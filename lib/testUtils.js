/**
 * Advanced Testing Utilities
 * 
 * This module provides advanced testing utilities for complex testing scenarios,
 * including comprehensive test suite management, helper functions, and pattern
 * elimination utilities. These are higher-level utilities that build upon the
 * core testing functionality.
 * 
 * Design philosophy:
 * - Eliminate duplicate patterns across test suites
 * - Provide comprehensive testing workflows
 * - Advanced helper functions for complex scenarios
 * - Framework-agnostic patterns supporting multiple test runners
 * 
 * Why advanced testing utilities are grouped together:
 * 1. All utilities provide sophisticated testing patterns
 * 2. They build upon core utilities to provide higher-level functionality
 * 3. Often used together in large-scale testing scenarios
 * 4. Share common patterns for advanced test management
 * 
 * Module organization rationale:
 * These utilities are grouped because they all serve the purpose of
 * providing advanced testing capabilities that go beyond basic mocking
 * and stubbing, offering comprehensive solutions for complex testing needs.
 */

// Import testHelpers for advanced testing scenarios
// testHelpers provides module reloading, response mocking, and other
// specialized utilities needed for integration and complex unit testing
const testHelpers = require('../utils/testHelpers');

// Import testSuite utilities for comprehensive test pattern elimination
// testSuite provides centralized setup, teardown, mocking, and assertion
// patterns to eliminate duplicate code across test suites
const testSuite = require('../utils/testSuite');

/**
 * Export advanced testing utilities
 * 
 * These utilities are exported together because they provide
 * complementary functionality for advanced testing scenarios:
 * 
 * - testHelpers: For complex testing scenarios and integration testing
 * - testSuite: For comprehensive test suite management and pattern elimination
 * 
 * Export strategy:
 * - Object export for consistent access patterns
 * - Descriptive property names that indicate purpose
 * - Grouped by advanced functionality for developer convenience
 */
module.exports = {
  // Advanced helper functions for complex testing scenarios
  testHelpers,
  
  // Comprehensive test suite utilities for pattern elimination
  testSuite
};