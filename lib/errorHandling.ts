/**
 * Error Handling Utilities
 * Provides consistent error handling and logging patterns
 * Consolidates common patterns used across 60+ files in the codebase
 */

/**
 * Executes a function with error logging and re-throwing
 * @param fn - Function to execute
 * @param context - Context description for error logging
 * @returns Function result
 * @throws Original error if function fails
 */
export function withErrorLogging<T>(fn: () => T, context: string): T {
  try {
    return fn();
  } catch (error: any) {
    console.log(`${context} error: ${error.message}`);
    throw error;
  }
}

/**
 * Executes a function safely, returning null on error instead of throwing
 * @param fn - Function to execute
 * @param context - Context description for error logging (optional)
 * @returns Function result or null if failed
 */
export function safeExecute<T>(fn: () => T, context?: string): T | null {
  try {
    return fn();
  } catch (error: any) {
    if (context) {
      console.log(`${context} error: ${error.message}`);
    }
    return null;
  }
}

/**
 * Executes an async function with error logging and re-throwing
 * @param fn - Async function to execute
 * @param context - Context description for error logging
 * @returns Promise with function result
 * @throws Original error if function fails
 */
export async function withAsyncErrorLogging<T>(fn: () => Promise<T>, context: string): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    console.log(`${context} error: ${error.message}`);
    throw error;
  }
}

/**
 * Executes an async function safely, returning null on error instead of throwing
 * @param fn - Async function to execute
 * @param context - Context description for error logging (optional)
 * @returns Promise with function result or null if failed
 */
export async function safeAsyncExecute<T>(fn: () => Promise<T>, context?: string): Promise<T | null> {
  try {
    return await fn();
  } catch (error: any) {
    if (context) {
      console.log(`${context} error: ${error.message}`);
    }
    return null;
  }
}

/**
 * Executes a function with a fallback value on error
 * @param fn - Function to execute
 * @param fallback - Fallback value to return on error
 * @param context - Context description for error logging (optional)
 * @returns Function result or fallback value if failed
 */
export function withFallback<T>(fn: () => T, fallback: T, context?: string): T {
  try {
    return fn();
  } catch (error: any) {
    if (context) {
      console.log(`${context} error: ${error.message}, using fallback`);
    }
    return fallback;
  }
}

/**
 * Executes an async function with a fallback value on error
 * @param fn - Async function to execute
 * @param fallback - Fallback value to return on error
 * @param context - Context description for error logging (optional)
 * @returns Promise with function result or fallback value if failed
 */
export async function withAsyncFallback<T>(fn: () => Promise<T>, fallback: T, context?: string): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (context) {
      console.log(`${context} error: ${error.message}, using fallback`);
    }
    return fallback;
  }
}

/**
 * Creates a wrapper function that adds error logging to any function
 * @param fn - Function to wrap
 * @param context - Context description for error logging
 * @returns Wrapped function with error logging
 */
export function wrapWithErrorLogging<T extends (...args: any[]) => any>(fn: T, context: string): T {
  return ((...args: Parameters<T>) => withErrorLogging(() => fn(...args), context)) as T;
}

/**
 * Creates a wrapper function that adds safe execution to any function
 * @param fn - Function to wrap
 * @param context - Context description for error logging (optional)
 * @returns Wrapped function that returns null on error
 */
export function wrapWithSafeExecute<T extends (...args: any[]) => any>(fn: T, context?: string): T {
  return ((...args: Parameters<T>) => safeExecute(() => fn(...args), context)) as T;
}

/**
 * Error type for structured error handling
 */
export interface StructuredError extends Error {
  code?: string;
  context?: string;
  originalError?: Error;
}

/**
 * Creates a structured error with additional context
 * @param message - Error message
 * @param code - Error code (optional)
 * @param context - Error context (optional)
 * @param originalError - Original error (optional)
 * @returns StructuredError object
 */
export function createStructuredError(
  message: string,
  code?: string,
  context?: string,
  originalError?: Error
): StructuredError {
  const error = new Error(message) as StructuredError;
  if (code) error.code = code;
  if (context) error.context = context;
  if (originalError) error.originalError = originalError;
  return error;
}

/**
 * Logs an error with structured information
 * @param error - Error to log
 * @param context - Additional context (optional)
 */
export function logError(error: Error | StructuredError, context?: string): void {
  const structuredError = error as StructuredError;
  const parts = [];
  
  if (context) parts.push(`[${context}]`);
  if (structuredError.code) parts.push(`(${structuredError.code})`);
  parts.push(structuredError.message);
  
  console.log(parts.join(' '));
  
  if (structuredError.originalError) {
    console.log(`Caused by: ${structuredError.originalError.message}`);
  }
}

// Export all utilities for easy importing
export const errorHandling = {
  withErrorLogging,
  safeExecute,
  withAsyncErrorLogging,
  safeAsyncExecute,
  withFallback,
  withAsyncFallback,
  wrapWithErrorLogging,
  wrapWithSafeExecute,
  createStructuredError,
  logError
};