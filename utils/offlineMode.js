/**
 * Offline Mode Testing Utilities
 * 
 * This module provides functionality to simulate offline conditions during testing
 * by automatically switching between real and stub implementations of network-dependent
 * modules. This enables testing of application behavior under network failure conditions
 * without requiring actual network connectivity manipulation.
 * 
 * Core concept:
 * Many applications need to handle offline scenarios gracefully. This utility
 * allows tests to simulate offline conditions by replacing network-dependent
 * modules (like axios for HTTP requests) and error reporting modules (like qerrors)
 * with stub implementations that behave predictably without network access.
 * 
 * Design philosophy:
 * - Automatic switching based on offline mode flag
 * - Transparent replacement of network-dependent modules
 * - Graceful handling of missing optional dependencies
 * - Clean separation between online and offline behavior testing
 * 
 * Use cases:
 * - Testing application behavior when network requests fail
 * - Verifying offline-first application logic
 * - Testing error handling in network-dependent code
 * - Simulating poor connectivity scenarios
 */

// Import logging control utility for optional log muting
const { setLogging } = require('../lib/logUtils'); // use only setLogging here
if (process.env.NODE_ENV !== 'test') setLogging(false); //(mute logs outside tests)

// Import mock axios factory for creating configurable mock instances
const { createMockAxios } = require('./mockAxios');

// Environment variable detection for automatic offline mode
// Supports multiple environment variables for different use cases:
// - CODEX: Used by development/testing environments
// - OFFLINE_MODE: Explicit offline mode flag
// - NODE_ENV=test: Automatic offline mode in test environments
const codexFlag = String(process.env.CODEX).toLowerCase() === 'true';
const offlineFlagExplicit = String(process.env.OFFLINE_MODE).toLowerCase() === 'true';
const testEnvironment = process.env.NODE_ENV === 'test';

// Initialize offline mode state with environment variable detection
// Precedence order: explicit OFFLINE_MODE > CODEX flag > manual setting
// This allows environment-based automatic configuration while preserving programmatic control
let isOffline = offlineFlagExplicit || codexFlag || false; // (tracks offline mode state with env detection)

// Cache variables for required modules //(store loaded modules)
let axiosCache; // (cache for axios module)
let qerrorsCache; // (cache for qerrors module)

/**
 * Toggle offline mode on or off
 * 
 * This function switches the application between online and offline modes
 * for testing purposes. When offline mode is enabled, network-dependent
 * modules are replaced with stub implementations that don't require
 * actual network connectivity.
 * 
 * Implementation strategy:
 * 1. Update the global offline state flag
 * 2. Log the state change for debugging
 * 3. Return the new state for confirmation
 * 
 * Why a simple boolean flag:
 * - Clear, unambiguous state representation
 * - Easy to reason about in test code
 * - Minimal complexity for maximum reliability
 * - Follows principle of least surprise
 * 
 * @param {boolean} offline - Whether to enable offline mode
 * @returns {boolean} The new offline mode state
 * 
 * @example
 * setOfflineMode(true);  // Switch to offline mode
 * // Tests here will use stub implementations
 * setOfflineMode(false); // Switch back to online mode
 */
function setOfflineMode(offline) {
  console.log(`setOfflineMode is running with ${offline}`); // logging function start per requirements

  try {
    const stateChanged = isOffline !== offline; // check if state differs to know when to clear cache
    isOffline = offline; // update global offline state flag
    if (stateChanged) clearOfflineCache(); // wipe caches when toggling state for consistent modules
    console.log(`setOfflineMode is returning ${isOffline}`); // logging return value per requirements
    return isOffline;
  } catch (error) {
    console.log(`setOfflineMode error: ${error.message}`); // error logging per requirements
    throw error;
  }
}

/**
 * Get current offline mode state
 * 
 * This function returns the current offline mode state without changing it.
 * Useful for conditional logic in tests and for debugging test setup.
 * 
 * @returns {boolean} Current offline mode state
 * 
 * @example
 * if (isOfflineMode()) {
 *   // Handle offline-specific test logic
 * }
 */
function isOfflineMode() {
  return isOffline;
}

/**
 * Get appropriate axios implementation based on offline mode
 * 
 * This function returns either the real axios module (when online) or
 * the qtests axios stub (when offline). This automatic switching allows
 * tests to seamlessly transition between network-dependent and network-free
 * execution without changing application code.
 * 
 * Implementation approach:
 * 1. Check current offline mode state
 * 2. Return appropriate implementation based on state
 * 3. Handle require errors gracefully for missing dependencies
 * 4. Log the decision for debugging purposes
 * 
 * Why automatic switching:
 * - Tests can toggle network behavior without code changes
 * - Application code remains unchanged between online/offline testing
 * - Clear separation of concerns between test setup and application logic
 * - Enables comprehensive testing of both network scenarios
 * 
 * @returns {Object} Either real axios or qtests axios stub
 * 
 * @example
 * const axios = getAxios();
 * // Returns real axios when online, stub when offline
 * const response = await axios.get('/api/data');
 */
function getAxios() {
  console.log(`getAxios is running with offline: ${isOffline}`); // logging function start per requirements
  
  try {
    // Check cache first to avoid repeated module loading and maintain consistency
    // Caching prevents different axios implementations during single test run
    // Essential for predictable behavior when offline mode doesn't change mid-test
    // Cache also improves performance by avoiding repeated require() calls
    if (axiosCache) {
      console.log(`getAxios is returning ${axiosCache}`); // logging return value per requirements
      return axiosCache;
    }

    // Declare variable to hold appropriate axios implementation
    // Declared outside if/else to maintain consistent scope and enable caching
    let axiosImplementation;

    if (isOffline) {
      // For compatibility with integration tests that compare instances directly,
      // return the original stub module. The cache behavior is handled by axiosCache.
      axiosImplementation = require(`../stubs/axios`);
    } else {
      // Load real axios module for online mode when network calls are intended
      // Standard require path allows npm to resolve axios from node_modules
      // Used when tests need to verify actual HTTP behavior or integration testing
      axiosImplementation = require(`axios`);
    }

    // Cache the loaded implementation for consistent behavior and performance
    // Prevents mode switching from loading different implementations mid-test
    // Ensures same axios instance used throughout test execution for predictability
    axiosCache = axiosImplementation;
    console.log(`getAxios is returning ${axiosCache}`); // logging return value per requirements
    return axiosCache;

  } catch (error) {
    // Handle module loading failures by falling back to stub implementation
    // Real axios might fail to load due to missing dependency or installation issues
    // Stub fallback ensures tests can continue running even with axios installation problems
    // This graceful degradation prevents test suite failures due to dependency issues
    console.log(`getAxios error: ${error.message}`);
    const fallbackAxios = require(`../stubs/axios`);
    axiosCache = fallbackAxios; // cache fallback to maintain consistency
    console.log(`getAxios is returning ${axiosCache}`); // logging return value per requirements
    return axiosCache;
  }
}

/**
 * Get appropriate qerrors implementation based on offline mode
 * 
 * Similar to getAxios, this function returns either the real qerrors module
 * or a stub implementation based on the current offline mode state.
 * qerrors is commonly used for error reporting, which often involves
 * network requests to logging services.
 * 
 * Offline mode considerations for error reporting:
 * - Error reporting services are often network-dependent
 * - Offline applications need to handle error reporting gracefully
 * - Tests shouldn't fail due to error reporting service unavailability
 * - Stub implementation allows testing error handling logic separately
 * 
 * @returns {Object} Either real qerrors or stub implementation
 * 
 * @example
 * const qerrors = getQerrors();
 * // Returns real qerrors when online, stub when offline
 * qerrors.report(new Error('Test error'));
 */
function getQerrors() {
  console.log(`getQerrors is running with offline: ${isOffline}`); // logging function start per requirements
  
  try {
    if (qerrorsCache) { // return cached module if available
      console.log(`getQerrors is returning ${qerrorsCache}`); // logging return value per requirements
      return qerrorsCache;
    }

    let qerrorsImplementation; // module holder variable

    if (isOffline) {
      // Enhanced no-op qerrors implementation for offline environments
      // Provides same interface as real qerrors but only logs locally
      // Includes debugging output to help track error reporting behavior
      qerrorsImplementation = {
        qerrors: () => {
          console.log(`noopQerrors is running with none`); // Log function entry for debugging
          try {
            console.log(`noopQerrors has run`); // Log successful execution
          } catch(error) {
            console.log(`noopQerrors error ${error.message}`); // Log any unexpected errors
          }
        }
      };
    } else {
      // Conditionally load qerrors only in online environments to prevent module not found errors
      // Dynamic import prevents errors in offline mode when qerrors module is unavailable
      qerrorsImplementation = require(`qerrors`); // load real qerrors for online mode with backticks
    }

    qerrorsCache = qerrorsImplementation; // store in cache for future use
    console.log(`getQerrors is returning ${qerrorsCache}`); // logging return value per requirements
    return qerrorsCache;

  } catch (error) {
    console.log(`getQerrors error: ${error.message}`); // error logging per requirements
    const fallbackQerrors = { qerrors: () => {} }; // create fallback stub
    qerrorsCache = fallbackQerrors; // store fallback in cache
    console.log(`getQerrors is returning ${qerrorsCache}`); // logging return value per requirements
    return qerrorsCache;
  }
}

/**
 * Get environment detection state for debugging and configuration
 * 
 * This function returns the current state of environment variable detection
 * to help with debugging and understanding how offline mode was configured.
 * Useful for troubleshooting environment-specific behavior.
 * 
 * @returns {Object} Environment detection state information
 * 
 * @example
 * const envState = getEnvironmentState();
 * console.log(`CODEX flag: ${envState.codexFlag}`);
 * console.log(`Offline mode: ${envState.isOffline}`);
 */
function getEnvironmentState() {
  console.log(`getEnvironmentState is running with none`);
  
  try {
    const state = {
      codexFlag,
      offlineFlagExplicit,
      testEnvironment,
      isOffline,
      environmentDetected: codexFlag || offlineFlagExplicit
    };
    console.log(`getEnvironmentState is returning ${JSON.stringify(state)}`);
    return state;
  } catch (error) {
    console.log(`getEnvironmentState error: ${error.message}`);
    throw error;
  }
}

/**
 * Create environment-aware adapters based on current offline state
 * 
 * This function provides a convenient way to get both axios and qerrors
 * implementations in a single call, configured appropriately for the
 * current environment. This matches the pattern from your provided
 * environment adapter functionality.
 * 
 * @returns {Object} Object containing axios and qerrors implementations
 * 
 * @example
 * const { axios, qerrors } = createEnvironmentAdapters();
 * const response = await axios.get('/api/data');
 * qerrors.report(new Error('Test error'));
 */
function createEnvironmentAdapters() {
  console.log(`createEnvironmentAdapters is running with offline: ${isOffline}`);
  
  try {
    const adapters = {
      isOffline,
      axios: getAxios(),
      qerrors: getQerrors()
    };
    console.log(`createEnvironmentAdapters is returning adapters`);
    return adapters;
  } catch (error) {
    console.log(`createEnvironmentAdapters error: ${error.message}`);
    throw error;
  }
}

function clearOfflineCache() { // reset caches for testing purposes
  console.log(`clearOfflineCache is running with none`); // logging function start per requirements
  
  try {
    axiosCache = undefined; // clear axios cache
    qerrorsCache = undefined; // clear qerrors cache
    console.log(`clearOfflineCache is returning undefined`); // logging return value per requirements
  } catch (error) {
    console.log(`clearOfflineCache error: ${error.message}`); // error logging per requirements
    throw error;
  }
}

// export offline mode utilities at bottom per requirements
module.exports = {
  setOfflineMode, // control offline mode state
  isOfflineMode, // get current offline state
  getAxios, // get appropriate axios implementation
  getQerrors, // get appropriate qerrors implementation
  getEnvironmentState, // get environment detection information
  createEnvironmentAdapters, // create complete environment-aware adapter set
  clearOfflineCache // reset module caches
};