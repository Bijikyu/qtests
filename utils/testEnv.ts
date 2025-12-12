/**
 * Test Environment Management Utilities - TypeScript Implementation
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
import { executeWithLogs, setLogging } from '../lib/logUtils.js';
if (process.env.NODE_ENV !== 'test') setLogging(false); // mute logs outside tests

// Import dotenv for environment variable management
import dotenv from 'dotenv';

interface DefaultEnv {
  GOOGLE_API_KEY: string;
  GOOGLE_CX: string;
  OPENAI_TOKEN: string;
}

interface MockSpy {
  mockClear?: () => void;
  mockReset?: () => void;
}

interface AxiosMock {
  onGet: (url: string) => ReplyBinder;
  onPost: (url: string) => ReplyBinder;
  reset: () => void;
  _replies: Record<string, { status: number; data: any }>;
}

interface ReplyBinder {
  reply: (status: number, data: any) => AxiosMock;
}

const defaultEnv: DefaultEnv = { // shared env defaults for tests
  GOOGLE_API_KEY: 'key', // fake google api key
  GOOGLE_CX: 'cx', // fake search cx
  OPENAI_TOKEN: 'token' // fake openai token
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
 * @returns Always returns true to confirm environment was set
 */
function setTestEnv(): boolean {
  console.log(`setTestEnv is running with default values`); // logging function start per requirements
  
  try {
    // Load environment variables from .env file if it exists using dotenv
    // dotenv provides standardized environment variable management from .env files
    // This replaces manual environment variable loading with established npm module
    dotenv.config();
    
    // Apply default test environment variables using Object.assign for atomic operation
    // Object.assign chosen over individual assignments for performance and atomicity
    // All environment variables are set together to prevent partial states
    // Overwrites existing values to ensure predictable test environment regardless of host setup
    Object.assign(process.env, defaultEnv);
    console.log(`setTestEnv is returning true`); // logging return value per requirements
    return true;
  } catch (error: any) {
    // Log error context for debugging environment setup issues
    // Environment variable assignment rarely fails but can occur with read-only process.env
    // Error re-throwing maintains contract while providing diagnostic information
    console.log(`setTestEnv error: ${error.message}`);
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
 * @returns Copy of current environment variables
 */
function saveEnv(): Record<string, string | undefined> {
  console.log(`saveEnv is running with none`); // logging function start per requirements
  
  try {
    // Create shallow copy of process.env using spread operator
    // Spread operator chosen over Object.assign for conciseness and readability
    // Shallow copy is sufficient because environment variables are always string primitives
    // Snapshot taken immediately to capture current state, not when restore is called
    // This timing ensures we get the exact environment state at the moment of saving
    const savedEnv = { ...process.env };
    console.log(`saveEnv is returning ${savedEnv}`); // logging return value per requirements
    return savedEnv;
  } catch (error: any) {
    // Handle rare cases where process.env access might fail
    // Possible issues include permission restrictions or corrupted environment
    // Error logging provides diagnostic context for environment capture failures
    console.log(`saveEnv error: ${error.message}`);
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
 * @param savedEnv - Previously saved environment from saveEnv()
 * @returns Always returns true to confirm restoration
 */
function restoreEnv(savedEnv: Record<string, string | undefined>): boolean {
  console.log(`restoreEnv is running with ${savedEnv}`); // logging function start per requirements

  try {
    // Validate the saved environment to avoid runtime errors
    if (!savedEnv || typeof savedEnv !== 'object') {
      console.log(`restoreEnv: invalid saved environment`); // log invalid input
      return false; // indicate failure to restore
    }

    // Determine which variables were added after the backup was taken
    const currentKeys = new Set(Object.keys(process.env)); // capture current keys
    const backupKeys = new Set(Object.keys(savedEnv)); // capture backup keys

    // Remove only those keys that did not exist at backup time
    for (const key of currentKeys) {
      if (!backupKeys.has(key)) delete process.env[key]; // remove added variables only
    }

    // Restore backed up variables to their original values without wiping others
    for (const [key, value] of Object.entries(savedEnv)) {
      if (value !== undefined) process.env[key] = value; else delete process.env[key]; // reinstate or delete per backup
    }

    console.log(`restoreEnv is returning true`); // logging return value per requirements
    return true;
  } catch (error: any) {
    console.log(`restoreEnv error: ${error.message}`); // log restoration failure
    throw error; // propagate error to caller
  }
}

/**
 * Attach Jest spy helpers to a mock when available
 *
 * Reduces duplication by centralizing the environment check and method creation
 * for mocks that require mockClear and mockReset methods.
 *
 * @param mock - Mock or spy object to enhance
 * @returns The same mock enhanced with spy methods
 */
function attachMockSpies<T extends MockSpy>(mock: T): T {
  console.log(`attachMockSpies is running with ${mock}`); // logging function start per requirements
  
  try {
    // Check for Jest availability and enhance mock with Jest-compatible methods
    // This pattern ensures consistent API across testing environments while leveraging Jest features when available
    // typeof check prevents ReferenceError in environments where Jest is not loaded
    if (typeof jest !== `undefined`) {
      // Add Jest spy methods for enhanced testing capabilities
      // jest.fn() creates proper Jest mock functions with full spy capabilities
      // These methods integrate with Jest's assertion and debugging tools
      // Provides mockClear and mockReset functionality expected by Jest users
      mock.mockClear = jest.fn();
      mock.mockReset = jest.fn();
    } else {
      // Provide no-op implementations for non-Jest environments
      // Maintains API compatibility so the same test code works across frameworks
      // No-op functions prevent errors when tests call these methods
      // Arrow functions used for minimal overhead and clear intent
      mock.mockClear = () => {};
      mock.mockReset = () => {};
    }
    console.log(`attachMockSpies is returning ${mock}`); // logging return value per requirements
    return mock;
  } catch (error: any) {
    // Handle cases where Jest enhancement fails or mock modification errors occur
    // Important for debugging framework integration issues
    // Error re-throwing maintains proper error handling contract
    console.log(`attachMockSpies error: ${error.message}`);
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
 * @param name - Identifier used for logging
 * @param creator - Function that returns the raw mock
 * @returns Mock enhanced with spy helpers
 */
function makeLoggedMock<T extends MockSpy>(name: string, creator: () => T): T {
  console.log(`makeLoggedMock is running with ${name}, ${creator}`); // logging function start per requirements
  
  try {
    const mock = creator(); // create raw mock using provided creator function
    attachMockSpies(mock); // add jest spies if available
    console.log(`makeLoggedMock is returning ${mock}`); // logging return value per requirements
    return mock;
  } catch (error: any) {
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
 * @returns Mock scheduler function with Jest-compatible methods
 */
function createScheduleMock(): Function & MockSpy {
  console.log(`createScheduleMock is running with none`); // logging function start per requirements
  
  try {
    const scheduleMock = function(fn: Function): Promise<any> { // immediate scheduler mock function
      return Promise.resolve(fn()); // execute and resolve instantly for fast tests
    } as Function & MockSpy;
    attachMockSpies(scheduleMock); // add jest spies if available
    console.log(`createScheduleMock is returning ${scheduleMock}`); // logging return value per requirements
    return scheduleMock;
  } catch (error: any) {
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
 * @returns Mock error handler with Jest-compatible methods
 */
function createQerrorsMock(): Function & MockSpy {
  console.log(`createQerrorsMock is running with none`); // logging function start per requirements
  
  try {
    const qerrorsMock = function(...args: any[]): any[] { // capture arguments for inspection
      return args; // return arguments for test inspection
    } as Function & MockSpy;
    attachMockSpies(qerrorsMock); // add jest spies if available
    console.log(`createQerrorsMock is returning ${qerrorsMock}`); // logging return value per requirements
    return qerrorsMock;
  } catch (error: any) {
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
 * @returns Mock adapter with onGet, onPost, and reset methods
 */
function createAxiosMock(): AxiosMock & MockSpy {
  return makeLoggedMock('createAxiosMock', () => { // log and spy helper
    const mock = { // declare mock before binder so binder can reference it
      /**
       * Configure mock response for GET requests to a specific URL
       * @param url - URL to mock
       * @returns Reply configuration object
       */
      onGet: function(url: string): ReplyBinder {
        return createReplyBinder(url); // delegate to reply binder
      },
      
      /**
       * Configure mock response for POST requests to a specific URL
       * @param url - URL to mock
       * @returns Reply configuration object
       */
      onPost: function(url: string): ReplyBinder {
        return createReplyBinder(url); // use common binder for post
      },
      
      /**
       * Reset all configured mocks
       * Essential for preventing test pollution
       */
      reset: function(): void {
        mock._replies = {}; // clear stored replies on adapter
      },
      
      _replies: {} as Record<string, { status: number; data: any }>
    } as AxiosMock & MockSpy;
    
    function createReplyBinder(url: string): ReplyBinder { // helper after mock exists to avoid reference errors
      return { // return object with reply method
        reply: function(status: number, data: any): AxiosMock { // store status and data for url
          mock._replies[url] = { status, data }; // bind response to url
          return mock; // allow chaining
        }
      }; // close returned object
    }
    return mock; // returned to helper for spies
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
 * @param mock - HTTP mock adapter with reset method
 * @param scheduleMock - Scheduler mock with Jest methods
 * @param qerrorsMock - Error handler mock with Jest methods
 * @returns Always returns true to confirm reset completion
 */
function resetMocks(
  mock?: AxiosMock, 
  scheduleMock?: Function & MockSpy, 
  qerrorsMock?: Function & MockSpy
): boolean {
  return executeWithLogs('resetMocks', () => { // wrap mock resets in logger
    if (mock && mock.reset) {
      mock.reset();
    }
    if (scheduleMock && scheduleMock.mockClear) {
      scheduleMock.mockClear();
    }
    if (qerrorsMock && qerrorsMock.mockClear) {
      qerrorsMock.mockClear();
    }
    return true; // confirm completion
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
 * @returns Object containing all created mocks for individual control
 */
function initSearchTest(): {
  mock: AxiosMock & MockSpy;
  scheduleMock: Function & MockSpy;
  qerrorsMock: Function & MockSpy;
} {
  return executeWithLogs('initSearchTest', () => { // wrap full init in logger
    if (typeof jest !== 'undefined' && jest.resetModules) {
      jest.resetModules();
    }
    setTestEnv();
    const scheduleMock = createScheduleMock();
    const qerrorsMock = createQerrorsMock();
    const mock = createAxiosMock();
    return { mock, scheduleMock, qerrorsMock }; // provide mocks
  }, 'none');
}

// Export all test environment functions using ES module syntax
export {
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