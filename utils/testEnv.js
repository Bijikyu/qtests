
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
 */

// Import logging utilities for function call tracing and debugging
const { logStart, logReturn } = require('../lib/logUtils');

/**
 * Sets up a standard test environment with common API keys
 * 
 * This function establishes a predictable environment for tests by setting
 * commonly used environment variables to known test values. This ensures
 * tests are deterministic and don't depend on the developer's local environment.
 * 
 * Why these specific variables:
 * - GOOGLE_API_KEY: Common in search and maps functionality
 * - GOOGLE_CX: Google Custom Search Engine ID
 * - OPENAI_TOKEN: AI/ML functionality testing
 * 
 * Values chosen:
 * - Simple strings that are obviously fake ('key', 'cx', 'token')
 * - Short to avoid log pollution
 * - Recognizable as test data
 * 
 * @returns {boolean} Always returns true to confirm environment was set
 */
function setTestEnv() {
  logStart('setTestEnv', 'default values');
  
  // Set standard test API keys
  // These values are obviously fake and safe for logging
  process.env.GOOGLE_API_KEY = 'key';   // Minimal fake API key
  process.env.GOOGLE_CX = 'cx';         // Minimal fake Custom Search Engine ID
  process.env.OPENAI_TOKEN = 'token';   // Minimal fake OpenAI token
  
  logReturn('setTestEnv', true);
  return true; // Confirm successful setup for test verification
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
  logStart('saveEnv', 'none');
  
  // Create shallow copy of current environment
  // Spread operator is efficient for this use case
  const savedEnv = { ...process.env };
  
  // Log success but mask actual environment data for security
  // Environment variables may contain sensitive information
  logReturn('saveEnv', 'env stored');
  return savedEnv;
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
  logStart('restoreEnv', 'env restore');
  
  // Step 1: Clear all current environment variables
  // This removes any variables that were added during testing
  Object.keys(process.env).forEach(k => delete process.env[k]);
  
  // Step 2: Restore the saved environment
  // Object.assign copies all properties from savedEnv to process.env
  Object.assign(process.env, savedEnv);
  
  logReturn('restoreEnv', true);
  return true; // Confirm successful restoration
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
  logStart('createScheduleMock', 'none');
  
  // Create mock function that immediately executes passed functions
  // This simulates a scheduler that processes jobs instantly
  const scheduleMock = function(fn) {
    return Promise.resolve(fn()); // Execute immediately and return result
  };
  
  // Add Jest-compatible methods if Jest environment is detected
  if (typeof jest !== 'undefined') {
    scheduleMock.mockClear = jest.fn(); // Jest spy clear method
    scheduleMock.mockReset = jest.fn(); // Jest spy reset method
  } else {
    // Provide no-op fallbacks for non-Jest environments
    // This prevents errors when tests call these methods
    scheduleMock.mockClear = () => {};
    scheduleMock.mockReset = () => {};
  }
  
  logReturn('createScheduleMock', 'mock');
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
  logStart('createQerrorsMock', 'none');
  
  // Mock function that captures and returns its arguments
  // This allows tests to inspect what was passed to error handlers
  const qerrorsMock = function(...args) {
    return args; // Return arguments for test inspection
  };
  
  // Add Jest-compatible methods for call tracking and reset
  if (typeof jest !== 'undefined') {
    qerrorsMock.mockReset = jest.fn();
    qerrorsMock.mockClear = jest.fn();
  } else {
    // No-op fallbacks for non-Jest environments
    qerrorsMock.mockReset = () => {};
    qerrorsMock.mockClear = () => {};
  }
  
  logReturn('createQerrorsMock', 'mock');
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
  logStart('createAxiosMock', 'none');
  
  // Simple axios mock adapter without external dependencies
  // Stores configured replies for different URLs and methods
  const mock = {
    /**
     * Configure mock response for GET requests to a specific URL
     * @param {string} url - URL to mock
     * @returns {Object} Reply configuration object
     */
    onGet: function(url) {
      return {
        reply: function(status, data) {
          // Store reply configuration for this URL
          this._replies = this._replies || {};
          this._replies[url] = { status, data };
          return this; // Allow method chaining
        }
      };
    },
    
    /**
     * Configure mock response for POST requests to a specific URL
     * @param {string} url - URL to mock
     * @returns {Object} Reply configuration object
     */
    onPost: function(url) {
      return {
        reply: function(status, data) {
          // Store reply configuration for this URL
          this._replies = this._replies || {};
          this._replies[url] = { status, data };
          return this; // Allow method chaining
        }
      };
    },
    
    /**
     * Reset all configured mocks
     * Essential for preventing test pollution
     */
    reset: function() {
      this._replies = {}; // Clear all stored replies
    }
  };
  
  logReturn('createAxiosMock', 'adapter');
  return mock;
}

/**
 * Resets all provided mocks to clean state
 * 
 * This utility function provides a centralized way to reset multiple
 * mocks at once. Essential for test cleanup and preventing interference
 * between test cases.
 * 
 * Defensive programming approach:
 * - Checks for method existence before calling
 * - Handles different mock types gracefully
 * - Won't throw errors if mocks are undefined or incomplete
 * 
 * Why centralized reset:
 * - Reduces boilerplate in test teardown
 * - Ensures consistent cleanup patterns
 * - Easier to maintain when mock interfaces change
 * 
 * @param {Object} mock - HTTP mock adapter with reset method
 * @param {Function} scheduleMock - Scheduler mock with Jest methods
 * @param {Function} qerrorsMock - Error handler mock with Jest methods
 * @returns {boolean} Always returns true to confirm reset completion
 */
function resetMocks(mock, scheduleMock, qerrorsMock) {
  logStart('resetMocks', 'mocks');
  
  // Reset HTTP adapter mock if it has reset capability
  if (mock && mock.reset) {
    mock.reset();
  }
  
  // Clear scheduler mock call history if available
  if (scheduleMock && scheduleMock.mockClear) {
    scheduleMock.mockClear();
  }
  
  // Clear error mock call history if available
  if (qerrorsMock && qerrorsMock.mockClear) {
    qerrorsMock.mockClear();
  }
  
  logReturn('resetMocks', true);
  return true; // Confirm all resets completed
}

/**
 * One-stop initialization for search/API testing scenarios
 * 
 * This convenience function sets up a complete test environment for
 * applications that make HTTP requests and use scheduling/error handling.
 * It combines multiple setup steps into a single call.
 * 
 * What it provides:
 * - Clean module state (Jest module reset)
 * - Test environment variables
 * - All common mocks configured and ready
 * 
 * Use case:
 * - Integration tests for search APIs
 * - Testing applications with multiple external dependencies
 * - Scenarios where you need full environment control
 * 
 * Why combine these specific elements:
 * - Common pattern in API testing
 * - Reduces test setup boilerplate
 * - Ensures consistent test environment
 * 
 * @returns {Object} Object containing all created mocks for individual control
 */
function initSearchTest() {
  logStart('initSearchTest', 'none');
  
  // Reset Jest modules if in Jest environment
  // This ensures clean module state for each test
  if (typeof jest !== 'undefined' && jest.resetModules) {
    jest.resetModules();
  }
  
  // Set up test environment with known values
  setTestEnv();
  
  // Create all common mocks for search/API testing
  const scheduleMock = createScheduleMock();
  const qerrorsMock = createQerrorsMock();
  const mock = createAxiosMock();
  
  logReturn('initSearchTest', 'mocks');
  
  // Return mocks for individual control in tests
  return { mock, scheduleMock, qerrorsMock };
}

// Export all functions for flexible test environment management
// Each function serves a specific purpose and can be used independently
// or in combination for complex test scenarios
module.exports = {
  setTestEnv,           // Set standard test environment variables
  saveEnv,              // Capture current environment for restoration
  restoreEnv,           // Restore previously saved environment
  createScheduleMock,   // Create scheduler/throttling mock
  createQerrorsMock,    // Create error handler mock
  createAxiosMock,      // Create HTTP client mock adapter
  resetMocks,           // Reset multiple mocks at once
  initSearchTest        // Complete setup for search/API testing
};
