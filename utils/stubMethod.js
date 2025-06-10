
/**
 * Method Stubbing Utility
 * 
 * This module provides the fundamental method replacement functionality
 * that enables isolated unit testing by replacing method implementations
 * with controlled test doubles.
 * 
 * Core concept:
 * Stubbing temporarily replaces a method on an object with a test implementation,
 * allowing tests to control the behavior of dependencies and verify interactions
 * without executing the real method code.
 * 
 * Design philosophy:
 * - Simple, predictable API that follows common stubbing patterns
 * - Automatic restoration to prevent test pollution
 * - Flexible replacement function support
 * - Framework-agnostic implementation
 * 
 * Why manual stubbing vs mocking libraries:
 * 1. Zero dependencies - works in any Node.js environment
 * 2. Simple implementation is easy to understand and debug
 * 3. Predictable behavior without complex library-specific semantics
 * 4. Minimal API surface reduces learning curve
 * 5. Complete control over restoration behavior
 */

/**
 * Replace a method on an object with a test implementation
 * 
 * This function temporarily replaces a method with a stub implementation,
 * providing a restoration function to return the object to its original state.
 * 
 * Implementation strategy:
 * 1. Store original method reference before replacement
 * 2. Replace method with provided stub function  
 * 3. Return restoration function that reinstates original method
 * 4. Use closure to maintain access to original method and object
 * 
 * Why this approach:
 * - Closure pattern ensures original method is preserved correctly
 * - Restoration function provides clear, explicit cleanup
 * - No global state management required
 * - Works with any object and method combination
 * - Simple implementation is easy to debug when tests fail
 * 
 * Alternative approaches considered:
 * - Automatic restoration via setTimeout: Rejected due to unpredictable timing
 * - Stack-based restoration: Rejected due to complexity for minimal benefit
 * - Property descriptor manipulation: Current approach is simpler and sufficient
 * 
 * @param {Object} obj - The object containing the method to replace
 * @param {string} methodName - Name of the method to replace
 * @param {Function} stubFn - Function to use as replacement implementation
 * @returns {Function} Restoration function that reinstates the original method
 * 
 * @example
 * const restore = stubMethod(fs, 'readFileSync', () => 'mock data');
 * // fs.readFileSync now returns 'mock data'
 * restore();
 * // fs.readFileSync restored to original implementation
 */
function stubMethod(obj, methodName, stubFn) {
  console.log(`stubMethod is running with ${obj}, ${methodName}, ${stubFn}`); // logging function start per requirements
  
  try {
    const originalMethod = obj[methodName]; // store original before replacement to enable restoration
    obj[methodName] = stubFn; // replace method with stub implementation for testing isolation
    
    const restoreFunction = function restore() { // create restoration function for cleanup
      obj[methodName] = originalMethod; // reinstate original method implementation
    };
    
    console.log(`stubMethod is returning ${restoreFunction}`); // logging return value per requirements
    return restoreFunction;
  } catch (error) {
    console.log(`stubMethod error: ${error.message}`); // error logging for debugging
    throw error;
  }
}

// export stubMethod function at bottom per requirements
module.exports = stubMethod;
