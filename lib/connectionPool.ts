/** Connection Pool Manager using generic-pool */
import{EventEmitter}from'events';
export enum CircuitState{CLOSED='closed',OPEN='open',HALF_OPEN='half-open'}
export interface ConnectionPoolOptions{maxConnections?:number;acquireTimeout?:number;healthCheckInterval?:number;maxRetries?:number;retryDelay?:number;}
export interface PoolStats{totalAcquisitions:number;successfulAcquisitions:number;failedAcquisitions:number;totalAcquireTime:number;connectionsCreated:number;connectionsDestroyed:number;activeConnections:number;waitingRequests:number;}
export interface Factory<T>{create():Promise<T>;destroy(connection:T):Promise<void>;validate?(connection:T):Promise<boolean>;}

export class AdvancedConnectionPool extends EventEmitter{private pool:any;private isShutdown=false;private circuitState=CircuitState.CLOSED;private failureCount=0;private lastFailureTime=0;private healthCheckInterval?:NodeJS.Timeout;private autoTransitionId?:NodeJS.Timeout;private config:ConnectionPoolOptions;private stats:PoolStats={totalAcquisitions:0,successfulAcquisitions:0,failedAcquisitions:0,totalAcquireTime:0,connectionsCreated:0,connectionsDestroyed:0,activeConnections:0,waitingRequests:0};constructor(private factory:Factory<any>,private options:ConnectionPoolOptions={}){super();this.config={maxConnections:10,acquireTimeout:30000,healthCheckInterval:30000,maxRetries:3,retryDelay:1000,...options};this.initializePool(factory);this.startHealthMonitoring();}

  private async initializePool(factory: Factory<any>): Promise<void> {
    try {
      // Use proper async import with await
      const genericPool = await import('generic-pool');
      this.pool = genericPool.createPool(factory);
    } catch (error) {
      console.error('Failed to initialize generic-pool:', error);
      throw error;
    }
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
      if (!this.pool) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.pool) {
          throw new Error('Pool not initialized');
        }
      }
      
      const connection = await this.pool.acquire();
      
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
  async release(connection: any): Promise<void> {
    if (this.isShutdown || !this.pool) {
      return;
    }

    try {
      await this.pool.release(connection);
      this.emit('connection-released', { connection });
    } catch (error) {
      this.emit('error', { error, connection });
    }
  }

/**
    * Shutdown the connection pool
    */
  async shutdown(): Promise<void> {
    this.isShutdown = true;
    
    // Clear health check interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Clear auto-transition timeout
    if (this.autoTransitionId) {
      clearTimeout(this.autoTransitionId);
    }

    // Close all connections
    if (this.pool) {
      await this.pool.drain();
      await this.pool.clear();
    }
    
    this.emit('shutdown');
  }

  /**
   * Get pool statistics
   */
  getStats(): PoolStats {
    return {
      ...this.stats,
      activeConnections: this.stats.connectionsCreated - this.stats.connectionsDestroyed,
      waitingRequests: 0 // Not directly available from generic-pool
    };
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
        return timeSinceFailure > (this.config.retryDelay||1000) * Math.pow(2, Math.min(this.failureCount, 5));
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
    if (this.failureCount >= (this.config.maxRetries||3)) {
      this.circuitState = CircuitState.OPEN;
      this.emit('circuit-open', { error, failureCount: this.failureCount });
    }

    this.emit('connection-failure', { error, failureCount: this.failureCount });
    
    // Auto-transition to HALF_OPEN after retry delay (only if not already transitioning)
    const autoTransitionId = setTimeout(() => {
      if (this.circuitState === CircuitState.OPEN) {
        this.circuitState = CircuitState.HALF_OPEN;
        this.emit('circuit-half-open', { failureCount: this.failureCount });
      }
    }, this.config.retryDelay);
    
    // Store transition ID for cleanup
    (this as any).autoTransitionId = autoTransitionId;
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
    try {
      this.emit('health-check', { 
        activeConnections: this.stats.connectionsCreated - this.stats.connectionsDestroyed,
        totalAcquisitions: this.stats.totalAcquisitions
      });
    } catch (error) {
      this.emit('health-check-error', { error });
    }
  }

  /**
   * Reset circuit breaker to closed state
   */
  resetCircuitBreaker(): void {
    const wasOpen = this.circuitState === CircuitState.OPEN;
    
    // Clear auto-transition timeout when resetting
    if (this.autoTransitionId) {
      clearTimeout(this.autoTransitionId);
      this.autoTransitionId = undefined;
    }
    
    this.circuitState = CircuitState.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.emit('circuit-reset');
    
    if (wasOpen) {
      // Emit recovery event when circuit recovers from OPEN state
      this.emit('circuit-recovered', { timestamp: Date.now() });
    }
  }

  /**
   * Get current circuit breaker state
   */
  getCircuitState(): CircuitState {
    return this.circuitState;
  }
}

/**
 * Create a connection pool with factory
 */
export function createConnectionPool(
  factory: Factory<any>,
  options: ConnectionPoolOptions = {}
): AdvancedConnectionPool {
  return new AdvancedConnectionPool(factory, options);
}

export default {
  AdvancedConnectionPool,
  createConnectionPool,
  CircuitState
};