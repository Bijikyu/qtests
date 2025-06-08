/**
 * Test Environment Management Utilities
 * 
 * Provides comprehensive environment variable management and mock creation
 * for complex testing scenarios. This module handles the common pattern of
 * setting up test environments with known values and cleaning up afterward.
 * 
 * Design philosophy:
 * - Environment isolation: tests shouldn't affect each other or the host environment
 * - Predictable test data: use known values for consistent test results
 * - Mock management: centralized creation and cleanup of test doubles
 * - Framework agnostic: works with or without Jest
 * 
 * Use cases:
 * - API testing with known API keys
 * - Testing code that depends on environment variables
 * - Complex test scenarios requiring multiple mocks
 * - Integration tests that need controlled environments
 * 
 * Why environment management is critical:
 * 1. Tests must be deterministic - same conditions should produce same results
 * 2. Tests should not depend on developer's local environment setup
 * 3. Environment state changes in one test shouldn't affect other tests
 * 4. Production environment variables shouldn't leak into test execution
 */


// Import logging utilities for function call tracing and debugging
// These utilities provide consistent logging patterns across the qtests framework
const { logStart, logReturn } = require('../lib/logUtils');

/**
 * Set up test environment with controlled environment variables
 * 
 * This function establishes a controlled test environment by setting
 * specific environment variables to known values. This ensures tests
 * run with predictable configuration regardless of the host system's
 * environment setup.
 * 
 * Default environment strategy:
 * The function sets up common environment variables needed for typical
 * web application testing scenarios. These defaults can be overridden
 * by passing custom values in the envVars parameter.
 * 
 * Why these specific defaults:
 * - NODE_ENV=test: Standard convention for test environment identification
 * - API_KEY: Common requirement for API integration testing
 * - DATABASE_URL: Frequently needed for database-connected applications
 * - DEBUG_MODE: Useful for controlling verbose output during testing
 * 
 * @param {Object} envVars - Custom environment variables to set (overrides defaults)
 * @returns {Object} Object containing current environment snapshot for restoration
 * 
 * @example
 * const envSnapshot = setTestEnv({ API_KEY: 'test-key-123' });
 * // Test code here - runs with known environment
 * restoreEnv(envSnapshot);
 */

function setTestEnv(envVars = {}) {
  // Log function execution for debugging test setup issues
  logStart('setTestEnv', envVars);

  try {
    // Define default test environment configuration
    // These values provide a baseline test environment that works for most scenarios
    const defaultEnv = {
      NODE_ENV: 'test',           // Standard test environment identifier
      API_KEY: 'test-api-key',    // Mock API key for service integration tests
      DATABASE_URL: 'test://localhost/testdb', // Mock database connection string
      DEBUG_MODE: 'false'         // Disable verbose logging during tests
    };

    // Merge custom environment variables with defaults
    // Custom values override defaults, allowing test-specific configuration
    const testEnv = { ...defaultEnv, ...envVars };

    // Create snapshot of current environment for restoration
    // This captures the current state before making changes
    const envSnapshot = {};

    // Apply test environment variables and capture original values
    for (const [key, value] of Object.entries(testEnv)) {
      // Store original value (undefined if not set) for restoration
      envSnapshot[key] = process.env[key];

      // Set the test environment variable
      process.env[key] = value;
    }

    logReturn('setTestEnv', envSnapshot);
    return envSnapshot;

  } catch (error) {
    // Log errors with context for debugging
    console.log(`setTestEnv error: ${error.message}`);
    throw error;
  }

function setTestEnv() {
  return executeWithLogs('setTestEnv', () => { //(log wrapper around env setup)
    Object.assign(process.env, defaultEnv); // (apply defaults)
    return true; //(report success)
  }, 'default values'); //(log parameter context)
}

/**
 * Captures the current process environment for later restoration
 * 
 * This function creates a snapshot of the current environment variables
 * so they can be restored after test modifications. Essential for preventing
 * test pollution and ensuring each test starts with a clean environment.
 * 
 * Implementation details:
 * - Uses spread operator for shallow copy (sufficient for env vars)
 * - Copies at time of call, not when restore is called
 * - Returns the copy rather than storing internally for thread safety
 * 
 * Why shallow copy is sufficient:
 * - Environment variables are always strings (primitives)
 * - No nested objects to worry about
 * - Fast and memory efficient
 * 
 * @returns {Object} Copy of current environment variables
 */
function saveEnv() {
  return executeWithLogs('saveEnv', () => { //(wrap env capture in logger)
    const savedEnv = { ...process.env }; // Spread operator for shallow copy
    return savedEnv; //(return snapshot)
  }, 'none');
}

/**
 * Restores environment to a previously saved state
 * 
 * This function completely replaces the current environment with a saved copy.
 * It ensures clean restoration by clearing all current variables first,
 * then applying the saved state.
 * 
 * Two-step process rationale:
 * 1. Clear current env: removes any variables added during testing
 * 2. Apply saved env: restores exactly the original state
 * 
 * Why not just override:
 * - Tests might add new environment variables
 * - Simple assignment wouldn't remove test-added variables
 * - Complete replacement ensures clean state
 * 
 * @param {Object} savedEnv - Previously saved environment from saveEnv()
 * @returns {boolean} Always returns true to confirm restoration
 */
function restoreEnv(savedEnv) {
  return executeWithLogs('restoreEnv', () => { //(wrap env restore in logger)
    Object.keys(process.env).forEach(k => delete process.env[k]); // clear env
    Object.assign(process.env, savedEnv); // restore saved env
    return true; //(confirm success)
  }, 'env restore');
}

/**
 * Attach Jest spy helpers to a mock when available
 *
 * Reduces duplication by centralizing the environment check and method creation
 * for mocks that require mockClear and mockReset methods.
 *
 * @param {Function} mock - Mock or spy object to enhance
 * @returns {Function} The same mock enhanced with spy methods
 */
function attachMockSpies(mock) { // (adds mockClear/mockReset to provided mock)
  logStart('attachMockSpies', 'mock'); // (trace function start)
  if (typeof jest !== 'undefined') { // (verify jest availability)
    mock.mockClear = jest.fn(); // (assign jest spy clear method)
    mock.mockReset = jest.fn(); // (assign jest spy reset method)
  } else {
    mock.mockClear = () => {}; // (fallback noop clear in non-jest)
    mock.mockReset = () => {}; // (fallback noop reset in non-jest)
  }
  logReturn('attachMockSpies', mock); // (trace function return)
  return mock; // (return enhanced mock for chaining)
}

/**
 * Creates a logged mock and attaches spies
 *
 * Consolidates repetitive mock creation logic by wrapping executeWithLogs
 * with automatic spy attachment. Useful for any mock factory in this file
 * that needs consistent logging behavior.
 *
 * @param {string} name - Identifier used for logging
 * @param {Function} creator - Function that returns the raw mock
 * @returns {any} Mock enhanced with spy helpers
 */
function makeLoggedMock(name, creator) { //(wrapper for logged mock creation)
  return executeWithLogs(name, () => { //(consistent log wrapper)
    const mock = creator(); // (create raw mock)
    attachMockSpies(mock); // (add jest spies if available)
    return mock; // (return enhanced mock)
  }, 'none');
}

/**
 * Creates a mock for scheduler/throttling libraries like Bottleneck
 * 
 * Many applications use scheduling libraries to control rate limiting or
 * async execution. In tests, we want immediate execution without delays.
 * This mock provides that while maintaining a compatible interface.
 * 
 * Framework compatibility approach:
 * - Provides Jest methods if Jest is available
 * - Falls back to no-op implementations otherwise
 * - This allows the same test code to work in different environments
 * 
 * Why Promise.resolve():
 * - Schedule functions typically return promises
 * - Immediate resolution simulates instant execution
 * - Maintains async interface contract for realistic testing
 * 
 * @returns {Function} Mock scheduler function with Jest-compatible methods
 */
function createScheduleMock() {
  return makeLoggedMock('createScheduleMock', () => { //(log and spy helper)
    const scheduleMock = function(fn) { // immediate scheduler mock
      return Promise.resolve(fn()); // Execute and resolve instantly
    };
    return scheduleMock; // (returned to helper for spies)
  });
}

/**
 * Creates a mock for error handling utilities
 * 
 * Applications often have centralized error handling utilities.
 * In tests, we want to capture error calls without triggering real
 * error handling logic like logging or alerting.
 * 
 * Design approach:
 * - Returns arguments passed to it for inspection
 * - Provides Jest methods for compatibility
 * - No-op in terms of side effects
 * 
 * Why return arguments:
 * - Allows tests to verify what errors were reported
 * - Simple way to capture call data without complex tracking
 * - Compatible with most error utility interfaces
 * 
 * @returns {Function} Mock error handler with Jest-compatible methods
 */
function createQerrorsMock() {
  return makeLoggedMock('createQerrorsMock', () => { //(log and spy helper)
    const qerrorsMock = function(...args) { // capture args for inspection
      return args; // Return arguments for test inspection
    };
    return qerrorsMock; // (returned to helper for spies)
  });
}

/**
 * Creates a mock HTTP adapter for axios testing
 * 
 * This provides a simple HTTP mock without external dependencies like
 * axios-mock-adapter. It implements the minimum interface needed for
 * basic HTTP testing scenarios.
 * 
 * Design decisions:
 * - Self-contained: no external mocking library dependencies
 * - Simple interface: covers common GET/POST scenarios
 * - Stateful: stores reply configurations for later use
 * - Resettable: can clear state between tests
 * 
 * Why not use axios-mock-adapter:
 * - Reduces dependencies for the qtests module
 * - Simpler implementation for basic use cases
 * - More predictable behavior in different environments
 * 
 * @returns {Object} Mock adapter with onGet, onPost, and reset methods
 */
function createAxiosMock() {
  return makeLoggedMock('createAxiosMock', () => { //(log and spy helper)
    function createReplyBinder(url){ //helper for binding replies on adapter
      return { //return object with reply method
        reply: function(status, data){ //store status and data for url
          mock._replies[url] = { status, data }; // (bind response to url)
          return mock; // (allow chaining)
        }
      }; //close returned object
    }
    const mock = {
      /**
       * Configure mock response for GET requests to a specific URL
       * @param {string} url - URL to mock
       * @returns {Object} Reply configuration object
       */
    onGet: function(url) {
      return createReplyBinder(url); //delegate to reply binder
    },
    
    /**
     * Configure mock response for POST requests to a specific URL
     * @param {string} url - URL to mock
     * @returns {Object} Reply configuration object
     */
    onPost: function(url) {
      return createReplyBinder(url); //use common binder for post
    },
    
    /**
     * Reset all configured mocks
     * Essential for preventing test pollution
     */
    reset: function() {
      mock._replies = {}; // (clear stored replies on adapter)
    }
  };
    mock._replies = {}; // (initialize reply store for adapter)
    return mock; // (returned to helper for spies)
  });

}

/**
 * Restore environment variables from a snapshot
 * 
 * This function restores the environment to its previous state using
 * a snapshot created by setTestEnv. This is critical for test isolation
 * and preventing environment changes from affecting subsequent tests.
 * 
 * Restoration strategy:
 * - If original value was undefined, delete the environment variable
 * - If original value existed, restore it exactly
 * - Handle edge cases like null or empty string values correctly
 * 
 * @param {Object} envSnapshot - Environment snapshot from setTestEnv
 * 
 * @example
 * const snapshot = setTestEnv({ NODE_ENV: 'development' });
 * // Run tests...
 * restoreEnv(snapshot); // Environment restored to original state
 */

function restoreEnv(envSnapshot) {
  logStart('restoreEnv', envSnapshot);

  try {
    // Restore each environment variable from the snapshot
    for (const [key, originalValue] of Object.entries(envSnapshot)) {
      if (originalValue === undefined) {
        // Variable didn't exist originally, so remove it
        delete process.env[key];
      } else {
        // Variable existed originally, restore its value
        process.env[key] = originalValue;
      }
    }

    logReturn('restoreEnv', undefined);

  } catch (error) {
    console.log(`restoreEnv error: ${error.message}`);
    throw error;
  }

}

/**
 * Create mock objects for testing complex scenarios
 * 
 * This function creates a collection of mock objects commonly needed
 * in testing scenarios. It handles both Jest environment (with advanced
 * mocking capabilities) and plain Node.js environments (with basic mocks).
 * 
 * Mock creation strategy:
 * - Detect Jest availability and use superior Jest mocks when available
 * - Provide functional fallbacks for non-Jest environments
 * - Create commonly needed mocks for typical testing scenarios
 * - Return consistent interface regardless of underlying implementation
 * 
 * Why these specific mocks:
 * - mock: General-purpose function mock for stubbing any function
 * - scheduleMock: Timer/scheduling mock for testing time-dependent code
 * - qerrorsMock: Error handling mock for testing error scenarios
 * 
 * @returns {Object} Collection of mock objects ready for use in tests
 * 
 * @example
 * const mocks = createMocks();
 * someObject.method = mocks.mock;
 * // Test code that calls someObject.method
 * console.log(mocks.mock.mock.calls.length); // Verify call count
 */

function createMocks() {
  logStart('createMocks', 'none');

  try {
    let mocks;

    // Check if Jest mocking capabilities are available
    if (typeof jest !== 'undefined' && jest.fn) {
      // Use Jest's advanced mocking features when available
      // Jest mocks provide call tracking, argument capture, return value control
      mocks = {
        mock: jest.fn(),                    // General-purpose function mock
        scheduleMock: jest.fn(),            // Mock for timer/scheduling functions
        qerrorsMock: jest.fn()              // Mock for error handling functions
      };
    } else {
      // Fallback mock implementation for non-Jest environments
      // These provide basic functionality to ensure tests can run

      // Create manual call tracking arrays
      const mockCalls = [];
      const scheduleCalls = [];
      const qerrorsCalls = [];

      mocks = {
        // General-purpose mock with manual call tracking
        mock: function(...args) {
          mockCalls.push(args);
        },

        // Timer/scheduling mock with call tracking
        scheduleMock: function(...args) {
          scheduleCalls.push(args);
        },

        // Error handling mock with call tracking
        qerrorsMock: function(...args) {
          qerrorsCalls.push(args);
        }
      };

      // Add Jest-compatible mock properties for consistent API
      mocks.mock.mock = { calls: mockCalls };
      mocks.scheduleMock.mock = { calls: scheduleCalls };
      mocks.qerrorsMock.mock = { calls: qerrorsCalls };
    }

    logReturn('createMocks', mocks);
    return mocks;

  } catch (error) {
    console.log(`createMocks error: ${error.message}`);
    throw error;
  }

}

/**
 * Reset all mocks to clear call history and state
 * 
 * This function clears the call history and state of all provided mocks,
 * returning them to a clean state for the next test. This is essential
 * for test isolation and preventing mock state from affecting subsequent tests.
 * 
 * Reset strategy:
 * - Handle both Jest mocks and manual fallback mocks
 * - Clear call history and reset any return values or implementations
 * - Gracefully handle missing or undefined mocks
 * - Provide consistent behavior across different mock types
 * 
 * @param {...Object} mocks - Variable number of mock objects to reset
 * 
 * @example
 * const mocks = createMocks();
 * // Use mocks in tests...
 * resetMocks(mocks.mock, mocks.scheduleMock, mocks.qerrorsMock);
 * // All mocks now have clean state for next test
 */
function resetMocks(...mocks) {
  logStart('resetMocks', mocks.length);

  try {
    // Reset each provided mock object
    mocks.forEach(mock => {
      if (mock && typeof mock === 'function') {
        // Check if this is a Jest mock with built-in reset functionality
        if (mock.mockReset && typeof mock.mockReset === 'function') {
          // Use Jest's built-in reset functionality
          mock.mockReset();
        } else if (mock.mock && Array.isArray(mock.mock.calls)) {
          // Reset manual mock call tracking array
          mock.mock.calls.length = 0;
        }
      }
    });

    logReturn('resetMocks', undefined);

  } catch (error) {
    console.log(`resetMocks error: ${error.message}`);
    throw error;
  }
}

/**
 * Export test environment management utilities
 * 
 * These functions work together to provide comprehensive test environment
 * management capabilities. They are designed to be used in combination
 * for complete test isolation and predictable test conditions.
 * 
 * Usage patterns:
 * 1. Call setTestEnv at the beginning of test suites
 * 2. Use createMocks to set up required test doubles
 * 3. Run tests with controlled environment and mocks
 * 4. Call resetMocks between tests for isolation
 * 5. Call restoreEnv after test suites to clean up
 */
module.exports = {
  defaultEnv,           // Export default env values
  setTestEnv,           // Set standard test environment variables
  saveEnv,              // Capture current environment for restoration
  restoreEnv,           // Restore previously saved environment
  attachMockSpies,      // Export attachMockSpies helper //(added export for spy helper)
  makeLoggedMock,       // Export makeLoggedMock factory //(added export for logged mock creation)
  createScheduleMock,   // Create scheduler/throttling mock
  createQerrorsMock,    // Create error handler mock
  createAxiosMock,      // Create HTTP client mock adapter
  resetMocks,           // Reset multiple mocks at once
  initSearchTest        // Complete setup for search/API testing
};

