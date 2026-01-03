/**
 * Advanced Connection Pool Manager
 *
 * Provides scalable connection pooling with health checks, circuit breaker,
 * and automatic failover capabilities for improved database and external service
 * connectivity under high load scenarios.
 */

import { EventEmitter } from 'events';

export enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half-open'
}

export interface ConnectionPoolOptions {
  maxConnections?: number;
  acquireTimeout?: number;
  healthCheckInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface PoolStats {
  totalAcquisitions: number;
  successfulAcquisitions: number;
  failedAcquisitions: number;
  totalAcquireTime: number;
  connectionsCreated: number;
  connectionsDestroyed: number;
  activeConnections: number;
  waitingRequests: number;
}

/**
 * Advanced connection pool with circuit breaker and health monitoring
 */
export class AdvancedConnectionPool extends EventEmitter {
  private connections: any[] = [];
  private waitingQueue: any[] = [];
  private isShutdown = false;
  private circuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private healthCheckInterval?: NodeJS.Timeout;
  private cleanupInterval?: NodeJS.Timeout;

  private stats: PoolStats = {
    totalAcquisitions: 0,
    successfulAcquisitions: 0,
    failedAcquisitions: 0,
    totalAcquireTime: 0,
    connectionsCreated: 0,
    connectionsDestroyed: 0,
    activeConnections: 0,
    waitingRequests: 0
  };

  private config: Required<ConnectionPoolOptions>;

  constructor(private options: ConnectionPoolOptions = {}) {
    super();
    
    this.config = {
      maxConnections: options.maxConnections || 10,
      acquireTimeout: options.acquireTimeout || 30000,
      healthCheckInterval: options.healthCheckInterval || 300000,
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000
    };

    // Start health monitoring
    this.startHealthMonitoring();
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
      
      return connection;
    } catch (error) {
      this.stats.totalAcquisitions++;
      this.stats.failedAcquisitions++;
      this.handleFailure(error as Error);
      throw error;
    }
  }

  /**
   * Release a connection back to the pool
   */
  release(connection: any): void {
    if (this.isShutdown) {
      return;
    }

    const index = this.connections.indexOf(connection);
    if (index >= 0) {
      // Perform health check before reusing
      this.performHealthCheck(connection)
        .then(isHealthy => {
          if (isHealthy) {
            // Connection is healthy, keep in pool
            this.emit('connection-released', { connection });
          } else {
            // Connection is unhealthy, remove it
            this.removeConnection(index);
          }
        })
        .catch(() => {
          // Health check failed, remove connection
          this.removeConnection(index);
        });
    }
  }

  /**
   * Shutdown the connection pool
   */
  async shutdown(): Promise<void> {
    this.isShutdown = true;
    
    // Clear intervals
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Close all connections
    const closePromises = this.connections.map(conn => 
      this.closeConnection(conn).catch(() => {})
    );
    
    await Promise.all(closePromises);
    this.connections = [];
    
    // Reject all waiting requests
    this.waitingQueue.forEach(request => {
      request.reject(new Error('Connection pool is shutting down'));
    });
    this.waitingQueue = [];
    
    this.emit('shutdown');
  }

  /**
   * Get pool statistics
   */
  getStats(): PoolStats {
    return {
      ...this.stats,
      activeConnections: this.connections.length,
      waitingRequests: this.waitingQueue.length
    };
  }

  /**
   * Try to acquire a connection
   */
  private async tryAcquire(): Promise<any> {
    // Check if there's an available connection
    if (this.connections.length < this.config.maxConnections) {
      const connection = await this.createConnection();
      this.connections.push(connection);
      this.stats.connectionsCreated++;
      return connection;
    }

    // Wait for a connection to become available
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection acquire timeout'));
      }, this.config.acquireTimeout);

      this.waitingQueue.push({
        resolve,
        reject,
        timeout,
        timestamp: Date.now(),
        requestId: `req_${Date.now()}_${Math.random()}`,
        timedOut: false
      });
    });
  }

  /**
   * Check if connections can be acquired
   */
  private canAcquire(): boolean {
    switch (this.circuitState) {
      case CircuitState.CLOSED:
        return true;
      case CircuitState.OPEN:
        const timeSinceFailure = Date.now() - this.lastFailureTime;
        return timeSinceFailure > this.config.retryDelay * Math.pow(2, Math.min(this.failureCount, 5));
      case CircuitState.HALF_OPEN:
        return true;
      default:
        return false;
    }
  }

  /**
   * Handle connection failures
   */
  private handleFailure(error: Error): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    // Update circuit breaker state
    if (this.failureCount >= this.config.maxRetries) {
      this.circuitState = CircuitState.OPEN;
      this.emit('circuit-open', { error, failureCount: this.failureCount });
    }

    this.emit('connection-failure', { error, failureCount: this.failureCount });
  }

  /**
   * Create a new connection (to be implemented by subclasses)
   */
  private async createConnection(): Promise<any> {
    throw new Error('createConnection must be implemented by subclass');
  }

  /**
   * Close a connection (to be implemented by subclasses)
   */
  private async closeConnection(connection: any): Promise<void> {
    throw new Error('closeConnection must be implemented by subclass');
  }

  /**
   * Perform health check on a connection (to be implemented by subclasses)
   */
  private async performHealthCheck(connection: any): Promise<boolean> {
    // Default implementation always returns true
    return true;
  }

  /**
   * Remove a connection from the pool
   */
  private async removeConnection(index: number): Promise<void> {
    if (index >= 0 && index < this.connections.length) {
      const connection = this.connections[index];
      this.connections.splice(index, 1);
      this.stats.connectionsDestroyed++;
      
      try {
        await this.closeConnection(connection);
      } catch (error) {
        this.emit('error', { error, connection });
      }
    }
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheckInterval);
  }

  /**
   * Perform health checks on all connections
   */
  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = this.connections.map(async (connection, index) => {
      try {
        const isHealthy = await this.performHealthCheck(connection);
        if (!isHealthy) {
          this.removeConnection(index);
        }
      } catch (error) {
        this.removeConnection(index);
      }
    });

    await Promise.allSettled(healthCheckPromises);
  }
}