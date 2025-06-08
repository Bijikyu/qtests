
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
  // Check if Jest mocking is available in the current environment
  // Jest provides sophisticated mock functionality that we prefer when available
  // The typeof check safely detects Jest without throwing errors in other environments
  if (typeof jest !== 'undefined' && jest.fn) {
    // Use Jest's spyOn functionality for superior mock capabilities
    // Jest.spyOn creates a mock that automatically tracks calls, arguments, and return values
    // The mockImplementation ensures the method does nothing (no console output)
    return jest.spyOn(console, method).mockImplementation(() => {});
  }
  
  // Fallback implementation for non-Jest environments
  // This provides basic mock functionality with manual call tracking
  // Ensures qtests works with any test framework, not just Jest
  
  // Store reference to original console method for restoration
  const originalMethod = console[method];
  
  // Create manual call tracking array to simulate Jest mock.calls
  const calls = [];
  
  // Replace console method with capturing implementation
  // This function captures arguments but produces no output
  console[method] = function(...args) {
    // Store all arguments passed to the console method
    // This allows test verification of what was logged
    calls.push(args);
  };
  
  // Return mock object with Jest-compatible interface
  // This ensures consistent API regardless of underlying implementation
  return {
    // Mock call tracking that mimics Jest's mock.calls structure
    mock: {
      calls: calls
    },
    
    // Restoration function that reinstates original console method
    // Named mockRestore to match Jest's API for consistency
    mockRestore: function() {
      console[method] = originalMethod;
    }
  };
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
