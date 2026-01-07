/**
 * Promise Utilities
 * Provides promise utilities for timeout and race conditions
 */

/**
 * Races a promise against a timeout
 * @param promise - Promise to race against timeout
 * @param timeoutMs - Timeout in milliseconds
 * @param timeoutError - Optional custom timeout error message
 * @returns Promise that resolves with original result or rejects on timeout
 */
export function promiseWithTimeout<T>(
  promise: Promise<T>, 
  timeoutMs: number, 
  timeoutError?: string
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(timeoutError || `Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Creates a timeout promise that rejects after specified time
 * @param timeoutMs - Timeout in milliseconds
 * @param message - Optional timeout message
 * @returns Promise that rejects after timeout
 */
export function createTimeout(timeoutMs: number, message?: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message || `Timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
}

/**
 * Wraps a function with automatic timeout
 * @param fn - Function to wrap with timeout
 * @param timeoutMs - Timeout in milliseconds
 * @param timeoutError - Optional custom timeout error message
 * @returns Function that executes with timeout
 */
export function withTimeout<T extends (...args: any[]) => any>(
  fn: T,
  timeoutMs: number,
  timeoutError?: string
): T {
  return ((...args: Parameters<T>) => {
    const result = fn(...args);
    return promiseWithTimeout(
      Promise.resolve(result),
      timeoutMs,
      timeoutError
    );
  }) as T;
}