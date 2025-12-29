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
  // Merge default options with user-provided options
  const config = { ...DEFAULT_OPTIONS, ...options };
  const functionName = name || fn.name || 'anonymous';
  
  return function (...args: any[]) {
    const startTime = config.includeTiming ? Date.now() : 0;
    
    try {
      // Log function entry if configured
      if (config.logEntry) {
        if (config.logArgs) {
          logStart(functionName, ...args); // Log with arguments
        } else {
          console.log(`${functionName}()`); // Simple entry log
        }
      }
      
      // Execute original function to get result
      const result = fn(...args);
      
      // Handle async functions by wrapping promises
      if (result && typeof result.then === 'function') {
        return result
          .then((asyncResult: any) => {
            // Log successful async completion
            if (config.logExit) {
              if (config.logResult) {
                logReturn(functionName, asyncResult); // Log with result
              } else {
                console.log(`${functionName}() completed`); // Simple completion log
              }
              
              // Log timing for async functions
              if (config.includeTiming) {
                const duration = Date.now() - startTime;
                console.log(`${functionName}() took ${duration}ms`);
              }
            }
            return asyncResult;
          })
          .catch((error: any) => {
            // Log async function errors
            if (config.logErrors) {
              console.log(`${functionName}() error: ${error.message}`);
              if (config.includeTiming) {
                const duration = Date.now() - startTime;
                console.log(`${functionName}() failed after ${duration}ms`);
              }
            }
            throw error; // Re-throw to maintain error flow
          });
      }
      
      // Handle synchronous functions
      if (config.logExit) {
        if (config.logResult) {
          logReturn(functionName, result); // Log with result
        } else {
          console.log(`${functionName}() completed`); // Simple completion log
        }
        
        // Log timing for sync functions
        if (config.includeTiming) {
          const duration = Date.now() - startTime;
          console.log(`${functionName}() took ${duration}ms`);
        }
      }
      
      return result; // Return sync result
      
    } catch (error: any) {
      // Log synchronous function errors
      if (config.logErrors) {
        console.log(`${functionName}() error: ${error.message}`);
        if (config.includeTiming) {
          const duration = Date.now() - startTime;
          console.log(`${functionName}() failed after ${duration}ms`);
        }
      }
      throw error; // Re-throw to maintain error flow
    }
  } as T;
}