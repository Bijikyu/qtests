/**
 * Comprehensive Testing Suite Utilities - TypeScript Implementation (Refactored)
 * 
 * This module has been refactored to follow Single Responsibility Principle.
 * It now coordinates between focused testing utilities for better maintainability.
 * 
 * Components:
 * - testing/databaseTestHelper.ts - Database testing utilities
 * - testing/mockManager.ts - Mock management system
 * - testing/assertionHelper.ts - Assertion helpers
 * - testing/testDataFactory.ts - Test data creation
 * - testing/performanceTestHelper.ts - Performance testing
 */

// Import focused testing utilities
import { DatabaseTestHelper } from './testing/databaseTestHelper.js';
import { MockManager } from './testing/mockManager.js';
import { AssertionHelper } from './testing/assertionHelper.js';
import { TestDataFactory } from './testing/testDataFactory.js';
import { PerformanceTestHelper } from './testing/performanceTestHelper.js';

// Type definitions
interface TestSuiteConfig {
  apiMocks?: boolean;
  emailMocks?: boolean;
  consoleMocks?: boolean;
  performance?: boolean;
  autoCleanup?: boolean;
  database?: boolean;
  environmentMocks?: Record<string, string>;
  httpMocks?: any[];
}

interface TestSuiteInstance {
  mocks: MockManager;
  db?: DatabaseTestHelper;
  assertions: AssertionHelper;
  assert: typeof AssertionHelper;
  data: typeof TestDataFactory;
  performance?: typeof PerformanceTestHelper;
  config: TestSuiteConfig;
}

/**
 * TestSuiteBuilder - Fluent API for building comprehensive test suites
 * 
 * Provides a builder pattern for configuring test utilities with method chaining
 */
class TestSuiteBuilder {
  private config: TestSuiteConfig;

  constructor() {
    this.config = {
      apiMocks: false,
      emailMocks: false,
      consoleMocks: false,
      performance: false,
      autoCleanup: true
    };
  }
  
  withApiMocks(): TestSuiteBuilder {
    this.config.apiMocks = true;
    return this;
  }
  
  withEmailMocks(): TestSuiteBuilder {
    this.config.emailMocks = true;
    return this;
  }
  
  withConsoleMocks(): TestSuiteBuilder {
    this.config.consoleMocks = true;
    return this;
  }
  
  withPerformance(): TestSuiteBuilder {
    this.config.performance = true;
    return this;
  }

  withDatabase(): TestSuiteBuilder {
    this.config.database = true;
    return this;
  }

  withEnvironmentMocks(envVars?: Record<string, string>): TestSuiteBuilder {
    this.config.environmentMocks = envVars || {};
    return this;
  }

  withHttpMocks(responses?: any[]): TestSuiteBuilder {
    this.config.httpMocks = responses || [];
    return this;
  }
  
  withoutAutoCleanup(): TestSuiteBuilder {
    this.config.autoCleanup = false;
    return this;
  }
  
  build(): TestSuiteInstance {
    const mockManager = new MockManager();
    
    // Set up mocks based on configuration
    if (this.config.apiMocks) {
      mockManager.setupApiClientMocks();
    }
    if (this.config.emailMocks) {
      // Set up email mocks if needed
      try {
        // Note: Dynamic import would be needed for ES modules
        // For now, this is a placeholder for the email functionality
        // Use public API to register the mock instead of touching private fields
        mockManager.registerMock('email', { sendEmail: () => {} });
      } catch (error) {
        // Email mocks not available, skip
      }
    }
    if (this.config.consoleMocks) {
      mockManager.setupConsoleMocks();
    }
    if (this.config.environmentMocks && Object.keys(this.config.environmentMocks).length > 0) {
      mockManager.setupEnvironmentMocks(this.config.environmentMocks);
    }
    if (this.config.httpMocks && this.config.httpMocks.length > 0) {
      mockManager.setupHttpMocks(this.config.httpMocks);
    }
    
    const assertionHelper = new AssertionHelper();
    
    return {
      mocks: mockManager,
      db: this.config.database ? new DatabaseTestHelper() : undefined,
      assertions: assertionHelper,
      assert: AssertionHelper, // Return class for toBe() equality checks
      data: TestDataFactory, // Always return class for toBe() equality checks
      performance: this.config.performance ? PerformanceTestHelper : undefined, // Return class for toBe() equality checks
      config: { ...this.config }
    };
  }
}

// Export all testing utilities following qtests framework patterns using ES module syntax
export {
  DatabaseTestHelper,
  MockManager,
  AssertionHelper,
  TestDataFactory,
  PerformanceTestHelper,
  TestSuiteBuilder
};
