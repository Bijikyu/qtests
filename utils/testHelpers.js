
/**
 * Advanced Test Helpers for qtests
 * 
 * This module provides specialized testing utilities for complex scenarios
 * that require module reloading, response mocking, environment management,
 * and external service stubbing. These helpers are designed for integration
 * testing and scenarios where basic stubs aren't sufficient.
 * 
 * Key capabilities:
 * - Module cache management for isolated testing
 * - HTTP response object mocking for Express-style apps
 * - Environment variable backup/restore for test isolation
 * - qerrors stubbing for offline testing
 * - Integration test helpers for API endpoints
 * 
 * Design philosophy:
 * - Each function is self-contained and can be used independently
 * - Comprehensive logging for debugging test failures
 * - Error handling with proper propagation
 * - Compatible with common testing frameworks (Jest, Mocha, etc.)
 */

const path = require('path');

/**
 * Stubs qerrors.qerrors method to silence error reporting during tests
 * 
 * This function replaces the qerrors.qerrors method with a no-op function
 * to prevent error reporting to external services during testing. Also
 * forces reload of the offline module to pick up the stubbed qerrors.
 * 
 * Use cases:
 * - Testing error handling without external service calls
 * - Preventing test pollution from error reporting
 * - Offline testing of applications that use qerrors
 * 
 * Note: Requires Node.js test module (available in Node 18+)
 * For older Node versions, use sinon or jest.spyOn instead
 * 
 * @throws {Error} If qerrors module cannot be required or stubbed
 */
function stubQerrors() {
  console.log(`stubQerrors is running with none`); // Log start of stubQerrors
  try {
    const qerrors = require('qerrors'); // Require qerrors module
    
    // Use Node.js built-in test mocking if available, fallback to manual stub
    if (typeof test !== 'undefined' && test.mock) {
      test.mock.method(qerrors, 'qerrors', () => {}); // Stub qerrors.qerrors
    } else {
      // Fallback for environments without Node.js test module
      qerrors.qerrors = () => {}; // Manual stub assignment
    }
    
    // Force offline module reload to pick up stubbed qerrors
    try {
      delete require.cache[require.resolve('../utils/offlineMode')]; // Force offline module reload
    } catch (resolveError) {
      // If offline module path doesn't resolve, try alternative paths
      console.log(`Could not clear offlineMode cache: ${resolveError.message}`);
    }
    
    console.log(`stubQerrors is returning undefined`); // Log completion
  } catch (err) {
    console.log(`stubQerrors error ${err.message}`); // Log error
    throw err; // Propagate error
  }
}

/**
 * Reloads a module from cache for isolated testing
 * 
 * This function clears a module from the require cache and requires it fresh.
 * Essential for testing modules that maintain state or when you need to test
 * module initialization with different conditions.
 * 
 * Use cases:
 * - Testing module initialization with different environment variables
 * - Clearing singleton state between tests
 * - Testing module behavior with different mocked dependencies
 * - Forcing re-evaluation of module-level code
 * 
 * @param {string} relPath - Path relative to the test helpers directory
 * @returns {any} The freshly required module
 * @throws {Error} If module cannot be resolved or required
 */
function reload(relPath) {
  console.log(`reload is running with ${relPath}`); // Log start of reload
  try {
    const fullPath = path.resolve(__dirname, relPath); // Resolve relative to helpers
    delete require.cache[require.resolve(fullPath)]; // Clear module from cache
    const mod = require(fullPath); // Require module afresh
    console.log(`reload is returning module`); // Log completion
    return mod; // Return reloaded module
  } catch (err) {
    console.log(`reload error ${err.message}`); // Log error
    throw err; // Propagate error
  }
}

/**
 * Creates a minimal response object with json spy for basic testing
 * 
 * This function creates a simple response mock with just a json method
 * that can be spied on. Useful for basic tests that only need to verify
 * JSON responses were called.
 * 
 * @returns {Object} Response mock with json spy method
 * @throws {Error} If mock creation fails
 */
function createJsonRes() {
  console.log(`createJsonRes is running with none`); // Log start of createJsonRes
  try {
    let jsonSpy;
    
    // Use Node.js test module if available, otherwise create manual spy
    if (typeof test !== 'undefined' && test.mock) {
      jsonSpy = test.mock.fn(); // Create json stub response using Node.js test
    } else {
      // Fallback manual spy for environments without Node.js test module
      const calls = [];
      jsonSpy = function(...args) {
        calls.push(args);
        return this;
      };
      jsonSpy.mock = { calls }; // Jest-compatible interface
    }
    
    const res = { json: jsonSpy };
    console.log(`createJsonRes is returning res`); // Log completion
    return res; // Return response mock
  } catch (err) {
    console.log(`createJsonRes error ${err.message}`); // Log error
    throw err; // Propagate error
  }
}

/**
 * Creates a comprehensive Express-style response mock
 * 
 * This function creates a full-featured response object that mimics
 * Express.js response objects. Includes common methods like status(),
 * json(), render(), and send() with proper chaining and state tracking.
 * 
 * Features:
 * - Chainable status() method
 * - Tracked json() calls with payload storage
 * - Mock render() and send() methods
 * - Express-compatible locals and headersSent properties
 * 
 * Use cases:
 * - Testing Express route handlers
 * - Verifying response status codes and payloads
 * - Integration testing of middleware chains
 * - Testing template rendering calls
 * 
 * @returns {Object} Full Express-style response mock
 * @throws {Error} If mock creation fails
 */
function createRes() {
  console.log(`createRes is running with none`); // Log start of createRes
  try {
    const res = { locals: {}, headersSent: false }; // Init defaults
    
    // Status method with chaining support
    res.status = (code) => { 
      res.statusCode = code; 
      return res; 
    }; // Status mock
    
    // Create mock functions based on available testing framework
    if (typeof test !== 'undefined' && test.mock) {
      // Use Node.js test module
      res.json = test.mock.fn(payload => { 
        res.jsonPayload = payload; 
        res.payload = payload; 
        return res; 
      }); // JSON mock with tracker
      res.render = test.mock.fn(); // Render stub
      res.send = test.mock.fn(); // Send stub
    } else {
      // Fallback manual mocks for environments without Node.js test module
      const createManualMock = (name, impl) => {
        const calls = [];
        const mockFn = function(...args) {
          calls.push(args);
          return impl ? impl.apply(this, args) : this;
        };
        mockFn.mock = { calls }; // Jest-compatible interface
        return mockFn;
      };
      
      res.json = createManualMock('json', payload => {
        res.jsonPayload = payload;
        res.payload = payload;
        return res;
      });
      res.render = createManualMock('render');
      res.send = createManualMock('send');
    }
    
    console.log(`createRes is returning res`); // Log completion
    return res; // Return res object
  } catch (err) {
    console.log(`createRes error ${err.message}`); // Log error
    throw err; // Propagate error
  }
}

/**
 * Helper to call /api/generate-key endpoint for integration tests
 * 
 * This function makes a POST request to the /api/generate-key endpoint
 * using supertest, which is commonly used for API integration testing.
 * Encapsulates the request setup and provides consistent error handling.
 * 
 * Use cases:
 * - Integration testing of API key generation endpoints
 * - Testing API authentication flows
 * - Verifying endpoint response formats and status codes
 * 
 * @param {Object} app - Express application instance
 * @param {string} allowedApi - API identifier for key generation
 * @returns {Promise<Object>} Supertest response object
 * @throws {Error} If request fails or supertest is not available
 */
async function generateKey(app, allowedApi) {
  console.log(`generateKey is running with ${allowedApi}`); // Log start of generateKey
  try {
    // Dynamic require to avoid hard dependency on supertest
    const request = require('supertest');
    const res = await request(app)
      .post('/api/generate-key')
      .send({ allowedApi });
    console.log(`generateKey is returning ${res.statusCode}`); // Log completion
    return res; // Return server response
  } catch (err) {
    console.log(`generateKey error ${err.message}`); // Log error
    throw err; // Propagate error
  }
}

/**
 * Environment variable backup storage
 * Holds captured environment variables for restoration
 */
let envBackup; // Holds captured variables

/**
 * Captures current environment variable values for later restoration
 * 
 * This function takes a snapshot of specified environment variables
 * so they can be restored after test modifications. Essential for
 * preventing test pollution when tests modify environment state.
 * 
 * Use cases:
 * - Testing environment-dependent code paths
 * - Isolating tests that modify global environment
 * - Ensuring clean state between test runs
 * - Testing configuration loading with different env vars
 * 
 * @param {...string} names - Environment variable names to backup
 * @throws {Error} If backup operation fails
 */
function backupEnvVars(...names) {
  console.log(`backupEnvVars is running with ${names}`); // Start log
  try {
    envBackup = {}; // Init backup container
    names.forEach(n => { 
      envBackup[n] = process.env[n]; 
    }); // Store each value
    console.log(`backupEnvVars is returning undefined`); // End log
  } catch (err) {
    console.log(`backupEnvVars error ${err.message}`); // Log error
    throw err; // Propagate
  }
}

/**
 * Restores previously backed up environment variables
 * 
 * This function restores environment variables that were previously
 * captured with backupEnvVars(). Properly handles both undefined
 * values (deletes the env var) and defined values (sets the env var).
 * 
 * Use cases:
 * - Cleaning up after tests that modify environment
 * - Ensuring test isolation and repeatability
 * - Restoring original configuration after test scenarios
 * 
 * @throws {Error} If restore operation fails
 */
function restoreEnvVars() {
  console.log(`restoreEnvVars is running with none`); // Start log
  try {
    if (!envBackup) { 
      console.log(`restoreEnvVars is returning undefined`); 
      return; 
    } // No backup available
    
    Object.keys(envBackup).forEach(n => {
      if (envBackup[n] === undefined) {
        delete process.env[n]; // Remove env var if it was undefined
      } else {
        process.env[n] = envBackup[n]; // Restore original value
      }
    }); // Apply backups
    
    console.log(`restoreEnvVars is returning undefined`); // End log
  } catch (err) {
    console.log(`restoreEnvVars error ${err.message}`); // Log error
    throw err; // Propagate
  }
}

/**
 * Export all test helper utilities
 * 
 * This module provides advanced testing utilities that complement
 * the basic stubs and mocks in qtests. Each function is designed
 * to be used independently and can be mixed and matched based on
 * testing needs.
 * 
 * Usage examples:
 * const { reload, createRes, backupEnvVars } = require('qtests/utils/testHelpers');
 * 
 * backupEnvVars('API_KEY', 'DEBUG');
 * process.env.API_KEY = 'test-key';
 * const freshModule = reload('../myModule');
 * const mockResponse = createRes();
 * // ... run tests
 * restoreEnvVars();
 */
module.exports = {
  stubQerrors,      // Stub qerrors for offline testing
  reload,           // Module cache management for isolated testing
  createJsonRes,    // Minimal response mock with JSON spy
  createRes,        // Full Express-style response mock
  generateKey,      // Integration test helper for API endpoints
  backupEnvVars,    // Environment variable backup
  restoreEnvVars    // Environment variable restoration
};
