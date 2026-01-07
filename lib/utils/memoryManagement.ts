/**
 * Shared Memory Management Utilities
 * 
 * Provides common memory management patterns to reduce duplication
 * across the qtests codebase. Centralizes garbage collection,
 * memory tracking, cleanup operations, and memory analysis.
 */

import { handleMemoryError } from './errorHandling.js';

// Memory snapshot interface
export interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  rss: number;
  external: number;
}

// Memory cleanup options
export interface CleanupOptions {
  forceGC?: boolean;
  clearCache?: boolean;
  clearGlobals?: boolean;
  gcPasses?: number;
  delayBetweenPasses?: number;
}

// Memory analysis options
export interface MemoryAnalysisOptions {
  sampleSize?: number;
  timeWindow?: number;
  growthThreshold?: number;
  correlationThreshold?: number;
}

/**
 * Get current memory snapshot
 */
export function getMemorySnapshot(): MemorySnapshot {
  try {
    const usage = process.memoryUsage();
    return {
      timestamp: Date.now(),
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      rss: Math.round(usage.rss / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024) // MB
    };
  } catch (error) {
    handleMemoryError(error, 'snapshot', {});
    throw new Error('Failed to get memory snapshot');
  }
}

/**
 * Perform garbage collection with multiple passes
 */
export async function performGarbageCollection(options: CleanupOptions = {}): Promise<void> {
  const {
    gcPasses = 3,
    delayBetweenPasses = 10,
    forceGC = true
  } = options;

  if (!forceGC || !(global as any).gc) {
    return; // GC not available or not forced
  }

  try {
    for (let i = 0; i < gcPasses; i++) {
      (global as any).gc();
      if (i < gcPasses - 1) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenPasses));
      }
    }
  } catch (error) {
    handleMemoryError(error, 'garbage_collection', {
      passes: gcPasses,
      delay: delayBetweenPasses
    });
  }
}

/**
 * Calculate memory delta between two snapshots
 */
export function calculateMemoryDelta(before: MemorySnapshot, after: MemorySnapshot): {
  heap: number;
  rss: number;
  external: number;
  timeSpan: number;
} {
  return {
    heap: after.heapUsed - before.heapUsed,
    rss: after.rss - before.rss,
    external: after.external - before.external,
    timeSpan: after.timestamp - before.timestamp
  };
}

/**
 * Analyze memory growth trend from snapshots
 */
export function analyzeMemoryGrowth(
  snapshots: MemorySnapshot[],
  options: MemoryAnalysisOptions = {}
): {
  isLeaking: boolean;
  growthRate: number;
  consistency: number;
  recommendation: string;
} {
  const {
    sampleSize = 5,
    timeWindow = 60000, // 1 minute
    growthThreshold = 1, // 1MB/s
    correlationThreshold = 0.7
  } = options;

  if (snapshots.length < sampleSize) {
    return {
      isLeaking: false,
      growthRate: 0,
      consistency: 0,
      recommendation: 'Insufficient data for analysis'
    };
  }

  const recent = snapshots.slice(-sampleSize);
  const timeSpan = recent[recent.length - 1].timestamp - recent[0].timestamp;
  const isLongRun = timeSpan > timeWindow;

  // Calculate growth rates
  const heapGrowthRate = (recent[recent.length - 1].heapUsed - recent[0].heapUsed) / (timeSpan / 1000);
  const rssGrowthRate = (recent[recent.length - 1].rss - recent[0].rss) / (timeSpan / 1000);

  // Dynamic thresholds based on time span
  const heapThreshold = isLongRun ? growthThreshold : growthThreshold * 5;
  const rssThreshold = isLongRun ? growthThreshold * 2 : growthThreshold * 10;

  // Check growth consistency using correlation
  const heapConsistency = calculateGrowthConsistency(recent.map(s => s.heapUsed));
  const rssConsistency = calculateGrowthConsistency(recent.map(s => s.rss));
  const overallConsistency = (heapConsistency + rssConsistency) / 2;

  const isHeapLeaking = heapGrowthRate > heapThreshold && heapConsistency > correlationThreshold;
  const isRssLeaking = rssGrowthRate > rssThreshold && rssConsistency > correlationThreshold;
  const isLeaking = isHeapLeaking || isRssLeaking;

  const maxGrowthRate = Math.max(heapGrowthRate, rssGrowthRate);
  
  let recommendation = 'Memory usage appears normal';
  if (isLeaking) {
    if (maxGrowthRate > growthThreshold * 10) {
      recommendation = 'Critical memory leak detected - immediate investigation required';
    } else if (maxGrowthRate > growthThreshold * 5) {
      recommendation = 'Significant memory leak detected - investigate soon';
    } else {
      recommendation = 'Potential memory leak detected - monitor closely';
    }
  } else if (maxGrowthRate > growthThreshold / 2) {
    recommendation = 'Memory growth detected but within acceptable limits';
  }

  return {
    isLeaking,
    growthRate: maxGrowthRate,
    consistency: overallConsistency,
    recommendation
  };
}

/**
 * Calculate growth consistency using correlation coefficient
 */
function calculateGrowthConsistency(values: number[]): number {
  if (values.length < 3) return 0;

  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = values.reduce((sum, yi) => sum + yi * yi, 0);

  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) {
    return 0;
  }
  
  const correlation = (n * sumXY - sumX * sumY) / denominator;
  return Math.max(0, correlation); // Return positive correlation only
}

/**
 * Perform comprehensive memory cleanup
 */
export async function performMemoryCleanup(options: CleanupOptions = {}): Promise<{
  beforeSnapshot: MemorySnapshot;
  afterSnapshot: MemorySnapshot;
  delta: ReturnType<typeof calculateMemoryDelta>;
  modulesCleared: number;
}> {
  const {
    forceGC = true,
    clearCache = true,
    clearGlobals = true,
    gcPasses = 3,
    delayBetweenPasses = 10
  } = options;

  const beforeSnapshot = getMemorySnapshot();
  let modulesCleared = 0;

  try {
    // Clear module cache if requested
    if (clearCache) {
      modulesCleared = clearModuleCache();
    }

    // Clear global references if requested
    if (clearGlobals) {
      clearGlobalReferences();
    }

    // Perform garbage collection
    await performGarbageCollection({
      forceGC,
      gcPasses,
      delayBetweenPasses
    });

    const afterSnapshot = getMemorySnapshot();
    const delta = calculateMemoryDelta(beforeSnapshot, afterSnapshot);

    return {
      beforeSnapshot,
      afterSnapshot,
      delta,
      modulesCleared
    };
  } catch (error) {
    handleMemoryError(error, 'cleanup', {
      beforeSnapshot,
      modulesCleared
    });
    throw error;
  }
}

/**
 * Clear module cache (simplified version)
 */
function clearModuleCache(): number {
  let cleared = 0;
  try {
    if (typeof require !== 'undefined' && require.cache) {
      const cache = require.cache;
      for (const key of Object.keys(cache)) {
        if (key.includes('/test/') || key.includes('/tests/')) {
          delete cache[key];
          cleared++;
        }
      }
    }
  } catch (error) {
    handleMemoryError(error, 'clear_cache', {});
  }
  return cleared;
}

/**
 * Clear global references that might prevent GC
 */
function clearGlobalReferences(): void {
  try {
    const globalObj = global as any;
    
    // Clear common test-related globals
    const testGlobals = [
      '__coverage__',
      '__tests__',
      'testResults',
      'mockData',
      'tempData'
    ];

    testGlobals.forEach(globalName => {
      if (globalObj[globalName]) {
        delete globalObj[globalName];
      }
    });
  } catch (error) {
    handleMemoryError(error, 'clear_globals', {});
  }
}

/**
 * Format memory snapshot for display
 */
export function formatMemorySnapshot(snapshot: MemorySnapshot, label?: string): string {
  const prefix = label ? `${label}: ` : '';
  return `${prefix}${snapshot.heapUsed}MB heap, ${snapshot.rss}MB RSS, ${snapshot.external}MB external`;
}

/**
 * Format memory delta for display
 */
export function formatMemoryDelta(delta: ReturnType<typeof calculateMemoryDelta>): string {
  const heapSign = delta.heap > 0 ? '+' : '';
  const rssSign = delta.rss > 0 ? '+' : '';
  const externalSign = delta.external > 0 ? '+' : '';
  
  return `${heapSign}${delta.heap}MB heap, ${rssSign}${delta.rss}MB RSS, ${externalSign}${delta.external}MB external (${(delta.timeSpan / 1000).toFixed(1)}s)`;
}

/**
 * Memory monitoring utility class
 */
export class MemoryMonitor {
  private snapshots: MemorySnapshot[] = [];
  private maxSnapshots: number;

  constructor(maxSnapshots: number = 100) {
    this.maxSnapshots = maxSnapshots;
  }

  /**
   * Take and store a memory snapshot
   */
  takeSnapshot(label?: string): MemorySnapshot {
    const snapshot = getMemorySnapshot();
    this.snapshots.push(snapshot);
    
    // Maintain memory bounds
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots = this.snapshots.slice(-this.maxSnapshots);
    }

    if (label) {
      console.log(`📊 ${label}:`, formatMemorySnapshot(snapshot));
    }
    
    return snapshot;
  }

  /**
   * Analyze current memory state
   */
  analyze(options?: MemoryAnalysisOptions): ReturnType<typeof analyzeMemoryGrowth> {
    return analyzeMemoryGrowth(this.snapshots, options);
  }

  /**
   * Get all snapshots
   */
  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Clear all snapshots
   */
  clearSnapshots(): void {
    this.snapshots = [];
  }

  /**
   * Print memory summary
   */
  printSummary(): void {
    if (this.snapshots.length === 0) {
      console.log('📊 No memory snapshots available');
      return;
    }

    const first = this.snapshots[0];
    const last = this.snapshots[this.snapshots.length - 1];
    const delta = calculateMemoryDelta(first, last);
    const analysis = this.analyze();

    console.log('\n📊 Memory Summary:');
    console.log(`   Start: ${formatMemorySnapshot(first)}`);
    console.log(`   End: ${formatMemorySnapshot(last)}`);
    console.log(`   Delta: ${formatMemoryDelta(delta)}`);
    console.log(`   Analysis: ${analysis.recommendation}`);
    
    if (analysis.isLeaking) {
      console.log(`   ⚠️  Memory leak detected! Growth rate: ${analysis.growthRate.toFixed(2)}MB/s`);
    } else {
      console.log(`   ✅ No significant memory leaks detected`);
    }
  }
}