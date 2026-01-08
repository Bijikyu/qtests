/**
 * Promise Utilities for qtests Framework
 * 
 * This module provides promise utilities for handling timeouts, race conditions,
 * and asynchronous operations that may hang or take too long to complete. These
 * utilities are essential for creating reliable tests that don't hang indefinitely
 * and for handling network operations that may fail or timeout.
 * 
 * Key use cases:
 * - Test timeouts to prevent hanging test suites
 * - Network operation timeouts for external service calls
 * - Race conditions between multiple async operations
 * - Function wrapping with automatic timeout enforcement
 * 
 * Design principles:
 * - Type safety with generic TypeScript support
 * - Consistent error messages for debugging
 * - Flexible timeout configuration
 * - Promise.race() for efficient timeout handling
 */

/**
 * Races a promise against a timeout using Promise.race()
 * 
 * This function creates a race between the original promise and a timeout
 * promise. Whichever resolves or rejects first determines the outcome. This
 * is the most efficient way to handle timeouts as it doesn't require polling
 * or complex cancellation logic.
 * 
 * Implementation details:
 * - Uses Promise.race() for efficient timeout handling
 * - Creates a timeout promise that rejects after specified duration
 * - Preserves the original promise's type and result
 * - Provides customizable error messages for better debugging
 * 
 * @param promise - Promise to race against timeout
 * @param timeoutMs - Timeout duration in milliseconds
 * @param timeoutError - Optional custom timeout error message
 * @returns Promise that resolves with original result or rejects on timeout
 * 
 * @example
 * const result = await promiseWithTimeout(
 *   fetch('/api/data'),
 *   5000,
 *   'API call timed out'
 * );
 * 
 * @example
 * // With default error message
 * const result = await promiseWithTimeout(slowOperation(), 1000);
 */
export function promiseWithTimeout<T>(
  promise: Promise<T>, 
  timeoutMs: number, 
  timeoutError?: string
): Promise<T> {
  // Create a timeout promise that rejects after the specified duration
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(timeoutError || `Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  // Race the original promise against the timeout promise
  // The first one to resolve/reject wins
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Creates a standalone timeout promise that rejects after specified time
 * 
 * This utility creates a promise that will always reject after the specified
 * timeout. It's useful for creating custom timeout logic or for use with
 * Promise.race() in scenarios where you need more control over the timeout
 * behavior.
 * 
 * Use cases:
 * - Custom timeout implementations
 * - Combining with other promises in race conditions
 * - Creating delay mechanisms that reject instead of resolve
 * - Testing timeout behavior in unit tests
 * 
 * @param timeoutMs - Timeout duration in milliseconds
 * @param message - Optional custom timeout message
 * @returns Promise that rejects after timeout (never resolves)
 * 
 * @example
 * // Create a 5-second timeout
 * const timeout = createTimeout(5000, 'Custom timeout message');
 * 
 * @example
 * // Use in a race condition
 * const result = await Promise.race([
 *   someOperation(),
 *   createTimeout(1000)
 * ]);
 */
export function createTimeout(timeoutMs: number, message?: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message || `Timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
}

/**
 * Wraps a function with automatic timeout enforcement
 * 
 * This higher-order function takes any function (sync or async) and returns
 * a wrapped version that will automatically timeout if the execution takes
 * too long. It's particularly useful for wrapping callback-based functions
 * or functions that may hang under certain conditions.
 * 
 * Implementation details:
 * - Preserves the original function's signature using TypeScript generics
 * - Automatically wraps return values in Promise.resolve()
 * - Handles both synchronous and asynchronous functions
 * - Maintains type safety throughout the wrapping process
 * 
 * @param fn - Function to wrap with timeout enforcement
 * @param timeoutMs - Timeout duration in milliseconds
 * @param timeoutError - Optional custom timeout error message
 * @returns Wrapped function that executes with automatic timeout
 * 
 * @example
 * // Wrap an async function
 * const timedFetch = withTimeout(fetch, 5000);
 * const response = await timedFetch('/api/data');
 * 
 * @example
 * // Wrap a synchronous function that might hang
 * const timedCalculation = withTimeout(complexCalculation, 1000);
 * const result = await timedCalculation(largeDataSet);
 */
export function withTimeout<T extends (...args: any[]) => any>(
  fn: T,
  timeoutMs: number,
  timeoutError?: string
): T {
  return ((...args: Parameters<T>) => {
    // Execute the original function with the provided arguments
    const result = fn(...args);
    
    // Wrap the result in a promise (handles both sync and async functions)
    // and apply the timeout using our promiseWithTimeout utility
    return promiseWithTimeout(
      Promise.resolve(result),
      timeoutMs,
      timeoutError
    );
  }) as T;
}