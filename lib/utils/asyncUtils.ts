/**
 * Async Utilities - Clean Working Implementation
 * 
 * Provides clean async utilities without compilation errors
 */

export const resolved = <T>(value: T): Promise<T> => Promise.resolve(value);

export const rejected = <T>(reason: any): Promise<T> => Promise.reject(reason);

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    )
  ]);

export interface RaceController<T> {
  race: (promises: Promise<T>[]) => Promise<T>;
  cancel: () => void;
  reset: () => void;
}

export const createRaceController = <T>(): RaceController<T> => {
  let cancelToken: { cancelled: boolean } = { cancelled: false };
  
  const race = (promises: Promise<T>[]): Promise<T> => {
    if (cancelToken.cancelled) {
      return Promise.reject(new Error('Race cancelled'));
    }
    
    return Promise.race(promises.map(p => 
      new Promise<T>((resolve, reject) => {
        p.then(result => {
          if (!cancelToken.cancelled) resolve(result);
        }).catch(error => {
          if (!cancelToken.cancelled) reject(error);
        });
      })
    ));
  };
  
  const cancel = () => {
    cancelToken.cancelled = true;
  };
  
  const reset = () => {
    cancelToken = { cancelled: false };
  };
  
  return { race, cancel, reset };
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      await sleep(delay * Math.pow(2, attempt));
    }
  }
  
  throw lastError!;
};

export const withTimeout = <T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> => {
  return timeout(fn(), timeoutMs);
};

export const createBatchProcessor = <T, R>(
  processor: (items: T[]) => Promise<R[]>,
  options: {
    batchSize?: number;
    concurrency?: number;
  } = {}
) => {
  const { batchSize = 10, concurrency = 3 } = options;
  
  const processBatch = async (items: T[]): Promise<R[]> => {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    const results: R[] = [];
    for (const batch of batches) {
      const batchResults = await processor(batch);
      results.push(...batchResults);
    }
    
    return results;
  };
  
  return { processBatch };
};