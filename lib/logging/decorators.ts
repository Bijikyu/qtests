/**
 * Core Logging Decorator Implementations
 */

import { logStart, logReturn, setLogging } from '../logUtils.js';
import { LoggingOptions, DEFAULT_OPTIONS } from './decoratorTypes.js';

/**
 * Class decorator to enable/disable logging for all methods in a class
 */
export function LogClass(enabled: boolean = true) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    setLogging(enabled);
    return constructor;
  };
}

/**
 * Core method decorator implementation
 */
export function LogMethod(options: LoggingOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  return function <T extends (...args: any[]) => any>(
    _target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> | void {
    const originalMethod = descriptor.value;
    
    if (!originalMethod) {
      return descriptor;
    }
    
descriptor.value = function (this: any, ...args: any[]) {
      const functionName = `${config.prefix}${String(propertyKey)}${config.suffix}`;
      const startTime = config.includeTiming ? Date.now() :0;
      
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
 */
export function Log(_target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
  return LogMethod()(_target, propertyKey, descriptor);
}

/**
 * Error-only decorator that only logs errors
 */
export function LogErrors(_target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
  return LogMethod({
    logEntry: false,
    logExit: false,
    logArgs: false,
    logResult: false,
    logErrors: true,
  })(_target, propertyKey, descriptor);
}

/**
 * Entry-only decorator that only logs function entry
 */
export function LogEntry(_target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
  return LogMethod({
    logEntry: true,
    logExit: false,
    logArgs: true,
    logResult: false,
    logErrors: true,
  })(_target, propertyKey, descriptor);
}

/**
 * Performance-focused decorator that includes timing
 */
export function LogPerformance(_target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
  return LogMethod({
    includeTiming: true,
    logEntry: true,
    logExit: true,
    logArgs: false,
    logResult: false,
    logErrors: true,
  })(_target, propertyKey, descriptor);
}