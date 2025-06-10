
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

// Import util for safe inspection fallback //(new dependency)
const util = require('util'); //(require util module)

let LOG_ENABLED = true; //(global log flag default true)

function setLogging(enabled){ //(setter to toggle global logs)
  LOG_ENABLED = enabled; //(update flag state)
}

/**
 * Safely converts values to strings for logging
 *
 * Attempts JSON serialization first, then falls back to util.inspect.
 * Returns '[unserializable]' if both methods fail.
 *
 * @param {any} value - Value to serialize for log output
 * @returns {string} Serialized representation
 */
function safeSerialize(value) {
  try {
    // Attempt JSON serialization as primary strategy for most values
    // JSON.stringify chosen first because it produces clean, readable output
    // Handles primitive types, arrays, and plain objects efficiently
    // Fails gracefully on circular references, functions, symbols, undefined
    const serialized = JSON.stringify(value);
    return serialized;
  } catch (error) {
    // Handle JSON serialization failures with util.inspect fallback
    // Common failures: circular references, functions, symbols, BigInt
    try {
      // Use util.inspect for complex objects that JSON.stringify cannot handle
      // depth: null ensures complete object traversal without truncation
      // util.inspect handles circular references, functions, and Node.js-specific objects
      // Produces more verbose but complete representation of complex values
      const inspected = util.inspect(value, { depth: null });
      return inspected;
    } catch (innerErr) {
      // Final fallback for truly unserializable values
      // Rare cases where both JSON.stringify and util.inspect fail
      // Provides consistent placeholder rather than throwing error
      // Ensures logging never fails due to argument serialization issues
      return '[unserializable]';
    }
  }
}

/**
 * Logs function entry with arguments
 * 
 * This function provides standardized logging for when functions start executing.
 * It's particularly useful for debugging test setup sequences and understanding
 * the order of operations in complex test environments.
 * 
 * Technical implementation:
 * - Uses console.log for immediate output (no buffering)
 * - safeSerialize handles objects, arrays, and primitive values safely //(update comment)
 * - Spread operator accepts variable number of arguments
 * - [START] prefix makes entry points easy to identify in logs
 * 
 * Argument serialization approach:
 * - safeSerialize converts any value to readable string //(update comment)
 * - Handles undefined, null, objects, arrays consistently
 * - Truncates long values naturally (JSON has reasonable limits)
 * - Avoids issues with toString() on complex objects
 * 
 * @param {string} functionName - Name of the function being entered
 * @param {...any} args - All arguments passed to the function
 */
function logStart(functionName, ...args) {
  // Convert all arguments to serialized strings for readable logging output
  // map() with safeSerialize ensures each argument is safely converted to string
  // join() with comma-space creates function call signature appearance
  // This format matches typical function call syntax for easy debugging
  const argsString = args.map(arg => safeSerialize(arg)).join(`, `);
  
  // Conditional logging based on global LOG_ENABLED flag for performance
  // Only perform string interpolation and console.log when logging is enabled
  // [START] prefix makes function entry points easy to identify in log streams
  // Template literal provides clean, readable output format
  if (LOG_ENABLED) console.log(`[START] ${functionName}(${argsString})`);
}

/**
 * Logs function exit with return value
 * 
 * This function provides standardized logging for when functions complete.
 * It shows the return value and matches with the corresponding START log
 * to help trace execution flow.
 * 
 * Why log return values:
 * - Helps verify functions are returning expected values
 * - Essential for debugging mock creation and setup
 * - Shows the flow of data through test setup functions
 * - Matches with START logs to show complete function execution
 * 
 * Return value serialization:
 * - Same safeSerialize approach as logStart for consistency //(update comment)
 * - Shows actual return values for verification
 * - Handles complex objects and primitives uniformly
 * 
 * @param {string} functionName - Name of the function being exited (should match logStart)
 * @param {any} returnValue - The value being returned by the function
 */
function logReturn(functionName, returnValue) {
  // Serialize return value using same safe approach as function arguments
  // Consistent serialization strategy ensures uniform log formatting across entry/exit
  // Safe serialization prevents logging failures from complex return values
  const valueString = safeSerialize(returnValue);
  
  // Conditional logging with [RETURN] prefix for easy correlation with [START] logs
  // Arrow notation (->) clearly indicates data flow from function to return value
  // Template literal maintains consistent formatting with logStart function
  // Only log when enabled to avoid performance overhead in production
  if (LOG_ENABLED) console.log(`[RETURN] ${functionName} -> ${valueString}`);
}

// Export both functions for use throughout the qtests module
// These provide the foundation for all function call tracing
/**
 * Executes a callback with standardized logging
 *
 * Outputs `${name} is running with` before execution, `${name} is returning`
 * when the callback succeeds, and `${name} encountered` if it throws. Works
 * with synchronous or asynchronous callbacks.
 *
 * @param {string} name - Identifier used in log messages
 * @param {Function} fn - Callback to execute
 * @param {...any} args - Arguments to pass to the callback
 * @returns {any|Promise} Result of the callback
 */
function executeWithLogs(name, fn, ...args) {
  console.log(`executeWithLogs is running with ${name}, ${fn}`); // logging function start per requirements
  
  try {
    // Serialize arguments for readable logging, handling empty argument lists gracefully
    // Conditional logic provides 'none' placeholder when no arguments passed
    // Consistent with other logging functions' argument serialization approach
    const argString = args.length ? args.map(a => safeSerialize(a)).join(`, `) : `none`;
    if (LOG_ENABLED) console.log(`${name} is running with ${argString}`);
    
    // Execute callback function with spread arguments to maintain original call signature
    // Spread operator ensures function receives arguments in expected format
    const result = fn(...args);
    
    // Detect Promise return values to handle async functions appropriately
    // Duck typing check using typeof result.then for Promise detection
    // This approach works with all Promise-like objects (thenables)
    if (result && typeof result.then === `function`) {
      // Handle async execution path with Promise chaining
      return result.then(res => {
        // Log successful async completion with serialized result
        if (LOG_ENABLED) console.log(`${name} is returning ${safeSerialize(res)}`);
        console.log(`executeWithLogs is returning ${res}`);
        return res;
      }).catch(err => {
        // Handle async errors with descriptive logging
        if (LOG_ENABLED) console.log(`${name} encountered ${err.message}`);
        console.log(`executeWithLogs error: ${err.message}`);
        throw err;
      });
    }
    
    // Handle synchronous execution path when function returns non-Promise value
    // Log successful synchronous completion with serialized result for debugging
    // Same logging format as async path maintains consistency across execution modes
    if (LOG_ENABLED) console.log(`${name} is returning ${safeSerialize(result)}`);
    console.log(`executeWithLogs is returning ${result}`);
    return result;
  } catch (error) {
    // Handle synchronous errors with descriptive logging for debugging
    // Error message logging helps identify issues in wrapped function execution
    // Re-throwing maintains original error handling contract while adding diagnostics
    if (LOG_ENABLED) console.log(`${name} encountered ${error.message}`);
    console.log(`executeWithLogs error: ${error.message}`);
    throw error;
  }
}

// export all logging utilities at bottom per requirements
module.exports = { logStart, logReturn, executeWithLogs, safeSerialize, setLogging };
