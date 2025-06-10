
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

// Import logging utilities including wrapper for consistent logs
const { logStart, logReturn, executeWithLogs, setLogging } = require('../lib/logUtils'); //(import setLogging for optional disable)
if (process.env.NODE_ENV !== 'test') setLogging(false); //(mute logs outside tests)

const defaultEnv = { // (shared env defaults for tests)
  GOOGLE_API_KEY: 'key', // (fake google api key)
  GOOGLE_CX: 'cx', // (fake search cx)
  OPENAI_TOKEN: 'token' // (fake openai token)
};

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
  console.log(`setTestEnv is running with default values`); // logging function start per requirements
  
  try {
    Object.assign(process.env, defaultEnv); // apply default test environment variables
    console.log(`setTestEnv is returning true`); // logging return value per requirements
    return true;
  } catch (error) {
    console.log(`setTestEnv error: ${error.message}`); // error logging per requirements
    throw error;
  }
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
  console.log(`saveEnv is running with none`); // logging function start per requirements
  
  try {
    const savedEnv = { ...process.env }; // spread operator for shallow copy of environment
    console.log(`saveEnv is returning ${savedEnv}`); // logging return value per requirements
    return savedEnv;
  } catch (error) {
    console.log(`saveEnv error: ${error.message}`); // error logging per requirements
    throw error;
  }
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
  console.log(`restoreEnv is running with ${savedEnv}`); // logging function start per requirements
  
  try {
    Object.keys(process.env).forEach(k => delete process.env[k]); // clear current environment variables
    Object.assign(process.env, savedEnv); // restore saved environment state
    console.log(`restoreEnv is returning true`); // logging return value per requirements
    return true;
  } catch (error) {
    console.log(`restoreEnv error: ${error.message}`); // error logging per requirements
    throw error;
  }
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
function attachMockSpies(mock) {
  console.log(`attachMockSpies is running with ${mock}`); // logging function start per requirements
  
  try {
    if (typeof jest !== `undefined`) { // verify jest availability with backticks
      mock.mockClear = jest.fn(); // assign jest spy clear method
      mock.mockReset = jest.fn(); // assign jest spy reset method
    } else {
      mock.mockClear = () => {}; // fallback noop clear in non-jest environments
      mock.mockReset = () => {}; // fallback noop reset in non-jest environments
    }
    console.log(`attachMockSpies is returning ${mock}`); // logging return value per requirements
    return mock;
  } catch (error) {
    console.log(`attachMockSpies error: ${error.message}`); // error logging per requirements
    throw error;
  }
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
function makeLoggedMock(name, creator) {
  console.log(`makeLoggedMock is running with ${name}, ${creator}`); // logging function start per requirements
  
  try {
    const mock = creator(); // create raw mock using provided creator function
    attachMockSpies(mock); // add jest spies if available
    console.log(`makeLoggedMock is returning ${mock}`); // logging return value per requirements
    return mock;
  } catch (error) {
    console.log(`makeLoggedMock error: ${error.message}`); // error logging per requirements
    throw error;
  }
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
  console.log(`createScheduleMock is running with none`); // logging function start per requirements
  
  try {
    const scheduleMock = function(fn) { // immediate scheduler mock function
      return Promise.resolve(fn()); // execute and resolve instantly for fast tests
    };
    attachMockSpies(scheduleMock); // add jest spies if available
    console.log(`createScheduleMock is returning ${scheduleMock}`); // logging return value per requirements
    return scheduleMock;
  } catch (error) {
    console.log(`createScheduleMock error: ${error.message}`); // error logging per requirements
    throw error;
  }
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
  console.log(`createQerrorsMock is running with none`); // logging function start per requirements
  
  try {
    const qerrorsMock = function(...args) { // capture arguments for inspection
      return args; // return arguments for test inspection
    };
    attachMockSpies(qerrorsMock); // add jest spies if available
    console.log(`createQerrorsMock is returning ${qerrorsMock}`); // logging return value per requirements
    return qerrorsMock;
  } catch (error) {
    console.log(`createQerrorsMock error: ${error.message}`); // error logging per requirements
    throw error;
  }
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
  return executeWithLogs('resetMocks', () => { //(wrap mock resets in logger)
    if (mock && mock.reset) {
      mock.reset();
    }
    if (scheduleMock && scheduleMock.mockClear) {
      scheduleMock.mockClear();
    }
    if (qerrorsMock && qerrorsMock.mockClear) {
      qerrorsMock.mockClear();
    }
    return true; //(confirm completion)
  }, 'mocks');
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
  return executeWithLogs('initSearchTest', () => { //(wrap full init in logger)
    if (typeof jest !== 'undefined' && jest.resetModules) {
      jest.resetModules();
    }
    setTestEnv();
    const scheduleMock = createScheduleMock();
    const qerrorsMock = createQerrorsMock();
    const mock = createAxiosMock();
    return { mock, scheduleMock, qerrorsMock }; // (provide mocks)
  }, 'none');
}

// export all test environment functions at bottom per requirements
module.exports = {
  defaultEnv, // default test environment values
  setTestEnv, // set standard test environment variables
  saveEnv, // capture current environment for restoration
  restoreEnv, // restore previously saved environment
  attachMockSpies, // attach jest spy helpers to mocks
  makeLoggedMock, // factory for creating logged mocks
  createScheduleMock, // create scheduler/throttling mock
  createQerrorsMock, // create error handler mock
  createAxiosMock, // create http client mock adapter
  resetMocks, // reset multiple mocks at once
  initSearchTest // complete setup for search/api testing
};
