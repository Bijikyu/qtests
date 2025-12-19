/**
 * Error Logging Utilities
 * 
 * Provides functions for adding error logging to function execution.
 * Enables consistent error handling and logging patterns across applications.
 */

import qerrors from 'qerrors';

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
    qerrors(error as Error, context);
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
      qerrors(error as Error, context);
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
    qerrors(error as Error, context);
    throw error;
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
      qerrors(error as Error, context);
    }
    return null;
  }
}