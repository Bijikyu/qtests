/**
 * Concurrency Control Utilities
 * Provides controlled concurrency for Promise.all operations to prevent resource exhaustion
 */

/**
 * Execute promises with controlled concurrency limit
 * @param tasks - Array of functions that return promises
 * @param concurrency - Maximum number of concurrent operations (default: 10)
 * @returns Promise that resolves to array of results
 */
export async function limitedPromiseAll<T>(
  tasks: (() => Promise<T>)[], 
  concurrency: number = 10
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(task => task())
    );
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Execute promises with controlled concurrency using Promise.allSettled
 * @param tasks - Array of functions that return promises
 * @param concurrency - Maximum number of concurrent operations (default: 10)
 * @returns Promise that resolves to array of settled results
 */
export async function limitedPromiseAllSettled<T>(
  tasks: (() => Promise<T>)[], 
  concurrency: number = 10
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = [];
  
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(task => task())
    );
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Execute promises with rate limiting (minimum delay between batches)
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
  const results: T[] = [];
  
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(task => task())
    );
    results.push(...batchResults);
    
    // Add delay between batches (except for last batch)
    if (i + concurrency < tasks.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
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
 * Semaphore for controlling access to limited resources
 */
export class Semaphore {
  private permits: number;
  private waitQueue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }> = [];
  private isDestroyed = false;

  constructor(permits: number) {
    if (permits <= 0) {
      throw new Error('Semaphore permits must be positive');
    }
    this.permits = permits;
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

    if (this.permits > 0) {
      this.permits--;
      return;
    }

    return new Promise((resolve, reject) => {
      if (this.isDestroyed) {
        reject(new Error('Semaphore has been destroyed'));
        return;
      }

      const timeout = setTimeout(() => {
        const index = this.waitQueue.findIndex(item => item.resolve === resolve);
        if (index >= 0) {
          this.waitQueue.splice(index, 1);
        }
        reject(new Error('Semaphore acquire timeout'));
      }, timeoutMs);

      this.waitQueue.push({ resolve, reject, timeout });
    });
  }

  /**
   * Release a permit
   */
  release(): void {
    if (this.waitQueue.length > 0) {
      const waiter = this.waitQueue.shift();
      if (waiter) {
        clearTimeout(waiter.timeout);
        waiter.resolve();
      }
    } else {
      this.permits++;
    }
  }

  /**
   * Get current available permits
   */
  getAvailablePermits(): number {
    return this.permits;
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.waitQueue.length;
  }

  /**
   * Destroy semaphore and reject all waiting requests
   */
  destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;
    
    // Reject all waiting requests
    const waiting = this.waitQueue.splice(0);
    for (const waiter of waiting) {
      clearTimeout(waiter.timeout);
      waiter.reject(new Error('Semaphore destroyed'));
    }
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

// Export default with all utilities
export default {
  limitedPromiseAll,
  limitedPromiseAllSettled,
  rateLimitedPromiseAll,
  throttle,
  debounce,
  Semaphore,
  withSemaphore
};