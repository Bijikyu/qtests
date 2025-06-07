
/**
 * Console Mocking Utility
 * 
 * Provides Jest-style console mocking capabilities without requiring Jest.
 * This allows testing of code that writes to console while capturing and
 * inspecting the output instead of polluting test output.
 * 
 * Design goals:
 * - Jest-compatible API for easy migration
 * - Works in any testing environment (Mocha, AVA, Tape, etc.)
 * - Captures console output for assertion
 * - Clean restoration to prevent test pollution
 * 
 * Implementation approach:
 * - Replaces console methods temporarily
 * - Tracks all calls in a Jest-compatible format
 * - Provides familiar mockImplementation and mockRestore methods
 * - Uses logging utility to track function calls for debugging
 */

// Import logging utilities for function call tracing
// This helps with debugging test setup and understanding call flow
const { logStart, logReturn } = require('../lib/logUtils');

/**
 * Creates a Jest-style spy for console methods
 * 
 * This function temporarily replaces a console method (log, error, warn, etc.)
 * with a spy that captures calls while optionally suppressing output.
 * 
 * Architecture rationale:
 * - Returns a Jest-compatible spy object to minimize learning curve
 * - Stores original method reference for safe restoration
 * - Tracks calls in the same format as Jest spies for compatibility
 * - Provides mockImplementation for custom behavior during tests
 * 
 * Why track calls in an array:
 * - Allows inspection of call count, arguments, and call order
 * - Compatible with existing Jest assertion patterns
 * - Enables testing of logging behavior without visual inspection
 * 
 * @param {string} method - The console method name to mock ('log', 'error', 'warn', etc.)
 *                         Must be a valid property of the console object
 * @returns {Object} Jest-compatible spy object with mock methods and call tracking
 */
function mockConsole(method) {
  // Log function entry for debugging test setup issues
  logStart('mockConsole', method);
  
  // Store reference to original console method before replacement
  // This ensures we can always restore the original behavior
  const originalMethod = console[method];
  
  // Array to store all calls made to the mocked method
  // Each element will be an array of arguments passed to the method
  // This matches Jest's spy.mock.calls format for compatibility
  const calls = [];
  
  // Default mock implementation: capture calls but produce no output
  // This is the most common use case - testing logging without console spam
  const mockImpl = (...args) => {
    calls.push(args);
  };
  
  // Replace the console method with our mock implementation
  // From this point, all calls to console[method] will be captured
  console[method] = mockImpl;
  
  // Create Jest-compatible spy object
  // This provides familiar methods for tests that may have used Jest before
  const spy = {
    /**
     * Replace the mock implementation with a custom function
     * 
     * Allows tests to control exactly what happens when the console method is called.
     * Useful for testing error conditions or custom logging behavior.
     * 
     * @param {Function} fn - Custom implementation function, or null for no-op
     * @returns {Object} The spy object for method chaining
     */
    mockImplementation: (fn) => {
      console[method] = fn || (() => {}); // Use no-op if no function provided
      return spy; // Return spy for method chaining
    },
    
    /**
     * Restore the original console method
     * 
     * MUST be called after testing to prevent interference with other tests
     * or normal console output. Restores the exact original method reference.
     */
    mockRestore: () => {
      console[method] = originalMethod;
    },
    
    /**
     * Jest-compatible mock tracking object
     * 
     * Provides access to call history in the same format as Jest spies.
     * This allows existing Jest assertions to work unchanged.
     */
    mock: {
      calls: calls // Array of argument arrays, one per method call
    }
  };
  
  // Log successful spy creation for debugging
  logReturn('mockConsole', 'spy');
  return spy;
}

// Export as an object to maintain consistency with other utilities
// and allow for potential future expansion
module.exports = { mockConsole };
