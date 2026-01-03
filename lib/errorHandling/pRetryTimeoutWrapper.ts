/**
 * Error Handling Implementation using p-retry and p-timeout
 * Replaced with industry-standard error handling libraries for better maintainability
 * 
 * Migration Guide:
 * - withErrorLogging() -> use p-retry + custom error logging
 * - safeExecute() -> p-timeout + try/catch
 * - withFallback() -> p-retry with fallback function
 * - Better retry strategies and timeout handling
 */

import pRetry, { AbortError } from 'p-retry';
import pTimeout from 'p-timeout';
import qerrors from '../qerrorsFallback.js';

export interface RetryOptions {
  retries?: number;
  factor?: number;
  minTimeout?: number;
  maxTimeout?: number;
  randomize?: boolean;
  shouldRetry?: (error: Error) => boolean;
}

export interface TimeoutOptions {
  milliseconds?: number;
  message?: string;
  fallback?: () => any;
}

export interface ErrorHandlingOptions extends RetryOptions, TimeoutOptions {
  enableLogging?: boolean;
  enableRetry?: boolean;
  enableTimeout?: boolean;
  context?: string;
}

/**
 * Enhanced error handling with retry and timeout support
 */
export class EnhancedErrorHandler {
  private options: ErrorHandlingOptions;

  constructor(options: ErrorHandlingOptions = {}) {
    this.options = {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 30000,
      randomize: true,
      milliseconds: 10000,
      enableLogging: true,
      enableRetry: true,
      enableTimeout: true,
      ...options
    };
  }

  /**
   * Execute function with retry logic
   */
  async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.options.enableRetry) {
      return fn();
    }

    const retryOptions = {
      retries: this.options.retries,
      factor: this.options.factor,
      minTimeout: this.options.minTimeout,
      maxTimeout: this.options.maxTimeout,
      randomize: this.options.randomize
    };

    try {
      return await pRetry(fn, retryOptions);
    } catch (error) {
      if (this.options.enableLogging) {
        qerrors(error as Error, 'EnhancedErrorHandler: all retries failed', {
          context: this.options.context,
          totalRetries: this.options.retries
        });
      }
      throw error;
    }
  }

  /**
   * Execute function with timeout
   */
  async executeWithTimeout<T>(fn: () => Promise<T>, customTimeout?: number): Promise<T> {
    if (!this.options.enableTimeout) {
      return fn();
    }

    const timeoutMs = customTimeout || this.options.milliseconds || 10000;
    const timeoutMessage = this.options.message || `Operation timed out after ${timeoutMs}ms`;

    try {
      return await pTimeout(fn(), {
        milliseconds: timeoutMs,
        message: timeoutMessage,
        fallback: this.options.fallback
      });
    } catch (error) {
      if (this.options.enableLogging) {
        qerrors(error as Error, 'EnhancedErrorHandler: timeout occurred', {
          context: this.options.context,
          timeoutMs
        });
      }
      throw error;
    }
  }

  /**
   * Execute function with both retry and timeout
   */
  async executeWithRetryAndTimeout<T>(fn: () => Promise<T>): Promise<T> {
    const wrappedFn = async () => {
      return this.executeWithTimeout(fn);
    };

    return this.executeWithRetry(wrappedFn);
  }

  /**
   * Execute function with fallback
   */
  async executeWithFallback<T>(
    fn: () => Promise<T>,
    fallbackFn: () => Promise<T>
  ): Promise<T> {
    try {
      return await this.executeWithRetryAndTimeout(fn);
    } catch (error) {
      if (this.options.enableLogging) {
        qerrors(error as Error, 'EnhancedErrorHandler: using fallback', {
          context: this.options.context
        });
      }
      
      try {
        return await fallbackFn();
      } catch (fallbackError) {
        if (this.options.enableLogging) {
          qerrors(fallbackError as Error, 'EnhancedErrorHandler: fallback failed', {
            context: this.options.context,
            originalError: (error as Error).message
          });
        }
        throw fallbackError;
      }
    }
  }

  /**
   * Safe execute with comprehensive error handling
   */
  async safeExecute<T>(fn: () => Promise<T>): Promise<T | null> {
    try {
      return await this.executeWithRetryAndTimeout(fn);
    } catch (error) {
      if (this.options.enableLogging) {
        qerrors(error as Error, 'EnhancedErrorHandler: safeExecute failed', {
          context: this.options.context
        });
      }
      return null;
    }
  }
}

/**
 * Legacy compatibility functions for backward compatibility
 */

/**
 * Execute function with error logging
 */
export async function withErrorLogging<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<T> {
  const handler = new EnhancedErrorHandler({
    enableRetry: false,
    enableTimeout: false,
    enableLogging: true,
    context
  });

  return handler.executeWithRetry(fn);
}

/**
 * Execute function safely with error handling
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  context?: string,
  timeout?: number
): Promise<T | null> {
  const handler = new EnhancedErrorHandler({
    enableRetry: false,
    enableTimeout: true,
    enableLogging: true,
    context,
    milliseconds: timeout
  });

  return handler.safeExecute(fn);
}

/**
 * Execute function with fallback
 */
export async function withFallback<T>(
  fn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  context?: string
): Promise<T> {
  const handler = new EnhancedErrorHandler({
    enableRetry: true,
    enableTimeout: true,
    enableLogging: true,
    context
  });

  return handler.executeWithFallback(fn, fallbackFn);
}

/**
 * Execute function with async error logging
 */
export async function withAsyncErrorLogging<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<T> {
  return withErrorLogging(fn, context);
}

/**
 * Execute function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retryOptions?: RetryOptions,
  context?: string
): Promise<T> {
  const handler = new EnhancedErrorHandler({
    enableRetry: true,
    enableTimeout: false,
    enableLogging: true,
    context,
    ...retryOptions
  });

  return handler.executeWithRetry(fn);
}

/**
 * Execute function with timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutOptions?: TimeoutOptions,
  context?: string
): Promise<T> {
  const handler = new EnhancedErrorHandler({
    enableRetry: false,
    enableTimeout: true,
    enableLogging: true,
    context,
    ...timeoutOptions
  });

  return handler.executeWithTimeout(fn);
}

// Export p-retry and p-timeout for direct usage
export { pRetry, pTimeout, AbortError };

export default EnhancedErrorHandler;