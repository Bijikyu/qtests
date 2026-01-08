/**
 * Async Utilities for qtests
 * 
 * Provides comprehensive async/await utilities, timeout handling,
 * retry logic, and flow control utilities for async operations.
 */

// Types for async utilities
export interface AsyncOptions {
  timeout?: number;
  retries?: number;
  delay?: number;
  backoff?: boolean;
  maxBackoff?: number;
}

export interface BatchOptions<T> {
  concurrency?: number;
  timeout?: number;
  onSuccess?: (result: T, index: number) => void;
  onError?: (error: Error, index: number) => void;
}

export interface WorkflowStep<T = any> {
  name: string;
  action: (data?: any) => Promise<T>;
  timeout?: number;
  retries?: number;
  dependencies?: string[];
  condition?: (data: any) => boolean;
}

export interface WorkflowResult<T = any> {
  results: Record<string, T>;
  steps: string[];
  duration: number;
  success: boolean;
  errors?: Record<string, Error>;
}

// Global async configuration
const asyncConfig = {
  defaultTimeout: 30000,
  defaultRetries: 3,
  concurrency: 4,
  slowThreshold: 1000
};

/**
 * Create a timeout promise
 */
export const createTimeout = (ms: number, reason?: string): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(reason || `Timeout after ${ms}ms`)), ms);
  });
};

/**
 * Wait for specified time
 */
export const wait = async (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Execute with timeout
 */
export const withTimeout = async <T>(
  operation: () => Promise<T>,
  timeoutMs: number,
  reason?: string
): Promise<T> => {
  const timeoutPromise = createTimeout(timeoutMs, reason);
  
  try {
    return await Promise.race([
      operation(),
      timeoutPromise
    ]);
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('Timeout')) {
      throw new Error(`${reason || 'Operation'} timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
};

/**
 * Execute with retries
 */
export const withRetries = async <T>(
  operation: () => Promise<T>,
  options: AsyncOptions,
  context: string
): Promise<T> => {
  const maxRetries = options.retries || asyncConfig.defaultRetries;
  const baseDelay = options.delay || 100;
  const useBackoff = options.backoff || false;
  const maxBackoff = options.maxBackoff || 5000;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = useBackoff 
          ? Math.min(baseDelay * Math.pow(2, attempt - 1), maxBackoff)
          : baseDelay;
        
        console.log(`🔄 ${context} retry ${attempt}/${maxRetries} after ${delay}ms delay`);
        await wait(delay);
      }
      
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        console.error(`❌ ${context} failed after ${maxRetries} retries:`, error);
        throw error;
      }
      
      console.warn(`⚠️ ${context} attempt ${attempt + 1} failed:`, error);
    }
  }
  
  throw lastError!;
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
    withTimeout(operation, options.timeout || 30000, `${context}.timeout`);

  return withRetries(wrappedOperation, options, `${context}.retry`);
};

/**
 * Execute multiple operations in parallel
 */
export const parallel = async <T>(
  operations: Array<() => Promise<T>>,
  options: BatchOptions<T> = {}
): Promise<T[]> => {
  const concurrency = Math.min(options.concurrency || 1, operations.length);
  const results: T[] = [];
  
  // Process in batches
  for (let i = 0; i < operations.length; i += concurrency) {
    const batch = operations.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((operation, index) => 
        operation().then(
          result => {
            if (options.onSuccess) {
              options.onSuccess(result, i + index);
            }
            return result;
          },
          error => {
            if (options.onError) {
              options.onError(error, i + index);
            }
            throw error;
          }
        )
      )
    );
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
      console.error(`❌ ${context} operation ${i} failed:`, error);
      throw error;
    }
  }
  
  return results;
};

/**
 * Wait for condition to be true
 */
export const waitForCondition = async (
  condition: () => boolean | Promise<boolean>,
  options: AsyncOptions = {}
): Promise<void> => {
  const timeoutMs = options.timeout || 30000;
  const intervalMs = options.delay || 50;
  const startTime = Date.now();
  
  const checkCondition = async (): Promise<boolean> => {
    try {
      return await Promise.resolve(condition());
    } catch {
      return false;
    }
  };
  
  while (Date.now() - startTime < timeoutMs) {
    if (await checkCondition()) {
      return;
    }
    await wait(intervalMs);
  }
  
  throw new Error(`Condition not met within ${timeoutMs}ms`);
};

/**
 * Execute with callback pattern
 */
export const executeWithCallback = <T>(
  operation: (callback: (error?: Error, result?: T) => void) => void
): Promise<T> => {
  return new Promise((resolve, reject) => {
    operation((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result as T);
      }
    });
  });
};

/**
 * Create debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delayMs: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delayMs);
  };
};

/**
 * Create throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delayMs: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delayMs) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Execute workflow steps
 */
export const executeWorkflow = async <T = any>(
  steps: WorkflowStep<T>[],
  context?: any
): Promise<WorkflowResult<T>> => {
  const startTime = Date.now();
  const results: Record<string, T> = {};
  const errors: Record<string, Error> = {};
  const executedSteps: string[] = [];
  
  // Find step dependencies and execute in order
  const getReadySteps = () => {
    return steps.filter(step => {
      if (executedSteps.includes(step.name)) {
        return false;
      }
      
      return !step.dependencies || 
        step.dependencies.every(dep => executedSteps.includes(dep));
    });
  };
  
  try {
    while (executedSteps.length < steps.length) {
      const readySteps = getReadySteps();
      
      if (readySteps.length === 0) {
        throw new Error('Circular dependency detected or missing dependencies');
      }
      
      for (const step of readySteps) {
        // Check condition
        if (step.condition && !step.condition(context)) {
          console.log(`⏭️ Skipping step: ${step.name} (condition not met)`);
          continue;
        }
        
        try {
          const result = await withTimeoutAndRetries(
            () => step.action(context),
            {
              timeout: step.timeout,
              retries: step.retries
            },
            step.name
          );
          
          results[step.name] = result;
          executedSteps.push(step.name);
          
          console.log(`✅ Workflow step completed: ${step.name}`);
        } catch (error) {
          errors[step.name] = error as Error;
          console.error(`❌ Workflow step failed: ${step.name}`, error);
          
          // Continue with other steps unless it's a critical failure
        }
      }
    }
    
    const duration = Date.now() - startTime;
    const success = Object.keys(errors).length === 0;
    
    return {
      results,
      steps: executedSteps,
      duration,
      success,
      ...(success ? {} : { errors })
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    return {
      results,
      steps: executedSteps,
      duration,
      success: false,
      errors: { ...errors, workflow: error as Error }
    };
  }
};

/**
 * Race multiple operations
 */
export const race = async <T>(
  operations: Array<() => Promise<T>>,
  options: { timeout?: number } = {}
): Promise<{ result: T; index: number; winner: string }> => {
  try {
    const promises = operations.map(async (operation, index) => {
      const result = await operation();
      return { result, index, winner: `operation-${index}` };
    });
    
    let racePromise = Promise.race(promises);
    
    if (options.timeout) {
      racePromise = Promise.race([
        racePromise,
        createTimeout(options.timeout, 'Race timeout')
      ]) as Promise<any>;
    }
    
    const winner = await racePromise;
    return winner as { result: T; index: number; winner: string };
    
  } catch (error) {
    throw error as Error;
  }
};

/**
 * Configure async utilities
 */
export const configure = (options: Partial<typeof asyncConfig>) => {
  Object.assign(asyncConfig, options);
};

/**
 * Get current configuration
 */
export const getConfig = () => ({ ...asyncConfig });