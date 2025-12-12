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
