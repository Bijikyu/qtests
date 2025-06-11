
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
    if (typeof obj !== 'object' || obj === null) { // ensure obj is valid before accessing properties
      throw new Error(`stubMethod expected object but received ${obj}`); // informative error for invalid obj
    }
    if (!(methodName in obj)) { // confirm property exists on target object
      throw new Error(`stubMethod could not find ${methodName} on provided object`); // error when method missing
    }
    if (typeof stubFn !== 'function') { // verify stubFn is callable
      throw new Error('stubMethod stubFn must be a function'); // error when stubFn invalid
    }
    // Store original method reference before replacement
    // This is critical for restoration - without this reference, the original method is lost forever
    // We must capture this before any modification to ensure we can restore exact original behavior
    const originalMethod = obj[methodName]; // capture original reference
    const hadOwn = Object.prototype.hasOwnProperty.call(obj, methodName); // track if property was own before stubbing
    
    // Replace method directly on the object for immediate effect
    // Direct property assignment chosen over Object.defineProperty for simplicity and performance
    // This approach works for 99% of use cases and avoids descriptor complexity
    obj[methodName] = stubFn;
    
    // Create restoration function using closure pattern
    // Closure captures originalMethod and obj references for later restoration
    // Named function 'restore' provides clear intent and better debugging experience
    // Returned function pattern allows caller to control when restoration occurs
    const restoreFunction = function restore() {
      // Reinstate original method only if it existed as own property, otherwise remove stub
      if (hadOwn) { // property was originally own so simply reassign
        obj[methodName] = originalMethod; // restore exact original method
      } else {
        delete obj[methodName]; // remove stub so prototype chain resolves original
      }
    };
    
    console.log(`stubMethod is returning ${restoreFunction}`); // logging return value per requirements
    return restoreFunction;
  } catch (error) {
    // Log error with context for debugging test setup issues
    // Error logging helps developers identify problems with object access or property assignment
    // We re-throw to maintain error handling contract while providing debugging information
    console.log(`stubMethod error: ${error.message}`);
    throw error;
  }
}

// export stubMethod function at bottom per requirements
module.exports = stubMethod;
