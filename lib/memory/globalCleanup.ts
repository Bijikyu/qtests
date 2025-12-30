/**
 * Global Reference Cleanup
 * Optimized cleanup of global references with timeout protection and batch processing
 */

declare const global: any;
import qerrors from 'qerrors';

interface CleanupMetrics {
  totalRefs: number;
  cleanedRefs: number;
  failedRefs: number;
  duration: number;
}

interface CleanupConfig {
  timeoutMs: number;
  batchSize: number;
  retryAttempts: number;
}

// Default configuration for cleanup operations
const DEFAULT_CONFIG: CleanupConfig = {
  timeoutMs: 5000,      // 5 second timeout per cleanup operation
  batchSize: 10,        // Process refs in batches to avoid blocking
  retryAttempts: 2      // Retry failed cleanups up to 2 times
};

// Extended list of global references that can cause memory leaks
const GLOBAL_REFS_TO_CLEAR = [
  // Test servers and applications
  'testServer', 'app', 'server', 'httpServer', 'httpsServer',
  // Database connections and instances
  'mongoConnection', '__MONGO_DB__', '__MONGOD__', 'db', 'database',
  'pgPool', 'sequelize', 'knex', 'typeorm',
  // Cache and message queue clients
  'redisClient', 'redis', 'cacheClient', 'amqpConnection',
  // Real-time communication
  'io', 'socket', 'websocket', 'ws',
  // File system and streams
  'fileWatcher', 'fsWatcher', 'readStream', 'writeStream',
  // Test utilities and mocks
  'sinonSandbox', 'nockScope', 'mockService'
];

/**
 * Cleanup a single global reference with timeout protection
 * @param refName Name of the global reference to cleanup
 * @param timeoutMs Maximum time to wait for cleanup
 * @returns Promise<boolean> True if cleanup succeeded
 */
const cleanupSingleRef = async (refName: string, timeoutMs: number): Promise<boolean> => {
  if (!global[refName]) {
    return true; // Already cleaned up
  }

  const cleanupPromise = new Promise<boolean>((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(false); // Timeout - cleanup failed
    }, timeoutMs);

    const cleanupAndResolve = (success: boolean) => {
      clearTimeout(timeoutId);
      resolve(success);
    };

    try {
      const ref = global[refName];
      
      // Attempt different cleanup methods based on object type
      const cleanupMethods = [
        () => ref.close?.(),
        () => ref.disconnect?.(),
        () => ref.stop?.(),
        () => ref.destroy?.(),
        () => ref.end?.(),
        () => ref.quit?.(),
        () => ref.shutdown?.(),
        () => ref.cleanup?.(),
        () => ref.clear?.(),
        () => ref.reset?.()
      ];

      // Try cleanup methods sequentially, stopping at first success
      let cleanupSuccess = false;
      for (const method of cleanupMethods) {
        try {
          if (typeof method === 'function') {
            method();
            cleanupSuccess = true;
            break;
          }
        } catch {
          // Continue to next method
        }
      }

      // Always nullify the reference to allow garbage collection
      global[refName] = null;
      cleanupAndResolve(cleanupSuccess);

    } catch (error) {
      // Even if cleanup fails, nullify the reference
      global[refName] = null;
      cleanupAndResolve(false);
    }
  });

  return await cleanupPromise;
};

/**
 * Clear global references with batch processing and retry logic
 * @param config Optional cleanup configuration
 * @returns Promise<CleanupMetrics> Cleanup performance metrics
 */
export const clearGlobalRefs = async (config: Partial<CleanupConfig> = {}): Promise<CleanupMetrics> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = Date.now();
  
  let totalRefs = 0;
  let cleanedRefs = 0;
  let failedRefs = 0;

  // Process references in batches to avoid blocking the event loop
  for (let i = 0; i < GLOBAL_REFS_TO_CLEAR.length; i += finalConfig.batchSize) {
    const batch = GLOBAL_REFS_TO_CLEAR.slice(i, i + finalConfig.batchSize);
    
    // Process batch concurrently with individual timeouts
    const batchPromises = batch.map(async (refName) => {
      totalRefs++;
      
      // Retry cleanup if it fails
      for (let attempt = 0; attempt <= finalConfig.retryAttempts; attempt++) {
        const success = await cleanupSingleRef(refName, finalConfig.timeoutMs);
        
        if (success) {
          cleanedRefs++;
          return true;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < finalConfig.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
        }
      }
      
      failedRefs++;
      return false;
    });

    await Promise.allSettled(batchPromises);
    
    // Yield control to event loop between batches
    if (i + finalConfig.batchSize < GLOBAL_REFS_TO_CLEAR.length) {
      await new Promise(resolve => setImmediate(resolve));
    }
  }

  const duration = Date.now() - startTime;
  const metrics: CleanupMetrics = {
    totalRefs,
    cleanedRefs,
    failedRefs,
    duration
  };

  // Log cleanup performance in development
  if (process.env.NODE_ENV === 'development') {
    const successRate = ((cleanedRefs / totalRefs) * 100).toFixed(1);
    console.log(`Global cleanup: ${cleanedRefs}/${totalRefs} refs (${successRate}%) in ${duration}ms`);
  }

  return metrics;
};

/**
 * Quick cleanup without retry logic for fast teardown
 * @returns Promise<CleanupMetrics> Basic cleanup metrics
 */
export const quickCleanup = async (): Promise<CleanupMetrics> => {
  const startTime = Date.now();
  let cleanedRefs = 0;
  let totalRefs = 0;

  for (const refName of GLOBAL_REFS_TO_CLEAR) {
    if (global[refName]) {
      totalRefs++;
      try {
        // Quick cleanup without timeout or retry
        const ref = global[refName];
        ref.close?.();
        ref.disconnect?.();
        global[refName] = null;
        cleanedRefs++;
      } catch {
        global[refName] = null; // Still nullify on error
        cleanedRefs++;
      }
    }
  }

  return {
    totalRefs,
    cleanedRefs,
    failedRefs: totalRefs - cleanedRefs,
    duration: Date.now() - startTime
  };
};