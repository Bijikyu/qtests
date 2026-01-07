/**
 * Function Logger Utility
 * Provides simplified wrapper around logUtils for consistent function logging patterns
 */

import { executeWithLogs } from '../../lib/logUtils.js';

/**
 * Wraps a function with automatic entry/exit logging
 * This replaces the common pattern of manual logStart/logReturn calls
 * 
 * @param name - Function name for logging identification
 * @param fn - Function to wrap with logging
 * @returns Wrapped function that automatically logs entry/exit
 */
export function withLogging<T extends (...args: any[]) => any>(
  name: string, 
  fn: T
): T {
  return ((...args: any[]) => executeWithLogs(name, fn, ...args)) as T;
}

/**
 * Higher-order function for class method logging
 * Use this to wrap entire classes or individual methods
 * 
 * @param className - Class name for logging context
 * @param methods - Object containing methods to wrap
 * @returns Object with wrapped methods
 */
export function logClassMethods<T extends Record<string, (...args: any[]) => any>>(
  className: string,
  methods: T
): T {
  const wrapped: any = {};
  
  for (const [methodName, method] of Object.entries(methods)) {
    const fullName = `${className}.${methodName}`;
    wrapped[methodName] = withLogging(fullName, method);
  }
  
  return wrapped;
}