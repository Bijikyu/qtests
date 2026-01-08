/**
 * Memory Pressure Detection and Adaptive Scaling System
 * 
 * Monitors system memory usage and automatically adjusts application behavior
 * to prevent out-of-memory errors and maintain optimal performance under
 * varying load conditions.
 */

import { EventEmitter } from 'events';

export interface MemoryPressureConfig {
  checkInterval?: number;           // How often to check memory (ms)
  lowMemoryThreshold?: number;     // Low memory threshold (0-1)
  highMemoryThreshold?: number;    // High memory threshold (0-1)
  criticalMemoryThreshold?: number; // Critical memory threshold (0-1)
  enableAutoScaling?: boolean;      // Enable automatic scaling adjustments
  enableGarbageCollection?: boolean; // Enable forced GC under pressure
  scalingFactor?: number;           // How aggressively to scale (0-1)
}

export interface MemoryPressureEvent {
  level: 'low' | 'medium' | 'high' | 'critical';
  usage: number;                   // Current memory usage (0-1)
  threshold: number;                // Threshold that was crossed
  timestamp: number;                // Event timestamp
  recommendations: string[];         // Recommended actions
}

export interface MemoryStats {
  used: number;                     // Used memory in bytes
  total: number;                    // Total memory in bytes
  usage: number;                    // Usage ratio (0-1)
  timestamp: number;                 // Timestamp of measurement
}

/**
 * Memory Pressure Monitor Class
 * 
 * Provides real-time memory monitoring with adaptive scaling recommendations
 */
export class MemoryPressureMonitor extends EventEmitter {
  private config: Required<MemoryPressureConfig>;
  private intervalId?: NodeJS.Timeout;
  private lastStats?: MemoryStats;
  private isMonitoring = false;

  constructor(config: MemoryPressureConfig = {}) {
    super();
    
    this.config = {
      checkInterval: config.checkInterval || 5000,
      lowMemoryThreshold: config.lowMemoryThreshold || 0.7,
      highMemoryThreshold: config.highMemoryThreshold || 0.85,
      criticalMemoryThreshold: config.criticalMemoryThreshold || 0.95,
      enableAutoScaling: config.enableAutoScaling ?? true,
      enableGarbageCollection: config.enableGarbageCollection ?? true,
      scalingFactor: config.scalingFactor || 0.5
    };
  }

  /**
   * Start monitoring memory pressure
   */
  start(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.intervalId = setInterval(() => {
      this.checkMemoryPressure();
    }, this.config.checkInterval);

    this.emit('started', { config: this.config });
  }

  /**
   * Stop monitoring memory pressure
   */
  stop(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    this.emit('stopped');
  }

  /**
   * Get current memory statistics
   */
  getCurrentStats(): MemoryStats {
    const usage = process.memoryUsage();
    const total = require('os').totalmem();
    const used = usage.heapUsed;
    const usageRatio = used / total;

    return {
      used,
      total,
      usage: usageRatio,
      timestamp: Date.now()
    };
  }

/**
 * Check memory pressure and emit events if thresholds are crossed
 * 
 * This is the core monitoring function that:
 * 1. Collects current memory statistics
 * 2. Determines pressure level based on thresholds
 * 3. Emits appropriate events for listeners
 * 4. Applies automatic scaling if configured
 */
private checkMemoryPressure(): void {
  // Get current memory statistics from the system
  const stats = this.getCurrentStats();
  this.lastStats = stats; // Store for historical reference

  // Determine current pressure level based on usage ratios
  const level = this.getPressureLevel(stats.usage);
  const threshold = this.getThresholdForLevel(level);

  // Only emit pressure events if we're above normal levels
  if (level !== 'normal') {
    // Create comprehensive event data for listeners
    const event: MemoryPressureEvent = {
      level,
      usage: stats.usage,
      threshold,
      timestamp: stats.timestamp,
      recommendations: this.getRecommendations(level, stats)
    };

    // Emit general pressure event for all listeners
    this.emit('pressure', event);
    // Emit level-specific event for targeted listeners
    this.emit(`pressure:${level}`, event);

    // Apply automatic scaling if enabled in configuration
    if (this.config.enableAutoScaling) {
      this.applyAutoScaling(level, stats);
    }
  }

  // Always emit regular stats for monitoring dashboards
  this.emit('stats', stats);
}

/**
 * Determine pressure level based on usage
 * 
 * Uses threshold comparison to categorize memory pressure.
 * The order is important - check highest threshold first
 * to ensure proper categorization.
 * 
 * @param usage - Current memory usage ratio (0-1)
 * @returns Pressure level classification
 */
private getPressureLevel(usage: number): MemoryPressureEvent['level'] | 'normal' {
  // Check thresholds in descending order for accurate classification
  if (usage >= this.config.criticalMemoryThreshold) return 'critical';
  if (usage >= this.config.highMemoryThreshold) return 'high';
  if (usage >= this.config.lowMemoryThreshold) return 'medium';
  return 'normal'; // Below low threshold = normal operation
}

  /**
   * Get threshold value for pressure level
   */
  private getThresholdForLevel(level: MemoryPressureEvent['level'] | 'normal'): number {
    switch (level) {
      case 'critical': return this.config.criticalMemoryThreshold;
      case 'high': return this.config.highMemoryThreshold;
      case 'medium': return this.config.lowMemoryThreshold;
      default: return this.config.lowMemoryThreshold;
    }
  }

  /**
   * Get recommendations for memory pressure level
   */
  private getRecommendations(level: MemoryPressureEvent['level'], stats: MemoryStats): string[] {
    const recommendations: string[] = [];

    switch (level) {
      case 'critical':
        recommendations.push(
          'Immediate action required - memory usage is critical',
          'Consider restarting the application',
          'Release unused resources immediately',
          'Increase available system memory'
        );
        break;
      case 'high':
        recommendations.push(
          'High memory usage detected',
          'Force garbage collection',
          'Clear caches if possible',
          'Consider reducing concurrent operations'
        );
        break;
      case 'medium':
        recommendations.push(
          'Moderate memory usage',
          'Monitor for further increases',
          'Consider proactive cleanup'
        );
        break;
    }

    return recommendations;
  }

/**
 * Apply automatic scaling based on pressure level
 * 
 * Implements adaptive scaling strategies to mitigate memory pressure.
 * Currently focuses on garbage collection, but can be extended
 * with additional scaling mechanisms.
 * 
 * @param level - Current memory pressure level
 * @param stats - Current memory statistics
 */
private applyAutoScaling(level: MemoryPressureEvent['level'], stats: MemoryStats): void {
  // Only apply garbage collection for high/critical pressure levels
  // to avoid performance impact from unnecessary GC calls
  if (this.config.enableGarbageCollection && (level === 'high' || level === 'critical')) {
    // Force garbage collection if available (requires --expose-gc flag)
    if (global.gc) {
      global.gc(); // Trigger immediate garbage collection
    }
  }

  // Notify listeners about the automatic scaling action taken
  this.emit('auto-scaling-applied', {
    level,
    action: 'garbage-collection',
    stats
  });
}

  /**
   * Get monitor configuration
   */
  getConfig(): MemoryPressureConfig {
    return { ...this.config };
  }

  /**
   * Update monitor configuration
   */
  updateConfig(newConfig: Partial<MemoryPressureConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.isMonitoring) {
      // Restart monitoring with new config
      this.stop();
      this.start();
    }

    this.emit('config-updated', this.config);
  }

  /**
   * Get last recorded statistics
   */
  getLastStats(): MemoryStats | undefined {
    return this.lastStats;
  }

  /**
   * Check if monitoring is active
   */
  isActive(): boolean {
    return this.isMonitoring;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stop();
    this.removeAllListeners();
  }
}

// Global memory monitor instance
export const memoryMonitor = new MemoryPressureMonitor();

// Auto-start monitoring in production
if (process.env.NODE_ENV === 'production') {
  memoryMonitor.start();
}

export default MemoryPressureMonitor;