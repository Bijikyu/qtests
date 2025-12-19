/**
 * Error Handling Module Index
 * 
 * Consolidates all error handling utilities and re-exports them
 * Maintains backward compatibility while organizing functions by SRP
 */

// Re-export all error handling utilities
export {
  withErrorLogging,
  safeExecute,
  withAsyncErrorLogging,
  safeAsyncExecute
} from './errorLogging.js';

export {
  withFallback,
  withAsyncFallback
} from './fallbackHandlers.js';

export {
  wrapWithErrorLogging,
  wrapWithSafeExecute
} from './errorWrappers.js';

// Define missing types inline since original module was removed
export type AsyncErrorWrapperOptions = {
  timeout?: number;
  context?: string;
};

export type RouteErrorWrapperOptions = {
  context?: string;
};

export type DatabaseErrorWrapperOptions = {
  context?: string;
};

export type ApiErrorWrapperOptions = {
  context?: string;
};

export type BatchErrorWrapperOptions = {
  context?: string;
};

export type TimeoutErrorWrapperOptions = {
  timeout?: number;
  context?: string;
};

export interface TransformedError extends Error {
  originalError?: Error;
  transformedAt?: Date;
}

export interface BatchResult<T> {
  successes: T[];
  failures: Array<{error: Error, item: any}>;
}

export interface BatchProcessingResult<T> {
  results: T[];
  errors: Error[];
  processedCount: number;
}

export interface StructuredError extends Error {
  code?: string;
  context?: Record<string, any>;
  timestamp?: Date;
}

// Simple placeholder implementations for missing functions
// TODO: Complete SRP refactoring by implementing these properly

export const createAsyncErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: AsyncErrorWrapperOptions = {}
): T => fn;

export const createSyncErrorWrapper = <T extends (...args: any[]) => any>(
  fn: T,
  options: RouteErrorWrapperOptions = {}
): T => fn;

export const createRouteErrorWrapper = (
  options: RouteErrorWrapperOptions = {}
) => (req: any, res: any, next: any) => next();

export const transformMongoError = (error: any): TransformedError => {
  const transformed = new Error(`Transformed: ${error}`) as TransformedError;
  transformed.originalError = error instanceof Error ? error : new Error(String(error));
  transformed.transformedAt = new Date();
  return transformed;
};

export const createDatabaseErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: DatabaseErrorWrapperOptions = {}
): T => fn;

export const createApiErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ApiErrorWrapperOptions = {}
): T => fn;

export const createFileErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ApiErrorWrapperOptions = {}
): T => fn;

export const createBatchErrorWrapper = <T, R>(
  processor: (items: T[]) => Promise<R[]>,
  options: BatchErrorWrapperOptions = {}
): ((items: T[]) => Promise<BatchProcessingResult<R>>) => 
  async (items: T[]) => ({
    results: await processor(items),
    errors: [],
    processedCount: items.length
  });

export const createTimeoutErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: TimeoutErrorWrapperOptions = {}
): T => fn;

export const createStructuredError = (
  message: string,
  code?: string,
  context?: Record<string, any>
): StructuredError => {
  const error = new Error(message) as StructuredError;
  error.code = code;
  error.context = context;
  error.timestamp = new Date();
  return error;
};

export const logError = (error: Error | StructuredError, context?: string): void => {
  console.error(`[${context || 'ERROR'}] ${error.message}`);
};

export const errorHandling = {
  createAsyncErrorWrapper,
  createSyncErrorWrapper,
  createRouteErrorWrapper,
  transformMongoError,
  createDatabaseErrorWrapper,
  createApiErrorWrapper,
  createFileErrorWrapper,
  createBatchErrorWrapper,
  createTimeoutErrorWrapper,
  createStructuredError,
  logError
};