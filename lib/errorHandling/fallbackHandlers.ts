/**
 * Fallback Error Handling Utilities
 * 
 * Provides functions for executing with fallback values when errors occur.
 * Enables graceful degradation and resilient function execution patterns.
 */

/**
 * Executes function with fallback value on error
 * @param fn - Function to execute
 * @param fallback - Fallback value if function fails
 * @param context - Optional context for error logging
 * @returns Function result or fallback value
 */
export function withFallback<T>(fn: () => T, fallback: T, context?: string): T {
  try {
    return fn();
  } catch (error) {
    if (context) {
      console.error(`[${context}] Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    return fallback;
  }
}

/**
 * Executes async function with fallback value on error
 * @param fn - Async function to execute
 * @param fallback - Fallback value if function fails
 * @param context - Optional context for error logging
 * @returns Promise that resolves with function result or fallback value
 */
export async function withAsyncFallback<T>(fn: () => Promise<T>, fallback: T, context?: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (context) {
      console.error(`[${context}] Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    return fallback;
  }
}