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
  // Set up controlled test environment with known values
  setTestEnv,

  // Restore environment to original state for cleanup
  restoreEnv,

  // Create commonly needed mock objects for testing
  createMocks,

  // Reset mock state for test isolation
  resetMocks,
  createScheduleMock,
  createQerrorsMock,
  createAxiosMock,
  createMockAxios,
  resetMocks,
  initSearchTest
};