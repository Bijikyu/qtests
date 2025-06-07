
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

/**
 * Logs function entry with arguments
 * 
 * This function provides standardized logging for when functions start executing.
 * It's particularly useful for debugging test setup sequences and understanding
 * the order of operations in complex test environments.
 * 
 * Technical implementation:
 * - Uses console.log for immediate output (no buffering)
 * - JSON.stringify handles objects, arrays, and primitive values safely
 * - Spread operator accepts variable number of arguments
 * - [START] prefix makes entry points easy to identify in logs
 * 
 * Argument serialization approach:
 * - JSON.stringify converts any value to readable string
 * - Handles undefined, null, objects, arrays consistently
 * - Truncates long values naturally (JSON has reasonable limits)
 * - Avoids issues with toString() on complex objects
 * 
 * @param {string} functionName - Name of the function being entered
 * @param {...any} args - All arguments passed to the function
 */
function logStart(functionName, ...args) {
  // Create readable representation of all arguments
  // JSON.stringify handles edge cases like undefined, circular refs, etc.
  const argsString = args.map(arg => JSON.stringify(arg)).join(', ');
  
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
 * - Same JSON.stringify approach as logStart for consistency
 * - Shows actual return values for verification
 * - Handles complex objects and primitives uniformly
 * 
 * @param {string} functionName - Name of the function being exited (should match logStart)
 * @param {any} returnValue - The value being returned by the function
 */
function logReturn(functionName, returnValue) {
  // Serialize return value using same approach as arguments
  // This ensures consistent formatting between START and RETURN logs
  const valueString = JSON.stringify(returnValue);
  
  // Log with consistent format: [RETURN] functionName -> returnValue
  // Arrow notation clearly indicates this is a return value
  console.log(`[RETURN] ${functionName} -> ${valueString}`);
}

// Export both functions for use throughout the qtests module
// These provide the foundation for all function call tracing
module.exports = { logStart, logReturn };
