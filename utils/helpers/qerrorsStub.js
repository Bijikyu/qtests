/**
 * QErrors Stubbing Utility
 * 
 * This module provides functionality for stubbing the qerrors module
 * during testing to prevent error reporting network calls.
 */

/**
 * Stub qerrors.qerrors method to silence error reporting during tests
 * 
 * This function replaces the qerrors.qerrors method with a no-op function
 * to prevent error reporting network calls and log output during testing.
 * 
 * @returns {undefined} This is a side-effect function with no return value
 */
function stubQerrors() {
  console.log(`stubQerrors is running with none`);
  
  try {
    const qerrors = require('qerrors');
    
    // Check if Node.js test module is available for superior mocking
    if (typeof test !== 'undefined' && test.mock && test.mock.method) {
      test.mock.method(qerrors, 'qerrors', () => {});
    } else {
      // Fall back to manual stubbing
      qerrors.qerrors = () => {};
    }
    
    // Force offline module to reload and pick up the stubbed qerrors
    delete require.cache[require.resolve('../offlineMode')];
    
    console.log(`stubQerrors is returning undefined`);
    
  } catch (err) {
    console.log(`stubQerrors error ${err.message}`);
    throw err;
  }
}

module.exports = {
  stubQerrors
};