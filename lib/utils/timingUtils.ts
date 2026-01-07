/**
 * Shared Timing Utilities
 * 
 * Provides common timing and performance measurement patterns
 * to reduce duplication across the qtests codebase.
 */

import { handlePerformanceError } from './errorHandling.js';

// Timing result interface
export interface TimingResult {
  startTime: number;
  endTime: number;
  duration: number;
  formattedDuration: string;
}

// Performance metrics interface
export interface PerformanceMetrics {
  operation: string;
  duration: number;
  threshold: number;
  status: 'fast' | 'normal' | 'slow' | 'critical';
  recommendations: string[];
}

/**
 * Create a timing measurement utility
 */
export class Timer {
  private startTime: number = 0;
  private endTime: number = 0;
  private operation: string = '';

  constructor(operation?: string) {
    this.operation = operation || 'operation';
    this.start();
  }

  /**
   * Start timing
   */
  start(): void {
    this.startTime = Date.now();
  }

  /**
   * Stop timing and return result
   */
  stop(): TimingResult {
    this.endTime = Date.now();
    const duration = this.endTime - this.startTime;
    
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      duration,
      formattedDuration: this.formatDuration(duration)
    };
  }

  /**
   * Stop timing and log result
   */
  stopAndLog(): TimingResult {
    const result = this.stop();
    console.log(`⏱️  ${this.operation}: ${result.formattedDuration}`);
    return result;
  }

  /**
   * Get current elapsed time without stopping
   */
  elapsed(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Get formatted elapsed time
   */
  elapsedFormatted(): string {
    return this.formatDuration(this.elapsed());
  }

  /**
   * Format duration in human readable format
   */
  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(1)}s`;
    } else {
      return `${(ms / 60000).toFixed(1)}m`;
    }
  }
}

/**
 * Measure execution time of a synchronous function
 */
export function measureTime<T>(
  fn: () => T,
  operation?: string
): { result: T; timing: TimingResult } {
  const timer = new Timer(operation || fn.name || 'function');
  
  try {
    const result = fn();
    const timing = timer.stop();
    
    return { result, timing };
  } catch (error) {
    const timing = timer.stop();
    handlePerformanceError(error, operation || fn.name || 'function', timing.duration, {
      errorType: 'synchronous'
    });
    throw error;
  }
}

/**
 * Measure execution time of an asynchronous function
 */
export async function measureAsyncTime<T>(
  fn: () => Promise<T>,
  operation?: string
): Promise<{ result: T; timing: TimingResult }> {
  const timer = new Timer(operation || fn.name || 'async function');
  
  try {
    const result = await fn();
    const timing = timer.stop();
    
    return { result, timing };
  } catch (error) {
    const timing = timer.stop();
    handlePerformanceError(error, operation || fn.name || 'async function', timing.duration, {
      errorType: 'asynchronous'
    });
    throw error;
  }
}

/**
 * Measure time with automatic performance analysis
 */
export function measureWithAnalysis<T>(
  fn: () => T,
  operation: string,
  thresholds: { fast?: number; normal?: number; slow?: number } = {}
): { result: T; timing: TimingResult; metrics: PerformanceMetrics } {
  const { fast = 100, normal = 1000, slow = 5000 } = thresholds;
  
  const timer = new Timer(operation);
  
  try {
    const result = fn();
    const timing = timer.stop();
    const metrics = analyzePerformance(operation, timing.duration, { fast, normal, slow });
    
    // Log performance warnings
    if (metrics.status === 'slow' || metrics.status === 'critical') {
      console.warn(`⚠️  Performance warning for ${operation}:`);
      console.warn(`   Duration: ${timing.formattedDuration}`);
      console.warn(`   Status: ${metrics.status.toUpperCase()}`);
      metrics.recommendations.forEach(rec => console.warn(`   - ${rec}`));
    }
    
    return { result, timing, metrics };
  } catch (error) {
    const timing = timer.stop();
    handlePerformanceError(error, operation, timing.duration, {
      thresholds: { fast, normal, slow }
    });
    throw error;
  }
}

/**
 * Measure async time with automatic performance analysis
 */
export async function measureAsyncWithAnalysis<T>(
  fn: () => Promise<T>,
  operation: string,
  thresholds: { fast?: number; normal?: number; slow?: number } = {}
): Promise<{ result: T; timing: TimingResult; metrics: PerformanceMetrics }> {
  const { fast = 100, normal = 1000, slow = 5000 } = thresholds;
  
  const timer = new Timer(operation);
  
  try {
    const result = await fn();
    const timing = timer.stop();
    const metrics = analyzePerformance(operation, timing.duration, { fast, normal, slow });
    
    // Log performance warnings
    if (metrics.status === 'slow' || metrics.status === 'critical') {
      console.warn(`⚠️  Performance warning for ${operation}:`);
      console.warn(`   Duration: ${timing.formattedDuration}`);
      console.warn(`   Status: ${metrics.status.toUpperCase()}`);
      metrics.recommendations.forEach(rec => console.warn(`   - ${rec}`));
    }
    
    return { result, timing, metrics };
  } catch (error) {
    const timing = timer.stop();
    handlePerformanceError(error, operation, timing.duration, {
      thresholds: { fast, normal, slow }
    });
    throw error;
  }
}

/**
 * Analyze performance metrics
 */
export function analyzePerformance(
  operation: string,
  duration: number,
  thresholds: { fast?: number; normal?: number; slow?: number } = {}
): PerformanceMetrics {
  const { fast = 100, normal = 1000, slow = 5000 } = thresholds;
  
  let status: 'fast' | 'normal' | 'slow' | 'critical';
  let recommendations: string[] = [];
  
  if (duration <= fast) {
    status = 'fast';
    recommendations = ['Performance is excellent'];
  } else if (duration <= normal) {
    status = 'normal';
    recommendations = ['Performance is acceptable'];
  } else if (duration <= slow) {
    status = 'slow';
    recommendations = [
      'Consider optimizing the operation',
      'Check for unnecessary loops or computations',
      'Consider caching results if applicable'
    ];
  } else {
    status = 'critical';
    recommendations = [
      'Performance is critically slow - immediate optimization required',
      'Check for infinite loops or blocking operations',
      'Consider breaking into smaller operations',
      'Review algorithmic complexity'
    ];
  }
  
  return {
    operation,
    duration,
    threshold: slow,
    status,
    recommendations
  };
}

/**
 * Performance tracking utility
 */
export class PerformanceTracker {
  private measurements: Array<{
    operation: string;
    duration: number;
    timestamp: number;
  }> = [];
  
  private maxMeasurements: number;

  constructor(maxMeasurements: number = 1000) {
    this.maxMeasurements = maxMeasurements;
  }

  /**
   * Record a performance measurement
   */
  record(operation: string, duration: number): void {
    this.measurements.push({
      operation,
      duration,
      timestamp: Date.now()
    });

    // Maintain memory bounds
    if (this.measurements.length > this.maxMeasurements) {
      this.measurements = this.measurements.slice(-this.maxMeasurements);
    }
  }

  /**
   * Get statistics for a specific operation
   */
  getStats(operation: string): {
    count: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    totalDuration: number;
  } | null {
    const operationMeasurements = this.measurements.filter(m => m.operation === operation);
    
    if (operationMeasurements.length === 0) {
      return null;
    }

    const durations = operationMeasurements.map(m => m.duration);
    
    return {
      count: durations.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      totalDuration: durations.reduce((a, b) => a + b, 0)
    };
  }

  /**
   * Get overall performance summary
   */
  getSummary(): {
    totalOperations: number;
    totalDuration: number;
    avgDuration: number;
    slowestOperation: { operation: string; duration: number } | null;
    fastestOperation: { operation: string; duration: number } | null;
  } {
    if (this.measurements.length === 0) {
      return {
        totalOperations: 0,
        totalDuration: 0,
        avgDuration: 0,
        slowestOperation: null,
        fastestOperation: null
      };
    }

    const durations = this.measurements.map(m => m.duration);
    const totalDuration = durations.reduce((a, b) => a + b, 0);
    
    const slowest = this.measurements.reduce((max, m) => 
      m.duration > max.duration ? m : max, this.measurements[0]);
    const fastest = this.measurements.reduce((min, m) => 
      m.duration < min.duration ? m : min, this.measurements[0]);

    return {
      totalOperations: this.measurements.length,
      totalDuration,
      avgDuration: totalDuration / this.measurements.length,
      slowestOperation: { operation: slowest.operation, duration: slowest.duration },
      fastestOperation: { operation: fastest.operation, duration: fastest.duration }
    };
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.measurements = [];
  }

  /**
   * Print performance summary
   */
  printSummary(): void {
    const summary = this.getSummary();
    
    console.log('\n⏱️  Performance Summary:');
    console.log(`   Total Operations: ${summary.totalOperations}`);
    console.log(`   Total Duration: ${summary.totalDuration}ms`);
    console.log(`   Average Duration: ${summary.avgDuration.toFixed(1)}ms`);
    
    if (summary.slowestOperation) {
      console.log(`   Slowest: ${summary.slowestOperation.operation} (${summary.slowestOperation.duration}ms)`);
    }
    
    if (summary.fastestOperation) {
      console.log(`   Fastest: ${summary.fastestOperation.operation} (${summary.fastestOperation.duration}ms)`);
    }
  }
}

// Global performance tracker instance
export const globalPerformanceTracker = new PerformanceTracker();

/**
 * Higher-order function to wrap functions with timing
 */
export function withTiming<T extends (...args: any[]) => any>(
  fn: T,
  operation?: string
): T {
  return function (...args: any[]) {
    const opName = operation || fn.name || 'anonymous';
    
    if (fn.constructor && fn.constructor.name === 'AsyncFunction') {
      return measureAsyncWithAnalysis(
        () => fn(...args),
        opName
      ).then(({ result }) => result);
    } else {
      const { result } = measureWithAnalysis(
        () => fn(...args),
        opName
      );
      return result;
    }
  } as T;
}