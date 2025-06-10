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

// Import logging utilities for consistent debugging output
const { logStart, logReturn, setLogging } = require('../lib/logUtils'); //(import setLogging)
if (process.env.NODE_ENV !== 'test') setLogging(false); //(mute logs outside tests)

// Initialize offline mode state - starts in online mode by default
// This state determines whether to use real or stub implementations
// Default to false (online) to match typical application runtime behavior
let isOffline = false;

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
  logStart('setOfflineMode', offline);

  // Update global offline state
  // This flag is checked by getAxios and other functions to determine
  // whether to return real or stub implementations
  isOffline = offline;

  logReturn('setOfflineMode', isOffline);
  return isOffline;
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
  logStart('getAxios', `offline: ${isOffline}`);

  try {
    let axiosImplementation;

    if (isOffline) {
      // Return stub implementation for offline mode
      // This prevents actual network requests during offline testing
      axiosImplementation = require('../stubs/axios');
      console.log('getAxios returning stub axios for offline mode');
    } else {
      // Return real axios implementation for online mode
      // This allows normal network behavior during online testing
      axiosImplementation = require('axios');
      console.log('getAxios returning real axios for online mode');
    }

    logReturn('getAxios', 'axios implementation');
    return axiosImplementation;

  } catch (error) {
    // Handle missing axios dependency gracefully
    // This allows qtests to work even if axios isn't installed
    console.log(`getAxios error: ${error.message}`);

    // Fall back to stub implementation if real axios is unavailable
    // This ensures tests can still run even with missing dependencies
    const fallbackAxios = require('../stubs/axios');
    logReturn('getAxios', 'fallback axios stub');
    return fallbackAxios;
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
  logStart('getQerrors', `offline: ${isOffline}`);

  try {
    let qerrorsImplementation;

    if (isOffline) {
      // Return no-op implementation for offline mode
      // This prevents error reporting network requests during offline testing
      qerrorsImplementation = {
        qerrors: () => {} // No-op function that does nothing
      };
      console.log('getQerrors returning stub qerrors for offline mode');
    } else {
      // Return real qerrors implementation for online mode
      qerrorsImplementation = require('qerrors');
      console.log('getQerrors returning real qerrors for online mode');
    }

    logReturn('getQerrors', 'qerrors implementation');
    return qerrorsImplementation;

  } catch (error) {
    // Handle missing qerrors dependency gracefully
    // qerrors is often an optional dependency, so missing it shouldn't break tests
    console.log(`qerrors module not available: ${error.message}`);

    // Always return stub implementation if real qerrors is unavailable
    // This ensures tests continue to work regardless of qerrors installation
    const fallbackQerrors = {
      qerrors: () => {} // No-op error reporting function
    };

    logReturn('getQerrors', 'fallback qerrors stub');
    return fallbackQerrors;
  }
}

/**
 * Export offline mode utilities
 * 
 * These functions work together to provide comprehensive offline mode testing:
 * - setOfflineMode and isOfflineMode manage the offline state
 * - getAxios and getQerrors provide automatic implementation switching
 * 
 * Usage pattern:
 * 1. Call setOfflineMode(true) to enable offline testing
 * 2. Use getAxios() and getQerrors() in application code
 * 3. Run tests - they will use stub implementations automatically
 * 4. Call setOfflineMode(false) to return to online mode
 */
module.exports = {
  // Control offline mode state
  setOfflineMode,
  isOfflineMode,

  // Get appropriate implementations based on offline mode
  getAxios,
  getQerrors
};