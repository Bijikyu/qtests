
/**
 * Core Testing Utilities
 * 
 * This module provides the fundamental testing utilities that form the backbone
 * of the qtests framework. These utilities are used across different testing
 * scenarios and provide basic functionality for method stubbing and console mocking.
 * 
 * Design philosophy:
 * - Simple, focused utilities that do one thing well
 * - Minimal dependencies to avoid circular imports
 * - Framework-agnostic implementations
 * - Consistent API patterns across utilities
 * 
 * Architecture rationale:
 * This module serves as the foundation layer because:
 * 1. These utilities have no dependencies on other qtests modules
 * 2. They provide primitive operations that other modules build upon
 * 3. Keeping them separate prevents circular dependency issues
 * 4. They can be used independently without importing the full qtests suite
 */

// Import the core stubMethod utility from utils directory
// This is placed in utils/ rather than lib/ because it's a pure utility function
// that doesn't depend on any qtests-specific architecture
const stubMethod = require('../utils/stubMethod');

// Import mockConsole from its dedicated utility module
// The destructuring here extracts just mockConsole from the module exports
// This pattern allows the mockConsole module to export additional utilities
// in the future without breaking this import
const { mockConsole } = require('../utils/mockConsole');

/**
 * Export core testing utilities
 * 
 * These are the most commonly used utilities in the qtests framework.
 * They are exported at the top level because:
 * 1. stubMethod and mockConsole are used in 80% of testing scenarios
 * 2. They have simple, predictable APIs that don't require namespacing
 * 3. They form the foundation that other utilities build upon
 * 4. Frequent usage justifies top-level access for developer convenience
 * 
 * Export strategy:
 * - Direct object export rather than individual exports for consistency
 * - Descriptive property names that clearly indicate purpose
 * - Comments explain the primary use case for each utility
 */
// export core testing utilities at bottom per requirements
module.exports = {
  stubMethod, // method replacement utility for isolating dependencies
  mockConsole // console output capture utility for testing logging
};
