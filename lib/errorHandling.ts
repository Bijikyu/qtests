/**
 * Consolidated Error Handling Utilities
 * Provides comprehensive error handling and logging patterns
 * Consolidates functionality from errorHandling.ts and errorWrapper.ts
 * Eliminates ~90% code duplication while preserving all features
 */

import qerrors from 'qerrors';

// ==================== INTERFACE DEFINITIONS ====================

export interface AsyncErrorWrapperOptions {
  logErrors?: boolean;
  logContext?: string;
  rethrow?: boolean;
  defaultErrorMessage?: string;
  errorTransform?: ((error: Error) => Error) | null;
  fallbackValue?: any;
}

export interface RouteErrorWrapperOptions {
  logErrors?: boolean;
  logContext?: string;
  sendErrorResponse?: boolean;
  defaultStatusCode?: number;
  defaultErrorMessage?: string;
}

export interface DatabaseErrorWrapperOptions {
  logErrors?: boolean;
  logContext?: string;
  rethrow?: boolean;
  fallbackValue?: any;
  transformMongoErrors?: boolean;
}

export interface ApiErrorWrapperOptions {
  logErrors?: boolean;
  logContext?: string;
  rethrow?: boolean;
  fallbackValue?: any;
  retryCount?: number;
  retryDelay?: number;
}

export interface BatchErrorWrapperOptions {
  logErrors?: boolean;
  logContext?: string;
  stopOnFirstError?: boolean;
  collectErrors?: boolean;
}

export interface TimeoutErrorWrapperOptions {
  logErrors?: boolean;
  logContext?: string;
  timeoutErrorMessage?: string;
}

export interface TransformedError extends Error {
  statusCode?: number;
  errorType?: string;
  validationErrors?: string[];
}

export interface BatchResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  index: number;
  item?: any;
}

export interface BatchProcessingResult<T> {
  results: BatchResult<T>[];
  errors: BatchResult<T>[];
  successCount: number;
  errorCount: number;
  totalCount: number;
}

export interface StructuredError extends Error {
  code?: string;
  context?: string;
  originalError?: Error;
}

// ==================== CORE ERROR HANDLING FUNCTIONS ====================

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
    qerrors(error, context, {context});
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
      qerrors(error, context, {context});
    } else {
      qerrors(error, 'safeExecute', {});
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

// ==================== WRAPPER FACTORY FUNCTIONS ====================

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
 * Creates a wrapper for async functions with configurable error handling
 * @param asyncFunction - Async function to wrap
 * @param options - Error handling options
 * @returns Wrapped async function
 */
export const createAsyncErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
  options: AsyncErrorWrapperOptions = {}
): T => {
  const {
    logErrors = true,
    logContext = '',
    rethrow = true,
    errorTransform = null,
    fallbackValue = null
  } = options;

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      if (logErrors) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const context = logContext ? ` in ${logContext}` : '';
        console.log(`Error encountered${context}: ${errorMessage}`);
      }

      let finalError = error;
      if (errorTransform && typeof errorTransform === 'function') {
        finalError = errorTransform(error as Error);
      }

      if (rethrow) {
        throw finalError;
      }
      return fallbackValue;
    }
  }) as T;
};

/**
 * Creates a wrapper for sync functions with configurable error handling
 * @param syncFunction - Sync function to wrap
 * @param options - Error handling options
 * @returns Wrapped sync function
 */
export const createSyncErrorWrapper = <T extends (...args: any[]) => any>(
  syncFunction: T,
  options: AsyncErrorWrapperOptions = {}
): T => {
  const {
    logErrors = true,
    logContext = '',
    rethrow = true,
    errorTransform = null,
    fallbackValue = null
  } = options;

  return ((...args: Parameters<T>): ReturnType<T> => {
    try {
      return syncFunction(...args);
    } catch (error) {
      if (logErrors) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const context = logContext ? ` in ${logContext}` : '';
        console.log(`Error encountered${context}: ${errorMessage}`);
      }

      let finalError = error;
      if (errorTransform && typeof errorTransform === 'function') {
        finalError = errorTransform(error as Error);
      }

      if (rethrow) {
        throw finalError;
      }
      return fallbackValue;
    }
  }) as T;
};

// ==================== SPECIALIZED WRAPPER FUNCTIONS ====================

/**
 * Creates a route handler wrapper with Express-style error handling
 * @param routeHandler - Route handler function
 * @param options - Route-specific error handling options
 * @returns Wrapped route handler
 */
export const createRouteErrorWrapper = (
  routeHandler: (req: any, res: any, next: any) => Promise<any>,
  options: RouteErrorWrapperOptions = {}
) => {
  const {
    logErrors = true,
    logContext = '',
    sendErrorResponse = true,
    defaultStatusCode = 500,
    defaultErrorMessage = 'Internal server error'
  } = options;

  return async (req: any, res: any, next: any) => {
    try {
      await routeHandler(req, res, next);
    } catch (error: any) {
      if (logErrors) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const context = logContext ? ` in ${logContext}` : '';
        console.log(`Route error encountered${context}: ${errorMessage}`);
      }

      if (sendErrorResponse) {
        const statusCode = error.statusCode || defaultStatusCode;
        const message = error.message || defaultErrorMessage;

        return res.status(statusCode).json({
          success: false,
          error: statusCode,
          message,
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || req.locals?.requestId
        });
      }

      next(error);
    }
  };
};

/**
 * Transforms MongoDB errors into structured error responses
 * @param error - MongoDB error to transform
 * @returns Transformed error with status codes and types
 */
export const transformMongoError = (error: any): TransformedError => {
  const transformedError: TransformedError = new Error(error.message);

  if (error.code === 11000) {
    transformedError.message = 'Duplicate entry found';
    transformedError.statusCode = 409;
    transformedError.errorType = 'DUPLICATE_KEY';
  } else if (error.name === 'ValidationError') {
    transformedError.message = 'Validation failed';
    transformedError.statusCode = 400;
    transformedError.errorType = 'VALIDATION_ERROR';
    transformedError.validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
  } else if (error.name === 'CastError') {
    transformedError.message = 'Invalid ID format';
    transformedError.statusCode = 400;
    transformedError.errorType = 'INVALID_ID';
  } else if (error.name === 'DocumentNotFoundError') {
    transformedError.message = 'Document not found';
    transformedError.statusCode = 404;
    transformedError.errorType = 'NOT_FOUND';
  }

  return transformedError;
};

/**
 * Creates a database operation wrapper with MongoDB error transformation
 * @param dbOperation - Database operation function
 * @param options - Database-specific error handling options
 * @returns Wrapped database operation
 */
export const createDatabaseErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  dbOperation: T,
  options: DatabaseErrorWrapperOptions = {}
): T => {
  const {
    logErrors = true,
    logContext = 'database operation',
    rethrow = true,
    fallbackValue = null,
    transformMongoErrors = true
  } = options;

  return createAsyncErrorWrapper(dbOperation, {
    logErrors,
    logContext,
    rethrow,
    fallbackValue,
    errorTransform: transformMongoErrors ? transformMongoError : null
  });
};

/**
 * Creates an API call wrapper with retry logic
 * @param apiCall - API call function
 * @param options - API-specific error handling options
 * @returns Wrapped API call with retry capability
 */
export const createApiErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  apiCall: T,
  options: ApiErrorWrapperOptions = {}
): T => {
  const {
    logErrors = true,
    logContext = 'API call',
    rethrow = true,
    fallbackValue = null,
    retryCount = 0,
    retryDelay = 1000
  } = options;

  return createAsyncErrorWrapper(async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    let lastError: any;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        return await apiCall(...args);
      } catch (error: any) {
        lastError = error;

        if (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 403) {
          throw error;
        }

        if (attempt === retryCount) {
          throw error;
        }

        if (retryDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    throw lastError;
  }, {
    logErrors,
    logContext,
    rethrow,
    fallbackValue
  }) as T;
};

/**
 * Creates a file operation wrapper with file system error transformation
 * @param fileOperation - File operation function
 * @param options - File-specific error handling options
 * @returns Wrapped file operation
 */
export const createFileErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fileOperation: T,
  options: AsyncErrorWrapperOptions = {}
): T => {
  const {
    logErrors = true,
    logContext = 'file operation',
    rethrow = true,
    fallbackValue = null
  } = options;

  return createAsyncErrorWrapper(fileOperation, {
    logErrors,
    logContext,
    rethrow,
    fallbackValue,
    errorTransform: (error: any): TransformedError => {
      const transformedError: TransformedError = new Error(error.message);

      if (error.code === 'ENOENT') {
        transformedError.message = 'File not found';
        transformedError.statusCode = 404;
        transformedError.errorType = 'FILE_NOT_FOUND';
      } else if (error.code === 'EACCES') {
        transformedError.message = 'Permission denied';
        transformedError.statusCode = 403;
        transformedError.errorType = 'PERMISSION_DENIED';
      } else if (error.code === 'EEXIST') {
        transformedError.message = 'File already exists';
        transformedError.statusCode = 409;
        transformedError.errorType = 'FILE_EXISTS';
      }

      return transformedError;
    }
  });
};

/**
 * Creates a batch processing wrapper with error collection
 * @param processor - Function to process individual items
 * @param options - Batch processing options
 * @returns Batch processing function with comprehensive error handling
 */
export const createBatchErrorWrapper = <T, R>(
  processor: (item: T) => Promise<R>,
  options: BatchErrorWrapperOptions = {}
): (items: T[]) => Promise<BatchProcessingResult<R>> => {
  const {
    logErrors = true,
    stopOnFirstError = false,
    collectErrors = true
  } = options;

  return async (items: T[]): Promise<BatchProcessingResult<R>> => {
    const results: BatchResult<R>[] = [];
    const errors: BatchResult<R>[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const result = await processor(items[i]);
        results.push({ success: true, data: result, index: i });
      } catch (error: any) {
        const errorInfo: BatchResult<R> = {
          success: false,
          error: error.message || String(error),
          index: i,
          item: items[i]
        };

        results.push(errorInfo);

        if (collectErrors) {
          errors.push(errorInfo);
        }

        if (logErrors) {
          console.log(`Batch processing error at index ${i}: ${errorInfo.error}`);
        }

        if (stopOnFirstError) {
          break;
        }
      }
    }

    return {
      results,
      errors,
      successCount: results.filter(r => r.success).length,
      errorCount: errors.length,
      totalCount: items.length
    };
  };
};

/**
 * Creates a timeout wrapper for long-running operations
 * @param asyncFunction - Function to wrap with timeout
 * @param timeoutMs - Timeout in milliseconds
 * @param options - Timeout-specific options
 * @returns Wrapped function with timeout protection
 */
export const createTimeoutErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
  timeoutMs: number,
  options: TimeoutErrorWrapperOptions = {}
): T => {
  const {
    logErrors = true,
    logContext = 'timeout operation',
    timeoutErrorMessage = 'Operation timed out'
  } = options;

  return createAsyncErrorWrapper(async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(timeoutErrorMessage)), timeoutMs);
    });
    const resultPromise = asyncFunction(...args);

    return await Promise.race([resultPromise, timeoutPromise]);
  }, {
    logErrors,
    logContext
  }) as T;
};

// ==================== STRUCTURED ERROR FUNCTIONS ====================

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

// ==================== EXPORTS ====================

// Export all utilities for easy importing
export const errorHandling = {
  // Core functions
  withErrorLogging,
  safeExecute,
  withAsyncErrorLogging,
  safeAsyncExecute,
  withFallback,
  withAsyncFallback,
  wrapWithErrorLogging,
  wrapWithSafeExecute,
  
  // Factory functions
  createAsyncErrorWrapper,
  createSyncErrorWrapper,
  createRouteErrorWrapper,
  createDatabaseErrorWrapper,
  createApiErrorWrapper,
  createFileErrorWrapper,
  createBatchErrorWrapper,
  createTimeoutErrorWrapper,
  
  // Error utilities
  transformMongoError,
  createStructuredError,
  logError
};

