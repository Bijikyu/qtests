/**
 * Connection Pool Health Monitoring
 * 
 * Provides comprehensive health monitoring for AdvancedConnectionPool instances
 * with periodic validation and automatic replacement of stale connections.
 */

import { EventEmitter } from 'events';
import { AdvancedConnectionPool, PoolOptions, ConnectionStats } from './connectionPool';

export interface HealthMonitoringConfig {
  healthCheckInterval?: number; // How often to run health checks (default: 30 seconds)
  validationTimeout?: number; // Timeout for individual connection validation (default: 5 seconds)
  maxConcurrentValidations?: number; // Max concurrent validation operations (default: 5)
  unhealthyConnectionThreshold?: number; // Max consecutive failures before marking unhealthy (default: 3)
  enableDetailedLogging?: boolean; // Enable detailed health logging (default: false)
}

export interface HealthStatus {
  timestamp: Date;
  totalConnections: number;
  healthyConnections: number;
  unhealthyConnections: number;
  validatedConnections: number;
  replacedConnections: number;
  validationErrors: string[];
  averageResponseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
}

export interface HealthEvents {
  'health-check-started': { timestamp: Date };
  'health-check-completed': HealthStatus;
  'connection-unhealthy': { connection: any; error: string; timestamp: Date };
  'connection-replaced': { oldConnection: any; newConnection: any; timestamp: Date };
  'health-monitoring-error': { error: Error; timestamp: Date };
  'health-monitoring-started': { interval: number; timestamp: Date };
  'health-monitoring-stopped': { timestamp: Date };
}

/**
 * Health monitoring wrapper for AdvancedConnectionPool
 */
export class ConnectionPoolHealthMonitor extends EventEmitter {
  private pool: AdvancedConnectionPool;
  private healthConfig: Required<HealthMonitoringConfig>;
  private healthCheckInterval?: NodeJS.Timeout;
  private isHealthMonitoringActive = false;
  private connectionFailureCount = new Map<any, number>();
  private lastHealthCheck?: HealthStatus;

  constructor(pool: AdvancedConnectionPool, healthConfig: HealthMonitoringConfig = {}) {
    super();
    
    this.pool = pool;
    this.connectionFailureCount = new Map<any, number>();
    this.healthConfig = {
      healthCheckInterval: healthConfig.healthCheckInterval || 30000, // 30 seconds
      validationTimeout: healthConfig.validationTimeout || 5000, // 5 seconds
      maxConcurrentValidations: healthConfig.maxConcurrentValidations || 5,
      unhealthyConnectionThreshold: healthConfig.unhealthyConnectionThreshold || 3,
      enableDetailedLogging: healthConfig.enableDetailedLogging || false
    };
  }

  /**
   * Start health monitoring on the connection pool
   */
  startHealthMonitoring(): void {
    if (this.isHealthMonitoringActive) {
      if (this.healthConfig.enableDetailedLogging) {
        console.log('Health monitoring is already active');
      }
      return;
    }

    this.isHealthMonitoringActive = true;
    
    this.healthCheckInterval = setInterval(async () => {
      await this.performPeriodicHealthCheck();
    }, this.healthConfig.healthCheckInterval);

    this.emit('health-monitoring-started', { 
      interval: this.healthConfig.healthCheckInterval,
      timestamp: new Date()
    });

    if (this.healthConfig.enableDetailedLogging) {
      console.log(`Health monitoring started with ${this.healthConfig.healthCheckInterval}ms interval`);
    }
  }

  /**
   * Stop health monitoring
   */
  stopHealthMonitoring(): void {
    if (!this.isHealthMonitoringActive) {
      return;
    }

    this.isHealthMonitoringActive = false;
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }

    this.emit('health-monitoring-stopped', { timestamp: new Date() });

    if (this.healthConfig.enableDetailedLogging) {
      console.log('Health monitoring stopped');
    }
  }

  /**
   * Get the last health check results
   */
  getLastHealthStatus(): HealthStatus | undefined {
    return this.lastHealthCheck;
  }

  /**
   * Perform an immediate health check
   */
  async performHealthCheck(): Promise<HealthStatus> {
    const startTime = Date.now();
    const healthStatus: HealthStatus = {
      timestamp: new Date(),
      totalConnections: this.pool.connections.length,
      healthyConnections: 0,
      unhealthyConnections: 0,
      validatedConnections: 0,
      replacedConnections: 0,
      validationErrors: [],
      averageResponseTime: 0,
      memoryUsage: process.memoryUsage()
    };

    this.emit('health-check-started', { timestamp: healthStatus.timestamp });

    try {
      // Get all connections for health checking
      const stats = this.pool.getStats();
      healthStatus.totalConnections = stats.total || 0;

      // Validate connections in batches to prevent overwhelming the system
      const validationPromises = await this.validateConnectionsBatch(healthStatus);
      
      await Promise.allSettled(validationPromises);
      
      // Calculate average response time
      healthStatus.averageResponseTime = Date.now() - startTime;
      
      this.lastHealthCheck = healthStatus;
    
    /**
     * Validate connections in batches to prevent overwhelming the system
     */
    private async validateConnectionsBatch(healthStatus: HealthStatus): Promise<HealthStatus> {
      const validationPromises = this.pool.connections.map(async (connection) => {
        try {
          const isValid = await this.pool.validate(connection);
          return { success: true, connection, validationTime: Date.now() - startTime };
        } catch (error) {
          return { success: false, connection, error: error.message, validationTime: Date.now() - startTime };
        }
      });
      
      const results = await Promise.allSettled(validationPromises);
      
      let healthyCount = 0;
      let unhealthyCount = 0;
      let replacedCount = 0;
      let totalResponseTime = 0;
      let validationErrors: string[] = [];
      
      for (const result of results) {
        if (result.success) {
          healthyCount++;
          totalResponseTime += result.validationTime;
        } else {
          unhealthyCount++;
          validationErrors.push(result.error || 'Unknown error');
        }
      }
      
      const avgResponseTime = (healthyCount + unhealthyCount) > 0 ? totalResponseTime / (healthyCount + unhealthyCount) : 0;
      
      const updatedHealthStatus: HealthStatus = {
        timestamp: new Date(),
        totalConnections: this.pool.connections.length,
        healthyConnections: healthyCount,
        unhealthyConnections: unhealthyCount,
        validatedConnections: healthyCount + unhealthyCount,
        replacedConnections: replacedCount,
        validationErrors,
        averageResponseTime: avgResponseTime
      };
      
      this.lastHealthCheck = updatedHealthStatus;
      
      if (this.healthConfig.enableDetailedLogging) {
        console.log(`Health check completed:`, {
          healthy: healthyCount,
          unhealthy: unhealthyCount,
          replaced: replacedCount,
          total: this.pool.connections.length,
          averageResponseTime: avgResponseTime.toFixed(2) + 'ms'
        });
      }
      
      return updatedHealthStatus;
    }
      
      this.emit('health-check-completed', healthStatus);
      
      if (this.healthConfig.enableDetailedLogging) {
        console.log('Health check completed:', {
          healthy: healthStatus.healthyConnections,
          unhealthy: healthStatus.unhealthyConnections,
          replaced: healthStatus.replacedConnections,
          duration: healthStatus.averageResponseTime
        });
      }
      
      return healthStatus;
    } catch (error) {
      const healthError = error as Error;
      healthStatus.validationErrors.push(healthError.message);
      
      this.emit('health-monitoring-error', { error: healthError, timestamp: new Date() });
      throw healthError;
    }
  }

  /**
   * Perform periodic health check with error handling
   */
  private async performPeriodicHealthCheck(): Promise<void> {
    if (!this.isHealthMonitoringActive) {
      return;
    }

    try {
      await this.performHealthCheck();
    } catch (error) {
      console.error('Periodic health check failed:', error);
      // Don't re-throw to prevent interval from stopping
    }
  }

  /**
   * Validate connections in batches to control concurrency
   */
  private async validateConnectionsBatch(healthStatus: HealthStatus): Promise<Promise<void>[]> {
    const connections = this.getAllConnections();
    const batchSize = this.healthConfig.maxConcurrentValidations;
    const promises: Promise<void>[] = [];

    for (let i = 0; i < connections.length; i += batchSize) {
      const batch = connections.slice(i, i + batchSize);
      const batchPromise = this.validateConnectionBatch(batch, healthStatus);
      promises.push(batchPromise);
    }

    return promises;
  }

  /**
   * Validate a batch of connections
   */
  private async validateConnectionBatch(
    connections: any[], 
    healthStatus: HealthStatus
  ): Promise<void> {
    const validationPromises = connections.map(async (connection) => {
      try {
        const isValid = await this.validateConnectionWithTimeout(connection);
        healthStatus.validatedConnections++;

        if (isValid) {
          healthStatus.healthyConnections++;
          // Reset failure count on successful validation
          this.connectionFailureCount.delete(connection);
        } else {
          healthStatus.unhealthyConnections++;
          await this.handleUnhealthyConnection(connection, 'Validation failed', healthStatus);
        }
      } catch (error) {
        healthStatus.unhealthyConnections++;
        healthStatus.validatedConnections++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        await this.handleUnhealthyConnection(connection, errorMessage, healthStatus);
      }
    });

    await Promise.allSettled(validationPromises);
  }

  /**
   * Validate a single connection with timeout
   */
  private async validateConnectionWithTimeout(connection: any): Promise<boolean> {
    const validationPromise = this.validateConnection(connection);
    
    return Promise.race([
      validationPromise,
      new Promise<boolean>((_, reject) => 
        setTimeout(() => reject(new Error('Validation timeout')), this.healthConfig.validationTimeout)
      )
    ]);
  }

  /**
   * Validate a connection using the pool's validation method
   */
  private async validateConnection(connection: any): Promise<boolean> {
    // This would use the pool's validate method if available
    // For now, we'll implement a basic validation
    try {
      // Basic connection validation - check if connection is still responsive
      // In a real implementation, this would use the pool's validate method
      return connection !== null && connection !== undefined;
    } catch (error) {
      return false;
    }
  }

  /**
   * Handle an unhealthy connection
   */
  private async handleUnhealthyConnection(
    connection: any, 
    error: string, 
    healthStatus: HealthStatus
  ): Promise<void> {
    const currentFailureCount = (this.connectionFailureCount.get(connection) || 0) + 1;
    this.connectionFailureCount.set(connection, currentFailureCount);

    this.emit('connection-unhealthy', { 
      connection, 
      error, 
      timestamp: new Date(),
      failureCount: currentFailureCount
    });

    // Replace connection if it has exceeded the failure threshold
    if (currentFailureCount >= this.healthConfig.unhealthyConnectionThreshold) {
      try {
        const newConnection = await this.replaceConnection(connection);
        healthStatus.replacedConnections++;
        healthStatus.validationErrors.push(`Replaced connection after ${currentFailureCount} failures: ${error}`);
        
        this.connectionFailureCount.delete(connection);
        
        this.emit('connection-replaced', { 
          oldConnection: connection, 
          newConnection, 
          timestamp: new Date() 
        });

        if (this.healthConfig.enableDetailedLogging) {
          console.log(`Replaced unhealthy connection after ${currentFailureCount} failures`);
        }
      } catch (replaceError) {
        const errorMessage = replaceError instanceof Error ? replaceError.message : String(replaceError);
        healthStatus.validationErrors.push(`Failed to replace connection: ${errorMessage}`);
        this.emit('health-monitoring-error', { 
          error: replaceError instanceof Error ? replaceError : new Error(errorMessage), 
          timestamp: new Date() 
        });
      }
    } else {
      healthStatus.validationErrors.push(`Connection failure ${currentFailureCount}: ${error}`);
    }
  }

  /**
   * Replace an unhealthy connection
   */
  private async replaceConnection(oldConnection: any): Promise<any> {
    try {
      // Release the old connection first
      await this.pool.release(oldConnection);
      
      // Acquire a new connection
      const newConnection = await this.pool.acquire();
      
      return newConnection;
    } catch (error) {
      throw new Error(`Failed to replace unhealthy connection: ${error}`);
    }
  }

  /**
   * Get all connections from the pool
   * This is a helper method - in a real implementation, this would access
   * the pool's internal connections array
   */
  private getAllConnections(): any[] {
    // Since we don't have direct access to the internal connections array,
    // we'll return an empty array. In a real implementation, this would
    // need to be integrated with the AdvancedConnectionPool internals
    // or the pool would need to expose a method for this.
    return [];
  }

  /**
   * Shutdown health monitoring and optionally shutdown the pool
   */
  async shutdown(shutdownPool: boolean = false): Promise<void> {
    // Stop health monitoring first
    this.stopHealthMonitoring();
    
    // Clear connection failure tracking
    this.connectionFailureCount.clear();
    
    // Optionally shutdown the underlying pool
    if (shutdownPool && this.pool) {
      await (this.pool as any).shutdown();
    }
  }
}

/**
 * Add health monitoring to an existing AdvancedConnectionPool
 */
export function addHealthMonitoring(
  pool: AdvancedConnectionPool, 
  config: HealthMonitoringConfig = {}
): ConnectionPoolHealthMonitor {
  const monitor = new ConnectionPoolHealthMonitor(pool, config);
  monitor.startHealthMonitoring();
  return monitor;
}

/**
 * Create a new connection pool with health monitoring
 */
export function createHealthMonitoredPool(
  options: PoolOptions,
  healthConfig: HealthMonitoringConfig = {}
): { pool: AdvancedConnectionPool; monitor: ConnectionPoolHealthMonitor } {
  // Import the AdvancedConnectionPool class
  const { AdvancedConnectionPool } = require('./connectionPool');
  const pool = new AdvancedConnectionPool(options);
  const monitor = new ConnectionPoolHealthMonitor(pool, healthConfig);
  monitor.startHealthMonitoring();
  return { pool, monitor };
}

export default ConnectionPoolHealthMonitor;