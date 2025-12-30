/**
 * Garbage Collection Utilities
 * Optimized garbage collection with memory pressure monitoring
 */

interface GlobalWithGC {
  gc?: () => void;
  memoryUsage?: () => NodeJS.MemoryUsage;
}

declare const global: GlobalWithGC;

interface GCMetrics {
  totalRuns: number;
  lastRun: Date;
  memoryBefore: NodeJS.MemoryUsage;
  memoryAfter: NodeJS.MemoryUsage;
  memoryFreed: number;
}

// Track GC metrics for performance monitoring
const gcMetrics: GCMetrics = {
  totalRuns: 0,
  lastRun: new Date(),
  memoryBefore: { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 },
  memoryAfter: { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 },
  memoryFreed: 0
};

/**
 * Optimized garbage collection with memory pressure detection
 * @param aggressive Force aggressive cleanup under memory pressure
 * @returns Promise<GCMetrics> GC performance metrics
 */
export const forceGC = async (aggressive = false): Promise<GCMetrics> => {
  const startTime = Date.now();
  gcMetrics.totalRuns++;
  gcMetrics.lastRun = new Date();
  
  // Capture memory state before GC
  gcMetrics.memoryBefore = global.memoryUsage ? global.memoryUsage() : process.memoryUsage();
  
  if (global.gc) {
    const passes = aggressive ? 5 : 3; // More passes for aggressive cleanup
    const delay = aggressive ? 5 : 10; // Shorter delays for aggressive cleanup
    
    // Run GC with strategic delays to allow async operations to complete
    for (let i = 0; i < passes; i++) {
      global.gc();
      
      // Only wait if not the last pass and not under time pressure
      if (i < passes - 1 && !aggressive) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Capture memory state after GC and calculate improvement
  gcMetrics.memoryAfter = global.memoryUsage ? global.memoryUsage() : process.memoryUsage();
  gcMetrics.memoryFreed = gcMetrics.memoryBefore.heapUsed - gcMetrics.memoryAfter.heapUsed;
  
  // Log GC performance for monitoring (only in development)
  if (process.env.NODE_ENV === 'development') {
    const duration = Date.now() - startTime;
    const memoryFreedMB = (gcMetrics.memoryFreed / 1024 / 1024).toFixed(2);
    console.log(`GC completed in ${duration}ms, freed ${memoryFreedMB}MB`);
  }
  
  return { ...gcMetrics };
};

/**
 * Check if system is under memory pressure and needs aggressive cleanup
 * @returns boolean True if memory usage exceeds threshold
 */
export const isUnderMemoryPressure = (): boolean => {
  const usage = global.memoryUsage ? global.memoryUsage() : process.memoryUsage();
  const totalMemory = require('os').totalmem();
  const memoryUsageRatio = usage.heapUsed / totalMemory;
  
  // Consider memory pressure if using more than 70% of system memory
  return memoryUsageRatio > 0.7;
};

/**
 * Smart garbage collection that adapts to memory pressure
 * @returns Promise<GCMetrics> GC performance metrics
 */
export const smartGC = async (): Promise<GCMetrics> => {
  const aggressive = isUnderMemoryPressure();
  return await forceGC(aggressive);
};

/**
 * Get current GC metrics for monitoring
 * @returns GCMetrics Current garbage collection statistics
 */
export const getGCMetrics = (): GCMetrics => {
  return { ...gcMetrics };
};