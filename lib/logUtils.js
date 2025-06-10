
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

// Configuration object controlling util.inspect depth //(exported config)
const logConfig = { inspectDepth: 2 }; //(default depth of 2)

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
  try { //attempt JSON serialization //(try stringify first)
    const serialized = JSON.stringify(value); //(primary stringify)
    return serialized; //return JSON string without extra logs
  } catch (error) { //handle JSON failure
    try { //attempt util.inspect
      const inspected = util.inspect(value, { depth: logConfig.inspectDepth }); //(inspect fallback uses config depth)
      return inspected; //return inspected string
    } catch (innerErr) { //handle inspect failure
      return '[unserializable]'; //fallback placeholder
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
  // Create readable representation of all arguments //(ensure consistent output)
  // safeSerialize handles JSON errors gracefully //(new helper usage)
  const argsString = args.map(arg => safeSerialize(arg)).join(', '); //(changed serializer)
  
  // Log with consistent format: [START] functionName(arg1, arg2, ...)
  // This format is easy to parse and grep for debugging
  console.log(`[START] ${functionName}(${argsString})`);
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
  // Serialize return value using same approach as arguments //(keep consistent)
  // safeSerialize prevents crashes on circular values //(new helper usage)
  const valueString = safeSerialize(returnValue); //(changed serializer)
  
  // Log with consistent format: [RETURN] functionName -> returnValue
  // Arrow notation clearly indicates this is a return value
  console.log(`[RETURN] ${functionName} -> ${valueString}`);
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
  const argString = args.length ? args.map(a => safeSerialize(a)).join(', ') : 'none'; //(serialize arguments)
  console.log(`${name} is running with ${argString}`); //(start log)
  try{ // (wrap callback execution)
    const result = fn(...args); //(invoke callback)
    if (result && typeof result.then === 'function') { // (handle promise result)
      return result.then(res => { // (await async resolution)
        console.log(`${name} is returning ${safeSerialize(res)}`); //(async return log)
        return res; //(forward async result)
      }).catch(err => { // (async error path)
        console.log(`${name} encountered ${err.message}`); //(async error log)
        throw err; //(rethrow async error)
      });
    }
    console.log(`${name} is returning ${safeSerialize(result)}`); //(sync return log)
    return result; //(return sync result)
  }catch(error){ // (sync error path)
    console.log(`${name} encountered ${error.message}`); //(sync error log)
    throw error; //(rethrow sync error)
  }
}

module.exports = { logStart, logReturn, executeWithLogs, safeSerialize, logConfig }; //(export safeSerialize & config)
