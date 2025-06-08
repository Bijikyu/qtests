
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
 */

const stubMethod = require('../utils/stubMethod');
const { mockConsole } = require('../utils/mockConsole');

/**
 * Export core testing utilities
 * 
 * These are the most commonly used utilities in the qtests framework:
 * - stubMethod: For replacing methods during tests
 * - mockConsole: For capturing console output during tests
 */
module.exports = {
  stubMethod,      // Method replacement utility for isolating dependencies
  mockConsole      // Console output capture for testing logging behavior
};
