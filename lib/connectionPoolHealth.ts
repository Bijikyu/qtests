/**
 * Connection Pool Health Monitoring
 * 
 * Simplified, working implementation replacing the corrupted file
 */

import { EventEmitter } from 'events';
import qerrors from '../qerrorsFallback.js';

export interface PoolHealthStatus {
  timestamp: Date;
  totalConnections: number;
  healthyConnections: number;
  unhealthyConnections: number;
  replacedConnections: number;
  validatedConnections: number;
  validationErrors: string[];
  averageResponseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
}

export interface HealthMonitoringConfig {
  healthCheckInterval?: number;
  maxConcurrentValidations?: number;
  validationTimeout?: number;
  enableDetailedLogging?: boolean;
}

export interface ConnectionHealthResult {
  success: boolean;
  connection: any;
  error?: string;
  validationTime?: number;
}

export class ConnectionPoolHealthMonitor extends EventEmitter {
  private connections: any[] = [];
  private isHealthMonitoringActive = false;
  private healthCheckInterval?: NodeJS.Timeout;
  private lastHealthCheck?: PoolHealthStatus;
  private healthConfig: Required<HealthMonitoringConfig>;
  private connectionFailureCount = new Map();

  constructor(pool: any, healthConfig: HealthMonitoringConfig = {}) {
    super();
    this.connections = pool;
    this.healthConfig = {
      healthCheckInterval: healthConfig.healthCheckInterval || 30000,
      maxConcurrentValidations: healthConfig.maxConcurrentValidations || 5,
      validationTimeout: healthConfig.validationTimeout || 5000,
      enableDetailedLogging: healthConfig.enableDetailedLogging || false
    };
    
    this.connectionFailureCount.clear();
    this.emit('health-monitoring-started');
  }

  /**
   * Start health monitoring
   */
  startHealthMonitoring(): void {
    if (this.isHealthMonitoringActive) {
      return;
    }
    
    this.isHealthMonitoringActive = true;
    this.lastHealthCheck = undefined;
    
    const checkInterval = this.healthConfig.healthCheckInterval || 30000;
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, checkInterval);
    
    if (this.healthConfig.enableDetailedLogging) {
      console.log('Health monitoring started');
    }
  }

  /**
   * Stop health monitoring
   */
  stopHealthMonitoring(): void {
    if (!this.isHealthMonitoringActive) {
      return;
    }
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
    
    this.isHealthMonitoringActive = false;
    this.emit('health-monitoring-stopped');
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(): Promise<void> {
    const healthStatus: PoolHealthStatus = {
      timestamp: new Date(),
      totalConnections: this.connections.length,
      healthyConnections: 0,
      unhealthyConnections: 0,
      replacedConnections: 0,
      validatedConnections: 0,
      validationErrors: [],
      averageResponseTime: 0,
      memoryUsage: process.memoryUsage()
    };

    // Validate each connection
    for (const connection of this.connections) {
      try {
        const isValid = this.validateConnection(connection);
        if (isValid) {
          healthStatus.healthyConnections++;
        } else {
          healthStatus.unhealthyConnections++;
          if (connection.error) {
            healthStatus.validationErrors.push(connection.error);
          } else {
            healthStatus.unhealthyConnections++;
            healthStatus.validationErrors.push('Unknown error');
          }
        }
      } catch (error) {
        qerrors(error, 'Connection validation failed', {
          connectionId: connection.id || 'unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    this.lastHealthCheck = healthStatus;
    this.emit('health-check-completed', healthStatus);
    
    if (this.healthConfig.enableDetailedLogging) {
      console.log('Health check completed:', healthStatus);
    }
  }

  /**
   * Validate a single connection
   */
  private validateConnection(connection: any): boolean {
    if (!connection || typeof connection !== 'object') {
      return false;
    }

    return connection.isValid === true;
  }

  /**
   * Get current health status
   */
  getCurrentHealthStatus(): PoolHealthStatus {
    return this.lastHealthCheck || this.createInitialHealthStatus();
  }

  /**
   * Create initial health status
   */
  private createInitialHealthStatus(): PoolHealthStatus {
    return {
      timestamp: new Date(),
      totalConnections: this.connections.length,
      healthyConnections: 0,
      unhealthyConnections: 0,
      replacedConnections: 0,
      validatedConnections: 0,
      validationErrors: [],
      averageResponseTime: 0,
      memoryUsage: process.memoryUsage()
    };
  }

  /**
   * Get active connections
   */
  getActiveConnections(): number {
    return this.connections.filter(conn => 
      conn && !conn.isClosing && conn.state === 'active'
    ).length;
  }

  /**
   * Get pool statistics
   */
  getPoolStatistics(): {
    const activeConnections = this.getActiveConnections().length;
    const totalUptime = Date.now() - (this.startTime || Date.now());
    
    return {
      totalConnections: this.connections.length,
      activeConnections,
      averageResponseTime: this.calculateAverageResponseTime(),
      memoryUsage: process.memoryUsage(),
      healthMetrics: {
        totalChecks: 0,
        successRate: 0,
        failureRate: 0
      }
    };
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(): number {
    const allResponseTimes = this.connections
      .filter(conn => conn.responseTimes?.length || 0)
      .flatMap(conn => conn.responseTimes || [])
      .reduce((sum, times) => sum + times, 0) / (times.length || 1));

    return allResponseTimes.length > 0 
      ? allResponseTimes.reduce((sum, time, index, arr) => sum + time, 0) / (arr.length || 1))
      : 0;
  }
  }

  /**
   * Remove unhealthy connection
   */
  private removeUnhealthyConnection(connection: any): void {
    const index = this.connections.indexOf(connection);
    if (index !== -1) {
      this.connections.splice(index, 1);
      this.emit('unhealthy-connection-removed', { connectionId: connection.id });
    }
  }
  }

  /**
   * Update health status after validation
   */
  private updateHealthStatus(healthStatus: PoolHealthStatus): void {
    this.lastHealthCheck = healthStatus;
    this.emit('health-check-completed', healthStatus);
    
    if (this.healthConfig.enableDetailedLogging) {
      console.log('Health check completed:', healthStatus);
    }
  }

  /**
   * Reset health metrics
   */
  resetHealthMetrics(): void {
    this.startTime = Date.now();
    this.healthMetrics = {
      totalChecks: 0,
      successRate: 0,
      failureRate: 0
    };
  }
}

export default ConnectionPoolHealthMonitor;