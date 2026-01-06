/**
 * Concurrency Control Utilities
 * Direct use of p-queue industry-standard concurrency control
 * 
 * This module provides simplified interfaces to p-queue functionality
 * while maintaining the same API for backward compatibility.
 */

import PQueue from 'p-queue';

/**
 * Execute promises with controlled concurrency limit using p-queue
 * @param tasks - Array of functions that return promises
 * @param concurrency - Maximum number of concurrent operations (default: 10)
 * @returns Promise that resolves to array of results
 */
export async function limitedPromiseAll<T>(
  tasks: (() => Promise<T>)[], 
  concurrency: number = 10
): Promise<T[]> {
  if (tasks.length === 0) return [];
  
  const queue = new PQueue({ concurrency });
  
  // Add all tasks to queue and wait for completion
  const results = await Promise.all(tasks.map(task => queue.add(task) as Promise<T>));
  
  return results;
}

/**
 * Execute promises with controlled concurrency using Promise.allSettled and p-queue
 * @param tasks - Array of functions that return promises
 * @param concurrency - Maximum number of concurrent operations (default: 10)
 * @returns Promise that resolves to array of settled results
 */
export async function limitedPromiseAllSettled<T>(
  tasks: (() => Promise<T>)[], 
  concurrency: number = 10
): Promise<PromiseSettledResult<T>[]> {
  if (tasks.length === 0) return [];
  
  const queue = new PQueue({ concurrency });
  
  try {
    const results = await Promise.allSettled(
      tasks.map(task => queue.add(task) as Promise<T>)
    );
    return results;
  } finally {
    await queue.onIdle();
  }
}

/**
 * Execute promises with rate limiting using p-queue and intervals
 * @param tasks - Array of functions that return promises
 * @param concurrency - Maximum number of concurrent operations (default: 10)
 * @param delayMs - Minimum delay between batches in milliseconds (default: 100)
 * @returns Promise that resolves to array of results
 */
export async function rateLimitedPromiseAll<T>(
  tasks: (() => Promise<T>)[], 
  concurrency: number = 10,
  delayMs: number = 100
): Promise<T[]> {
  if (tasks.length === 0) return [];
  
  const queue = new PQueue({ 
    concurrency,
    interval: delayMs,
    intervalCap: concurrency
  });
  
  try {
    const results = await Promise.all(
      tasks.map(task => queue.add(task) as Promise<T>)
    );
    return results;
  } finally {
    await queue.onIdle();
  }
}

/**
 * Throttle function calls to prevent excessive frequency
 * @param fn - Function to throttle
 * @param delayMs - Minimum delay between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delayMs) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Debounce function calls to prevent excessive frequency
 * @param fn - Function to debounce
 * @param delayMs - Delay before invoking the function
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Semaphore implementation using p-queue
 * Provides compatible API while using industry-standard queue
 */
export class Semaphore {
  private queue: PQueue;
  private isDestroyed = false;

  constructor(permits: number) {
    if (permits <= 0) {
      throw new Error('Semaphore permits must be positive');
    }
    this.queue = new PQueue({ concurrency: permits });
  }

  /**
   * Acquire a permit
   * @param timeoutMs - Timeout in milliseconds (default: 30000)
   * @returns Promise that resolves when permit is acquired
   */
  async acquire(timeoutMs: number = 30000): Promise<void> {
    if (this.isDestroyed) {
      throw new Error('Semaphore has been destroyed');
    }

    // Add a no-op task to consume a permit
    return Promise.race([
      this.queue.add(() => {}),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Semaphore acquire timeout')), timeoutMs)
      )
    ]);
  }

  /**
   * Release a permit - no-op with p-queue
   * p-queue manages permits automatically
   */
  release(): void {
    // No-op - p-queue handles concurrency automatically
    // Method kept for API compatibility
  }

  /**
   * Get current available permits
   */
  getAvailablePermits(): number {
    return this.queue.concurrency - this.queue.pending;
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.pending;
  }

  /**
   * Destroy semaphore and reject all waiting requests
   */
  destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;
    this.queue.clear();
    this.queue.pause();
  }
}

/**
 * Execute function within semaphore context
 * @param semaphore - Semaphore instance
 * @param fn - Function to execute
 * @param timeoutMs - Timeout for acquiring semaphore (default: 30000)
 * @returns Promise that resolves to function result
 */
export async function withSemaphore<T>(
  semaphore: Semaphore,
  fn: () => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  await semaphore.acquire(timeoutMs);
  try {
    return await fn();
  } finally {
    semaphore.release();
  }
}

/**
 * Rolling concurrency with dynamic adjustment
 * @param tasks - Array of functions that return promises
 * @param initialConcurrency - Starting concurrency level
 * @param maxConcurrency - Maximum concurrency allowed
 * @param adjustmentInterval - How often to adjust concurrency (ms)
 * @param performanceThreshold - Success rate threshold for increasing concurrency
 * @returns Promise that resolves to array of results
 */
export async function rollingConcurrency<T>(
  tasks: (() => Promise<T>)[],
  initialConcurrency: number = 5,
  maxConcurrency: number = 20,
  adjustmentInterval: number = 5000,
  performanceThreshold: number = 0.95
): Promise<T[]> {
  let currentConcurrency = Math.min(initialConcurrency, maxConcurrency);
  const results: T[] = [];
  let completedCount = 0;
  let successCount = 0;
  let lastAdjustment = Date.now();
  
  console.log(`Starting rolling concurrency with ${currentConcurrency} initial workers`);
  
  const processBatch = async (batchTasks: (() => Promise<T>)[], concurrency: number) => {
    const queue = new PQueue({ concurrency });
    const batchResults = await Promise.allSettled(
      batchTasks.map(task => queue.add(task))
    );
    
    // Update performance metrics
    const batchSuccess = batchResults.filter(r => r.status === 'fulfilled').length;
    successCount += batchSuccess;
    completedCount += batchResults.length;
    
    return batchResults;
  };
  
  // Process tasks in batches with rolling concurrency
  for (let i = 0; i < tasks.length; i += currentConcurrency) {
    const batch = tasks.slice(i, i + currentConcurrency);
    const batchResults = await processBatch(batch, currentConcurrency);
    
    // Extract successful results
    const successfulResults = batchResults
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<T>).value);
    results.push(...successfulResults);
    
    // Check if we should adjust concurrency
    const now = Date.now();
    if (now - lastAdjustment >= adjustmentInterval && completedCount > 0) {
      const successRate = successCount / completedCount;
      const remainingTasks = tasks.length - (i + currentConcurrency);
      
      // Adjust concurrency based on performance
      if (successRate >= performanceThreshold && currentConcurrency < maxConcurrency && remainingTasks > 0) {
        // High success rate - increase concurrency
        const newConcurrency = Math.min(currentConcurrency + 2, maxConcurrency);
        console.log(`Increasing concurrency: ${currentConcurrency} -> ${newConcurrency} (success rate: ${(successRate * 100).toFixed(1)}%)`);
        currentConcurrency = newConcurrency;
      } else if (successRate < performanceThreshold * 0.8 && currentConcurrency > 2) {
        // Low success rate - decrease concurrency
        const newConcurrency = Math.max(currentConcurrency - 1, 2);
        console.log(`Decreasing concurrency: ${currentConcurrency} -> ${newConcurrency} (success rate: ${(successRate * 100).toFixed(1)}%)`);
        currentConcurrency = newConcurrency;
      }
      
      lastAdjustment = now;
    }
    
    // Add delay between batches to prevent overwhelming
    if (i + currentConcurrency < tasks.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`Rolling concurrency completed: ${results.length} results, final concurrency: ${currentConcurrency}`);
  return results;
}

/**
 * Adaptive concurrency with automatic backpressure handling
 * @param tasks - Array of functions that return promises
 * @param options - Configuration options
 * @returns Promise that resolves to array of results
 */
export async function adaptiveConcurrency<T>(
  tasks: (() => Promise<T>)[],
  options: {
    initialConcurrency?: number;
    maxConcurrency?: number;
    targetLatency?: number; // Target response time in ms
    latencyThreshold?: number; // How much latency can vary before adjusting
    sampleSize?: number; // Number of recent tasks to sample for performance
  } = {}
): Promise<T[]> {
  const {
    initialConcurrency = 5,
    maxConcurrency = 20,
    targetLatency = 1000,
    latencyThreshold = 0.2,
    sampleSize = 20
  } = options;
  
  let currentConcurrency = Math.min(initialConcurrency, maxConcurrency);
  const recentLatencies: number[] = [];
  const results: T[] = [];
  
  console.log(`Starting adaptive concurrency with ${currentConcurrency} workers, target latency: ${targetLatency}ms`);
  
  const processTask = async (task: () => Promise<T>) => {
    const startTime = Date.now();
    try {
      const result = await task();
      const latency = Date.now() - startTime;
      
      // Track recent latencies
      recentLatencies.push(latency);
      if (recentLatencies.length > sampleSize) {
        recentLatencies.shift();
      }
      
      return result;
    } catch (error) {
      const latency = Date.now() - startTime;
      recentLatencies.push(latency);
      if (recentLatencies.length > sampleSize) {
        recentLatencies.shift();
      }
      throw error;
    }
  };
  
  // Process tasks with adaptive concurrency
  for (let i = 0; i < tasks.length; i += currentConcurrency) {
    const batch = tasks.slice(i, i + currentConcurrency);
    
    // Process current batch
    const queue = new PQueue({ concurrency: currentConcurrency });
    const batchPromises = batch.map(task => queue.add(() => processTask(task)));
    await Promise.allSettled(batchPromises);
    
    // Calculate average latency from recent samples
    if (recentLatencies.length >= sampleSize / 2) {
      const avgLatency = recentLatencies.reduce((sum, lat) => sum + lat, 0) / recentLatencies.length;
      const latencyRatio = avgLatency / targetLatency;
      
      // Adjust concurrency based on latency
      const remainingTasks = tasks.length - (i + currentConcurrency);
      if (latencyRatio > 1 + latencyThreshold && currentConcurrency > 2) {
        // Latency too high - reduce concurrency
        const newConcurrency = Math.max(currentConcurrency - 1, 2);
        console.log(`Reducing concurrency due to high latency: ${currentConcurrency} -> ${newConcurrency} (avg latency: ${avgLatency.toFixed(1)}ms)`);
        currentConcurrency = newConcurrency;
      } else if (latencyRatio < 1 - latencyThreshold && currentConcurrency < maxConcurrency && remainingTasks > 0) {
        // Latency good - can increase concurrency
        const newConcurrency = Math.min(currentConcurrency + 1, maxConcurrency);
        console.log(`Increasing concurrency due to good latency: ${currentConcurrency} -> ${newConcurrency} (avg latency: ${avgLatency.toFixed(1)}ms)`);
        currentConcurrency = newConcurrency;
      }
    }
    
    // Small delay between batches
    if (i + currentConcurrency < tasks.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  console.log(`Adaptive concurrency completed with ${results.length} results`);
  return results;
}

// Re-export p-queue for direct use
export { PQueue };

// Export default with all utilities
export default {
  limitedPromiseAll,
  limitedPromiseAllSettled,
  rateLimitedPromiseAll,
  throttle,
  debounce,
  Semaphore,
  withSemaphore,
  adaptiveConcurrency,
  rollingConcurrency,
  PQueue
};