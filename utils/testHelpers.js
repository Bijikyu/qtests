

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

// Thread-safe module reloading lock to prevent race conditions
// This prevents concurrent reload operations on the same module
const moduleReloadLock = new Set();
const { mockConsole } = require('./mockConsole'); // (import console spy utility)

/**
 * Stub qerrors.qerrors method to silence error reporting during tests
 * 
 * This function replaces the qerrors.qerrors method with a no-op function
 * to prevent error reporting network calls and log output during testing.
 * It also forces a reload of the offline module to ensure it picks up
 * the stubbed qerrors implementation.
 * 
 * Enhanced implementation with Node.js test module integration:
 * 1. Prefer Node.js test module for superior mocking when available
 * 2. Support both test.mock.method and manual stubbing approaches
 * 3. Force module cache clearing to ensure stub is used
 * 4. Handle graceful fallback when qerrors module is missing
 * 5. Provide detailed logging for debugging test setup issues
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
 * Node.js test module benefits:
 * - Automatic cleanup after test completion
 * - Better integration with Node.js testing infrastructure
 * - Consistent behavior across different test frameworks
 * - Superior spy functionality for call verification
 * 
 * @returns {undefined} This is a side-effect function with no return value
 * 
 * @example
 * stubQerrors();
 * // Now qerrors.qerrors() calls will be silent
 * // And offline module will use stubbed qerrors
 */
function stubQerrors() {
  console.log(`stubQerrors is running with none`); //(log start of stubQerrors)
  
  try {
    // Attempt to require qerrors module for stubbing
    // This may fail if qerrors is not installed, which is handled gracefully
    const qerrors = require('qerrors'); //(use global stubbed module)
    
    // Check if Node.js test module is available for superior mocking
    // Node.js test module provides automatic cleanup and better spy functionality
    if (typeof test !== 'undefined' && test.mock && test.mock.method) {
      // Use Node.js test module's mock.method for automatic cleanup
      // This approach provides better integration with Node.js testing infrastructure
      test.mock.method(qerrors, 'qerrors', () => {}); //(spy on qerrors.qerrors)
    } else {
      // Fall back to manual stubbing for environments without test module
      // Store original method for potential future restoration needs
      qerrors.qerrors = () => {};
    }
    
    // Force offline module to reload and pick up the stubbed qerrors
    // This must happen after stubbing to ensure the module gets the stub version
    // Using require.resolve ensures we get the correct path for cache deletion
    delete require.cache[require.resolve('./offlineMode')]; //(force offline module reload)
    
    // Log successful completion for debugging
    console.log(`stubQerrors is returning undefined`); //(log completion)
    
  } catch (err) {
    // Log error with descriptive context for debugging
    // qerrors is often optional, so this may be expected in some environments
    console.log(`stubQerrors error ${err.message}`); //(log error)
    
    // Propagate error to caller for handling
    // Allows calling code to decide how to handle missing qerrors
    throw err; //(propagate error)
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
  console.log(`reload is running with ${relPath}`); // log entry for troubleshooting

  const fullPath = path.resolve(__dirname, relPath); // compute absolute path once for reuse

  if (moduleReloadLock.has(fullPath)) { // avoid race by checking lock
    console.log(`reload has run resulting in skip`); // log skip event per requirement
    return require(fullPath); // return cached module when locked
  }

  try {
    moduleReloadLock.add(fullPath); // acquire reload lock before cache operations
    delete require.cache[require.resolve(fullPath)]; // clear cache while locked
    const mod = require(fullPath); // require fresh module after clearing cache
    moduleReloadLock.delete(fullPath); // release lock after load completes
    console.log(`reload is returning module`); // log successful reload
    return mod; // return newly loaded module to caller
  } catch (err) {
    moduleReloadLock.delete(fullPath); // release lock on failure to avoid deadlock
    console.log(`reload error ${err.message}`); // log error context
    throw err; // propagate failure for caller handling
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
        status: jest.fn().mockImplementation(function(code) {
          this.statusCode = code; // Set statusCode property for Express compatibility
          return this; // Enable method chaining
        }),
        
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
          if (args.length > 0) {
            this.statusCode = args[0]; // Set statusCode property for Express compatibility
          }
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
 * Enhanced implementation with HTTP testing support:
 * - Generate consistent test key that looks realistic
 * - Support HTTP app testing with supertest-style calls
 * - Handle both direct key generation and API endpoint testing
 * - Provide different keys for different test scenarios
 * 
 * Dual usage patterns:
 * 1. Direct key generation: generateKey('suffix') returns string
 * 2. HTTP endpoint testing: generateKey(app, allowedApi) returns response
 * 
 * Why specific format:
 * - 'test-api-key-' prefix clearly identifies test keys
 * - Timestamp component provides uniqueness when needed
 * - Consistent format allows easy test verification
 * - Realistic enough to test key validation logic
 * 
 * @param {string|Object} appOrSuffix - Express app for HTTP testing or suffix for direct generation
 * @param {string} allowedApi - API service name for HTTP endpoint testing
 * @returns {string|Promise<Object>} Generated test API key or HTTP response
 * 
 * @example
 * // Direct key generation
 * const apiKey = generateKey('user');
 * // Returns 'test-api-key-user'
 * 
 * // HTTP endpoint testing
 * const response = await generateKey(app, 'userService');
 * // Returns supertest response object
 */
async function generateKey(appOrSuffix = '', allowedApi = null) {
  // Determine if this is HTTP testing or direct key generation
  const isHttpTesting = allowedApi !== null && typeof appOrSuffix === 'object';
  
  if (isHttpTesting) {
    // HTTP endpoint testing mode
    console.log(`generateKey is running with ${allowedApi}`); //(log start of generateKey)
    
    try {
      // Import httpTest for supertest-style testing
      const { supertest } = require('./httpTest');
      
      // Make HTTP request to generate-key endpoint
      const res = await supertest(appOrSuffix)
        .post('/api/generate-key')
        .send({ allowedApi });
      
      console.log(`generateKey is returning ${res.statusCode}`); //(log completion)
      return res; //(return server response)
    } catch (err) {
      console.log(`generateKey error ${err.message}`); //(log error)
      throw err; //(propagate error)
    }
  } else {
    // Direct key generation mode
    const suffix = appOrSuffix;
    console.log(`generateKey is running with ${suffix}`);
    
    try {
      let generatedKey;
      
      if (suffix) {
        // Use provided suffix for specific test scenarios
        generatedKey = `test-api-key-${suffix}`;
      } else {
        // Generate timestamp-based key for uniqueness
        generatedKey = `test-api-key-${Date.now()}`;
      }
      
      console.log(`generateKey is returning ${generatedKey}`);
      return generatedKey;
      
    } catch (err) {
      console.log(`generateKey error ${err.message}`);
      throw err;
    }
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
 * Enhanced implementation with selective backup:
 * - Support both full environment backup and selective variable backup
 * - Store selected env vars for later restoration
 * - Handle edge cases like undefined or null values
 * - Provide clean restoration point for test cleanup
 * 
 * Dual usage patterns:
 * 1. Full backup: backupEnvVars() returns complete environment snapshot
 * 2. Selective backup: backupEnvVars('VAR1', 'VAR2') returns specified variables
 * 
 * Why selective backup option:
 * - Memory efficiency for tests that only modify specific variables
 * - Clear intent about which variables test will modify
 * - Faster restoration for selective backups
 * - Reduces noise in debugging output
 * 
 * Memory considerations:
 * - Environment snapshots are small (typically < 1KB)
 * - Selective backups use even less memory
 * - Temporary storage for duration of test only
 * - Garbage collected after test completion
 * 
 * @param {...string} names - Optional variable names for selective backup
 * @returns {Object} Environment backup object
 * 
 * @example
 * // Full environment backup
 * const envBackup = backupEnvVars();
 * 
 * // Selective variable backup
 * const envBackup = backupEnvVars('NODE_ENV', 'DEBUG');
 */
function backupEnvVars(...names) {
  // Determine backup mode based on arguments
  const isSelectiveBackup = names.length > 0;
  
  if (isSelectiveBackup) {
    // Selective backup mode for specific variables
    console.log(`backupEnvVars is running with ${names}`); //(start log)
    
    try {
      const envBackup = {}; //(init backup container)
      names.forEach(name => { 
        envBackup[name] = process.env[name]; 
      }); //(store each value)
      
      console.log(`backupEnvVars is returning selective backup`); //(end log)
      return envBackup;
      
    } catch (err) {
      console.log(`backupEnvVars error ${err.message}`); //(log error)
      throw err; //(propagate)
    }
  } else {
    // Full environment backup mode
    console.log(`backupEnvVars is running with none`);
    
    try {
      // Create copy of process.env using object spread for simplicity
      // All env values are strings so shallow copy avoids reference issues
      const envBackup = { ...process.env }; //(use spread copy to avoid JSON parsing & retain strings)
      
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
}

/**
 * Restore environment variables from backup
 * 
 * This function restores the environment to a previous state using
 * a backup created by backupEnvVars. It handles both complete restoration
 * and selective restoration based on the backup contents.
 * 
 * Enhanced restoration strategy:
 * 1. Detect if backup is selective or complete based on backup size
 * 2. For selective backups: only restore specified variables
 * 3. For complete backups: full environment restoration
 * 4. Handle edge cases like undefined values consistently
 * 
 * Restoration modes:
 * - Selective restoration: Only restores variables present in backup
 * - Complete restoration: Removes added variables and restores all original values
 * 
 * Why smart restoration:
 * - Prevents accidental deletion of system variables during selective restore
 * - Maintains full compatibility with existing usage patterns
 * - Provides optimal performance for both use cases
 * - Clear behavior based on backup type
 * 
 * Edge case handling:
 * - Variables added during test are removed (complete mode only)
 * - Variables deleted during test are restored (both modes)
 * - Original undefined values are handled correctly
 * - No references to backup object are retained
 * 
 * @param {Object} envBackup - Environment backup from backupEnvVars()
 * 
 * @example
 * // Selective restoration
 * const backup = backupEnvVars('NODE_ENV', 'DEBUG');
 * process.env.NODE_ENV = 'test';
 * restoreEnvVars(backup);
 * // Only NODE_ENV and DEBUG restored
 * 
 * // Complete restoration
 * const backup = backupEnvVars();
 * process.env.NEW_VAR = 'test';
 * restoreEnvVars(backup);
 * // NEW_VAR removed, all original variables restored
 */
function restoreEnvVars(envBackup) {
  // Handle the new calling pattern without backup parameter
  if (!envBackup) {
    console.log(`restoreEnvVars is running with none`); //(start log)
    
    try {
      // Check for stored backup from backupEnvVars (legacy pattern support)
      if (typeof global !== 'undefined' && global.qtestsEnvBackup) {
        envBackup = global.qtestsEnvBackup;
        delete global.qtestsEnvBackup; // Clean up after use
      } else {
        console.log(`restoreEnvVars is returning undefined`); //(no backup)
        return;
      }
    } catch (err) {
      console.log(`restoreEnvVars error ${err.message}`); //(log error)
      throw err; //(propagate)
    }
  } else {
    // Standard backup restoration
    console.log(`restoreEnvVars is running with environment backup`);
  }
  
  try {
    // Validate backup parameter to prevent runtime errors
    if (!envBackup || typeof envBackup !== 'object') {
      console.log(`restoreEnvVars: Invalid backup provided, skipping restoration`);
      return;
    }
    
    // Determine restoration mode based on backup characteristics
    const backupKeys = Object.keys(envBackup);
    const currentKeys = Object.keys(process.env);
    const isSelectiveBackup = backupKeys.length < currentKeys.length / 2; // Heuristic for selective backup
    
    if (isSelectiveBackup) {
      // Selective restoration: only restore variables from backup
      // This prevents accidental deletion of system variables
      for (const [key, value] of Object.entries(envBackup)) {
        if (value === undefined) {
          delete process.env[key]; // Restore original undefined state
        } else {
          process.env[key] = value; // Restore original value
        }
      }
      
      console.log(`restoreEnvVars completed selective restoration`);
    } else {
      // Complete restoration: full environment reset
      const currentKeySet = new Set(currentKeys);
      const backupKeySet = new Set(backupKeys);
      
      // Remove only variables that were added after backup creation
      // This preserves system-critical variables like PATH, HOME, NODE_ENV
      for (const key of currentKeySet) {
        if (!backupKeySet.has(key)) {
          delete process.env[key];
        }
      }
      
      // Restore original values for all backed-up variables
      // Handle undefined values by deleting the key (restoring original undefined state)
      for (const [key, value] of Object.entries(envBackup)) {
        if (value !== undefined) {
          process.env[key] = value;
        } else {
          delete process.env[key];
        }
      }
      
      console.log(`restoreEnvVars completed full restoration`);
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
// export all test helper utilities at bottom per requirements
module.exports = {
  stubQerrors, // error reporting stubbing utility
  reload, // module cache management utility
  moduleReloadLock, // expose lock for testing of concurrent reloads
  withMockConsole, // console mocking helper function
  createJsonRes, // minimal response mocking utility
  createRes, // comprehensive response mocking utility
  generateKey, // test data generation utility
  backupEnvVars, // environment backup utility
  restoreEnvVars, // environment restoration utility
  withSavedEnv // environment save/restore wrapper
};

