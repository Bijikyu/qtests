/**
 * Error Wrapper Utilities
 * 
 * Provides higher-order function wrappers for adding error handling
 * to existing functions without modifying their implementation.
 */

/**
 * Wraps function with error logging
 * @param fn - Function to wrap
 * @param context - Context for error logging
 * @returns Wrapped function with error logging
 */
export function wrapWithErrorLogging<T extends (...args: any[]) => any>(fn: T, context: string): T {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      console.error(`[${context}] Error: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }) as T;
}

/**
 * Wraps function with safe execution (returns null on error)
 * @param fn - Function to wrap
 * @param context - Optional context for error logging
 * @returns Wrapped function with safe execution
 */
export function wrapWithSafeExecute<T extends (...args: any[]) => any>(fn: T, context?: string): T {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      if (context) {
        console.error(`[${context}] Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      return null;
    }
  }) as T;
}