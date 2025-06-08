
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
 */

function setup() { // Function exported so stubs activate only when called
  console.log(`setup is running with none`); // Debug start log
  try { // Error handling wrapper
    require('../setup'); // Load setup side effect on demand
    console.log(`setup is returning undefined`); // Debug return log
  } catch (error) { // Catch any require failure
    console.log(`setup encountered ${error.message}`); // Error log
    throw error; // Propagate error
  }
} // End setup function

/**
 * Export setup utilities
 * 
 * The setup function is separated because it modifies global Node.js behavior
 * and should be explicitly invoked by users when they want to enable automatic
 * stub resolution.
 */
module.exports = {
  setup // Call this to activate stubs when desired
};
