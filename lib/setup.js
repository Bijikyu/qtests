
/**
 * Setup and Initialization Utilities
 * 
 * This module provides setup functionality for the qtests framework.
 * The setup function modifies global Node.js behavior to enable automatic
 * stub resolution, which is essential for seamless testing.
 * 
 * Design philosophy:
 * - Explicit setup to avoid unintended side effects
 * - Clear separation of setup from other utilities
 * - Comprehensive error handling and logging
 * - Safe to call multiple times
 * 
 * Why explicit setup is necessary:
 * 1. Modifying Node.js module resolution is a global side effect
 * 2. Users should explicitly opt-in to this behavior modification
 * 3. Setup timing is critical - must happen before module requires
 * 4. Clear separation makes it obvious when global behavior is being changed
 * 
 * Alternative approaches considered:
 * - Automatic setup on require: Rejected due to hidden side effects
 * - Setup in individual utilities: Rejected due to timing complexity
 * - Multiple setup functions: Rejected for simplicity
 * 
 * Current approach benefits:
 * - Clear, explicit user intent required
 * - Single point of global behavior modification
 * - Easy to understand and debug
 * - Follows principle of least surprise
 */

/**
 * Initialize qtests framework with automatic stub resolution
 * 
 * This function modifies Node.js module resolution to automatically
 * substitute stub implementations for real modules during testing.
 * 
 * Implementation rationale:
 * 1. Function wrapper provides explicit call syntax for users
 * 2. Lazy loading of setup module prevents accidental side effects
 * 3. Error handling ensures setup failures are clearly reported
 * 4. Logging provides visibility into setup process for debugging
 * 
 * Why a function wrapper instead of direct require:
 * - Makes setup intention explicit in user code
 * - Allows error handling and logging at the API level
 * - Provides a clear point for future enhancement (parameters, options)
 * - Follows common Node.js patterns for initialization functions
 * 
 * Critical timing requirement:
 * This function MUST be called before requiring any modules that need stubbing.
 * If axios or winston are required before setup(), they will be the real modules.
 * 
 * @returns {undefined} No return value - this is a side-effect function
 * @throws {Error} Propagates any errors from the setup module
 */
function setup() {
  // Log function entry for debugging setup timing issues
  // This helps users understand when setup is actually executing
  console.log(`setup is running with none`);
  
  try {
    // Lazy-load the setup module to perform actual Node.js modification
    // This require statement triggers the side effects that modify module resolution
    // The setup module is separate to isolate the complex module resolution logic
    require('../setup');
    
    // Log successful completion for debugging
    // Helps confirm setup completed without throwing errors
    console.log(`setup is returning undefined`);
    
  } catch (error) {
    // Log setup errors with descriptive context
    // Setup failures are critical and need clear error reporting
    console.log(`setup encountered ${error.message}`);
    
    // Propagate the error to the caller
    // Setup failures should halt test execution to prevent confusing behavior
    throw error;
  }
}

/**
 * Export setup utilities
 * 
 * The setup function is separated into its own module because:
 * 1. It modifies global Node.js behavior and should be explicitly invoked
 * 2. It has different usage patterns than other utilities (called once vs per-test)
 * 3. It has no return value and serves purely as a side-effect function
 * 4. Separating it makes the API design intention clear
 * 
 * Single export rationale:
 * - Only one setup function is needed for the entire framework
 * - Future setup-related functions can be added to this module
 * - Clear namespace separation from testing utilities
 */
module.exports = {
  // Call this to activate stubs when desired
  // Must be called before requiring modules that need stubbing
  // Safe to call multiple times - setup module handles redundant calls
  setup
};
