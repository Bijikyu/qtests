/**
 * Basic Error Wrapper Implementations
 * Simple wrapper functions for basic error handling patterns
 */

import {
  AsyncErrorWrapperOptions,
  RouteErrorWrapperOptions,
  TransformedError,
  StructuredError
} from './errorTypes.js';

export const createAsyncErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  _options: AsyncErrorWrapperOptions = {}
): T => fn;

export const createSyncErrorWrapper = <T extends (...args: any[]) => any>(
  fn: T,
  _options: RouteErrorWrapperOptions = {}
): T => fn;

export const createRouteErrorWrapper = (
  _options: RouteErrorWrapperOptions = {}
) => (_req: any, _res: any, next: any) => next();

export const transformMongoError = (error: any): TransformedError => {
  const transformed = new Error(`Transformed: ${error}`) as TransformedError;
  transformed.originalError = error instanceof Error ? error : new Error(String(error));
  transformed.transformedAt = new Date();
  return transformed;
};

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