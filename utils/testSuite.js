/**
 * Comprehensive Testing Suite Utilities (Refactored)
 * 
 * This module has been refactored to follow Single Responsibility Principle.
 * It now coordinates between focused testing utilities for better maintainability.
 * 
 * Components:
 * - testing/databaseTestHelper.js - Database testing utilities
 * - testing/mockManager.js - Mock management system
 * - testing/assertionHelper.js - Assertion helpers
 * - testing/testDataFactory.js - Test data creation
 * - testing/performanceTestHelper.js - Performance testing
 */

// Import focused testing utilities
const { DatabaseTestHelper } = require('./testing/databaseTestHelper');
const { MockManager } = require('./testing/mockManager');
const { AssertionHelper } = require('./testing/assertionHelper');
const { TestDataFactory } = require('./testing/testDataFactory');
const { PerformanceTestHelper } = require('./testing/performanceTestHelper');

// Export all testing utilities following qtests framework patterns
module.exports = {
  DatabaseTestHelper,
  MockManager,
  AssertionHelper,
  TestDataFactory,
  PerformanceTestHelper
};