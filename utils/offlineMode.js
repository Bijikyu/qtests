
/**
 * Offline Mode Utility for qtests
 * 
 * This module provides automatic switching between real and mock implementations
 * of external dependencies based on the CODEX environment variable. When CODEX=true,
 * it uses mock implementations to enable offline testing and development.
 * 
 * Design philosophy:
 * - Environment-driven behavior: one codebase works online and offline
 * - Transparent switching: calling code doesn't need to change
 * - Graceful degradation: mock implementations provide safe fallbacks
 * - Development flexibility: easily toggle between real and mock dependencies
 * 
 * Use cases:
 * - Offline development when internet is unavailable
 * - CI/CD environments without external network access
 * - Testing scenarios that should not make real HTTP requests
 * - Development environments where external services are unreliable
 * 
 * Why CODEX environment variable:
 * - Conventional name for offline/mock mode in development tools
 * - Easy to set in different environments (local, CI, staging)
 * - Clear semantic meaning for developers
 * - Can be set once and affect entire application behavior
 */

const axiosReal = require('axios'); // Store real axios for online use
const { createMockAxios } = require('./testEnv'); // Import mock axios factory from testEnv
const codexFlag = String(process.env.CODEX).toLowerCase() === 'true'; // Normalize CODEX env check

// Conditionally load qerrors only when online to avoid dependency errors
// This prevents crashes when qerrors module is not available in offline environments
let realQerrors;
if (!codexFlag) {
  try {
    ({ qerrors: realQerrors } = require('qerrors')); // Load qerrors only when online
  } catch (error) {
    // If qerrors is not available, we'll fall back to mock implementation
    console.log(`qerrors module not available: ${error.message}`);
    realQerrors = null;
  }
}

const isOffline = codexFlag; // Codex env check for clarity

/**
 * Configure axios based on offline mode
 * 
 * When offline (CODEX=true):
 * - Uses createMockAxios() factory for predictable HTTP responses
 * - No real network requests are made
 * - Responses can be programmed via __set method
 * 
 * When online (CODEX=false or unset):
 * - Uses real axios for actual HTTP requests
 * - Full axios functionality available
 * - Real network requests to external services
 */
let axios;
if (isOffline) {
  axios = createMockAxios(); // Use factory-built mock when offline
} else {
  axios = axiosReal; // Use real axios for online operation
}

/**
 * Configure qerrors based on offline mode
 * 
 * When offline (CODEX=true):
 * - Uses no-op implementation that logs calls
 * - Prevents error reporting to external services
 * - Safe for offline development and testing
 * 
 * When online (CODEX=false or unset):
 * - Uses real qerrors for actual error reporting
 * - Full error handling and reporting functionality
 * - Errors are sent to configured external services
 */
let qerrors;
if (isOffline) {
  qerrors = function noopQerrors(...args) {
    console.log(`noopQerrors is running with ${args.length} arguments`); // Start log
    try {
      // Log the error details for debugging without external reporting
      if (args.length > 0) {
        console.log(`noopQerrors captured:`, args[0]);
      }
      console.log(`noopQerrors has run`); // Finish log
      return args; // Return arguments for compatibility
    } catch (error) {
      console.log(`noopQerrors error ${error.message}`); // Error log
      throw error; // Propagate unexpected errors
    }
  };
} else {
  qerrors = realQerrors || function fallbackQerrors(...args) {
    // Fallback if qerrors module wasn't available
    console.log(`fallbackQerrors (qerrors unavailable):`, args[0]);
    return args;
  };
}

/**
 * Export configured utilities
 * 
 * isOffline: Boolean flag indicating current mode for conditional logic
 * axios: Configured axios instance (real or mock based on environment)
 * qerrors: Configured error handler (real or no-op based on environment)
 * 
 * Usage examples:
 * const { isOffline, axios, qerrors } = require('qtests/utils/offlineMode');
 * 
 * if (isOffline) {
 *   axios.__set('http://api.example.com', { data: 'mock response' });
 * }
 * 
 * const response = await axios.get('http://api.example.com');
 * qerrors('Something went wrong', { context: 'user-action' });
 */
module.exports = { isOffline, axios, qerrors }; // Export utilities
