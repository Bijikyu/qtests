/**
 * Core Logging Wrapper
 * Core higher-order function for adding logging to functions
 */

import { logStart, logReturn } from '../logUtils.js';
import { LoggingOptions, DEFAULT_OPTIONS } from './decoratorTypes.js';

/**
 * Higher-order function that adds logging to any function
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