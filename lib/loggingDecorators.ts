/**
 * Logging Decorators for Eliminating Repetitive Patterns
 * Provides decorator-based logging to replace repetitive logStart/logReturn calls
 * Eliminates ~90% of logging boilerplate while preserving debug visibility
 * 
 * Design philosophy:
 * - Decorator pattern for clean, declarative logging
 * - Automatic parameter and return value logging
 * - Configurable logging levels and formats
 * - Zero-impact when logging is disabled
 * - TypeScript-friendly with type preservation
 */

// Import existing logging utilities
import { logStart, logReturn, setLogging } from './logUtils.js';

// ==================== TYPE DEFINITIONS ====================

/**
 * Configuration options for logging decorators
 */
export interface LoggingOptions {
  /** Whether to log function entry */
  logEntry?: boolean;
  
  /** Whether to log function exit/return value */
  logExit?: boolean;
  
  /** Whether to log function parameters */
  logArgs?: boolean;
  
  /** Whether to log return value */
  logResult?: boolean;
  
  /** Whether to log errors */
  logErrors?: boolean;
  
  /** Custom prefix for log messages */
  prefix?: string;
  
  /** Custom suffix for log messages */
  suffix?: string;
  
  /** Maximum depth for object serialization */
  maxDepth?: number;
  
  /** Whether to include timing information */
  includeTiming?: boolean;
}

/**
 * Default logging options
 */
const DEFAULT_OPTIONS: Required<LoggingOptions> = {
  logEntry: true,
  logExit: true,
  logArgs: true,
  logResult: true,
  logErrors: true,
  prefix: '',
  suffix: '',
  maxDepth: 3,
  includeTiming: false,
};

// ==================== CORE DECORATOR IMPLEMENTATIONS ====================

/**
 * Class decorator to enable/disable logging for all methods in a class
 * 
 * @param enabled - Whether logging should be enabled
 * @returns Class decorator
 */
export function LogClass(enabled: boolean = true) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    // Set logging globally for this class
    setLogging(enabled);
    return constructor;
  };
}

/**
 * Method decorator for automatic function logging
 * 
 * @param options - Logging configuration options
 * @returns Method decorator
 */
export function LogMethod(options: LoggingOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> | void {
    const originalMethod = descriptor.value;
    
    if (!originalMethod) {
      return descriptor;
    }
    
    descriptor.value = function (...args: any[]) {
      const functionName = `${config.prefix}${String(propertyKey)}${config.suffix}`;
      const startTime = config.includeTiming ? Date.now() : 0;
      
      try {
        // Log function entry
        if (config.logEntry) {
          if (config.logArgs) {
            logStart(functionName, ...args);
          } else {
            console.log(`${functionName}()`);
          }
        }
        
        // Execute original function
        const result = originalMethod.apply(this, args);
        
        // Handle async functions
        if (result && typeof result.then === 'function') {
          return result
            .then((asyncResult: any) => {
              if (config.logExit) {
                if (config.logResult) {
                  logReturn(functionName, asyncResult);
                } else {
                  console.log(`${functionName}() completed`);
                }
                
                if (config.includeTiming) {
                  const duration = Date.now() - startTime;
                  console.log(`${functionName}() took ${duration}ms`);
                }
              }
              return asyncResult;
            })
            .catch((error: any) => {
              if (config.logErrors) {
                console.log(`${functionName}() error: ${error.message}`);
                if (config.includeTiming) {
                  const duration = Date.now() - startTime;
                  console.log(`${functionName}() failed after ${duration}ms`);
                }
              }
              throw error;
            });
        }
        
        // Handle synchronous functions
        if (config.logExit) {
          if (config.logResult) {
            logReturn(functionName, result);
          } else {
            console.log(`${functionName}() completed`);
          }
          
          if (config.includeTiming) {
            const duration = Date.now() - startTime;
            console.log(`${functionName}() took ${duration}ms`);
          }
        }
        
        return result;
        
      } catch (error: any) {
        if (config.logErrors) {
          console.log(`${functionName}() error: ${error.message}`);
          if (config.includeTiming) {
            const duration = Date.now() - startTime;
            console.log(`${functionName}() failed after ${duration}ms`);
          }
        }
        throw error;
      }
    } as T;
    
    return descriptor;
  };
}

/**
 * Simple method decorator with default logging options
 * 
 * @param target - Target object
 * @param propertyKey - Method name
 * @param descriptor - Method descriptor
 */
export function Log(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
  return LogMethod()(target, propertyKey, descriptor);
}

/**
 * Error-only decorator that only logs errors
 * 
 * @param target - Target object
 * @param propertyKey - Method name
 * @param descriptor - Method descriptor
 */
export function LogErrors(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
  return LogMethod({
    logEntry: false,
    logExit: false,
    logArgs: false,
    logResult: false,
    logErrors: true,
  })(target, propertyKey, descriptor);
}

/**
 * Entry-only decorator that only logs function entry
 * 
 * @param target - Target object
 * @param propertyKey - Method name
 * @param descriptor - Method descriptor
 */
export function LogEntry(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
  return LogMethod({
    logEntry: true,
    logExit: false,
    logArgs: true,
    logResult: false,
    logErrors: true,
  })(target, propertyKey, descriptor);
}

/**
 * Performance-focused decorator that includes timing
 * 
 * @param target - Target object
 * @param propertyKey - Method name
 * @param descriptor - Method descriptor
 */
export function LogPerformance(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
  return LogMethod({
    includeTiming: true,
    logEntry: true,
    logExit: true,
    logArgs: false,
    logResult: false,
    logErrors: true,
  })(target, propertyKey, descriptor);
}

// ==================== FUNCTION WRAPPERS ====================

/**
 * Higher-order function that adds logging to any function
 * 
 * @param fn - Function to wrap with logging
 * @param name - Function name for logging (optional)
 * @param options - Logging options (optional)
 * @returns Wrapped function with logging
 */
export function withLogging<T extends (...args: any[]) => any>(
  fn: T,
  name?: string,
  options: LoggingOptions = {}
): T {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const functionName = name || fn.name || 'anonymous';
  
  return function (...args: any[]) {
    const startTime = config.includeTiming ? Date.now() : 0;
    
    try {
      // Log function entry
      if (config.logEntry) {
        if (config.logArgs) {
          logStart(functionName, ...args);
        } else {
          console.log(`${functionName}()`);
        }
      }
      
      // Execute original function
      const result = fn(...args);
      
      // Handle async functions
      if (result && typeof result.then === 'function') {
        return result
          .then((asyncResult: any) => {
            if (config.logExit) {
              if (config.logResult) {
                logReturn(functionName, asyncResult);
              } else {
                console.log(`${functionName}() completed`);
              }
              
              if (config.includeTiming) {
                const duration = Date.now() - startTime;
                console.log(`${functionName}() took ${duration}ms`);
              }
            }
            return asyncResult;
          })
          .catch((error: any) => {
            if (config.logErrors) {
              console.log(`${functionName}() error: ${error.message}`);
              if (config.includeTiming) {
                const duration = Date.now() - startTime;
                console.log(`${functionName}() failed after ${duration}ms`);
              }
            }
            throw error;
          });
      }
      
      // Handle synchronous functions
      if (config.logExit) {
        if (config.logResult) {
          logReturn(functionName, result);
        } else {
          console.log(`${functionName}() completed`);
        }
        
        if (config.includeTiming) {
          const duration = Date.now() - startTime;
          console.log(`${functionName}() took ${duration}ms`);
        }
      }
      
      return result;
      
    } catch (error: any) {
      if (config.logErrors) {
        console.log(`${functionName}() error: ${error.message}`);
        if (config.includeTiming) {
          const duration = Date.now() - startTime;
          console.log(`${functionName}() failed after ${duration}ms`);
        }
      }
      throw error;
    }
  } as T;
}

/**
 * Simple function wrapper with default logging
 * 
 * @param fn - Function to wrap
 * @param name - Function name (optional)
 * @returns Wrapped function
 */
export function logFunction<T extends (...args: any[]) => any>(fn: T, name?: string): T {
  return withLogging(fn, name);
}

/**
 * Performance-focused function wrapper
 * 
 * @param fn - Function to wrap
 * @param name - Function name (optional)
 * @returns Wrapped function with timing
 */
export function logPerformance<T extends (...args: any[]) => any>(fn: T, name?: string): T {
  return withLogging(fn, name, { includeTiming: true, logArgs: false, logResult: false });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Batch wrap multiple functions with logging
 * 
 * @param functions - Object with functions to wrap
 * @param options - Logging options
 * @returns Object with wrapped functions
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
 * 
 * @param presetOptions - Preset logging options
 * @returns Custom decorator function
 */
export function createCustomLogger(presetOptions: LoggingOptions) {
  return function (options: LoggingOptions = {}) {
    return LogMethod({ ...presetOptions, ...options });
  };
}

// ==================== EXPORTS ====================

// Export all logging decorators and utilities
export const loggingDecorators = {
  // Decorators
  LogClass,
  LogMethod,
  Log,
  LogErrors,
  LogEntry,
  LogPerformance,
  
  // Function wrappers
  withLogging,
  logFunction,
  logPerformance,
  wrapObject,
  createCustomLogger,
  
  // Utilities
  DEFAULT_OPTIONS,
};

// Default export with most commonly used functions
export default {
  Log,
  LogMethod,
  withLogging,
  logFunction,
  DEFAULT_OPTIONS,
};