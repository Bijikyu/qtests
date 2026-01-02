/**
 * Advanced Connection Pool Manager
 * 
 * Provides scalable connection pooling with health checks, circuit breaker,
 * and automatic failover capabilities for improved database and external service
 * connectivity under high load scenarios.
 */

import { EventEmitter } from 'events';

export interface ConnectionConfig {
  host: string;
  port?: number;
  maxConnections?: number;
  minConnections?: number;
  acquireTimeout?: number;
  idleTimeout?: number;
  healthCheckInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
  connectionTimeout?: number;
}

export interface ConnectionStats {
  total: number;
  active: number;
  idle: number;
  waiting: number;
  failed: number;
  avgAcquireTime: number;
  successRate: number;
  lastError?: string;
  lastHealthCheck?: Date;
}

export interface PoolOptions extends ConnectionConfig {
  factory: () => Promise<any>;
  destroy: (connection: any) => Promise<void>;
  validate?: (connection: any) => Promise<boolean>;
}

interface PooledConnection {
  connection: any;
  acquired: boolean;
  created: number;
  lastUsed: number;
  retries: number;
}

/**
 * Circuit breaker states
 */
enum CircuitState {
  CLOSED = 'closed',      // Normal operation
  OPEN = 'open',          // Circuit is open, no requests
  HALF_OPEN = 'half-open' // Testing if service has recovered
}

/**
 * Advanced connection pool with circuit breaker and health monitoring
 */
export class AdvancedConnectionPool extends EventEmitter {
  private config: Required<PoolOptions>;
  private connections: PooledConnection[] = [];
  private waitingQueue: Array<{
    resolve: (connection: any) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
    timestamp: number;
    requestId?: string;
    timedOut?: boolean;
  }> = [];
  
  // O(1) queue implementation for high-performance dequeue operations
  private queueHead = 0;
  private queueTail = 0;
  
  // Performance optimization: connection reuse tracking with memory limits
  private connectionReuseStats = new Map<any, { uses: number; lastUsed: number; created: number; lastValidated: number }>();
  private readonly maxConnectionUses = 1000; // Recreate connection after N uses
  private readonly maxReuseStatsSize = 10000; // Prevent memory leaks in reuse stats
  private readonly maxWaitingQueue = 1000; // Prevent unlimited queue growth
  private readonly maxConnectionAge = 30 * 60 * 1000; // 30 minutes max connection age
  private readonly validationInterval = 5 * 60 * 1000; // Validate connections every 5 minutes
  private isShutdown = false; // Prevent operations after shutdown
  
  private circuitState: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private healthCheckInterval?: NodeJS.Timeout;
  private cleanupInterval?: NodeJS.Timeout;
  
  // Stats tracking
  private stats = {
    totalAcquisitions: 0,
    successfulAcquisitions: 0,
    failedAcquisitions: 0,
    totalAcquireTime: 0,
    connectionsCreated: 0,
    connectionsDestroyed: 0
  };

  // Intelligent eviction properties
  private memoryThreshold = 100 * 1024 * 1024; // 100MB memory threshold
  private maxAge = 30 * 60 * 1000; // 30 minutes max connection age
  private lastEvictionCheck = 0;
  private evictionCheckInterval = 60 * 1000; // Check every minute
  private connectionMemoryEstimate = 0;

  constructor(options: PoolOptions) {
    super();
    
    this.config = {
      maxConnections: options.maxConnections || 20, // Reduced to prevent resource exhaustion
      minConnections: options.minConnections || 2, // Reduced minimum
      acquireTimeout: options.acquireTimeout || 3000, // Faster timeout
      idleTimeout: options.idleTimeout || 15000, // Shorter idle timeout
      healthCheckInterval: options.healthCheckInterval || 5000, // More frequent health checks
      maxRetries: options.maxRetries || 2, // Fewer retries
      retryDelay: options.retryDelay || 500, // Faster retry
      connectionTimeout: options.connectionTimeout || 3000, // Faster connection timeout
      factory: options.factory,
      destroy: options.destroy,
      validate: options.validate || (() => Promise.resolve(true)), // Provide default validator
      host: options.host,
      port: options.port || 5432
    };

    this.startHealthChecks();
    this.startCleanup();
    this.ensureMinConnections();
  }

/**
 * Acquire a connection from the pool
 */
async acquire(): Promise<any> {
  if (this.isShutdown) {
    throw new Error('Connection pool is shutdown');
  }

  // Check circuit breaker
  if (!this.canAcquire()) {
    throw new Error(`Circuit breaker is ${this.circuitState}`);
  }

  const startTime = Date.now();
  
  try {
    const connection = await this.tryAcquire();
    
    // Update stats
    const acquireTime = Date.now() - startTime;
    this.stats.totalAcquisitions++;
    this.stats.successfulAcquisitions++;
    this.stats.totalAcquireTime += acquireTime;
    
    // Reset failure count on successful acquisition
    if (this.failureCount > 0) {
      this.failureCount = 0;
      this.circuitState = CircuitState.CLOSED;
    }
    
    return connection;
  } catch (error) {
    this.stats.failedAcquisitions++;
    this.handleFailure(error as Error);
    throw error;
  }
}

  /**
   * Release a connection back to the pool
   */
  async release(connection: any): Promise<void> {
    const pooled = this.connections.find(p => p.connection === connection);
    if (!pooled) {
      // Connection not from this pool
      await this.config.destroy(connection);
      return;
    }

    if (!pooled.acquired) {
      // Already released
      return;
    }

    pooled.acquired = false;
    pooled.lastUsed = Date.now();

    // Process waiting queue using O(1) dequeue
    if (this.getOptimizedQueueSize() > 0) {
      const waiter = this.waitingQueue[this.queueHead];
      if (waiter && waiter.resolve) {
        clearTimeout(waiter.timeout);
        pooled.acquired = true;
        waiter.resolve(connection);
        
        // Move head forward (O(1) operation)
        this.queueHead = (this.queueHead + 1) % this.waitingQueue.length;
        
        // Compact queue if it's getting sparse
        if (this.getOptimizedQueueSize() < this.waitingQueue.length * 0.25 && this.waitingQueue.length > 100) {
          this.compactQueue();
        }
      }
    }
  }

/**
   * Test all connections and remove unhealthy ones
   */
  async testAllConnections(): Promise<{ healthy: number; unhealthy: number }> {
    let healthy = 0;
    let unhealthy = 0;
    
    const healthCheckResults: Array<{ connection: PooledConnection; healthy: boolean }> = [];
    
    // Check connections in smaller batches to reduce memory pressure
    const batchSize = 5;
    for (let i = 0; i < this.connections.length; i += batchSize) {
      const batch = this.connections.slice(i, i + batchSize);
      const batchPromises = batch.map(async (pooled) => {
        try {
          if (this.config.validate) {
            const isValid = await this.config.validate(pooled.connection);
            return { connection: pooled, healthy: isValid };
          }
          return { connection: pooled, healthy: true };
        } catch (error) {
          console.warn(`Health check error for connection:`, error);
          return { connection: pooled, healthy: false };
        }
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          healthCheckResults.push(result.value);
          if (result.value.healthy) {
            healthy++;
          } else {
            unhealthy++;
          }
        } else {
          unhealthy++;
        }
      });
    }
    
    // Remove unhealthy connections
    const unhealthyConnections = healthCheckResults
      .filter(result => !result.healthy)
      .map(result => result.connection);
    
    for (const pooled of unhealthyConnections) {
      try {
        await this.removeConnection(pooled);
      } catch (error) {
        console.error('Failed to remove unhealthy connection:', error);
      }
    }
    
    this.emit('pool:health-check-completed', { healthy, unhealthy });
    
    return { healthy, unhealthy };
  }

/**
   * Get connection pool statistics
   */
  getStats(): ConnectionStats {
    const active = this.connections.filter(c => c.acquired).length;
    const idle = this.connections.length - active;
    const avgAcquireTime = this.stats.successfulAcquisitions > 0 
      ? this.stats.totalAcquireTime / this.stats.successfulAcquisitions 
      : 0;
    const successRate = this.stats.totalAcquisitions > 0 
      ? (this.stats.successfulAcquisitions / this.stats.totalAcquisitions) * 100 
      : 100;

    return {
      total: this.connections.length,
      active,
      idle,
      waiting: this.getOptimizedQueueSize(),
      failed: this.stats.failedAcquisitions,
      avgAcquireTime,
      successRate,
      lastError: this.lastFailureTime > 0 ? `Last failure: ${new Date(this.lastFailureTime).toISOString()}` : undefined,
      lastHealthCheck: this.healthCheckInterval ? new Date() : undefined
    };
  }

/**
 * Gracefully shutdown the pool
 */
async shutdown(): Promise<void> {
  if (this.isShutdown) {
    return;
  }
  
  this.isShutdown = true;

  // Clear intervals
  if (this.healthCheckInterval) {
    clearInterval(this.healthCheckInterval);
  }
  if (this.cleanupInterval) {
    clearInterval(this.cleanupInterval);
  }

  // Reject all waiting requests
  const waiting = this.waitingQueue.splice(0);
  for (const waiter of waiting) {
    clearTimeout(waiter.timeout);
    waiter.reject(new Error('Pool is shutting down'));
  }

  // Close all connections
  const closePromises = this.connections.map(async (pooled) => {
    try {
      await this.config.destroy(pooled.connection);
    } catch (error) {
      console.warn('Error closing connection during shutdown:', error);
    }
  });

  await Promise.allSettled(closePromises);
  this.connections = [];
  this.connectionReuseStats.clear();
}

  private async tryAcquire(): Promise<any> {
    // Try to find an idle connection with optimal reuse statistics
    let connection = this.findOptimalIdleConnection();
    
    if (!connection) {
      // Can we create a new connection?
      if (this.connections.length < this.config.maxConnections) {
        connection = await this.createConnection();
      } else {
        // Wait for a connection to become available
        return this.waitForConnection();
      }
    }

    connection.acquired = true;
    connection.lastUsed = Date.now();
    
    // Track connection reuse for performance monitoring with memory limits
    const now = Date.now();
    let stats = this.connectionReuseStats.get(connection.connection);
    
    if (!stats) {
      stats = {
        uses: 0,
        lastUsed: now,
        created: now,
        lastValidated: now
      };
    }
    
    stats.uses++;
    stats.lastUsed = now;
    
    // Prevent memory leaks by limiting reuse stats size
    if (this.connectionReuseStats.size >= this.maxReuseStatsSize) {
      const oldestKey = this.connectionReuseStats.keys().next().value;
      if (oldestKey) {
        this.connectionReuseStats.delete(oldestKey);
      }
    }
    
    this.connectionReuseStats.set(connection.connection, stats);
    
    // Check connection age and recreate if too old
    const connectionAge = now - stats.created;
    if (connectionAge > this.maxConnectionAge) {
      console.debug(`Connection age exceeded limit (${connectionAge}ms > ${this.maxConnectionAge}ms), recreating`);
      await this.removeConnection(connection);
      this.connectionReuseStats.delete(connection.connection);
      return this.tryAcquire();
    }
    
    // Recreate connection if it has been used too many times (prevent connection fatigue)
    if (stats.uses > this.maxConnectionUses) {
      console.debug(`Connection uses exceeded limit (${stats.uses} > ${this.maxConnectionUses}), recreating`);
      await this.removeConnection(connection);
      this.connectionReuseStats.delete(connection.connection);
      return this.tryAcquire();
    }
    
    // Validate connection periodically
    const timeSinceValidation = now - stats.lastValidated;
    if (timeSinceValidation > this.validationInterval) {
      try {
        const isValid = await this.config.validate!(connection.connection);
        if (!isValid) {
          console.debug('Connection validation failed, recreating');
          await this.removeConnection(connection);
          this.connectionReuseStats.delete(connection.connection);
          return this.tryAcquire();
        }
        stats.lastValidated = now;
      } catch (error) {
        console.warn('Connection validation error, recreating:', error);
        await this.removeConnection(connection);
        this.connectionReuseStats.delete(connection.connection);
        return this.tryAcquire();
      }
    }
    
    // Validate connection if validator is provided
    if (this.config.validate) {
      try {
        const isValid = await this.config.validate(connection.connection);
        if (!isValid) {
          // Remove invalid connection and try again
          await this.removeConnection(connection);
          this.connectionReuseStats.delete(connection.connection);
          return this.tryAcquire();
        }
      } catch (error) {
        // Validation failed, remove connection and try again
        await this.removeConnection(connection);
        this.connectionReuseStats.delete(connection.connection);
        return this.tryAcquire();
      }
    }

    return connection.connection;
  }

  /**
   * Find the optimal idle connection based on reuse statistics
   */
  private findOptimalIdleConnection(): PooledConnection | undefined {
    const idleConnections = this.connections.filter(c => !c.acquired);
    
    if (idleConnections.length === 0) {
      return undefined;
    }
    
    if (idleConnections.length === 1) {
      return idleConnections[0];
    }
    
    // Select connection with lowest reuse count to balance load
    return idleConnections.reduce((optimal, current) => {
      const optimalStats = this.connectionReuseStats.get(optimal.connection) || { uses: 0 };
      const currentStats = this.connectionReuseStats.get(current.connection) || { uses: 0 };
      
      return currentStats.uses < optimalStats.uses ? current : optimal;
    });
  }

  private async createConnection(): Promise<PooledConnection> {
    const connection = await this.config.factory();
    
    const pooled: PooledConnection = {
      connection,
      acquired: false,
      created: Date.now(),
      lastUsed: Date.now(),
      retries: 0
    };

    this.connections.push(pooled);
    this.stats.connectionsCreated++;
    
    return pooled;
  }

  private async removeConnection(pooled: PooledConnection): Promise<void> {
    const index = this.connections.indexOf(pooled);
    if (index >= 0) {
      this.connections.splice(index, 1);
      await this.config.destroy(pooled.connection);
      this.stats.connectionsDestroyed++;
    }
  }

private async waitForConnection(): Promise<any> {
    // Aggressive cleanup before checking limit
    this.cleanupTimedOutWaiters();
    
    // Simple, reliable queue management with hard limits
    const memoryPressure = await this.getMemoryPressure();
    const poolHealth = this.getPoolHealth();
    
    // Dynamic queue size adjustment based on conditions
    let effectiveMaxQueue = this.maxWaitingQueue;
    
    if (memoryPressure > 0.9 || poolHealth < 0.5) {
      // Reduce queue size under stress
      effectiveMaxQueue = Math.floor(this.maxWaitingQueue * 0.5);
    } else if (memoryPressure > 0.8 || poolHealth < 0.7) {
      // Moderate reduction
      effectiveMaxQueue = Math.floor(this.maxWaitingQueue * 0.75);
    }
    
    // Use O(1) queue size calculation
    const currentQueueSize = this.getOptimizedQueueSize();
    
    // Simple, hard limit check - no complex rejection strategies that can fail
    if (currentQueueSize >= effectiveMaxQueue) {
      const backoffDelay = Math.min(1000, currentQueueSize * 100);
      throw new Error(`Connection pool waiting queue is full (${currentQueueSize}/${effectiveMaxQueue}). Retry after ${backoffDelay}ms`);
    }

    return this.addToQueueWithBackpressure(effectiveMaxQueue);
  }

  /**
   * Get optimized queue size using O(1) calculation
   */
  private getOptimizedQueueSize(): number {
    if (this.queueTail >= this.queueHead) {
      return this.queueTail - this.queueHead;
    } else {
      // Queue has wrapped around
      return this.waitingQueue.length - this.queueHead + this.queueTail;
    }
  }

  /**
   * Expand queue array when needed (amortized O(1) operation)
   */
  private expandQueue(): void {
    const newSize = Math.max(this.waitingQueue.length * 2, this.maxWaitingQueue * 2);
    const newQueue = new Array(newSize);
    
    // Copy existing elements in order
    const currentSize = this.getOptimizedQueueSize();
    for (let i = 0; i < currentSize; i++) {
      const sourceIndex = (this.queueHead + i) % this.waitingQueue.length;
      newQueue[i] = this.waitingQueue[sourceIndex];
    }
    
    this.waitingQueue = newQueue;
    this.queueHead = 0;
    this.queueTail = currentSize;
  }

  /**
   * Compact queue to reclaim memory (amortized O(1) operation)
   */
  private compactQueue(): void {
    const currentSize = this.getOptimizedQueueSize();
    if (currentSize === 0) {
      // Reset queue if empty
      this.waitingQueue = new Array(Math.min(100, this.maxWaitingQueue));
      this.queueHead = 0;
      this.queueTail = 0;
      return;
    }
    
    const newQueue = new Array(Math.max(currentSize * 2, 50));
    
    // Copy active elements
    for (let i = 0; i < currentSize; i++) {
      const sourceIndex = (this.queueHead + i) % this.waitingQueue.length;
      newQueue[i] = this.waitingQueue[sourceIndex];
    }
    
    this.waitingQueue = newQueue;
    this.queueHead = 0;
    this.queueTail = currentSize;
  }
  
  /**
   * Get current memory pressure (0-1 scale)
   */
  private async getMemoryPressure(): Promise<number> {
    try {
      const memUsage = process.memoryUsage();
      const os = await import('os');
      const totalMem = os.totalmem();
      const usedMem = totalMem - os.freemem();
      return Math.min(1, usedMem / totalMem);
    } catch {
      return 0.5; // Default to medium pressure on error
    }
  }
  
  /**
   * Get pool health score (0-1 scale)
   */
  private getPoolHealth(): number {
    try {
      const totalConnections = this.connections.length;
      const activeConnections = this.connections.filter(c => c.acquired).length;
      const successRate = this.stats.totalAcquisitions > 0 ? 
        this.stats.successfulAcquisitions / this.stats.totalAcquisitions : 1;
      
      // Health factors
      const utilizationHealth = 1 - Math.abs(0.7 - (activeConnections / Math.max(1, totalConnections))); // Optimal 70% utilization
      const successHealth = successRate;
      const sizeHealth = totalConnections <= this.config.maxConnections ? 1 : 0.5;
      
      return (utilizationHealth + successHealth + sizeHealth) / 3;
    } catch {
      return 0.5; // Default to medium health on error
    }
  }
  
  /**
   * Select rejection strategy based on current conditions
   */
  private selectRejectionStrategy(memoryPressure: number, poolHealth: number): 'aggressive' | 'moderate' | 'conservative' {
    if (memoryPressure > 0.9 || poolHealth < 0.3) {
      return 'aggressive';
    } else if (memoryPressure > 0.8 || poolHealth < 0.6) {
      return 'moderate';
    } else {
      return 'conservative';
    }
  }
  
  /**
   * Execute the selected rejection strategy
   */
  private async executeRejectionStrategy(strategy: 'aggressive' | 'moderate' | 'conservative'): Promise<void> {
    let toReject: number;
    let rejectMessage: string;
    
    switch (strategy) {
      case 'aggressive':
        toReject = Math.max(1, Math.floor(this.waitingQueue.length * 0.5)); // Reject 50%
        rejectMessage = 'Pool under extreme stress - request rejected';
        break;
      case 'moderate':
        toReject = Math.max(1, Math.floor(this.waitingQueue.length * 0.25)); // Reject 25%
        rejectMessage = 'Pool under high load - request rejected';
        break;
      case 'conservative':
        toReject = Math.max(1, Math.floor(this.waitingQueue.length * 0.1)); // Reject 10%
        rejectMessage = 'Pool approaching capacity - request rejected';
        break;
    }
    
    // Reject oldest requests first (FIFO)
    for (let i = 0; i < toReject && i < this.waitingQueue.length; i++) {
      const waiter = this.waitingQueue.shift();
      if (waiter) {
        clearTimeout(waiter.timeout);
        waiter.reject(new Error(rejectMessage));
      }
    }
    
    console.debug(`Pool rejection: removed ${toReject} requests from queue (${this.waitingQueue.length} remaining)`);
  }
  
  /**
   * Calculate intelligent backoff delay
   */
  private calculateBackoffDelay(memoryPressure: number, poolHealth: number): number {
    const baseDelay = 100;
    const queueFactor = Math.min(this.waitingQueue.length, 10) * 50;
    const memoryFactor = memoryPressure * 500;
    const healthFactor = (1 - poolHealth) * 300;
    
    return Math.min(5000, baseDelay + queueFactor + memoryFactor + healthFactor);
  }
  
  /**
   * Add request to queue with enhanced error handling
   */
  private addToQueue(): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        // O(1) removal by marking as resolved (will be cleaned up in dequeue)
        const index = this.queueHead;
        if (index < this.waitingQueue.length && this.waitingQueue[index].resolve === resolve) {
          this.waitingQueue[index].resolve = () => {}; // Mark as processed
          this.queueHead++; // Move head forward
        }
        reject(new Error('Connection acquire timeout'));
      }, this.config.acquireTimeout);

      // O(1) enqueue operation
      this.waitingQueue[this.queueTail] = {
        resolve,
        reject,
        timeout,
        timestamp: Date.now()
      };
      
      // Handle circular buffer wrap-around
      this.queueTail = (this.queueTail + 1) % this.waitingQueue.length;
      
      // Expand array if needed (amortized O(1))
      if (this.queueTail === this.queueHead && this.getOptimizedQueueSize() >= this.waitingQueue.length * 0.8) {
        this.expandQueue();
      }
    });
  }

private addToQueueWithBackpressure(maxQueue: number): Promise<any> {
    return new Promise((resolve, reject) => {
      // Double-check queue limit before adding
      if (this.waitingQueue.length >= maxQueue) {
        reject(new Error(`Connection pool queue exceeded limit (${this.waitingQueue.length}/${maxQueue})`));
        return;
      }

      // Create unique identifier for O(1) removal
      const requestId = `req_${Date.now()}_${Math.random()}`;
      
      const timeout = setTimeout(() => {
        // O(1) removal using marker instead of findIndex/splice
        const index = this.waitingQueue.findIndex(w => w.requestId === requestId);
        if (index >= 0) {
          // Mark as resolved for cleanup instead of splicing
          this.waitingQueue[index].resolve = () => {};
          this.waitingQueue[index].timedOut = true;
        }
        reject(new Error('Connection acquire timeout'));
      }, this.config.acquireTimeout);

      this.waitingQueue.push({
        resolve,
        reject,
        timeout,
        timestamp: Date.now(),
        requestId,
        timedOut: false
      });
    });
  }

      // Create unique identifier for O(1) removal
      const requestId = `req_${Date.now()}_${Math.random()}`;
      
      const timeout = setTimeout(() => {
        // O(1) removal using marker instead of findIndex/splice
        const index = this.waitingQueue.findIndex(w => w.requestId === requestId);
        if (index >= 0) {
          // Mark as resolved for cleanup instead of splicing
          this.waitingQueue[index].resolve = () => {};
          this.waitingQueue[index].timedOut = true;
        }
        reject(new Error('Connection acquire timeout'));
      }, this.config.acquireTimeout);

      this.waitingQueue.push({
        resolve,
        reject,
        timeout,
        timestamp: Date.now(),
        requestId,
        timedOut: false
      });
    });
  }

  private canAcquire(): boolean {
    switch (this.circuitState) {
      case CircuitState.CLOSED:
        return true;
      case CircuitState.OPEN:
        // Check if we should try half-open
        const timeSinceFailure = Date.now() - this.lastFailureTime;
        return timeSinceFailure > this.config.retryDelay * Math.pow(2, Math.min(this.failureCount, 5));
      case CircuitState.HALF_OPEN:
        return true;
      default:
        return false;
    }
  }

  private handleFailure(error: Error): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    // Update circuit breaker state
    if (this.failureCount >= this.config.maxRetries) {
      this.circuitState = CircuitState.OPEN;
      this.emit('circuit-open', { error, failureCount: this.failureCount });
    }

    // Log failure
    console.warn('Connection pool failure:', {
      error: error.message,
      failureCount: this.failureCount,
      circuitState: this.circuitState,
      totalConnections: this.connections.length
    });
  }

  /**
   * Intelligent eviction to prevent memory leaks
   */
  private async performIntelligentEviction(): Promise<void> {
    const now = Date.now();
    
    // Skip if not enough time has passed
    if (now - this.lastEvictionCheck < this.evictionCheckInterval) {
      return;
    }
    
    this.lastEvictionCheck = now;
    
    // Get available connections for eviction
    const availableConnections = this.connections.filter(conn => !conn.acquired);
    
    if (availableConnections.length === 0) {
      return;
    }

    // Priority-based eviction:
    // 1. Connections older than maxAge
    // 2. Idle connections beyond minimum
    // 3. Connections with high retry count
    
    const evictionCandidates: Array<{ connection: PooledConnection; score: number }> = [];
    
    for (const conn of availableConnections) {
      let score = 0;
      
      // Age-based scoring
      const age = now - conn.created;
      if (age > this.maxAge) {
        score += 100; // High priority for old connections
      } else {
        score += (age / this.maxAge) * 50;
      }
      
      // Idle time scoring
      const idleTime = now - conn.lastUsed;
      score += Math.min(idleTime / this.config.idleTimeout, 1) * 30;
      
      // Retry count scoring
      score += Math.min(conn.retries, 5) * 10;
      
      evictionCandidates.push({ connection: conn, score });
    }
    
    // Sort by eviction priority (highest score first)
    evictionCandidates.sort((a, b) => b.score - a.score);
    
    // Calculate how many to evict based on memory pressure
    const minConnections = this.config.minConnections || 2;
    const currentAvailable = availableConnections.length;
    let evictCount = 0;
    
    // Evict if we have more than minimum + buffer
    if (currentAvailable > minConnections + 2) {
      evictCount = Math.min(
        currentAvailable - minConnections - 2,
        Math.floor(evictionCandidates.length * 0.3) // Evict up to 30%
      );
    }
    
    // Additional eviction under memory pressure
    if (this.connectionMemoryEstimate > this.memoryThreshold) {
      evictCount = Math.max(evictCount, Math.floor(evictionCandidates.length * 0.5));
    }
    
    // Perform eviction
    for (let i = 0; i < evictCount && i < evictionCandidates.length; i++) {
      const candidate = evictionCandidates[i];
      const index = this.connections.indexOf(candidate.connection);
      if (index >= 0) {
        this.connections.splice(index, 1);
        this.connectionMemoryEstimate -= 1024; // Estimate 1KB per connection
        this.stats.connectionsDestroyed++;
      }
      
      try {
        await this.config.destroy(candidate.connection.connection);
      } catch (error) {
        console.warn('Error during connection eviction:', error);
      }
    }
    
    if (evictCount > 0) {
      console.debug(`Intelligent eviction: removed ${evictCount} connections, ${this.connections.length} remaining`);
    }
  }

  private async startHealthChecks(): Promise<void> {
    if (!this.config.validate) {
      return;
    }

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, this.config.healthCheckInterval);
  }

private async performHealthCheck(): Promise<void> {
    // Set a timeout for health check to prevent blocking
    const healthCheckTimeout = setTimeout(() => {
      this.emit('health-check-timeout');
    }, 5000); // 5 second max for health checks

    try {
      const unhealthy: PooledConnection[] = [];
      
      // Check connections in parallel with a limit
      const checkPromises = this.connections
        .filter(pooled => !pooled.acquired)
        .map(async (pooled) => {
          try {
            const isValid = await Promise.race([
              this.config.validate!(pooled.connection),
              new Promise<boolean>((_, reject) => 
                setTimeout(() => reject(new Error('Health check timeout')), 2000)
              )
            ]);
            if (!isValid) {
              unhealthy.push(pooled);
            }
          } catch (error) {
            unhealthy.push(pooled);
          }
        });

      await Promise.allSettled(checkPromises);

      // Remove unhealthy connections in parallel
      const removePromises = unhealthy.map(pooled => 
        this.removeConnection(pooled).catch(err => 
          this.emit('connection-removal-error', { error: err, connection: pooled })
        )
      );
      await Promise.allSettled(removePromises);

      // Ensure minimum connections
      await this.ensureMinConnections();
    } finally {
      clearTimeout(healthCheckTimeout);
    }
}

  private startCleanup(): void {
    this.cleanupInterval = setInterval(async () => {
      await this.cleanupIdleConnections();
      await this.performIntelligentEviction();
    }, this.config.idleTimeout);
  }

  private async cleanupIdleConnections(): Promise<void> {
    if (this.connections.length <= this.config.minConnections) {
      return;
    }

    const now = Date.now();
    const idleConnections: PooledConnection[] = [];
    
    for (const pooled of this.connections) {
      if (!pooled.acquired && 
          (now - pooled.lastUsed) > this.config.idleTimeout &&
          this.connections.length > this.config.minConnections) {
        idleConnections.push(pooled);
      }
    }

    // Remove idle connections
    for (const pooled of idleConnections) {
      await this.removeConnection(pooled);
    }

    if (idleConnections.length > 0) {
      this.emit('cleanup', {
        connectionsRemoved: idleConnections.length,
        remainingConnections: this.connections.length
      });
    }
  }

private async ensureMinConnections(): Promise<void> {
  while (this.connections.length < this.config.minConnections) {
    try {
      await this.createConnection();
    } catch (error) {
      console.error('Failed to create minimum connection:', error);
      break;
    }
  }
}

/**
 * Clean up timed out waiters to prevent memory leaks
 */
private cleanupTimedOutWaiters(): void {
  const now = Date.now();
  const timeoutThreshold = this.config.acquireTimeout * 2; // Allow some grace period
  
  for (let i = this.waitingQueue.length - 1; i >= 0; i--) {
    const waiter = this.waitingQueue[i];
    if (now - waiter.timestamp > timeoutThreshold) {
      clearTimeout(waiter.timeout);
      this.waitingQueue.splice(i, 1);
      waiter.reject(new Error('Waiter cleaned up due to timeout'));
    }
  }
}
}

/**
 * Factory for creating database connection pools
 */
export function createDatabasePool(config: ConnectionConfig): AdvancedConnectionPool {
  // This would be implemented based on specific database type
  // For now, return a mock pool
  return new AdvancedConnectionPool({
    ...config,
    factory: async () => {
      // Mock connection creation
      return { id: Math.random(), created: Date.now() };
    },
    destroy: async (connection) => {
      // Mock connection destruction
      console.log('Destroying connection:', connection.id);
    },
    validate: async (connection) => {
      // Mock validation
      return connection.id !== undefined;
    }
  });
}

export default AdvancedConnectionPool;