/**
 * Advanced Memory Leak Detection System
 * 
 * Provides comprehensive memory monitoring with growth rate analysis,
 * correlation coefficients, and automated alerting for memory leaks.
 * Uses statistical analysis to distinguish normal growth from problematic leaks.
 */

import { EventEmitter } from 'events';
import qerrors from './qerrorsFallback.js';

interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  arrayBuffers: number;
}

interface MemoryGrowthAnalysis {
  growthRate: number; // MB per minute
  correlation: number; // Growth consistency (0-1)
  variance: number; // Growth volatility
  leakProbability: number; // 0-1 probability of leak
  trend: 'stable' | 'growing' | 'leaking' | 'fluctuating';
}

interface MemoryAlert {
  type: 'warning' | 'critical';
  message: string;
  snapshot: MemorySnapshot;
  analysis: MemoryGrowthAnalysis;
  timestamp: number;
}

/**
 * Advanced Memory Leak Detector
 */
export class AdvancedMemoryLeakDetector extends EventEmitter {
  private snapshots: MemorySnapshot[] = [];
  private maxSnapshots = 100; // Keep last 100 snapshots
  private snapshotInterval = 30000; // 30 seconds between snapshots
  private analysisWindow = 10; // Analyze last 10 snapshots
  private leakThreshold = 50; // 50MB growth threshold
  private correlationThreshold = 0.7; // Correlation threshold for leak detection
  private intervalId?: NodeJS.Timeout;
  private lastAlertTime = 0;
  private alertCooldown = 60000; // 1 minute between alerts
  
  constructor() {
    super();
    this.startMonitoring();
  }

  /**
   * Start memory monitoring
   */
  private startMonitoring(): void {
    if (typeof process === 'undefined' || !process.memoryUsage) {
      console.warn('Memory leak detection disabled: process.memoryUsage not available');
      return;
    }

    // Take initial snapshot
    this.takeSnapshot();
    
    // Start periodic monitoring
    this.intervalId = setInterval(() => {
      this.takeSnapshot();
      this.analyzeMemoryTrend();
    }, this.snapshotInterval);
    
    console.log('Advanced memory leak detection started');
  }

  /**
   * Stop memory monitoring
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    console.log('Memory leak detection stopped');
  }

  /**
   * Take memory snapshot
   */
  private takeSnapshot(): void {
    const memUsage = process.memoryUsage();
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memUsage.external / 1024 / 1024), // MB
      rss: Math.round(memUsage.rss / 1024 / 1024), // MB
      arrayBuffers: Math.round(memUsage.arrayBuffers / 1024 / 1024) // MB
    };

    this.snapshots.push(snapshot);
    
    // Limit snapshots size
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.splice(0, this.snapshots.length - this.maxSnapshots);
    }
  }

  /**
   * Analyze memory trends using statistical methods
   */
  private analyzeMemoryTrend(): void {
    if (this.snapshots.length < this.analysisWindow) {
      return; // Not enough data
    }

    const recentSnapshots = this.snapshots.slice(-this.analysisWindow);
    const analysis = this.performGrowthAnalysis(recentSnapshots);
    
    // Check for potential leak
    if (analysis.leakProbability > 0.8) {
      this.triggerAlert({
        type: 'critical',
        message: `High probability memory leak detected (${(analysis.leakProbability * 100).toFixed(1)}% chance)`,
        snapshot: recentSnapshots[recentSnapshots.length - 1],
        analysis,
        timestamp: Date.now()
      });
    } else if (analysis.leakProbability > 0.6) {
      this.triggerAlert({
        type: 'warning',
        message: `Possible memory leak detected (${(analysis.leakProbability * 100).toFixed(1)}% chance)`,
        snapshot: recentSnapshots[recentSnapshots.length - 1],
        analysis,
        timestamp: Date.now()
      });
    }

    // Emit analysis results
    this.emit('analysis', analysis);
  }

  /**
   * Perform statistical analysis of memory growth
   */
  private performGrowthAnalysis(snapshots: MemorySnapshot[]): MemoryGrowthAnalysis {
    if (snapshots.length < 2) {
      return {
        growthRate: 0,
        correlation: 0,
        variance: 0,
        leakProbability: 0,
        trend: 'stable'
      };
    }

    // Calculate growth rates
    const growthRates: number[] = [];
    for (let i = 1; i < snapshots.length; i++) {
      const timeDiff = (snapshots[i].timestamp - snapshots[i-1].timestamp) / 60000; // minutes
      const heapGrowth = snapshots[i].heapUsed - snapshots[i-1].heapUsed;
      
      if (timeDiff > 0) {
        growthRates.push(heapGrowth / timeDiff); // MB per minute
      }
    }

    // Calculate statistics
    const avgGrowthRate = growthRates.length > 0 
      ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length 
      : 0;

    // Calculate correlation coefficient (linear regression)
    const correlation = this.calculateCorrelation(snapshots);
    
    // Calculate variance
    const variance = this.calculateVariance(growthRates);
    
    // Determine trend
    let trend: MemoryGrowthAnalysis['trend'] = 'stable';
    if (avgGrowthRate > this.leakThreshold / 30) { // > 50MB per hour
      if (correlation > this.correlationThreshold && variance < 100) {
        trend = 'leaking';
      } else {
        trend = 'growing';
      }
    } else if (variance > 1000) {
      trend = 'fluctuating';
    }

    // Calculate leak probability based on multiple factors
    let leakProbability = 0;
    if (trend === 'leaking') {
      leakProbability = Math.min(0.95, 0.5 + (correlation * 0.3) + (avgGrowthRate / (this.leakThreshold / 30)) * 0.2);
    } else if (trend === 'growing') {
      leakProbability = Math.min(0.7, 0.1 + (avgGrowthRate / (this.leakThreshold / 30)) * 0.3);
    } else if (variance > 500) {
      leakProbability = 0.3;
    }

    return {
      growthRate: avgGrowthRate,
      correlation,
      variance,
      leakProbability,
      trend
    };
  }

  /**
   * Calculate correlation coefficient for linear growth
   */
  private calculateCorrelation(snapshots: MemorySnapshot[]): number {
    if (snapshots.length < 3) return 0;

    const n = snapshots.length;
    const sumX = (n * (n - 1)) / 2; // Sum of time indices
    const sumY = snapshots.reduce((sum, s) => sum + s.heapUsed, 0);
    const sumXY = snapshots.reduce((sum, s, i) => sum + (i * s.heapUsed), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squared time indices
    const sumY2 = snapshots.reduce((sum, s) => sum + (s.heapUsed * s.heapUsed), 0);
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return Math.max(0, Math.min(1, correlation));
  }

  /**
   * Calculate variance of growth rates
   */
  private calculateVariance(growthRates: number[]): number {
    if (growthRates.length < 2) return 0;

    const mean = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
    const squaredDiffs = growthRates.map(rate => Math.pow(rate - mean, 2));
    const variance = squaredDiffs.reduce((sum, sq) => sum + sq, 0) / growthRates.length;

    return variance;
  }

  /**
   * Trigger memory leak alert with cooldown
   */
  private triggerAlert(alert: MemoryAlert): void {
    const now = Date.now();
    
    // Respect alert cooldown
    if (now - this.lastAlertTime < this.alertCooldown) {
      return;
    }

    this.lastAlertTime = now;
    
    // Log to qerrors for external monitoring
    qerrors(new Error(alert.message), 'memory.leak.detected', {
      alertType: alert.type,
      heapUsed: alert.snapshot.heapUsed,
      heapTotal: alert.snapshot.heapTotal,
      growthRate: alert.analysis.growthRate,
      leakProbability: alert.analysis.leakProbability,
      trend: alert.analysis.trend,
      correlation: alert.analysis.correlation,
      variance: alert.analysis.variance
    });

    // Emit alert event
    this.emit('alert', alert);
    
    console.error(`🚨 Memory Leak Alert [${alert.type.toUpperCase()}]: ${alert.message}`);
    console.error(`   Current Heap: ${alert.snapshot.heapUsed}MB`);
    console.error(`   Growth Rate: ${alert.analysis.growthRate.toFixed(2)}MB/min`);
    console.error(`   Leak Probability: ${(alert.analysis.leakProbability * 100).toFixed(1)}%`);
    console.error(`   Trend: ${alert.analysis.trend}`);
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats(): {
    snapshots: MemorySnapshot[];
    analysis: MemoryGrowthAnalysis | null;
    currentUsage: MemorySnapshot | null;
  } {
    const currentUsage = this.snapshots.length > 0 ? this.snapshots[this.snapshots.length - 1] : null;
    const analysis = this.snapshots.length >= this.analysisWindow 
      ? this.performGrowthAnalysis(this.snapshots.slice(-this.analysisWindow))
      : null;

    return {
      snapshots: [...this.snapshots],
      analysis,
      currentUsage
    };
  }

  /**
   * Force garbage collection (if available)
   */
  forceGC(): void {
    if (typeof global !== 'undefined' && global.gc) {
      global.gc();
      console.log('Forced garbage collection');
    } else if (typeof process !== 'undefined' && (process as any).gc) {
      (process as any).gc();
      console.log('Forced garbage collection');
    }
  }

  /**
   * Export memory statistics for monitoring
   */
  exportMemoryReport(): string {
    const stats = this.getMemoryStats();
    const report = [
      '# Advanced Memory Leak Detection Report',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Current Memory Status',
      stats.currentUsage ? `Heap Used: ${stats.currentUsage.heapUsed}MB (${((stats.currentUsage.heapUsed / stats.currentUsage.heapTotal) * 100).toFixed(1)}%)` : 'N/A',
      stats.currentUsage ? `Heap Total: ${stats.currentUsage.heapTotal}MB` : 'N/A',
      stats.currentUsage ? `RSS: ${stats.currentUsage.rss}MB` : 'N/A',
      '',
      '## Growth Analysis',
      stats.analysis ? `Growth Rate: ${stats.analysis.growthRate.toFixed(2)} MB/min` : 'N/A',
      stats.analysis ? `Correlation: ${stats.analysis.correlation.toFixed(3)}` : 'N/A',
      stats.analysis ? `Variance: ${stats.analysis.variance.toFixed(2)}` : 'N/A',
      stats.analysis ? `Trend: ${stats.analysis.trend}` : 'N/A',
      stats.analysis ? `Leak Probability: ${(stats.analysis.leakProbability * 100).toFixed(1)}%` : 'N/A',
      '',
      '## Recent Snapshots',
      ...stats.snapshots.slice(-5).map((s, i) => 
        `${i + 1}. ${new Date(s.timestamp).toISOString()}: Heap ${s.heapUsed}MB, RSS ${s.rss}MB`
      ),
      '',
      '--- End of Report ---'
    ];

    return report.join('\n');
  }
}

export default AdvancedMemoryLeakDetector;