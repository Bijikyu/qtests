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
const defaultEnv = { GOOGLE_API_KEY: `key`, GOOGLE_CX: `cx`, OPENAI_TOKEN: `token` }; //defined defaults for tests

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
// Simplified setTestEnv applies defaultEnv values for tests
function setTestEnv() {
  logStart(`setTestEnv`, `default values`);
  process.env.GOOGLE_API_KEY = defaultEnv.GOOGLE_API_KEY;
  process.env.GOOGLE_CX = defaultEnv.GOOGLE_CX;
  process.env.OPENAI_TOKEN = defaultEnv.OPENAI_TOKEN;
  logReturn(`setTestEnv`, true);
  return true;
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
  logStart(`saveEnv`, `none`);
  const savedEnv = { ...process.env };
  logReturn(`saveEnv`, `env stored`);
  return savedEnv;
}

function restoreEnv(savedEnv) {
  logStart(`restoreEnv`, `env restore`);
  Object.keys(process.env).forEach(k => delete process.env[k]);
  Object.assign(process.env, savedEnv);
  logReturn(`restoreEnv`, true);
  return true;
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
  logStart(`createScheduleMock`, `none`);
  const scheduleMock = jest.fn(fn => Promise.resolve(fn()));
  const Bottleneck = require(`bottleneck`);
  Bottleneck.mockImplementation(() => ({ schedule: scheduleMock }));
  logReturn(`createScheduleMock`, `mock`);
  return scheduleMock;
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
  logStart(`createQerrorsMock`, `none`);
  const qerrorsMock = require(`qerrors`);
  qerrorsMock.mockReset();
  logReturn(`createQerrorsMock`, `mock`);
  return qerrorsMock;
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
  logStart(`createAxiosMock`, `none`);
  const MockAdapter = require(`axios-mock-adapter`);
  const axios = require(`axios`);
  const mock = new MockAdapter(axios);
  logReturn(`createAxiosMock`, `adapter`);
  return mock;
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
function resetMocks(mock, scheduleMock, qerrorsMock) {
  logStart(`resetMocks`, `mocks`);
  mock.reset();
  scheduleMock.mockClear();
  qerrorsMock.mockClear();
  logReturn(`resetMocks`, true);
  return true;
}
function initSearchTest() {
  logStart(`initSearchTest`, `none`);
  jest.resetModules();
  setTestEnv();
  const scheduleMock = createScheduleMock();
  const qerrorsMock = createQerrorsMock();
  const mock = createAxiosMock();
  logReturn(`initSearchTest`, `mocks`);
  return { mock, scheduleMock, qerrorsMock };
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

