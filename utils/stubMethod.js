
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
  // Store the original method implementation before replacement
  // This reference is captured in the closure and used for restoration
  // Must be done before replacement to avoid losing the original reference
  const originalMethod = obj[methodName];
  
  // Replace the method with the provided stub function
  // This immediately changes the behavior of the method for all callers
  // The stub function will be called instead of the original implementation
  obj[methodName] = stubFn;
  
  // Return a restoration function that reinstates the original method
  // This function is returned immediately, allowing the caller to control
  // when restoration happens (typically in test cleanup)
  return function restore() {
    // Reinstate the original method implementation
    // This completely undoes the stubbing operation
    obj[methodName] = originalMethod;
  };
}

// Export the stubMethod function as the primary module interface
// Single function export pattern used because this module has one clear purpose
// Users can require this directly or access via the main qtests module
module.exports = stubMethod;
