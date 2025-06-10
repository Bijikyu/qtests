
/**
 * Console Mocking Utilities
 * 
 * This module provides console output capture functionality for testing
 * code that logs to the console without polluting test output.
 * 
 * Core purpose:
 * When testing functions that log information, errors, or debug output,
 * we need to verify the logging behavior without cluttering the test
 * runner's console. This utility captures console calls while providing
 * access to verify what was logged.
 * 
 * Design philosophy:
 * - Clean test output by preventing unwanted console pollution
 * - Full capture and verification capabilities for logged content
 * - Framework compatibility (works with Jest, Mocha, etc.)
 * - Simple restoration to prevent test interference
 * 
 * Implementation approach:
 * Uses the same stubbing pattern as stubMethod but specialized for console
 * methods with additional mock call tracking for test verification.
 */

/**
 * Create a mock console method that captures calls without output
 * 
 * This function replaces a console method (log, error, warn, etc.) with
 * a mock implementation that captures all calls and arguments while
 * preventing actual console output during testing.
 * 
 * Mock implementation strategy:
 * 1. Check if Jest is available and use its mocking capabilities
 * 2. Fall back to manual mock implementation for non-Jest environments
 * 3. Provide consistent API regardless of underlying implementation
 * 4. Capture all arguments passed to console method for verification
 * 
 * Why Jest detection:
 * - Jest provides superior mock functionality with built-in call tracking
 * - Jest mocks have additional features like call count, arguments history
 * - Fallback ensures compatibility with other test frameworks
 * - Consistent API means tests work regardless of framework choice
 * 
 * @param {string} method - Console method name to mock ('log', 'error', 'warn', etc.)
 * @returns {Object} Mock object with call tracking and restoration capabilities
 * 
 * @example
 * const spy = mockConsole('log');
 * console.log('test message');
 * console.log(spy.mock.calls.length); // 1
 * spy.mockRestore();
 */
function mockConsole(method) {
  console.log(`mockConsole is running with ${method}`); // logging function start per requirements
  
  try {
    if (typeof jest !== `undefined` && jest.fn) { // changed quotes to backticks per requirements
      const jestSpy = jest.spyOn(console, method).mockImplementation(() => {}); // use jest spy for superior mocking
      console.log(`mockConsole is returning ${jestSpy}`); // logging return value per requirements
      return jestSpy;
    }
    
    const originalMethod = console[method]; // store original method for restoration
    const calls = []; // manual call tracking for non-jest environments
    
    console[method] = function(...args) { // replace console method with capturing function
      calls.push(args); // store arguments for test verification
    };
    
    const mockObject = { // create mock object with jest-compatible interface
      mock: {
        calls: calls
      },
      mockRestore: function() {
        console[method] = originalMethod; // restore original console method
      }
    };
    
    console.log(`mockConsole is returning ${mockObject}`); // logging return value per requirements
    return mockObject;
  } catch (error) {
    console.log(`mockConsole error: ${error.message}`); // error logging for debugging
    throw error;
  }
}

/**
 * Export mockConsole utilities
 * 
 * Using object export pattern to allow for future expansion while
 * maintaining backward compatibility. The mockConsole function is
 * the primary interface, but additional console-related utilities
 * could be added to this module in the future.
 */
module.exports = {
  // Primary console mocking function
  // Captures console output during testing to prevent output pollution
  // while allowing verification of logging behavior
  mockConsole
};
