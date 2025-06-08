

/**
 * Advanced Testing Helper Utilities
 * 
 * This module provides specialized utilities for complex testing scenarios
 * including module reloading, response object mocking, and integration test
 * helpers. These functions handle edge cases and advanced patterns that
 * basic stubbing utilities cannot address.
 * 
 * Design philosophy:
 * - Handle complex testing scenarios that require specialized approaches
 * - Provide framework compatibility across different testing environments
 * - Support both Jest and vanilla Node.js testing setups
 * - Enable integration testing patterns with minimal configuration
 * 
 * Why these utilities exist:
 * 1. Module cache management: Node.js caches required modules, making it
 *    difficult to test module loading and reloading scenarios
 * 2. Response object mocking: Express-style response objects are complex
 *    and require specific mock implementations for testing
 * 3. Integration testing: Some tests need to verify real module interactions
 *    while still controlling certain dependencies
 * 4. Framework compatibility: Tests should work regardless of Jest availability
 * 
 * Target scenarios:
 * - Testing module loading and configuration scenarios
 * - API route testing with Express-style response objects
 * - Integration tests that need partial mocking
 * - Cross-framework test compatibility requirements
 */

// Import path utilities for robust file path resolution
// Using path.resolve ensures correct path handling across different operating systems
// and prevents issues with relative path interpretation in test environments
const path = require('path');
const { mockConsole } = require('./mockConsole'); // (import console spy utility)

/**
 * Stub qerrors.qerrors method to silence error reporting during tests
 * 
 * This function replaces the qerrors.qerrors method with a no-op function
 * to prevent error reporting network calls and log output during testing.
 * It also forces a reload of the offline module to ensure it picks up
 * the stubbed qerrors implementation.
 * 
 * Implementation strategy:
 * 1. Check for Node.js test module availability (preferred)
 * 2. Fall back to manual stubbing for non-test environments
 * 3. Force module cache clearing to ensure stub is used
 * 4. Provide detailed logging for debugging test setup issues
 * 
 * Why stub qerrors specifically:
 * - Error reporting often involves network requests to logging services
 * - Tests should not make real network calls to error reporting systems
 * - Error reporting side effects can cause test failures or pollution
 * - Silencing allows testing of error handling logic without external dependencies
 * 
 * Why force offline module reload:
 * - The offline module may have already required qerrors before stubbing
 * - Module cache prevents the stub from taking effect
 * - Forcing reload ensures offline module uses the stubbed version
 * - This enables proper offline mode testing behavior
 * 
 * @returns {undefined} This is a side-effect function with no return value
 * 
 * @example
 * stubQerrors();
 * // Now qerrors.qerrors() calls will be silent
 * // And offline module will use stubbed qerrors
 */
function stubQerrors() {
  // Log function start for debugging test setup timing
  console.log(`stubQerrors is running with none`);
  
  try {
    // Attempt to require qerrors module for stubbing
    // This may fail if qerrors is not installed, which is handled gracefully
    const qerrors = require('qerrors');
    
    // Check if Node.js test module is available for superior mocking
    if (typeof test !== 'undefined' && test.mock && test.mock.method) {
      // Use Node.js test module's mock.method for automatic cleanup
      // This approach provides better integration with Node.js testing infrastructure
      test.mock.method(qerrors, 'qerrors', () => {});
    } else {
      // Fall back to manual stubbing for environments without test module
      // Store original method for potential future restoration needs
      qerrors.qerrors = () => {};
    }
    
    // Force offline module to reload and pick up the stubbed qerrors
    // This must happen after stubbing to ensure the module gets the stub version
    // Using require.resolve ensures we get the correct path for cache deletion
    delete require.cache[require.resolve('./offlineMode')]; //(ensure offlineMode reloaded)
    
    // Log successful completion for debugging
    console.log(`stubQerrors is returning undefined`);
    
  } catch (err) {
    // Log error with descriptive context for debugging
    // qerrors is often optional, so this may be expected in some environments
    console.log(`stubQerrors error ${err.message}`);
    
    // Propagate error to caller for handling
    // Allows calling code to decide how to handle missing qerrors
    throw err;
  }
}

/**
 * Reload a module from cache for isolated testing
 * 
 * This function clears a module from Node.js require cache and reloads it,
 * enabling tests to verify module loading behavior and ensure fresh module
 * state between tests. This is essential for testing module initialization
 * and configuration scenarios.
 * 
 * Implementation approach:
 * 1. Resolve relative path to absolute path for reliable cache lookup
 * 2. Clear the module from require cache to force fresh loading
 * 3. Require the module again to get a fresh instance
 * 4. Return the reloaded module for use in tests
 * 
 * Why module reloading is necessary:
 * - Node.js caches required modules to improve performance
 * - Cached modules retain state from previous requires
 * - Tests may need to verify module initialization behavior
 * - Some modules behave differently on first load vs subsequent loads
 * - Configuration changes may not take effect without reloading
 * 
 * Path resolution strategy:
 * - Use path.resolve to convert relative paths to absolute paths
 * - Resolve relative to the testHelpers module location (__dirname)
 * - This ensures consistent behavior regardless of where tests are run from
 * - Prevents issues with different working directories in test environments
 * 
 * @param {string} relPath - Relative path to module that should be reloaded
 * @returns {Object} The freshly loaded module object
 * @throws {Error} If module cannot be found or loaded
 * 
 * @example
 * const freshModule = reload('../utils/offlineMode');
 * // freshModule is a newly loaded instance, not cached
 */
function reload(relPath) {
  // Log function entry with parameter for debugging module loading issues
  console.log(`reload is running with ${relPath}`);
  
  try {
    // Convert relative path to absolute path for reliable cache operations
    // Using __dirname ensures path is resolved relative to this testHelpers module
    // This prevents issues when tests are run from different working directories
    const fullPath = path.resolve(__dirname, relPath);
    
    // Remove module from require cache to force fresh loading
    // require.resolve ensures we use the same path resolution as require()
    // This is critical - if paths don't match exactly, cache clearing fails
    delete require.cache[require.resolve(fullPath)];
    
    // Require the module fresh from disk
    // This will re-execute the module's initialization code
    // Any module-level variables will be reset to initial values
    const mod = require(fullPath);
    
    // Log successful completion for debugging
    console.log(`reload is returning module`);
    
    // Return the freshly loaded module
    return mod;
    
  } catch (err) {
    // Log error with context for debugging path resolution issues
    console.log(`reload error ${err.message}`);
    
    // Propagate error to caller
    // Module loading failures should halt tests to prevent confusing behavior
    throw err;
  }
}

/**
 * Execute a callback with a mocked console method
 *
 * This helper creates a console spy using mockConsole, runs the callback,
 * then restores the original console method. It simplifies tests that need
 * temporary console interception.
 *
 * @param {string} method - Console method name to spy on
 * @param {Function} fn - Callback to execute with the spy
 * @returns {Promise<*>} Result returned by the callback
 *
 * @example
 * await withMockConsole('log', spy => { console.log('hi'); });
 */
async function withMockConsole(method, fn) {
  const spy = mockConsole(method); //(create console spy)
  console.log(`withMockConsole is running with ${method}`); //(log after spy setup)
  try {
    const result = await fn(spy);
    console.log(`withMockConsole is returning ${result}`); //(log before restore moved to finally)
    return result;
  } catch (err) {
    console.log(`withMockConsole error ${err.message}`);
    throw err;
  } finally {
    if (spy.mockRestore) { spy.mockRestore(); } //(ensure restoration if error)
  }
}

/**
 * Create minimal response object with json spy for API testing
 * 
 * This function creates a minimal Express-style response object with a
 * spied json method, enabling verification of API response behavior
 * without requiring a full Express application setup.
 * 
 * Implementation strategy:
 * 1. Check for Jest availability and use its superior spy functionality
 * 2. Fall back to manual call tracking for non-Jest environments
 * 3. Provide consistent API regardless of underlying implementation
 * 4. Include only essential response methods for API testing
 * 
 * Why minimal implementation:
 * - API tests often only need to verify json() method calls
 * - Full Express response objects are complex with many methods
 * - Minimal implementation reduces test complexity and potential conflicts
 * - Easy to understand and debug when tests fail
 * 
 * Spy functionality rationale:
 * - Tests need to verify what data was sent in response
 * - Call count verification ensures response methods are called correctly
 * - Argument capture allows assertion on response data structure
 * - Compatible interface works with both Jest and manual testing
 * 
 * @returns {Object} Mock response object with spied json method
 * 
 * @example
 * const res = createJsonRes();
 * apiHandler(req, res);
 * expect(res.json.mock.calls.length).toBe(1);
 * expect(res.json.mock.calls[0][0]).toEqual({ success: true });
 */
function createJsonRes() {
  // Log function start for debugging mock creation
  console.log(`createJsonRes is running with none`);
  
  try {
    let jsonSpy;
    
    // Check if Jest is available for superior spy functionality
    if (typeof jest !== 'undefined' && jest.fn) {
      // Use Jest's spy functionality for advanced call tracking
      // Jest spies provide more features like call history, return value control
      jsonSpy = jest.fn();
    } else {
      // Create manual spy implementation for non-Jest environments
      // This provides basic call tracking compatible with Jest interface
      const calls = [];
      
      // Create function that tracks calls manually
      jsonSpy = function(...args) {
        // Store all arguments for later verification
        calls.push(args);
      };
      
      // Add Jest-compatible mock property for consistent API
      jsonSpy.mock = { calls: calls };
    }
    
    // Log successful creation for debugging
    console.log(`createJsonRes is returning response object`);
    
    // Return minimal response object with spied json method
    // Only includes json method as it's the most commonly tested response method
    return { json: jsonSpy };
    
  } catch (err) {
    // Log error with context for debugging
    console.log(`createJsonRes error ${err.message}`);
    
    // Propagate error to caller
    throw err;
  }
}

/**
 * Create comprehensive Express-style response mock for integration testing
 * 
 * This function creates a more complete Express-style response object
 * suitable for comprehensive API testing scenarios. It includes multiple
 * response methods and proper call tracking for complex test scenarios.
 * 
 * Implementation philosophy:
 * - Provide enough functionality to handle most Express response patterns
 * - Maintain compatibility with both Jest and non-Jest environments
 * - Include commonly used response methods (status, json, send, etc.)
 * - Enable call verification and argument capture for thorough testing
 * 
 * Why comprehensive vs minimal:
 * - Integration tests often use multiple response methods
 * - Some middleware expects specific response methods to exist
 * - Comprehensive mock prevents "method not found" errors
 * - Allows testing of complete request/response cycles
 * 
 * Method selection rationale:
 * - status(): Essential for HTTP status code testing
 * - json(): Most common data response method
 * - send(): Alternative data response method
 * - end(): Response termination method
 * - These four methods cover 90% of Express response usage patterns
 * 
 * @returns {Object} Comprehensive response mock with multiple spied methods
 * 
 * @example
 * const res = createRes();
 * expressHandler(req, res);
 * expect(res.status.mock.calls[0][0]).toBe(200);
 * expect(res.json.mock.calls[0][0]).toEqual({ data: 'test' });
 */
function createRes() {
  // Log function start for debugging mock creation
  console.log(`createRes is running with none`);
  
  try {
    let responseMock;
    
    // Check for Jest availability
    if (typeof jest !== 'undefined' && jest.fn) {
      // Create Jest-based response mock with spied methods
      responseMock = {
        // HTTP status code setter with chaining support
        status: jest.fn().mockReturnThis(), // Returns this for method chaining
        
        // JSON response method
        json: jest.fn().mockReturnThis(),
        
        // General response method for any data type
        send: jest.fn().mockReturnThis(),
        
        // Response termination method
        end: jest.fn().mockReturnThis()
      };
    } else {
      // Create manual implementation for non-Jest environments
      // Each method needs its own call tracking array
      const statusCalls = [];
      const jsonCalls = [];
      const sendCalls = [];
      const endCalls = [];
      
      // Build response object with manual call tracking
      responseMock = {
        // Status method with call tracking and chaining
        status: function(...args) {
          statusCalls.push(args);
          return this; // Enable method chaining
        },
        
        // JSON method with call tracking and chaining
        json: function(...args) {
          jsonCalls.push(args);
          return this;
        },
        
        // Send method with call tracking and chaining
        send: function(...args) {
          sendCalls.push(args);
          return this;
        },
        
        // End method with call tracking and chaining
        end: function(...args) {
          endCalls.push(args);
          return this;
        }
      };
      
      // Add Jest-compatible mock properties for consistent API
      responseMock.status.mock = { calls: statusCalls };
      responseMock.json.mock = { calls: jsonCalls };
      responseMock.send.mock = { calls: sendCalls };
      responseMock.end.mock = { calls: endCalls };
    }
    
    // Log successful creation for debugging
    console.log(`createRes is returning response object`);
    
    return responseMock;
    
  } catch (err) {
    // Log error with context for debugging
    console.log(`createRes error ${err.message}`);
    
    // Propagate error to caller
    throw err;
  }
}

/**
 * Generate API key for /api/generate-key integration tests
 * 
 * This function creates a mock API key for testing API key generation
 * endpoints. It provides predictable test data while maintaining
 * realistic API key format for integration test scenarios.
 * 
 * Implementation approach:
 * - Generate consistent test key that looks realistic
 * - Use deterministic approach for predictable test results
 * - Include format that matches real API key patterns
 * - Provide different keys for different test scenarios
 * 
 * Why specific format:
 * - 'test-api-key-' prefix clearly identifies test keys
 * - Timestamp component provides uniqueness when needed
 * - Consistent format allows easy test verification
 * - Realistic enough to test key validation logic
 * 
 * @param {string} suffix - Optional suffix for generating different test keys
 * @returns {string} Generated test API key
 * 
 * @example
 * const apiKey = generateKey();
 * // Returns something like 'test-api-key-1634567890123'
 * const userKey = generateKey('user');
 * // Returns 'test-api-key-user'
 */
function generateKey(suffix = '') {
  // Log function start with parameter for debugging
  console.log(`generateKey is running with ${suffix}`);
  
  try {
    let generatedKey;
    
    if (suffix) {
      // Use provided suffix for specific test scenarios
      // This allows tests to generate keys for specific purposes
      generatedKey = `test-api-key-${suffix}`;
    } else {
      // Generate timestamp-based key for uniqueness
      // This ensures different keys across test runs when needed
      generatedKey = `test-api-key-${Date.now()}`;
    }
    
    // Log generated key for debugging
    console.log(`generateKey is returning ${generatedKey}`);
    
    return generatedKey;
    
  } catch (err) {
    // Log error with context for debugging
    console.log(`generateKey error ${err.message}`);
    
    // Propagate error to caller
    throw err;
  }
}

/**
 * Backup current environment variables for restoration
 * 
 * This function creates a snapshot of current environment variables
 * that can be restored later, enabling test isolation and cleanup.
 * It's particularly useful when tests need to modify environment
 * variables temporarily.
 * 
 * Implementation strategy:
 * - Take snapshot of entire process.env object
 * - Use JSON serialization for deep copy to prevent reference issues
 * - Handle edge cases like undefined or null values
 * - Provide clean restoration point for test cleanup
 * 
 * Why full environment backup:
 * - Some tests may modify unexpected environment variables
 * - Full backup provides complete isolation guarantee
 * - Prevents test pollution from environment changes
 * - Enables parallel test execution without interference
 * 
 * Memory considerations:
 * - Environment snapshots are small (typically < 1KB)
 * - Temporary storage for duration of test only
 * - Garbage collected after test completion
 * - No performance impact for typical test scenarios
 * 
 * @returns {Object} Deep copy of current environment variables
 * 
 * @example
 * const envBackup = backupEnvVars();
 * process.env.TEST_VAR = 'modified';
 * // ... run tests
 * restoreEnvVars(envBackup);
 * // Environment restored to original state
 */
function backupEnvVars() {
  // Log function start for debugging environment operations
  console.log(`backupEnvVars is running with none`);
  
  try {
    // Create deep copy of process.env to prevent reference issues
    // JSON.parse(JSON.stringify()) is simple and sufficient for environment variables
    // Environment variables are always strings, so this approach is safe
    const envBackup = JSON.parse(JSON.stringify(process.env));
    
    // Log successful backup creation for debugging
    console.log(`backupEnvVars is returning environment backup`);
    
    return envBackup;
    
  } catch (err) {
    // Log error with context for debugging
    console.log(`backupEnvVars error ${err.message}`);
    
    // Propagate error to caller
    throw err;
  }
}

/**
 * Restore environment variables from backup
 * 
 * This function restores the environment to a previous state using
 * a backup created by backupEnvVars. It handles complete restoration
 * including removal of variables that were added after backup.
 * 
 * Restoration strategy:
 * 1. Clear all current environment variables
 * 2. Restore all variables from backup
 * 3. Handle edge cases like undefined values
 * 4. Ensure complete state restoration
 * 
 * Why complete replacement vs selective restoration:
 * - Ensures no environment pollution from test execution
 * - Handles cases where tests add new environment variables
 * - Simpler implementation with fewer edge cases
 * - Guarantees exact restoration of environment state
 * 
 * Edge case handling:
 * - Variables added during test are removed
 * - Variables deleted during test are restored
 * - Original undefined values are handled correctly
 * - No references to backup object are retained
 * 
 * @param {Object} envBackup - Environment backup from backupEnvVars()
 * 
 * @example
 * const backup = backupEnvVars();
 * process.env.NEW_VAR = 'test';
 * delete process.env.EXISTING_VAR;
 * restoreEnvVars(backup);
 * // NEW_VAR removed, EXISTING_VAR restored
 */
function restoreEnvVars(envBackup) {
  // Log function start with backup info for debugging
  console.log(`restoreEnvVars is running with environment backup`);
  
  try {
    // Clear current environment completely
    // This ensures no test-added variables remain
    for (const key in process.env) {
      delete process.env[key];
    }
    
    // Restore all variables from backup
    // This handles both original variables and proper undefined handling
    for (const [key, value] of Object.entries(envBackup)) {
      process.env[key] = value;
    }
    
    // Log successful restoration for debugging
    console.log(`restoreEnvVars is returning undefined`);
    
  } catch (err) {
    // Log error with context for debugging
    console.log(`restoreEnvVars error ${err.message}`);
    
    // Propagate error to caller
    throw err;
  }
}

/**
 * Run a callback with environment variables saved and restored
 *
 * This helper captures process.env, executes the callback, then restores
 * the original environment. Useful for tests that temporarily modify env vars.
 *
 * @param {Function} fn - Callback function to run while env is saved
 * @returns {Promise<*>} Result returned by the callback
 */
async function withSavedEnv(fn) {
  console.log(`withSavedEnv is running with none`);

  const backup = backupEnvVars();
  try {
    const result = await fn();
    console.log(`withSavedEnv is returning ${result}`);
    return result;
  } catch (err) {
    console.log(`withSavedEnv error ${err.message}`);
    throw err;
  } finally {
    restoreEnvVars(backup);
  }
}

/**
 * Export advanced testing helper utilities
 * 
 * These utilities handle specialized testing scenarios that require
 * more sophisticated approaches than basic stubbing. They are grouped
 * together because they all serve advanced testing needs and often
 * work together in complex test setups.
 * 
 * Function organization rationale:
 * - stubQerrors and reload: Module and dependency management
 * - createJsonRes and createRes: Response object mocking for API tests
 * - generateKey: Specialized utility for API key testing
 * - backupEnvVars and restoreEnvVars: Environment isolation utilities
 * 
 * Usage patterns:
 * - Integration tests: Use createRes, generateKey, environment utilities
 * - Module testing: Use reload, stubQerrors for fresh module states
 * - API testing: Use response creators and environment management
 * - Cross-framework compatibility: All utilities work with or without Jest
 */
module.exports = {
  // Module and dependency management utilities
  stubQerrors,    // Silence error reporting for clean test output
  reload,         // Force fresh module loading for isolation testing

  // Response object mocking for API testing scenarios  
  createJsonRes,  // Minimal response mock for simple API tests
  createRes,      // Comprehensive response mock for complex API tests

  // Specialized utilities for specific testing scenarios
  generateKey,    // API key generation for endpoint testing

  // Environment isolation utilities for test cleanup
  backupEnvVars,  // Create environment snapshot for restoration
  restoreEnvVars, // Restore environment from snapshot for cleanup

  // Lifecycle helpers simplifying common patterns
  withMockConsole, // Wrap code with console spy lifecycle
  withSavedEnv    // Wrap code with environment save/restore
};

