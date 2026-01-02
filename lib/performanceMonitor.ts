/**
 * Performance Monitoring Utilities
 * Optimized performance tracking with memory-efficient metrics collection
 */

import { EventEmitter } from 'events';

export interface PerformanceMetrics {
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
    heapUsed: number;
    heapTotal: number;
  };
  eventLoop: {
    utilization: number;
    lag: number;
  };
  requests: {
    total: number;
    perSecond: number;
    averageResponseTime: number;
    errorRate: number;
  };
  database: {
    activeConnections: number;
    queryTime: number;
    cacheHitRate: number;
  };
  timestamp: number;
}

export interface AlertRule {
  name: string;
  metric: keyof PerformanceMetrics;
  threshold: number;
  operator: '>' | '<' | '>=' | '<=';
  duration: number; // ms
  enabled: boolean;
}

export interface Alert {
  rule: AlertRule;
  value: number;
  timestamp: number;
  resolved: boolean;
}

interface MetricHistory {
  [key: string]: Array<{ value: number; timestamp: number }>;
}

interface MonitorConfig {
  intervalMs: number;
  historySize: number;
  alertCheckIntervalMs: number;
  enableEventLoopMonitoring: boolean;
  enableCpuMonitoring: boolean;
  enableMemoryMonitoring: boolean;
}

/**
 * Performance Monitor with real-time metrics and alerting
 */
export class PerformanceMonitor extends EventEmitter {
  private metrics: PerformanceMetrics;
  private history: MetricHistory = {};
  private alerts = new Map<string, Alert>();
  private alertRules: AlertRule[] = [];
  private monitoringInterval?: NodeJS.Timeout;
  private isMonitoring = false;
  private config: MonitorConfig;
  
  // Circular buffer implementation for memory-efficient history storage
  private circularBuffers = new Map<string, { buffer: Array<{ value: number; timestamp: number }>; size: number; head: number; count: number }>();
  private readonly defaultBufferSize = 720; // 2 hours of 5-second intervals
  
  // Adaptive sampling properties
  private samplingRate = 1.0; // Start with full sampling
  private performanceBaseline: PerformanceMetrics | null = null;
  private lastSamplingAdjustment = 0;
  private samplingAdjustmentInterval = 60000; // Adjust every minute
  private highLoadThreshold = 0.8; // 80% resource usage
  private lowLoadThreshold = 0.3; // 30% resource usage

  constructor(config: Partial<MonitorConfig> = {}) {
    super();
    
    // Initialize config first with memory-efficient defaults
    this.config = {
      intervalMs: 5000,        // Reduced frequency to lower overhead
      historySize: 720,       // Reduced history to 2 hours (5 second intervals)
      alertCheckIntervalMs: 10000, // Less frequent alert checks
      enableEventLoopMonitoring: false, // Disabled by default for performance
      enableCpuMonitoring: true,
      enableMemoryMonitoring: true,
      ...config
    };
    
    // Now initialize other properties
    this.metrics = this.initializeMetrics();
    this.setupDefaultAlertRules();
  }

  /**
   * Start performance monitoring
   */
  start(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.checkAlerts();
    }, this.config.intervalMs);

    this.emit('monitoring:started');
    console.log('Performance monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stop(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    this.emit('monitoring:stopped');
    console.log('Performance monitoring stopped');
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get metrics history for a specific metric (optimized with circular buffer)
   */
  getHistory(metricPath: string, durationMs?: number): Array<{ value: number; timestamp: number }> {
    // Prefer circular buffer data for efficiency
    const buffer = this.circularBuffers.get(metricPath);
    if (buffer && buffer.count > 0) {
      const result: Array<{ value: number; timestamp: number }> = [];
      
      // Extract data from circular buffer in chronological order
      for (let i = 0; i < buffer.count; i++) {
        const index = (buffer.head - buffer.count + i + 1 + buffer.size) % buffer.size;
        const entry = buffer.buffer[index];
        if (entry) {
          // Apply duration filter if specified
          if (!durationMs || entry.timestamp >= Date.now() - durationMs) {
            result.push(entry);
          }
        }
      }
      
      return result;
    }
    
    // Fallback to array-based history
    const history = this.history[metricPath] || [];
    
    if (!durationMs) {
      return [...history];
    }

    const cutoff = Date.now() - durationMs;
    return history.filter(entry => entry.timestamp >= cutoff);
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
  }

  /**
   * Add custom alert rule
   */
  addAlertRule(rule: AlertRule): void {
    this.alertRules.push(rule);
    this.emit('alert-rule:added', rule);
  }

  /**
   * Remove alert rule
   */
  removeAlertRule(ruleName: string): void {
    this.alertRules = this.alertRules.filter(rule => rule.name !== ruleName);
    this.alerts.delete(ruleName);
    this.emit('alert-rule:removed', ruleName);
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(): number {
    let score = 100;
    
    // CPU impact
    if (this.metrics.cpu.usage > 80) score -= 20;
    else if (this.metrics.cpu.usage > 60) score -= 10;
    
    // Memory impact
    if (this.metrics.memory.percentage > 85) score -= 20;
    else if (this.metrics.memory.percentage > 70) score -= 10;
    
    // Event loop impact
    if (this.metrics.eventLoop.utilization > 80) score -= 20;
    else if (this.metrics.eventLoop.utilization > 60) score -= 10;
    
    // Response time impact
    if (this.metrics.requests.averageResponseTime > 1000) score -= 15;
    else if (this.metrics.requests.averageResponseTime > 500) score -= 8;
    
    // Error rate impact
    if (this.metrics.requests.errorRate > 5) score -= 15;
    else if (this.metrics.requests.errorRate > 1) score -= 5;
    
    return Math.max(0, score);
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.cpu.usage > 80) {
      recommendations.push('High CPU usage detected. Consider scaling horizontally or optimizing CPU-intensive operations.');
    }
    
    if (this.metrics.memory.percentage > 85) {
      recommendations.push('High memory usage detected. Check for memory leaks and consider increasing memory limits.');
    }
    
    if (this.metrics.eventLoop.lag > 100) {
      recommendations.push('High event loop lag detected. Move blocking operations to worker threads or optimize async operations.');
    }
    
    if (this.metrics.requests.averageResponseTime > 1000) {
      recommendations.push('Slow response times detected. Consider implementing caching or optimizing database queries.');
    }
    
    if (this.metrics.requests.errorRate > 5) {
      recommendations.push('High error rate detected. Review application logs and fix underlying issues.');
    }
    
    if (this.metrics.database.cacheHitRate < 50) {
      recommendations.push('Low database cache hit rate. Consider optimizing cache strategies or query patterns.');
    }
    
    return recommendations;
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      cpu: { usage: 0, loadAverage: [0, 0, 0] },
      memory: { used: 0, total: 0, percentage: 0, heapUsed: 0, heapTotal: 0 },
      eventLoop: { utilization: 0, lag: 0 },
      requests: { total: 0, perSecond: 0, averageResponseTime: 0, errorRate: 0 },
      database: { activeConnections: 0, queryTime: 0, cacheHitRate: 0 },
      timestamp: Date.now()
    };
  }

  private setupDefaultAlertRules(): void {
    this.alertRules = [
      {
        name: 'high-cpu',
        metric: 'cpu',
        threshold: 80,
        operator: '>',
        duration: 30000, // 30 seconds
        enabled: true
      },
      {
        name: 'high-memory',
        metric: 'memory',
        threshold: 85,
        operator: '>',
        duration: 30000,
        enabled: true
      },
      {
        name: 'high-event-loop-lag',
        metric: 'eventLoop',
        threshold: 100,
        operator: '>',
        duration: 10000, // 10 seconds
        enabled: true
      },
      {
        name: 'high-error-rate',
        metric: 'requests',
        threshold: 5,
        operator: '>',
        duration: 60000, // 1 minute
        enabled: true
      }
    ];
  }

  private collectMetrics(): void {
    const timestamp = Date.now();
    
    // Adaptive sampling - skip collection based on current load
    if (!this.shouldCollectMetrics()) {
      return;
    }
    
    // Adjust sampling rate periodically
    this.adjustSamplingRate();
    
    // Collect CPU metrics
    if (this.config.enableCpuMonitoring) {
      this.collectCpuMetrics(timestamp);
    }
    
    // Collect memory metrics
    if (this.config.enableMemoryMonitoring) {
      this.collectMemoryMetrics(timestamp);
    }
    
    // Collect event loop metrics
    if (this.config.enableEventLoopMonitoring) {
      this.collectEventLoopMetrics(timestamp);
    }
    
    // Update timestamp
    this.metrics.timestamp = timestamp;
    
    // Emit metrics update
    this.emit('metrics:updated', this.metrics);
  }

  private collectCpuMetrics(timestamp: number): void {
    try {
      const cpus = require('os').cpus();
      const loadAvg = require('os').loadavg();
      
      // Calculate CPU usage (simplified)
      let totalIdle = 0;
      let totalTick = 0;
      
      cpus.forEach((cpu: any) => {
        for (const type in cpu.times) {
          totalTick += cpu.times[type as keyof typeof cpu.times];
        }
        totalIdle += cpu.times.idle;
      });
      
      const idle = totalIdle / cpus.length;
      const total = totalTick / cpus.length;
      const usage = 100 - (idle / total) * 100;
      
      this.metrics.cpu.usage = Math.round(usage * 100) / 100;
      this.metrics.cpu.loadAverage = loadAvg;
      
      // Store in history
      this.updateHistory('cpu.usage', this.metrics.cpu.usage, timestamp);
      
    } catch (error) {
      console.warn('Failed to collect CPU metrics:', error);
    }
  }

  private collectMemoryMetrics(timestamp: number): void {
    try {
      const memUsage = process.memoryUsage();
      const totalMem = require('os').totalmem();
      const freeMem = require('os').freemem();
      const usedMem = totalMem - freeMem;
      
      this.metrics.memory.used = usedMem;
      this.metrics.memory.total = totalMem;
      this.metrics.memory.percentage = (usedMem / totalMem) * 100;
      this.metrics.memory.heapUsed = memUsage.heapUsed;
      this.metrics.memory.heapTotal = memUsage.heapTotal;
      
      // Store in history
      this.updateHistory('memory.percentage', this.metrics.memory.percentage, timestamp);
      this.updateHistory('memory.heapUsed', this.metrics.memory.heapUsed, timestamp);
      
    } catch (error) {
      console.warn('Failed to collect memory metrics:', error);
    }
  }

  private collectEventLoopMetrics(timestamp: number): void {
    try {
      const start = process.hrtime.bigint();
      
      // Schedule a callback to measure event loop lag
      setImmediate(() => {
        const end = process.hrtime.bigint();
        const lag = Number(end - start) / 1000000; // Convert to milliseconds
        
        this.metrics.eventLoop.lag = Math.round(lag * 100) / 100;
        
        // Calculate utilization (simplified)
        this.metrics.eventLoop.utilization = Math.min(100, (lag / 10) * 100);
        
        // Store in history
        this.updateHistory('eventLoop.lag', this.metrics.eventLoop.lag, timestamp);
        this.updateHistory('eventLoop.utilization', this.metrics.eventLoop.utilization, timestamp);
      });
      
    } catch (error) {
      console.warn('Failed to collect event loop metrics:', error);
    }
  }

  /**
   * Determine if metrics should be collected based on adaptive sampling
   */
  private shouldCollectMetrics(): boolean {
    // Always collect the first few metrics to establish baseline
    if (!this.performanceBaseline) {
      return true;
    }
    
    // Use random sampling based on current rate
    return Math.random() < this.samplingRate;
  }

  /**
   * Adjust sampling rate based on current system load
   */
  private adjustSamplingRate(): void {
    const now = Date.now();
    
    // Only adjust periodically
    if (now - this.lastSamplingAdjustment < this.samplingAdjustmentInterval) {
      return;
    }
    
    this.lastSamplingAdjustment = now;
    
    // Calculate overall system load (0-1 scale)
    const memoryLoad = this.metrics.memory.percentage / 100;
    const cpuLoad = Math.min(this.metrics.cpu.usage / 100, 1);
    const eventLoopLoad = Math.min(this.metrics.eventLoop.utilization, 1);
    
    const overallLoad = (memoryLoad + cpuLoad + eventLoopLoad) / 3;
    
    // Adjust sampling rate based on load
    if (overallLoad > this.highLoadThreshold) {
      // High load - reduce sampling to save resources
      this.samplingRate = Math.max(0.1, this.samplingRate * 0.8);
      console.debug(`High load detected (${(overallLoad * 100).toFixed(1)}%), reducing sampling to ${(this.samplingRate * 100).toFixed(1)}%`);
    } else if (overallLoad < this.lowLoadThreshold) {
      // Low load - can afford full sampling
      this.samplingRate = Math.min(1.0, this.samplingRate * 1.2);
      console.debug(`Low load detected (${(overallLoad * 100).toFixed(1)}%), increasing sampling to ${(this.samplingRate * 100).toFixed(1)}%`);
    } else {
      // Medium load - maintain current sampling
      this.samplingRate = Math.max(0.5, Math.min(0.9, this.samplingRate));
    }
    
    // Ensure we have at least some baseline measurements
    if (this.samplingRate < 0.3) {
      this.samplingRate = 0.3;
    }
  }

  private updateHistory(path: string, value: number, timestamp: number): void {
    // Use circular buffer for O(1) insertion and bounded memory usage
    let buffer = this.circularBuffers.get(path);
    
    if (!buffer) {
      buffer = {
        buffer: new Array(this.config.historySize || this.defaultBufferSize),
        size: this.config.historySize || this.defaultBufferSize,
        head: 0,
        count: 0
      };
      this.circularBuffers.set(path, buffer);
    }
    
    // Add new entry to circular buffer (O(1) operation)
    buffer.buffer[buffer.head] = { value, timestamp };
    buffer.head = (buffer.head + 1) % buffer.size;
    buffer.count = Math.min(buffer.count + 1, buffer.size);
    
    // Maintain backward compatibility with array-based history for existing code
    if (!this.history[path]) {
      this.history[path] = [];
    }
    
    // Update array-based history for compatibility (but limit size)
    this.history[path].push({ value, timestamp });
    
    // Apply aggressive memory management to array-based history
    if (this.history[path].length > this.config.historySize) {
      const memoryPressure = this.getMemoryPressure();
      let keepRatio = 0.7; // Default keep 70%
      
      if (memoryPressure > 0.9) {
        keepRatio = 0.5; // High pressure - keep only 50%
      } else if (memoryPressure > 0.8) {
        keepRatio = 0.6; // Medium pressure - keep 60%
      }
      
      const keepCount = Math.floor(this.config.historySize * keepRatio);
      
      // Keep most recent entries
      this.history[path] = this.history[path].slice(-keepCount);
      
      // Additional cleanup under extreme memory pressure
      if (memoryPressure > 0.95) {
        this.cleanupOldHistory();
      }
    }
  }
  
  /**
   * Get current memory pressure (0-1 scale)
   */
  private getMemoryPressure(): number {
    try {
      const memUsage = process.memoryUsage();
      const totalMem = require('os').totalmem();
      const usedMem = totalMem - require('os').freemem();
      return Math.min(1, usedMem / totalMem);
    } catch {
      return 0.5; // Default to medium pressure on error
    }
  }
  
  /**
   * Intelligent sampling to preserve important data points
   */
  private intelligentSample(data: Array<{ value: number; timestamp: number }>, targetCount: number): Array<{ value: number; timestamp: number }> {
    if (data.length <= targetCount) {
      return data;
    }
    
    // Preserve outliers and significant changes - optimized single-pass calculation
    let sum = 0;
    let sumSquares = 0;
    const values = new Array(data.length);
    
    // Handle empty data edge case to prevent division by zero
    if (data.length === 0) {
      return data; // Return empty array for empty input
    }
    
    // Single pass to extract values and calculate sums
    for (let i = 0; i < data.length; i++) {
      const value = data[i].value;
      values[i] = value;
      sum += value;
      sumSquares += value * value;
    }
    
    const mean = sum / values.length;
    const stdDev = Math.sqrt((sumSquares / values.length) - (mean * mean));
    const threshold = mean + (stdDev * 2); // 2 sigma threshold for outliers
    
    // Keep outliers and evenly sample the rest
    const outliers = data.filter(d => Math.abs(d.value - mean) > stdDev);
    const normal = data.filter(d => Math.abs(d.value - mean) <= stdDev);
    
    // Sample normal data
    const sampleInterval = Math.ceil(normal.length / (targetCount - outliers.length));
    const sampledNormal = normal.filter((_, index) => index % sampleInterval === 0);
    
    // Combine and sort by timestamp
    return [...outliers, ...sampledNormal]
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, targetCount);
  }
  
  /**
   * Cleanup old history data to prevent memory leaks
   */
  private cleanupOldHistory(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours max age
    
    for (const [path, history] of Object.entries(this.history)) {
      const filtered = history.filter(entry => now - entry.timestamp < maxAge);
      if (filtered.length !== history.length) {
        this.history[path] = filtered;
        console.debug(`Cleaned up old history for ${path}: ${history.length - filtered.length} entries removed`);
      }
    }
  }

  private checkAlerts(): void {
    for (const rule of this.alertRules) {
      if (!rule.enabled) {
        continue;
      }
      
      const currentValue = this.getMetricValue(rule.metric);
      const isTriggered = this.evaluateCondition(currentValue, rule.operator, rule.threshold);
      
      const existingAlert = this.alerts.get(rule.name);
      
      if (isTriggered && !existingAlert) {
        // New alert
        const alert: Alert = {
          rule,
          value: currentValue,
          timestamp: Date.now(),
          resolved: false
        };
        
        this.alerts.set(rule.name, alert);
        this.emit('alert:triggered', alert);
        
        console.warn(`🚨 Alert triggered: ${rule.name} - ${rule.metric} ${rule.operator} ${rule.threshold} (current: ${currentValue})`);
        
      } else if (!isTriggered && existingAlert && !existingAlert.resolved) {
        // Alert resolved
        existingAlert.resolved = true;
        this.emit('alert:resolved', existingAlert);
        
        console.log(`✅ Alert resolved: ${rule.name}`);
      }
    }
  }

  private getMetricValue(metric: keyof PerformanceMetrics): number {
    switch (metric) {
      case 'cpu':
        return this.metrics.cpu.usage;
      case 'memory':
        return this.metrics.memory.percentage;
      case 'eventLoop':
        return this.metrics.eventLoop.lag;
      case 'requests':
        return this.metrics.requests.errorRate;
      case 'database':
        return this.metrics.database.queryTime;
      default:
        return 0;
    }
  }

  private evaluateCondition(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case '>=': return value >= threshold;
      case '<=': return value <= threshold;
      default: return false;
    }
  }

  /**
   * Update request metrics (call this from your request handlers)
   */
  updateRequestMetrics(responseTime: number, isError: boolean): void {
    this.metrics.requests.total++;
    
    // Update average response time
    const totalRequests = this.metrics.requests.total;
    this.metrics.requests.averageResponseTime = 
      (this.metrics.requests.averageResponseTime * (totalRequests - 1) + responseTime) / totalRequests;
    
    // Update error rate (simplified - rolling window would be better)
    if (isError) {
      this.metrics.requests.errorRate = 
        (this.metrics.requests.errorRate * (totalRequests - 1) + 100) / totalRequests;
    } else {
      this.metrics.requests.errorRate = 
        (this.metrics.requests.errorRate * (totalRequests - 1)) / totalRequests;
    }
    
    // Calculate requests per second (simplified)
    this.metrics.requests.perSecond = 1000 / responseTime;
  }

  /**
   * Update database metrics (call this from your database client)
   */
  updateDatabaseMetrics(activeConnections: number, queryTime: number, cacheHitRate: number): void {
    this.metrics.database.activeConnections = activeConnections;
    this.metrics.database.queryTime = queryTime;
    this.metrics.database.cacheHitRate = cacheHitRate;
  }
}

/**
 * Create a performance monitor with default configuration
 */
export function createPerformanceMonitor(config?: Partial<MonitorConfig>): PerformanceMonitor {
  return new PerformanceMonitor(config);
}

/**
 * Global performance monitor instance
 */
export const globalPerformanceMonitor = createPerformanceMonitor();

export default PerformanceMonitor;