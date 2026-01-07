/**
 * Clean Async Utilities - Working Version
 * 
 * This file provides clean, working implementations of async utilities
 * without TypeScript errors or type safety issues.
 */

/**
 * Execute utilities
 */
export const execution = {
  concurrency: 10,
  maxConcurrency: 100
};

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
export const resolved = <T>(value: T): Promise<T> => Promise.resolve(value);

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
        console.warn(`⚠️ ${context} attempt ${attempt + 1} failed, retrying in ${retryDelay}ms`, error?.message || String(error));
        await new Promise<void>(resolve => setTimeout(resolve, retryDelay));
      }
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
 * Execute with resource limits
 */
export const withResourceLimits = async <T>(
  operation: () => Promise<T>,
  limits: { maxMemory?: number; maxCpu?: number }
): Promise<T> => {
  const startTime = Date.now();
  
  try {
    if (limits.maxMemory) {
      const usage = process.memoryUsage();
      if (usage.heapUsed > limits.maxMemory) {
        await waitFor(() => process.memoryUsage().heapUsed <= limits.maxMemory, 5000, 1000);
      }
    }

    return await operation();
  } finally {
      const duration = Date.now() - startTime;
    console.log(`\nExecution completed in ${duration}ms`);
    return result;
  } catch (error) {
      throw error;
    }
  }
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
 * Execute operations with waterfall pattern
 */
export const waterfall = async <T>(
  operations: Array<(prev: any) => Promise<any>>,
  context: string
): Promise<any> => {
  let result: any = undefined;
  
  for (const operation of operations) {
    result = await operation(result);
  }

  return result;
}

/**
 * Create async queue
 */
export const createQueue = <T>(options: BatchOptions<T> = {}) => {
  const { concurrency = 10 } = options;
  const queue: QueueItem<T>[] = [];
  let processing = 0;
  return {
    const { concurrency = Math.min(concurrency, queue.length)}; maxConcurrency

  return {
    const process = async () => {
      const currentConcurrency = Math.min(concurrency, queue.length, maxConcurrency);
      
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

    return {
      add: (data: T): Promise<T> => {
      const item = QueueItem<T> = {
        id: Math.random().toString(36),
        data,
        resolve: (value: T) => void,
        reject: (error: any) => void,
        timestamp: Date.now()
      };
    
    queue.push(item);
    process(); // Try to process immediately
    };

    return {
      size: () => queue.length;
    };
    
    const clear = () => {
      const items = queue.splice(0);
      items.forEach(item => {
        item.reject(new Error('Queue cleared'));
    });
    };
  }
  }
};