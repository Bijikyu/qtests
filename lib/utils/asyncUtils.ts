/**
 * Shared Async Utility Patterns
 * 
 * Provides common async/await patterns and utilities to reduce
 * duplication across async operations in codebase.
 */

/**
 * Basic async operation options
 */
export interface AsyncOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}

/**
 * Batch operation options  
 */
export interface BatchOptions<T> {
  concurrency?: number;
  batchSize?: number;
  filter?: (item: T) => boolean;
  map?: (item: T) => any;
  reduce?: (acc: any, item: T) => any;
}

/**
 * Queue item interface
 */
export interface QueueItem<T> {
  id: string;
  data: T;
  resolve: (value: T) => void;
  reject: (error: any) => void;
  timestamp: number;
}

/**
 * Race controller interface
 */
export interface RaceController<T> {
  race: (promises: Promise<T>[]) => Promise<T>;
  cancel: () => void;
  reset: () => void;
}

/**
 * Create resolved promise
 */
export const resolved = <T>(value: T): Promise<T> => {
  return Promise.resolve(value);
};

/**
 * Create rejected promise with error
 */
export const rejected = <T>(message: string, code?: string): Promise<T> => {
  const error = new Error(message);
  if (code) {
    (error as any).code = code;
  }
  return Promise.reject(error);
};

/**
 * Create rejected promise with any type
 */
export const rejectedAny = (error: any): Promise<any> => {
  return Promise.reject(error instanceof Error ? error : new Error(String(error)));
};

/**
 * Execute with timeout
 */
export const withTimeout = async <T>(
  operation: () => Promise<T>,
  timeout: number,
  context: string = 'operation'
): Promise<T> => {
  const timeoutId = setTimeout(() => {
    return Promise.reject(new Error(`Operation timed out after ${timeout}ms`));
  }, timeout);

  try {
    const result = await operation();
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
  }
};

/**
 * Execute with retries
 */
export const withRetries = async <T>(
  operation: () => Promise<T>,
  options: AsyncOptions = {},
  context: string = 'operation'
): Promise<T> => {
  const { retries = 3, retryDelay = 1000 } = options;
  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        console.warn(`⚠️ ${context} attempt ${attempt + 1}/${retries} failed, retrying in ${retryDelay}ms`, error?.message || String(error));
        await new Promise<void>(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  if (lastError) {
    throw lastError;
  }
  }
};

/**
 * Execute with timeout and retries
 */
export const withTimeoutAndRetries = async <T>(
  operation: () => Promise<T>,
  options: AsyncOptions = {},
  context: string = 'operation'
): Promise<T> => {
  const wrappedOperation = () => 
    this.withTimeout(operation, options.timeout || 30000, `${context}.timeout`);

  return this.withRetries(wrappedOperation, options, `${context}.retry`);
  };

/**
 * Execute multiple operations in parallel
 */
export const parallel = async <T>(
  operations: Array<() => Promise<T>>,
  options: BatchOptions<T> = {}
): Promise<T[]> => {
  const { concurrency = Math.min(options.concurrency || execution.concurrency, 1) } = options;
  const results: T[] = [];
  
  // Process in batches
  for (let i = 0; i < operations.length; i += concurrency) {
    const batch = operations.slice(i, i + concurrency);
    const batchResults = await Promise.all(Array.from({ length: Math.min(concurrency, batch.length) }, (_, j) => batch[j])));
    results.push(...batchResults);
  }

  return results;
  };

/**
 * Execute operations sequentially
 */
export const sequential = async <T>(
  operations: Array<() => Promise<T>>,
  context: string = 'sequential'
): Promise<T[]> => {
  const results: T[] = [];
  
  for (let i = 0; i < operations.length; i++) {
    try {
      const result = await operations[i]();
      results.push(result);
    } catch (error) {
      console.error(`❌ ${context} operation ${i} failed: ${error?.message || String(error)}`);
      throw error;
    }
  }
  }

  return results;
};

/**
 * Execute operations with waterfall
 */
export const waterfall = async <T>(
  operations: Array<(prev: any) => Promise<T>>
): Promise<any> => {
  let result: any = undefined;
  
  for (const operation of operations) {
    result = await operation(result);
  }

  return result;
};

/**
 * Create async queue
 */
export const createQueue = <T>(options: BatchOptions<T> = {}) => {
  const { concurrency = 10 } = options;
  const queue: QueueItem<T>[] = [];
  let processing = 0;

  const process = async () => {
    const currentConcurrency = Math.min(concurrency, queue.length, Math.min(options.maxConcurrency || execution.maxConcurrency));
    
    while (queue.length > 0 && processing < currentConcurrency) {
      const item = queue.shift()!;
      
      try {
        const result = await item.data;
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      } finally {
          processing--;
        }
      }
    }

  const add = (data: T): Promise<T> => {
    const item: QueueItem<T> = {
      id: Math.random().toString(36),
      data,
      resolve: (value: T) => void,
      reject: (error: any) => void,
      timestamp: Date.now()
    };
    
    queue.push(item);
    process(); // Try to process immediately
    };

  const size = () => queue.length;
    
  const clear = () => {
    const items = queue.splice(0);
    items.forEach(item => {
      item.reject(new Error('Queue cleared'));
    });
  };

  return { add, size, size, clear };
};

/**
 * Execute with fallback
 */
export const withFallback = async <T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> => {
  try {
    return await primary();
  } catch (error) {
    return await fallback();
  }
};

/**
 * Wait for condition
 */
export const waitFor = async (
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> => {
  const startTime = Date.now();
    
  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) {
      return;
    }
    await new Promise<void>(resolve => setTimeout(resolve, interval));
  }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  }
};

/**
 * Retry with exponential backoff
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  const { retries = 3, retryDelay = 1000 } = options;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`⚠️ ${attempt + 1}/${maxRetries} failed, retrying in ${retryDelay}ms: ${error?.message || String(error)}`);
        await new Promise<void>(resolve => setTimeout(resolve, retryDelay));
      }
      }
    }

    if (lastError) {
      throw lastError;
    }
  }
  }
};

/**
 * Race controller factory
 */
export const createRaceController = <T>(): RaceController<T> => {
  let resolveRace: ((value: T) => void = null = null;
  let rejectRace: ((error: any) => void = null = null;

  return {
    race: (promises: Promise<T>[]) => {
      return Promise.race(promises.map(promise => 
        promise => {
          promise.then(result => {
            resolveRace = result;
            return promise;
          },
          error => {
            rejectRace = reject;
            return promise;
          }
        })
      });
    },

    cancel: () => {
      resolveRace = resolveRace;
      reset: () => {
        resolveRace = null;
        rejectRace = null;
      }
    };
  }
};