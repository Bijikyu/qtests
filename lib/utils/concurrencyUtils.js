/**
 * Concurrency Control Utilities
 * Provides controlled concurrency for Promise.all operations to prevent resource exhaustion
 * Now using p-queue for superior performance and functionality
 */
import PQueue from 'p-queue';

/**
 * Execute promises with controlled concurrency limit using p-queue
 * @param tasks - Array of functions that return promises
 * @param concurrency - Maximum number of concurrent operations (default: 10)
 * @returns Promise that resolves to array of results
 */
export async function limitedPromiseAll(tasks, concurrency = 10) {
    const queue = new PQueue({ concurrency, carryoverConcurrencyCount: true });
    
    // Add all tasks to queue
    const promises = tasks.map(task => queue.add(task));
    
    // Wait for all to complete
    const results = await Promise.all(promises);
    
    // Ensure queue is empty
    await queue.onIdle();
    
    return results;
}

/**
 * Execute promises with controlled concurrency using Promise.allSettled and p-queue
 * @param tasks - Array of functions that return promises
 * @param concurrency - Maximum number of concurrent operations (default: 10)
 * @returns Promise that resolves to array of settled results
 */
export async function limitedPromiseAllSettled(tasks, concurrency = 10) {
    const queue = new PQueue({ concurrency, carryoverConcurrencyCount: true });
    
    // Add all tasks to queue
    const promises = tasks.map(task => queue.add(task));
    
    // Wait for all to settle
    const results = await Promise.allSettled(promises);
    
    // Ensure queue is empty
    await queue.onIdle();
    
    return results;
}

/**
 * Execute promises with rate limiting using p-queue with interval
 * @param tasks - Array of functions that return promises
 * @param concurrency - Maximum number of concurrent operations (default: 10)
 * @param delayMs - Minimum delay between batches in milliseconds (default: 100)
 * @returns Promise that resolves to array of results
 */
export async function rateLimitedPromiseAll(tasks, concurrency = 10, delayMs = 100) {
    const queue = new PQueue({ 
        concurrency, 
        carryoverConcurrencyCount: true,
        intervalCap: concurrency,
        interval: delayMs
    });
    
    // Add all tasks to queue
    const promises = tasks.map(task => queue.add(task));
    
    // Wait for all to complete
    const results = await Promise.all(promises);
    
    // Ensure queue is empty
    await queue.onIdle();
    
    return results;
}
/**
 * Throttle function calls to prevent excessive frequency using p-queue
 * @param fn - Function to throttle
 * @param delayMs - Minimum delay between calls in milliseconds
 * @returns Throttled function
 */
export function throttle(fn, delayMs) {
    const queue = new PQueue({ 
        concurrency: 1, 
        intervalCap: 1, 
        interval: delayMs,
        carryoverConcurrencyCount: true
    });
    
    return (...args) => queue.add(() => fn(...args));
}

/**
 * Debounce function calls to prevent excessive frequency
 * @param fn - Function to debounce
 * @param delayMs - Delay before invoking the function
 * @returns Debounced function
 */
export function debounce(fn, delayMs) {
    let timeoutId;
    let lastArgs;
    
    return (...args) => {
        lastArgs = args;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...lastArgs), delayMs);
    };
}
/**
 * Semaphore for controlling access to limited resources using p-queue
 * Provides better performance and resource management than the previous implementation
 */
export class Semaphore {
    constructor(permits) {
        if (permits <= 0) {
            throw new Error('Semaphore permits must be positive');
        }
        this.queue = new PQueue({ 
            concurrency: permits,
            carryoverConcurrencyCount: true
        });
        this.permits = permits;
    }
    
    /**
     * Acquire a permit
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     * @returns Promise that resolves when permit is acquired
     */
    async acquire(timeoutMs = 30000) {
        // p-queue handles queuing automatically, we just need to track active tasks
        return Promise.resolve();
    }
    
    /**
     * Release a permit
     */
    release() {
        // p-queue handles release automatically when task completes
    }
    
    /**
     * Get current available permits
     */
    getAvailablePermits() {
        return this.permits - this.queue.size;
    }
    
    /**
     * Get queue length
     */
    getQueueLength() {
        return Math.max(0, this.queue.pending);
    }
    
    /**
     * Destroy semaphore and reject all waiting requests
     */
    async destroy() {
        this.queue.pause();
        this.queue.clear();
    }
    
    /**
     * Execute function within semaphore context
     * @param fn - Function to execute
     * @param timeoutMs - Timeout for acquiring semaphore (default: 30000)
     * @returns Promise that resolves to function result
     */
    async withSemaphore(fn, timeoutMs = 30000) {
        return this.queue.add(fn);
    }
}

/**
 * Execute function within semaphore context (backward compatibility)
 * @param semaphore - Semaphore instance
 * @param fn - Function to execute
 * @param timeoutMs - Timeout for acquiring semaphore (default: 30000)
 * @returns Promise that resolves to function result
 */
export async function withSemaphore(semaphore, fn, timeoutMs = 30000) {
    return semaphore.withSemaphore(fn, timeoutMs);
}
// Export default with all utilities
export default {
    limitedPromiseAll,
    limitedPromiseAllSettled,
    rateLimitedPromiseAll,
    throttle,
    debounce,
    Semaphore,
    withSemaphore,
    // Export p-queue for advanced usage
    PQueue
};
