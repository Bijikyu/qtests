/**
 * Convenience Logging Wrappers
 * Specialized wrapper functions for common logging scenarios
 */

import { withLogging } from './coreWrapper.js';
import { LoggingOptions } from './decoratorTypes.js';

/**
 * Simple function wrapper with default logging
 */
export function logFunction<T extends (...args: any[]) => any>(fn: T, name?: string): T {
  return withLogging(fn, name);
}

/**
 * Performance-focused function wrapper
 */
export function logPerformance<T extends (...args: any[]) => any>(fn: T, name?: string): T {
  return withLogging(fn, name, { includeTiming: true, logArgs: false, logResult: false } as LoggingOptions);
}