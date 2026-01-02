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
  }> = [];
  
  // Performance optimization: connection reuse tracking with memory limits
  private connectionReuseStats = new Map<any, { uses: number; lastUsed: number }>();
  private readonly maxConnectionUses = 1000; // Recreate connection after N uses
  private readonly maxReuseStatsSize = 10000; // Prevent memory leaks in reuse stats
  private readonly maxWaitingQueue = 1000; // Prevent unlimited queue growth
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

    // Process waiting queue
    if (this.waitingQueue.length > 0) {
      const waiter = this.waitingQueue.shift();
      if (waiter) {
        clearTimeout(waiter.timeout);
        pooled.acquired = true;
        waiter.resolve(connection);
      }
    }
  }

  /**
   * Get pool statistics
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
      waiting: this.waitingQueue.length,
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
    const stats = this.connectionReuseStats.get(connection.connection) || { uses: 0, lastUsed: 0 };
    stats.uses++;
    stats.lastUsed = Date.now();
    
    // Prevent memory leaks by limiting reuse stats size
    if (this.connectionReuseStats.size >= this.maxReuseStatsSize) {
      const oldestKey = this.connectionReuseStats.keys().next().value;
      this.connectionReuseStats.delete(oldestKey);
    }
    
    this.connectionReuseStats.set(connection.connection, stats);
    
    // Recreate connection if it has been used too many times (prevent connection fatigue)
    if (stats.uses > this.maxConnectionUses) {
      await this.removeConnection(connection);
      this.connectionReuseStats.delete(connection.connection);
      return this.tryAcquire();
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
  
  // More aggressive queue management with priority-based rejection
  if (this.waitingQueue.length >= this.maxWaitingQueue) {
    // Reject oldest 25% of requests to make room and prevent cascade failures
    const toReject = Math.max(1, Math.floor(this.waitingQueue.length * 0.25));
    for (let i = 0; i < toReject; i++) {
      const waiter = this.waitingQueue.shift();
      if (waiter) {
        clearTimeout(waiter.timeout);
        waiter.reject(new Error('Pool overloaded - request rejected due to high load'));
      }
    }
  }

  // Final check with exponential backoff suggestion
  if (this.waitingQueue.length >= this.maxWaitingQueue) {
    const suggestedDelay = Math.min(1000, this.waitingQueue.length * 10);
    throw new Error(`Connection pool waiting queue is full (${this.waitingQueue.length}/${this.maxWaitingQueue}). Retry after ${suggestedDelay}ms`);
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const index = this.waitingQueue.findIndex(w => w.resolve === resolve);
      if (index >= 0) {
        this.waitingQueue.splice(index, 1);
      }
      reject(new Error('Connection acquire timeout'));
    }, this.config.acquireTimeout);

    this.waitingQueue.push({
      resolve,
      reject,
      timeout,
      timestamp: Date.now()
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
    const unhealthy: PooledConnection[] = [];
    
    for (const pooled of this.connections) {
      if (pooled.acquired) {
        continue; // Skip active connections
      }

      try {
        const isValid = await this.config.validate!(pooled.connection);
        if (!isValid) {
          unhealthy.push(pooled);
        }
      } catch (error) {
        unhealthy.push(pooled);
      }
    }

    // Remove unhealthy connections
    for (const pooled of unhealthy) {
      await this.removeConnection(pooled);
    }

    // Ensure minimum connections
    await this.ensureMinConnections();

    this.emit('health-check', {
      totalConnections: this.connections.length,
      unhealthyRemoved: unhealthy.length
    });
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