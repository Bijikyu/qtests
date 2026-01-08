/**
 * Advanced Error Wrapper Implementations
 * Specialized wrapper functions for specific error handling scenarios
 */

import {
  DatabaseErrorWrapperOptions,
  ApiErrorWrapperOptions,
  BatchErrorWrapperOptions,
  TimeoutErrorWrapperOptions,
  BatchProcessingResult
} from './errorTypes.js';

export const createDatabaseErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: DatabaseErrorWrapperOptions = {}
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error: any) {
      // Handle connection errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        const connectionError = new Error(`Database connection failed: ${error.message}`);
        (connectionError as any).originalError = error;
        (connectionError as any).errorType = 'CONNECTION';
        throw connectionError;
      }
      
      // Handle constraint violations
      if (error.code === '23505' || error.code === 'UNIQUE_VIOLATION') {
        const constraintError = new Error(`Database constraint violation: ${error.message}`);
        (constraintError as any).originalError = error;
        (constraintError as any).errorType = 'CONSTRAINT';
        throw constraintError;
      }
      
      // Handle timeout errors
      if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        const timeoutError = new Error(`Database operation timeout: ${error.message}`);
        (timeoutError as any).originalError = error;
        (timeoutError as any).errorType = 'TIMEOUT';
        throw timeoutError;
      }
      
      // Pass through other errors
      throw error;
    }
  }) as T;
};

export const createApiErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ApiErrorWrapperOptions = {}
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error: any) {
      // Handle HTTP status codes
      if (error.response) {
        const { status, statusText } = error.response;
        const apiError = new Error(`API Error (${status}): ${statusText}`);
        (apiError as any).originalError = error;
        (apiError as any).errorType = 'HTTP';
        (apiError as any).statusCode = status;
        throw apiError;
      }
      
      // Handle rate limiting
      if (error.code === 'ECONNRESET' || error.message.includes('rate limit')) {
        const rateLimitError = new Error(`API rate limit exceeded: ${error.message}`);
        (rateLimitError as any).originalError = error;
        (rateLimitError as any).errorType = 'RATE_LIMIT';
        throw rateLimitError;
      }
      
      // Handle network timeouts
      if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        const timeoutError = new Error(`API request timeout: ${error.message}`);
        (timeoutError as any).originalError = error;
        (timeoutError as any).errorType = 'TIMEOUT';
        throw timeoutError;
      }
      
      // Pass through other errors
      throw error;
    }
  }) as T;
};

export const createFileErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ApiErrorWrapperOptions = {}
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error: any) {
      // Handle permission denied
      if (error.code === 'EACCES' || error.code === 'EPERM') {
        const permissionError = new Error(`Permission denied: ${error.message}`);
        (permissionError as any).originalError = error;
        (permissionError as any).errorType = 'PERMISSION';
        throw permissionError;
      }
      
      // Handle file not found
      if (error.code === 'ENOENT') {
        const notFoundError = new Error(`File not found: ${error.message}`);
        (notFoundError as any).originalError = error;
        (notFoundError as any).errorType = 'NOT_FOUND';
        throw notFoundError;
      }
      
      // Handle disk space
      if (error.code === 'ENOSPC') {
        const spaceError = new Error(`Insufficient disk space: ${error.message}`);
        (spaceError as any).originalError = error;
        (spaceError as any).errorType = 'DISK_SPACE';
        throw spaceError;
      }
      
      // Pass through other errors
      throw error;
    }
  }) as T;
};

export const createBatchErrorWrapper = <T, R>(
  processor: (items: T[]) => Promise<R[]>,
  _options: BatchErrorWrapperOptions = {}
): ((items: T[]) => Promise<BatchProcessingResult<R>>) => 
  async (items: T[]) => ({
    results: await processor(items), // Process all items; in real implementation would catch individual item errors
    errors: [], // Process all items; in real implementation would catch individual item errors
    processedCount: items.length
  });

export const createTimeoutErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: TimeoutErrorWrapperOptions = {}
): T => {
  return (async (...args: any[]) => {
    const timeoutMs = options.timeout || 5000;
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        const timeoutError = new Error(`Operation timed out after ${timeoutMs}ms`);
        (timeoutError as any).errorType = 'TIMEOUT';
        (timeoutError as any).timeoutMs = timeoutMs;
        reject(timeoutError);
      }, timeoutMs);
    });
    
    try {
      return await Promise.race([
        fn(...args),
        timeoutPromise
      ]);
    } catch (error: any) {
      if (error.errorType === 'TIMEOUT') {
        throw error;
      }
      throw error;
    }
  }) as T;
};