/**
 * Comprehensive Monitoring and Alerting System
 * 
 * Provides real-time monitoring of system performance, resource usage,
 * and health metrics with configurable alerting thresholds.
 */

import { EventEmitter } from 'events';
import { CircuitBreakerStats, circuitBreakerRegistry } from './circuitBreaker.js';

export interface MonitoringConfig {
  enabled: boolean;
  metricsInterval?: number;        // Interval for collecting metrics (ms)
  retentionPeriod?: number;       // How long to keep metrics (ms)
  alertThresholds?: AlertThresholds;
  alertChannels?: AlertChannel[];
}

export interface AlertThresholds {
  errorRate?: number;            // Error rate percentage (0-100)
  responseTime?: number;         // Average response time (ms)
  memoryUsage?: number;          // Memory usage percentage (0-100)
  cpuUsage?: number;             // CPU usage percentage (0-100)
  connectionPoolUsage?: number;   // Connection pool usage percentage (0-100)
  circuitBreakerFailures?: number; // Circuit breaker failure count
}

export interface AlertChannel {
  type: 'console' | 'file' | 'webhook' | 'email';
  config: Record<string, any>;
}

export interface SystemMetrics {
  timestamp: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
  requests: {
    total: number;
    success: number;
    error: number;
    errorRate: number;
    avgResponseTime: number;
  };
  connectionPools: Record<string, any>;
  circuitBreakers: Record<string, CircuitBreakerStats>;
}

export interface Alert {
  id: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  metrics: Partial<SystemMetrics>;
  resolved: boolean;
  resolvedAt?: number;
}

export interface MonitoringDashboard {
  uptime: number;
  totalRequests: number;
  totalErrors: number;
  currentErrorRate: number;
  avgResponseTime: number;
  activeAlerts: number;
  systemHealth: 'healthy' | 'degraded' | 'critical';
}

/**
 * Advanced monitoring system with alerting
 */
export class MonitoringSystem extends EventEmitter {
  private config: Required<MonitoringConfig>;
  private metrics: SystemMetrics[] = [];
  private alerts: Alert[] = [];
  private metricsInterval?: NodeJS.Timeout;
  private startTime: number = Date.now();
  private requestMetrics = {
    total: 0,
    success: 0,
    error: 0,
    responseTime: 0
  };

  // System health tracking
  private healthHistory: Array<{ timestamp: number; health: 'healthy' | 'degraded' | 'critical' }> = [];

  constructor(config: MonitoringConfig = { enabled: true }) {
    super();
    
    this.config = {
      enabled: config.enabled,
      metricsInterval: config.metricsInterval || 10000, // 10 seconds
      retentionPeriod: config.retentionPeriod || 24 * 60 * 60 * 1000, // 24 hours
      alertThresholds: {
        errorRate: 5,              // 5% error rate
        responseTime: 1000,         // 1 second
        memoryUsage: 85,            // 85% memory
        cpuUsage: 80,              // 80% CPU
        connectionPoolUsage: 90,    // 90% pool usage
        circuitBreakerFailures: 3,  // 3 circuit breaker failures
        ...config.alertThresholds
      },
      alertChannels: config.alertChannels || [
        { type: 'console', config: {} }
      ]
    };

    if (this.config.enabled) {
      this.startMonitoring();
    }
  }

  /**
   * Record a request for metrics tracking
   */
  recordRequest(responseTime: number, success: boolean): void {
    this.requestMetrics.total++;
    if (success) {
      this.requestMetrics.success++;
    } else {
      this.requestMetrics.error++;
    }
    this.requestMetrics.responseTime += responseTime;
  }

  /**
   * Get current dashboard metrics
   */
  getDashboard(): MonitoringDashboard {
    const latestMetrics = this.getLatestMetrics();
    const activeAlerts = this.getActiveAlerts();
    const errorRate = latestMetrics?.requests.errorRate || 0;
    const avgResponseTime = latestMetrics?.requests.avgResponseTime || 0;

    let systemHealth: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    if (errorRate > this.config.alertThresholds.errorRate! * 2 || 
        avgResponseTime > this.config.alertThresholds.responseTime! * 2) {
      systemHealth = 'critical';
    } else if (errorRate > this.config.alertThresholds.errorRate! || 
               avgResponseTime > this.config.alertThresholds.responseTime! ||
               (latestMetrics?.memory.percentage && latestMetrics.memory.percentage > this.config.alertThresholds.memoryUsage!)) {
      systemHealth = 'degraded';
    }

    return {
      uptime: Date.now() - this.startTime,
      totalRequests: this.requestMetrics.total,
      totalErrors: this.requestMetrics.error,
      currentErrorRate: errorRate,
      avgResponseTime,
      activeAlerts: activeAlerts.length,
      systemHealth
    };
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit?: number): SystemMetrics[] {
    return limit ? this.metrics.slice(-limit) : [...this.metrics];
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): Alert[] {
    return [...this.alerts];
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
      this.emit('alert-resolved', alert);
      this.sendAlert(alert);
    }
  }

  /**
   * Gracefully shutdown monitoring
   */
  async shutdown(): Promise<void> {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = undefined;
    }

    // Send final metrics
    await this.collectMetrics();
    
    this.emit('shutdown');
  }

  private startMonitoring(): void {
    this.metricsInterval = setInterval(async () => {
      await this.collectMetrics();
    }, this.config.metricsInterval);
  }

  private async collectMetrics(): Promise<void> {
    try {
      const metrics = await this.gatherSystemMetrics();
      
      // Store metrics
      this.metrics.push(metrics);
      
      // Cleanup old metrics
      const cutoff = Date.now() - this.config.retentionPeriod;
      this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
      
      // Check for alerts
      await this.checkAlerts(metrics);
      
      this.emit('metrics-collected', metrics);
    } catch (error) {
      console.error('Error collecting metrics:', error);
    }
  }

  private async gatherSystemMetrics(): Promise<SystemMetrics> {
    const now = Date.now();
    
    // Memory metrics
    const memUsage = process.memoryUsage();
    const totalMem = require('os').totalmem();
    const memory = {
      used: memUsage.heapUsed,
      total: totalMem,
      percentage: (memUsage.heapUsed / totalMem) * 100
    };

    // CPU metrics (simplified)
    const cpuUsage = process.cpuUsage();
    const cpu = {
      usage: (cpuUsage.user + cpuUsage.system) / 1000000 // Convert to seconds
    };

    // Request metrics
    const total = this.requestMetrics.total;
    const success = this.requestMetrics.success;
    const error = this.requestMetrics.error;
    const errorRate = total > 0 ? (error / total) * 100 : 0;
    const avgResponseTime = total > 0 ? this.requestMetrics.responseTime / total : 0;

    const requests = {
      total,
      success,
      error,
      errorRate,
      avgResponseTime
    };

    // Connection pool metrics - get from registered connection pools if available
    const connectionPools: Record<string, any> = {}; // TODO: Integrate with connection pool registry

    // Circuit breaker metrics
    const circuitBreakers = circuitBreakerRegistry.getAllStats();

    return {
      timestamp: now,
      memory,
      cpu,
      requests,
      connectionPools,
      circuitBreakers
    };
  }

  private async checkAlerts(metrics: SystemMetrics): Promise<void> {
    const thresholds = this.config.alertThresholds;
    const alerts: Alert[] = [];

    // Check error rate
    if (metrics.requests.errorRate > thresholds.errorRate!) {
      alerts.push(this.createAlert(
        'high_error_rate',
        `Error rate is ${metrics.requests.errorRate.toFixed(2)}% (threshold: ${thresholds.errorRate}%)`,
        'high',
        metrics
      ));
    }

    // Check response time
    if (metrics.requests.avgResponseTime > thresholds.responseTime!) {
      alerts.push(this.createAlert(
        'high_response_time',
        `Average response time is ${metrics.requests.avgResponseTime}ms (threshold: ${thresholds.responseTime}ms)`,
        'medium',
        metrics
      ));
    }

    // Check memory usage
    if (metrics.memory.percentage > thresholds.memoryUsage!) {
      alerts.push(this.createAlert(
        'high_memory_usage',
        `Memory usage is ${metrics.memory.percentage.toFixed(2)}% (threshold: ${thresholds.memoryUsage}%)`,
        'high',
        metrics
      ));
    }

    // Check circuit breakers
    for (const [name, stats] of Object.entries(metrics.circuitBreakers)) {
      if (stats.failureCount > thresholds.circuitBreakerFailures! && stats.state === 'open') {
        alerts.push(this.createAlert(
          'circuit_breaker_open',
          `Circuit breaker ${name} is OPEN with ${stats.failureCount} failures`,
          'critical',
          metrics
        ));
      }
    }

    // Send new alerts
    for (const alert of alerts) {
      if (!this.isDuplicateAlert(alert)) {
        this.alerts.push(alert);
        this.emit('alert', alert);
        this.sendAlert(alert);
      }
    }
  }

  private createAlert(type: string, message: string, severity: Alert['severity'], metrics: SystemMetrics): Alert {
    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      severity,
      type,
      message,
      metrics,
      resolved: false
    };
  }

  private isDuplicateAlert(newAlert: Alert): boolean {
    const recentAlerts = this.alerts.filter(alert => 
      !alert.resolved && 
      alert.type === newAlert.type &&
      (Date.now() - alert.timestamp) < 60000 // Within last minute
    );
    
    return recentAlerts.length > 0;
  }

  private async sendAlert(alert: Alert): Promise<void> {
    for (const channel of this.config.alertChannels) {
      try {
        switch (channel.type) {
          case 'console':
            console.log(`[${alert.severity.toUpperCase()}] ${alert.message}`, {
              timestamp: new Date(alert.timestamp).toISOString(),
              type: alert.type
            });
            break;
            
          case 'file':
            await this.sendFileAlert(alert, channel.config);
            break;
            
          case 'webhook':
            await this.sendWebhookAlert(alert, channel.config);
            break;
        }
      } catch (error) {
        console.error('Failed to send alert via', channel.type, error);
      }
    }
  }

  private async sendFileAlert(alert: Alert, config: Record<string, any>): Promise<void> {
    const fs = await import('fs');
    const path = await import('path');
    
    const logFile = config.path || './alerts.log';
    const logDir = path.dirname(logFile);
    
    // Ensure directory exists
    await fs.promises.mkdir(logDir, { recursive: true });
    
    const logEntry = `${new Date(alert.timestamp).toISOString()} [${alert.severity.toUpperCase()}] ${alert.message}\n`;
    await fs.promises.appendFile(logFile, logEntry);
  }

  private async sendWebhookAlert(alert: Alert, config: Record<string, any>): Promise<void> {
    // Use native Node.js fetch if available, otherwise skip webhook
    if (typeof fetch !== 'undefined') {
      const payload = {
        alert,
        timestamp: new Date().toISOString(),
        service: 'qtests-monitoring'
      };
      
      await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: JSON.stringify(payload)
      });
    } else {
      console.warn('Webhook alert skipped - fetch not available');
    }
    
    const payload = {
      alert,
      timestamp: new Date().toISOString(),
      service: 'qtests-monitoring'
    };
    
    await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: JSON.stringify(payload)
    });
  }

  private getLatestMetrics(): SystemMetrics | undefined {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : undefined;
  }
}

/**
 * Global monitoring instance
 */
export const monitoringSystem = new MonitoringSystem({
  enabled: process.env.MONITORING_ENABLED !== 'false',
  metricsInterval: parseInt(process.env.MONITORING_INTERVAL || '10000'),
  alertThresholds: {
    errorRate: parseFloat(process.env.ALERT_ERROR_RATE || '5'),
    responseTime: parseFloat(process.env.ALERT_RESPONSE_TIME || '1000'),
    memoryUsage: parseFloat(process.env.ALERT_MEMORY_USAGE || '85')
  }
});

export default MonitoringSystem;