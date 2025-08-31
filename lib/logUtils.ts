/**
 * Logging Utilities for Function Call Tracing
 * 
 * Provides standardized logging for function entry and exit points throughout
 * the qtests module. This is essential for debugging test setup issues and
 * understanding the flow of mock creation and cleanup.
 * 
 * Design philosophy:
 * - Consistent format: all logs follow the same pattern for easy parsing
 * - Minimal overhead: simple console output without external dependencies
 * - Debugging focus: optimized for troubleshooting rather than production
 * - JSON serialization: handles complex arguments safely
 * 
 * Why dedicated logging utilities:
 * - Consistent formatting across all qtests functions
 * - Easy to disable by modifying this single file
 * - Helps users understand what qtests is doing during test setup
 * - Essential for debugging complex test environment issues
 */

// Import util for safe inspection fallback
import util from 'util';

let LOG_ENABLED = true; // global log flag default true

function setLogging(enabled: boolean): void {
  LOG_ENABLED = enabled; // update flag state
}

/**
 * Safely converts values to strings for logging
 *
 * Attempts JSON serialization first, then falls back to util.inspect.
 * Returns '[unserializable]' if both methods fail.
 *
 * @param value - Value to serialize for log output
 * @returns Serialized representation
 */
function safeSerialize(value: any): string {
  if (value === undefined) return 'undefined'; // handle undefined explicitly for clarity
  try {
    // Attempt JSON serialization as primary strategy for most values
    // JSON.stringify chosen first because it produces clean, readable output
    // Handles primitive types, arrays, and plain objects efficiently
    // Fails gracefully on circular references, functions, symbols
    const serialized = JSON.stringify(value);
    if (serialized !== undefined) return serialized; // check for unsupported types
    const inspected = util.inspect(value, { depth: null }); // fallback for functions or symbols
    return inspected;
  } catch (error) {
    // Handle JSON serialization failures with util.inspect fallback
    // Common failures: circular references, BigInt
    try {
      // Use util.inspect for complex objects that JSON.stringify cannot handle
      const inspected = util.inspect(value, { 
        depth: null,
        showHidden: false,
        colors: false,
        customInspect: true,
        showProxy: true,
        maxArrayLength: 100,
        maxStringLength: 100,
        breakLength: 80,
        compact: true,
        sorted: false,
        getters: false 
      });
      return inspected;
    } catch (inspectError) {
      // Final fallback when both JSON and util.inspect fail
      // This should be extremely rare but provides safety
      return '[unserializable]';
    }
  }
}

/**
 * Logs function entry with name and arguments
 *
 * @param name - Function name for identification
 * @param args - Function arguments to serialize and log
 */
function logStart(name: string, ...args: any[]): void {
  if (!LOG_ENABLED) return; // respect global log flag
  const serializedArgs = args.map(arg => safeSerialize(arg)).join(', ');
  console.log(`${name}(${serializedArgs})`);
}

/**
 * Logs function return value
 *
 * @param name - Function name for identification  
 * @param value - Return value to serialize and log
 */
function logReturn(name: string, value: any): void {
  if (!LOG_ENABLED) return; // respect global log flag
  const serializedValue = safeSerialize(value);
  console.log(`${name} -> ${serializedValue}`);
}

/**
 * Executes a function with entry/exit logging
 *
 * Provides automatic logging wrapper for functions that need
 * detailed execution tracing for debugging purposes.
 *
 * @param name - Function name for log identification
 * @param fn - Function to execute with logging
 * @param args - Arguments to pass to the function
 * @returns The result of the function execution
 */
function executeWithLogs<T>(name: string, fn: (...args: any[]) => T, ...args: any[]): T {
  try {
    // Log function entry with arguments for debugging visibility
    // This helps track the sequence of function calls during test setup
    logStart(name, ...args);
    
    // Execute the wrapped function with provided arguments
    // Function execution is not modified, only instrumented with logging
    const result = fn(...args);
    
    // Log function exit with return value for completeness
    // Return value logging helps verify expected function behavior
    logReturn(name, result);
    
    return result;
  } catch (error: any) {
    // Log errors for debugging while preserving original error handling
    // Error message logging helps identify issues in wrapped function execution
    // Re-throwing maintains original error handling contract while adding diagnostics
    if (LOG_ENABLED) console.log(`${name} encountered ${error.message}`);
    console.log(`executeWithLogs error: ${error.message}`);
    throw error;
  }
}

// Export all logging utilities using ES module syntax
export { logStart, logReturn, executeWithLogs, safeSerialize, setLogging };