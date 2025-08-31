/**
 * Console Mocking Utilities - TypeScript Implementation
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
 * @param method - Console method name to mock ('log', 'error', 'warn', etc.)
 * @returns Mock object with call tracking and restoration capabilities
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
        // Check for Jest availability and prefer Jest spies when available
        // Jest spies provide superior debugging tools, call introspection, and integration with Jest ecosystem
        // typeof check ensures we don't throw errors in non-Jest environments
        // jest.fn check ensures Jest mocking functionality is actually available, not just Jest test runner
        if (typeof jest !== `undefined` && jest.fn) {
            // Use Jest's built-in spying mechanism for enhanced debugging and integration
            // jest.spyOn preserves original method while adding spy capabilities
            // mockImplementation(() => {}) creates silent mock that captures calls without output
            // Jest spies automatically integrate with Jest's assertion and debugging tools
            const jestSpy = jest.spyOn(console, method).mockImplementation(() => { });
            console.log(`mockConsole is returning ${jestSpy}`); // logging return value per requirements
            return jestSpy;
        }
        // Fallback implementation for non-Jest environments (Mocha, AVA, vanilla Node.js)
        // Manual implementation ensures qtests works regardless of testing framework choice
        // This approach maintains Jest-compatible API for consistent developer experience
        let originalMethod = console[method]; // preserve original for restoration
        let calls = []; // array to capture all method invocations with arguments
        // Replace console method with capturing function that stores calls but produces no output
        // Spread operator (...args) captures all arguments regardless of method signature
        // Anonymous function used to avoid name conflicts and ensure proper 'this' binding
        console[method] = function (...args) {
            // Store complete argument list for each invocation
            // Arguments stored as arrays to match Jest's spy.mock.calls format
            // This enables tests to verify exactly what was logged during execution
            calls.push(args);
        };
        // Create Jest-compatible mock object for consistent API across environments
        // Object structure matches Jest spy interface to minimize learning curve for developers
        // Provides same call tracking and restoration capabilities as Jest spies
        const mockObject = {
            mock: {
                // Expose calls array with same structure as Jest spies
                // Each element is an array of arguments passed to that invocation
                calls: calls
            },
            mockRestore: function () {
                // Restore original console method to prevent test pollution
                // Simple assignment ensures reliable restoration and avoids memory leaks
                console[method] = originalMethod; // reinstate saved method for other tests
                if (calls) {
                    calls.length = 0;
                } // clear captured calls for GC
                this.mock.calls = null; // remove reference from mock object for GC
                originalMethod = null; // drop reference to allow garbage collection
                calls = null; // drop call history reference enabling GC
            }
        };
        console.log(`mockConsole is returning ${mockObject}`); // logging return value per requirements
        return mockObject;
    }
    catch (error) {
        // Provide context for debugging console mocking failures
        // Common issues include invalid method names or console object modification conflicts
        // Error re-throwing maintains proper error handling while adding diagnostic information
        console.log(`mockConsole error: ${error.message}`);
        throw error;
    }
}
// Export mockConsole utilities using ES module syntax
export { mockConsole };
