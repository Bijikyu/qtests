/**
 * Error Logging Utilities
 * 
 * Provides functions for adding error logging to function execution.
 * Enables consistent error handling and logging patterns across applications.
 */

// Production-ready fallback error handling to avoid qerrors dependency issues
const qerrorsFallback = (error: Error, message?: string, context?: any) => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    message: message || error.message,
    stack: error.stack,
    context: context || {}
  };
  
  console.error('[QERRORS]', JSON.stringify(errorInfo, null, 2));
  
  throw error;
};

/**
 * Adds error logging to synchronous function execution
 * @param fn - Function to execute with error logging
 * @param context - Context description for error logging
 * @returns Function result or throws logged error
 */
export function withErrorLogging<T>(fn: () => T, context: string): T {
  try {
    return fn();
  } catch (error) {
    qerrorsFallback(error as Error, context);
    throw error;
  }
}

/**
 * Safely executes synchronous function, returning null on error
 * @param fn - Function to execute safely
 * @param context - Optional context for error logging
 * @returns Function result or null on error
 */
export function safeExecute<T>(fn: () => T, context?: string): T | null {
  try {
    return fn();
  } catch (error) {
    if (context) {
      qerrorsFallback(error as Error, context);
    }
    return null;
  }
}

/**
 * Adds error logging to asynchronous function execution
 * @param fn - Async function to execute with error logging
 * @param context - Context description for error logging
 * @returns Promise that resolves with result or rejects with logged error
 */
export async function withAsyncErrorLogging<T>(fn: () => Promise<T>, context: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    qerrorsFallback(error as Error, context);
    throw error;
  }
}
}

/**
 * Safely executes asynchronous function, returning null on error
 * @param fn - Async function to execute safely
 * @param context - Optional context for error logging
 * @returns Promise that resolves with result or null on error
 */
export async function safeAsyncExecute<T>(fn: () => Promise<T>, context?: string): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (context) {
      qerrorsFallback(error as Error, context);
    }
    return null;
  }
}