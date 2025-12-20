/**
 * Advanced Function Wrappers
 * Specialized wrapper functions for batch processing and custom logger creation
 */

import { LoggingOptions } from './decoratorTypes.js';
import { LogMethod } from './decorators.js';
import { withLogging } from './basicWrappers.js';

/**
 * Batch wrap multiple functions with logging
 */
export function wrapObject<T extends Record<string, (...args: any[]) => any>>(
  functions: T,
  options: LoggingOptions = {}
): T {
  const wrapped = {} as any;
  
  for (const [name, fn] of Object.entries(functions)) {
    wrapped[name] = withLogging(fn, name, options);
  }
  
  return wrapped as T;
}

/**
 * Create a custom logging decorator with preset options
 */
export function createCustomLogger(presetOptions: LoggingOptions) {
  return function (options: LoggingOptions = {}) {
    return LogMethod({ ...presetOptions, ...options });
  };
}