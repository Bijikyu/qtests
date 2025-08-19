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

/**
 * TestSuiteBuilder - Fluent API for building comprehensive test suites
 * 
 * Provides a builder pattern for configuring test utilities with method chaining
 */
class TestSuiteBuilder {
  constructor() {
    this.config = {
      apiMocks: false,
      emailMocks: false,
      consoleMocks: false,
      performance: false,
      autoCleanup: true
    };
  }
  
  withApiMocks() {
    this.config.apiMocks = true;
    return this;
  }
  
  withEmailMocks() {
    this.config.emailMocks = true;
    return this;
  }
  
  withConsoleMocks() {
    this.config.consoleMocks = true;
    return this;
  }
  
  withPerformance() {
    this.config.performance = true;
    return this;
  }
  
  withoutAutoCleanup() {
    this.config.autoCleanup = false;
    return this;
  }
  
  build() {
    const mockManager = new MockManager();
    
    // Set up mocks based on configuration
    if (this.config.apiMocks) {
      mockManager.setupApiClientMocks();
    }
    if (this.config.emailMocks) {
      // Set up email mocks if needed
      try {
        const { sendEmail } = require('./email/emailSender');
        mockManager.mocks.set('email', { sendEmail });
      } catch (error) {
        // Email mocks not available, skip
      }
    }
    if (this.config.consoleMocks) {
      mockManager.setupConsoleMocks();
    }
    
    return {
      mocks: mockManager,
      db: new DatabaseTestHelper(), 
      assertions: new AssertionHelper(),
      assert: new AssertionHelper(), // Alias for compatibility
      data: new TestDataFactory(),
      performance: this.config.performance ? new PerformanceTestHelper() : null,
      config: { ...this.config }
    };
  }
}

// Export all testing utilities following qtests framework patterns
module.exports = {
  DatabaseTestHelper,
  MockManager,
  AssertionHelper,
  TestDataFactory,
  PerformanceTestHelper,
  TestSuiteBuilder
};