/**
 * Performance Monitor Implementation
 * 
 * Provides real-time performance monitoring with adaptive sampling,
 * circular buffer storage, and alerting capabilities.
 */

import { EventEmitter } from 'events';
import * as os from 'os';

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
    latency: number;
  };
  custom: {
    [key: string]: number;
  };
}

export interface AlertThresholds {
  cpu?: number;
  memory?: number;
  eventLoop?: number;
  custom?: {
    [key: string]: number;
  };
}

export interface PerformanceMonitorOptions {
  samplingInterval?: number;
  historySize?: number;
  adaptiveSampling?: boolean;
  alertThresholds?: AlertThresholds;
}

/**
 * Performance Monitor with adaptive sampling
 */
export class PerformanceMonitor extends EventEmitter {
  private metrics: PerformanceMetrics = {
    cpu: { usage: 0, loadAverage: [] },
    memory: { used: 0, total: 0, percentage: 0, heapUsed: 0, heapTotal: 0 },
    eventLoop: { utilization: 0, latency: 0 },
    custom: {}
  };

  private history: {
    [path: string]: Array<{ value: number; timestamp: number }>;
  } = {};

  private circularBuffers = new Map<string, any>();
  private performanceBaseline: PerformanceMetrics | null = null;
  private samplingRate = 1.0;
  private lastSamplingAdjustment = 0;

  private config: Required<PerformanceMonitorOptions>;
  private monitoringInterval?: NodeJS.Timeout;

  constructor(private options: PerformanceMonitorOptions = {}) {
    super();
    
    this.config = {
      samplingInterval: options.samplingInterval || 1000,
      historySize: options.historySize || 1000,
      adaptiveSampling: options.adaptiveSampling || false,
      alertThresholds: options.alertThresholds || {}
    };

    this.startMonitoring();
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.monitoringInterval) {
      return; // Already monitoring
    }

    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, this.config.samplingInterval);
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get historical data for a metric path
   */
  getHistory(path: string, limit?: number): Array<{ value: number; timestamp: number }> {
    const history = this.history[path] || [];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Add custom metric
   */
  addMetric(name: string, value: number): void {
    this.metrics.custom[name] = value;
    this.updateHistory(`custom.${name}`, value, Date.now());
    
    // Check alert threshold
    this.checkAlertThresholds(`custom.${name}`, value);
  }

  /**
   * Collect all performance metrics
   */
  private collectMetrics(): void {
    if (!this.shouldCollectMetrics()) {
      return;
    }

    const now = Date.now();

    // Collect CPU metrics
    this.collectCPUMetrics(now);

    // Collect memory metrics
    this.collectMemoryMetrics(now);

    // Collect event loop metrics
    this.collectEventLoopMetrics(now);

    // Update performance baseline
    if (!this.performanceBaseline) {
      this.performanceBaseline = { ...this.metrics };
    }

    // Adjust sampling rate if adaptive sampling is enabled
    if (this.config.adaptiveSampling) {
      this.adjustSamplingRate();
    }

    // Check alert thresholds
    this.checkAllAlertThresholds();
  }

  /**
   * Collect CPU metrics
   */
  private collectCPUMetrics(timestamp: number): void {
    const loadAvg = os.loadavg();
    this.metrics.cpu = {
      usage: this.calculateCPUUsage(),
      loadAverage: loadAvg
    };

    this.updateHistory('cpu.usage', this.metrics.cpu.usage, timestamp);
    this.updateHistory('cpu.loadAverage', loadAvg[0], timestamp);
  }

  /**
   * Collect memory metrics
   */
  private collectMemoryMetrics(timestamp: number): void {
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    this.metrics.memory = {
      used: usedMem,
      total: totalMem,
      percentage: (usedMem / totalMem) * 100,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal
    };

    this.updateHistory('memory.percentage', this.metrics.memory.percentage, timestamp);
    this.updateHistory('memory.heapUsed', this.metrics.memory.heapUsed, timestamp);
  }

  /**
   * Collect event loop metrics
   */
  private collectEventLoopMetrics(timestamp: number): void {
    const start = process.hrtime.bigint();
    
    setImmediate(() => {
      const end = process.hrtime.bigint();
      const latency = Number(end - start) / 1000000; // Convert to milliseconds
      
      this.metrics.eventLoop.utilization = this.calculateEventLoopUtilization();
      this.metrics.eventLoop.latency = latency;
      
      this.updateHistory('eventLoop.utilization', this.metrics.eventLoop.utilization, timestamp);
      this.updateHistory('eventLoop.latency', latency, timestamp);
    });
  }

  /**
   * Calculate CPU usage
   */
  private calculateCPUUsage(): number {
    // Simple CPU usage calculation
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += (cpu.times as any)[type];
      }
      totalIdle += cpu.times.idle;
    });

    return Math.max(0, 100 - (totalIdle / totalTick) * 100);
  }

  /**
   * Calculate event loop utilization
   */
  private calculateEventLoopUtilization(): number {
    // Simplified event loop utilization calculation
    return Math.random() * 20; // Placeholder - actual implementation would measure loop delay
  }

  /**
   * Determine if metrics should be collected based on adaptive sampling
   */
  private shouldCollectMetrics(): boolean {
    if (!this.performanceBaseline) {
      return true;
    }
    
    return Math.random() < this.samplingRate;
  }

  /**
   * Adjust sampling rate based on current system load
   */
  private adjustSamplingRate(): void {
    const now = Date.now();
    
    if (now - this.lastSamplingAdjustment < 10000) {
      return;
    }
    
    this.lastSamplingAdjustment = now;
    
    const memoryLoad = this.metrics.memory.percentage / 100;
    const cpuLoad = Math.min(this.metrics.cpu.usage / 100, 1);
    const eventLoopLoad = Math.min(this.metrics.eventLoop.utilization, 1);
    
    const overallLoad = (memoryLoad + cpuLoad + eventLoopLoad) / 3;
    
    // Reduce sampling rate under high load
    this.samplingRate = Math.max(0.1, 1 - overallLoad);
  }

  /**
   * Update history for a metric path
   */
  private updateHistory(path: string, value: number, timestamp: number): void {
    if (!this.history[path]) {
      this.history[path] = [];
    }

    this.history[path].push({ value, timestamp });

    // Keep history size bounded
    const maxSize = this.config.historySize;
    if (this.history[path].length > maxSize) {
      this.history[path] = this.history[path].slice(-maxSize);
    }
  }

  /**
   * Check alert threshold for a specific metric
   */
  private checkAlertThresholds(path: string, value: number): void {
    const threshold = this.getThresholdForPath(path);
    if (threshold && value > threshold) {
      this.emit('alert', { path, value, threshold, timestamp: Date.now() });
    }
  }

  /**
   * Check all alert thresholds
   */
  private checkAllAlertThresholds(): void {
    this.checkAlertThresholds('cpu.usage', this.metrics.cpu.usage);
    this.checkAlertThresholds('memory.percentage', this.metrics.memory.percentage);
    this.checkAlertThresholds('eventLoop.utilization', this.metrics.eventLoop.utilization);

    // Check custom metrics
    for (const [name, value] of Object.entries(this.metrics.custom)) {
      this.checkAlertThresholds(`custom.${name}`, value);
    }
  }

  /**
   * Get threshold for a specific metric path
   */
  private getThresholdForPath(path: string): number | undefined {
    const thresholds = this.config.alertThresholds;
    
    if (path.startsWith('custom.')) {
      const customName = path.substring(7);
      return thresholds.custom?.[customName] as number;
    }
    
    const [category] = path.split('.');
    return thresholds[category as keyof typeof thresholds] as number;
  }
}