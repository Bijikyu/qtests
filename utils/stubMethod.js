
/**
 * Method Stubbing Utility
 * 
 * Provides a simple, reliable way to temporarily replace any method on any object
 * during testing, with guaranteed restoration to prevent test pollution.
 * 
 * Design philosophy:
 * - Simple API: one function call to stub, one call to restore
 * - Safe: always preserves original method for restoration
 * - Universal: works with any object and method combination
 * - Error-safe: propagates errors rather than silently failing
 * 
 * Why this approach:
 * - More explicit than automatic mocking frameworks
 * - No dependencies on specific testing libraries
 * - Works in any JavaScript environment
 * - Gives precise control over what gets stubbed when
 */

/**
 * Temporarily replaces a method on an object with a stub implementation
 * 
 * This function is the core of qtests' method stubbing capability. It safely
 * stores the original method and provides a restoration function to ensure
 * tests don't interfere with each other.
 * 
 * Technical implementation:
 * - Captures reference to original method before replacement
 * - Assigns new implementation to the same property
 * - Returns a closure that restores the original method
 * 
 * Error handling approach:
 * - Allows any errors during stubbing to propagate (fail fast)
 * - This prevents silent failures that could lead to confusing test results
 * - Callers can handle errors appropriately for their context
 * 
 * @param {Object} obj - The object containing the method to stub
 *                      Can be any JavaScript object with properties
 * @param {string} method - The name of the method to replace
 *                         Must be a valid property name on the object
 * @param {Function} replacement - The stub function to use during testing
 *                                Should match expected signature of original method
 * @returns {Function} Restoration function - call this to restore the original method
 *                    MUST be called after testing to prevent test pollution
 * @throws {Error} Propagates any errors from property assignment or access
 */
function stubMethod(obj, method, replacement) {
  try {
    // Capture original method reference before replacement
    // This preserves the exact original function for later restoration
    const orig = obj[method];
    
    // Replace the method with our stub implementation
    // This assignment may throw if the property is non-configurable
    obj[method] = replacement;
    
    // Return restoration function as a closure
    // The closure captures 'orig' and 'obj[method]' references
    // This ensures restoration works even if the object changes
    const restore = () => { 
      obj[method] = orig; 
    };
    
    return restore;
  } catch (error) {
    // Re-throw any errors rather than swallowing them
    // This ensures callers know when stubbing fails
    // Common causes: non-configurable properties, frozen objects
    throw error;
  }
}

// Export as a single function since this utility has one clear purpose
module.exports = stubMethod;
