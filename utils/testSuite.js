/**
 * Comprehensive Testing Suite Utilities for qtests Framework
 * 
 * This module provides centralized testing utilities that eliminate duplicate patterns
 * across test suites. It offers standardized setup/teardown, mocking, assertion,
 * and data creation patterns for consistent testing across different scenarios.
 * 
 * Design philosophy:
 * - Zero external dependencies beyond qtests framework utilities
 * - CommonJS compatibility for seamless integration with existing codebase
 * - Framework-agnostic patterns that work with Jest, vanilla Node.js, and other test runners
 * - Centralized patterns to reduce code duplication across test files
 * - Comprehensive error handling and logging following qtests patterns
 * 
 * Architecture approach:
 * - Class-based utilities for stateful management (database connections, mock state)
 * - Static utility classes for stateless operations (assertions, data factories)
 * - Builder pattern for flexible test suite configuration
 * - Automatic cleanup and state management for test isolation
 * 
 * Integration with qtests:
 * - Uses existing qtests utilities (stubMethod, mockConsole, testEnv, etc.)
 * - Follows qtests logging patterns with logStart/logReturn
 * - Maintains qtests zero-dependency philosophy
 * - Compatible with qtests module stubbing system
 */

const { logStart, logReturn } = require('../lib/logUtils');

/**
 * Database Testing Helper for In-Memory Database Management
 * 
 * This class provides centralized database testing utilities using qtests mockModels
 * instead of external database dependencies. It eliminates duplicate beforeEach/afterEach
 * patterns across storage tests while maintaining qtests zero-dependency approach.
 * 
 * Implementation rationale:
 * - Uses qtests mockModels for in-memory database simulation
 * - Provides consistent setup/teardown patterns across test files
 * - Manages model state isolation between tests
 * - Supports both automatic and manual setup modes
 * 
 * Usage patterns:
 * - Automatic: DatabaseTestHelper.createSuite() in test file
 * - Manual: Call setup() and teardown() in beforeEach/afterEach hooks
 * - Direct: Access models property for direct model manipulation
 */
class DatabaseTestHelper {
  constructor() {
    this.models = null;
    this.isSetup = false;
  }

  /**
   * Sets up in-memory database models and clears existing data
   * 
   * This method initializes the qtests mockModels system and ensures
   * a clean state for each test. It provides access to ApiKey, ApiLog,
   * and custom model creation capabilities.
   * 
   * @returns {Promise<void>} Resolves when setup is complete
   */
  async setup() {
    logStart('DatabaseTestHelper.setup');
    
    try {
      // Import qtests mockModels for in-memory database simulation
      const { mockModels } = require('../lib/envUtils');
      this.models = mockModels;
      
      // Clear existing model data for clean test state
      if (this.models.clearAllModels) {
        this.models.clearAllModels();
      } else {
        // Manual clearing if clearAllModels not available
        if (this.models.mockApiKeys) this.models.mockApiKeys.length = 0;
        if (this.models.mockLogs) this.models.mockLogs.length = 0;
      }
      
      this.isSetup = true;
      logReturn('DatabaseTestHelper.setup', 'completed');
    } catch (error) {
      logReturn('DatabaseTestHelper.setup', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Tears down database connections and clears model state
   * 
   * This method provides cleanup functionality to ensure test isolation.
   * It clears all model data and resets the helper state.
   * 
   * @returns {Promise<void>} Resolves when teardown is complete
   */
  async teardown() {
    logStart('DatabaseTestHelper.teardown');
    
    try {
      if (this.models) {
        // Clear all model data
        if (this.models.clearAllModels) {
          this.models.clearAllModels();
        } else {
          // Manual clearing if clearAllModels not available
          if (this.models.mockApiKeys) this.models.mockApiKeys.length = 0;
          if (this.models.mockLogs) this.models.mockLogs.length = 0;
        }
      }
      
      this.models = null;
      this.isSetup = false;
      logReturn('DatabaseTestHelper.teardown', 'completed');
    } catch (error) {
      logReturn('DatabaseTestHelper.teardown', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creates a complete test suite setup with automatic cleanup
   * 
   * This static method provides the most convenient way to set up database
   * testing with automatic beforeEach/afterEach hook management. It reduces
   * boilerplate in test files by handling setup/teardown automatically.
   * 
   * Note: This should only be called at the top level of test files,
   * not inside individual test cases, due to Jest hook restrictions.
   * 
   * @returns {DatabaseTestHelper} Configured helper instance
   */
  static createSuite() {
    logStart('DatabaseTestHelper.createSuite');
    
    const helper = new DatabaseTestHelper();
    
    // Only set up hooks if they're available and we're at the right scope
    try {
      if (typeof beforeEach === 'function' && typeof afterEach === 'function') {
        // Check if we're in a test context by attempting to define hooks
        const isValidTestContext = typeof describe === 'function' && typeof it === 'function';
        
        if (isValidTestContext) {
          beforeEach(async () => {
            await helper.setup();
          });

          afterEach(async () => {
            await helper.teardown();
          });
        } else {
          console.log('[DatabaseTestHelper] Hooks available but not in valid test context - use manual setup/teardown');
        }
      } else {
        console.log('[DatabaseTestHelper] No test hooks detected - use manual setup/teardown');
      }
    } catch (error) {
      console.log('[DatabaseTestHelper] Could not set up automatic hooks - use manual setup/teardown');
    }
    
    logReturn('DatabaseTestHelper.createSuite', helper);
    return helper;
  }

  /**
   * Get direct access to models for advanced testing scenarios
   * 
   * @returns {Object} Mock models object with ApiKey, ApiLog, etc.
   */
  getModels() {
    if (!this.isSetup) {
      throw new Error('DatabaseTestHelper must be set up before accessing models');
    }
    return this.models;
  }
}

/**
 * Mock Management System for Consistent API and Service Mocking
 * 
 * This class provides centralized mock management that eliminates duplicate
 * mock patterns across test files. It uses qtests utilities for consistent
 * mocking while providing advanced mock configuration capabilities.
 * 
 * Design approach:
 * - Builds on qtests stubMethod and mockConsole utilities
 * - Provides standardized mock responses for common scenarios
 * - Manages mock lifecycle and cleanup automatically
 * - Supports both simple and advanced mock configurations
 */
class MockManager {
  constructor() {
    this.mocks = new Map();
    this.restorations = new Map();
  }

  /**
   * Sets up API client mocks using qtests stubMethod utility
   * 
   * This method provides consistent mock patterns for HTTP client testing
   * using qtests' existing stubbing capabilities rather than external mocking libraries.
   * 
   * @param {Object} customResponses - Custom response configurations
   */
  setupApiClientMocks(customResponses = {}) {
    logStart('MockManager.setupApiClientMocks', customResponses);
    
    try {
      const { stubMethod } = require('../lib/envUtils');
      
      // Default API responses
      const defaultResponses = {
        get: { status: 200, data: {} },
        post: { status: 201, data: { id: 1 } },
        put: { status: 200, data: { updated: true } },
        delete: { status: 204, data: null }
      };
      
      const responses = { ...defaultResponses, ...customResponses };
      
      // Create mock API client object
      const mockApiClient = {
        get: () => Promise.resolve(responses.get),
        post: () => Promise.resolve(responses.post),
        put: () => Promise.resolve(responses.put),
        delete: () => Promise.resolve(responses.delete),
        request: () => Promise.resolve(responses.get) // generic request method
      };
      
      this.mocks.set('apiClient', mockApiClient);
      
      // If we have a global HTTP client to stub, stub it
      if (typeof global.fetch === 'function') {
        const originalFetch = global.fetch;
        global.fetch = (url, options = {}) => {
          const method = (options.method || 'GET').toLowerCase();
          const response = responses[method] || responses.get;
          
          return Promise.resolve({
            ok: response.status < 400,
            status: response.status,
            json: () => Promise.resolve(response.data),
            text: () => Promise.resolve(JSON.stringify(response.data))
          });
        };
        
        this.restorations.set('fetch', () => {
          global.fetch = originalFetch;
        });
      }
      
      logReturn('MockManager.setupApiClientMocks', 'completed');
    } catch (error) {
      logReturn('MockManager.setupApiClientMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sets up console and notification mocks using qtests utilities
   * 
   * This method uses qtests mockConsole utility to provide consistent
   * console mocking for testing notification and logging behavior.
   * 
   * @returns {Object} Mock console functions
   */
  setupConsoleMocks() {
    logStart('MockManager.setupConsoleMocks');
    
    try {
      const { mockConsole } = require('../lib/envUtils');
      
      // Use qtests mockConsole utility
      const mockConsoleResult = mockConsole();
      const { mockLog, mockError, mockWarn, restore } = mockConsoleResult;
      
      const consoleMocks = {
        log: mockLog,
        error: mockError,
        warn: mockWarn,
        restore
      };
      
      this.mocks.set('console', consoleMocks);
      this.restorations.set('console', restore);
      
      logReturn('MockManager.setupConsoleMocks', consoleMocks);
      return consoleMocks;
    } catch (error) {
      logReturn('MockManager.setupConsoleMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sets up environment variable mocks using qtests testEnv utility
   * 
   * This method provides consistent environment variable mocking
   * for testing configuration-dependent code paths.
   * 
   * @param {Object} envVars - Environment variables to set
   * @returns {Function} Restoration function
   */
  setupEnvironmentMocks(envVars = {}) {
    logStart('MockManager.setupEnvironmentMocks', envVars);
    
    try {
      const { testEnv } = require('../lib/envUtils');
      
      // Save current environment and set test values
      const restore = testEnv.save();
      testEnv.set(envVars);
      
      this.mocks.set('environment', envVars);
      this.restorations.set('environment', restore);
      
      logReturn('MockManager.setupEnvironmentMocks', 'completed');
      return restore;
    } catch (error) {
      logReturn('MockManager.setupEnvironmentMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sets up email mocking using qtests sendEmail utility
   * 
   * This method provides consistent email mocking for testing
   * notification workflows without external email services.
   * 
   * @returns {Object} Email mock utilities
   */
  setupEmailMocks() {
    logStart('MockManager.setupEmailMocks');
    
    try {
      const { sendEmail } = require('../lib/envUtils');
      
      // Clear previous email history
      sendEmail.clearEmailHistory();
      
      const emailMocks = {
        sendEmail: sendEmail.sendEmail,
        sendEmailBatch: sendEmail.sendEmailBatch,
        getHistory: sendEmail.getEmailHistory,
        clearHistory: sendEmail.clearEmailHistory
      };
      
      this.mocks.set('email', emailMocks);
      
      logReturn('MockManager.setupEmailMocks', emailMocks);
      return emailMocks;
    } catch (error) {
      logReturn('MockManager.setupEmailMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sets up HTTP integration test mocks using qtests httpTest utility
   * 
   * This method provides consistent HTTP endpoint mocking for
   * integration testing without external dependencies.
   * 
   * @param {Array} responses - Array of response configurations
   * @returns {Object} HTTP test utilities
   */
  setupHttpMocks(responses = []) {
    logStart('MockManager.setupHttpMocks', responses);
    
    try {
      const { httpTest } = require('../lib/envUtils');
      
      // Create mock application with configured responses
      const mockApp = httpTest.createMockApp();
      
      // Configure routes with provided responses
      responses.forEach(({ method = 'GET', path = '/', status = 200, data = {} }) => {
        mockApp[method.toLowerCase()](path, (req, res) => {
          res.status(status).json(data);
        });
      });
      
      const httpMocks = {
        app: mockApp,
        supertest: httpTest.supertest,
        request: (app) => httpTest.supertest(app || mockApp)
      };
      
      this.mocks.set('http', httpMocks);
      
      logReturn('MockManager.setupHttpMocks', httpMocks);
      return httpMocks;
    } catch (error) {
      logReturn('MockManager.setupHttpMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clears all mocks and restores original functionality
   * 
   * This method provides comprehensive cleanup to ensure test isolation.
   * It should be called in beforeEach hooks for clean test state.
   */
  clearAll() {
    logStart('MockManager.clearAll');
    
    try {
      // Restore all stubbed functions
      this.restorations.forEach((restore, name) => {
        try {
          restore();
        } catch (error) {
          console.log(`Failed to restore ${name}: ${error.message}`);
        }
      });
      
      // Clear mock storage
      this.mocks.clear();
      this.restorations.clear();
      
      logReturn('MockManager.clearAll', 'completed');
    } catch (error) {
      logReturn('MockManager.clearAll', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets a specific mock by name for custom assertions
   * 
   * @param {string} name - Name of the mock to retrieve
   * @returns {any} Mock object or undefined if not found
   */
  getMock(name) {
    logStart('MockManager.getMock', name);
    const mock = this.mocks.get(name);
    logReturn('MockManager.getMock', mock ? 'found' : 'not found');
    return mock;
  }
}

/**
 * Assertion Helper Utilities for Common Testing Patterns
 * 
 * This class centralizes repetitive assertion logic with descriptive helpers
 * that reduce code duplication across test files while providing clear,
 * readable test assertions.
 * 
 * Design philosophy:
 * - Static methods for stateless assertion operations
 * - Framework-agnostic assertions that work with any test runner
 * - Descriptive method names that make test intent clear
 * - Comprehensive error messages for failed assertions
 */
class AssertionHelper {
  /**
   * Asserts that an object has standard database entity properties
   * 
   * This method eliminates repetitive property checks across entity tests
   * by providing a standardized way to verify database entity structure.
   * 
   * @param {Object} entity - Entity object to validate
   * @param {Object} expectedProperties - Expected property values
   */
  static assertDatabaseEntity(entity, expectedProperties = {}) {
    logStart('AssertionHelper.assertDatabaseEntity', entity, expectedProperties);
    
    try {
      if (!entity) {
        throw new Error('Entity cannot be null or undefined');
      }
      
      // Check for database-specific properties
      if (entity._id !== undefined) {
        if (!entity._id) {
          throw new Error('Entity _id must be defined and truthy');
        }
      }
      
      if (entity.id !== undefined) {
        if (!entity.id) {
          throw new Error('Entity id must be defined and truthy');
        }
      }
      
      if (entity.createdAt !== undefined) {
        if (!(entity.createdAt instanceof Date)) {
          throw new Error('Entity createdAt must be a Date instance');
        }
      }
      
      // Check expected properties
      Object.entries(expectedProperties).forEach(([key, value]) => {
        if (entity[key] !== value) {
          throw new Error(`Expected entity.${key} to be ${value}, but got ${entity[key]}`);
        }
      });
      
      logReturn('AssertionHelper.assertDatabaseEntity', 'passed');
    } catch (error) {
      logReturn('AssertionHelper.assertDatabaseEntity', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts API response structure and status
   * 
   * This method standardizes API response validation across endpoint tests
   * by providing consistent checks for status codes and response structure.
   * 
   * @param {Object} response - API response object
   * @param {number} expectedStatus - Expected HTTP status code
   * @param {boolean} hasData - Whether response should have data
   */
  static assertApiResponse(response, expectedStatus, hasData = true) {
    logStart('AssertionHelper.assertApiResponse', response, expectedStatus, hasData);
    
    try {
      if (!response) {
        throw new Error('Response cannot be null or undefined');
      }
      
      if (response.status !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, but got ${response.status}`);
      }
      
      if (hasData) {
        if (!response.body && !response.data) {
          throw new Error('Response should have body or data property');
        }
      }
      
      if (expectedStatus >= 400) {
        const errorData = response.body || response.data || {};
        if (!errorData.error && !errorData.message) {
          throw new Error('Error responses should have error or message property');
        }
      }
      
      logReturn('AssertionHelper.assertApiResponse', 'passed');
    } catch (error) {
      logReturn('AssertionHelper.assertApiResponse', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts email sending behavior using qtests sendEmail utility
   * 
   * This method provides standardized email assertion patterns for
   * testing notification workflows and email-dependent functionality.
   * 
   * @param {Object} expectedEmail - Expected email properties
   * @param {Object} options - Assertion options
   */
  static assertEmailSent(expectedEmail = {}, options = {}) {
    logStart('AssertionHelper.assertEmailSent', expectedEmail, options);
    
    try {
      const { sendEmail } = require('../lib/envUtils');
      const emailHistory = sendEmail.getEmailHistory();
      
      const { count = 1, index = emailHistory.length - 1 } = options;
      
      if (emailHistory.length < count) {
        throw new Error(`Expected at least ${count} emails, but found ${emailHistory.length}`);
      }
      
      if (index >= emailHistory.length || index < 0) {
        throw new Error(`Email index ${index} out of range (0-${emailHistory.length - 1})`);
      }
      
      const email = emailHistory[index];
      
      if (!email.success) {
        throw new Error(`Email at index ${index} failed: ${email.message}`);
      }
      
      // Check expected email properties
      Object.entries(expectedEmail).forEach(([key, value]) => {
        const emailValue = email.emailData?.[key] || email[key];
        if (emailValue !== value) {
          throw new Error(`Expected email.${key} to be ${value}, but got ${emailValue}`);
        }
      });
      
      logReturn('AssertionHelper.assertEmailSent', 'passed');
    } catch (error) {
      logReturn('AssertionHelper.assertEmailSent', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts mock function call behavior
   * 
   * This method provides standardized mock assertion patterns for
   * verifying function calls and their arguments.
   * 
   * @param {Function} mockFn - Mock function to check
   * @param {Object} options - Call assertion options
   */
  static assertMockCalled(mockFn, options = {}) {
    logStart('AssertionHelper.assertMockCalled', mockFn, options);
    
    try {
      if (typeof mockFn !== 'function') {
        throw new Error('mockFn must be a function');
      }
      
      const { times, calledWith, lastCalledWith } = options;
      
      // Check if function has call tracking (Jest-style)
      if (mockFn.mock) {
        if (times !== undefined && mockFn.mock.calls.length !== times) {
          throw new Error(`Expected ${times} calls, but got ${mockFn.mock.calls.length}`);
        }
        
        if (calledWith && !mockFn.mock.calls.some(call => 
          call.every((arg, index) => arg === calledWith[index])
        )) {
          throw new Error(`Mock was not called with expected arguments: ${JSON.stringify(calledWith)}`);
        }
        
        if (lastCalledWith && mockFn.mock.calls.length > 0) {
          const lastCall = mockFn.mock.calls[mockFn.mock.calls.length - 1];
          if (!lastCall.every((arg, index) => arg === lastCalledWith[index])) {
            throw new Error(`Mock was not last called with: ${JSON.stringify(lastCalledWith)}`);
          }
        }
      }
      // Simple call tracking for non-Jest environments
      else if (mockFn.callCount !== undefined) {
        if (times !== undefined && mockFn.callCount !== times) {
          throw new Error(`Expected ${times} calls, but got ${mockFn.callCount}`);
        }
      }
      else {
        console.log('Warning: Mock function does not support call tracking');
      }
      
      logReturn('AssertionHelper.assertMockCalled', 'passed');
    } catch (error) {
      logReturn('AssertionHelper.assertMockCalled', `failed: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Test Data Factory for Creating Realistic Test Entities
 * 
 * This class eliminates duplicate test data creation across test files
 * by providing standardized factory methods for common test entities.
 * All data is realistic and follows common application patterns.
 * 
 * Design approach:
 * - Static factory methods for consistency
 * - Realistic default values with override capabilities
 * - Incremental data generation for unique test scenarios
 * - Support for creating multiple related entities
 */
class TestDataFactory {
  static counter = 0;

  /**
   * Gets next unique counter value for test data
   * 
   * @returns {number} Incremented counter value
   */
  static nextId() {
    return ++this.counter;
  }

  /**
   * Creates a test user with realistic properties
   * 
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Test user object
   */
  static createUser(overrides = {}) {
    logStart('TestDataFactory.createUser', overrides);
    
    const id = this.nextId();
    const user = {
      id: `user-${id}`,
      username: `testuser${id}`,
      email: `test${id}@example.com`,
      password: `hashedpassword${id}`,
      firstName: 'Test',
      lastName: `User${id}`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
    
    logReturn('TestDataFactory.createUser', user);
    return user;
  }

  /**
   * Creates a test API key with realistic properties
   * 
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Test API key object
   */
  static createApiKey(overrides = {}) {
    logStart('TestDataFactory.createApiKey', overrides);
    
    const id = this.nextId();
    const apiKey = {
      id: `key-${id}`,
      key: `test-api-key-${id}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Test API Key ${id}`,
      userId: `user-${id}`,
      isActive: true,
      permissions: ['read', 'write'],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      ...overrides
    };
    
    logReturn('TestDataFactory.createApiKey', apiKey);
    return apiKey;
  }

  /**
   * Creates a test log entry with realistic properties
   * 
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Test log entry object
   */
  static createLogEntry(overrides = {}) {
    logStart('TestDataFactory.createLogEntry', overrides);
    
    const id = this.nextId();
    const logEntry = {
      id: `log-${id}`,
      message: `Test log message ${id}`,
      level: 'info',
      timestamp: new Date(),
      userId: `user-${id}`,
      source: 'test-application',
      metadata: {
        testId: id,
        environment: 'test'
      },
      ...overrides
    };
    
    logReturn('TestDataFactory.createLogEntry', logEntry);
    return logEntry;
  }

  /**
   * Creates a test configuration object with realistic properties
   * 
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Test configuration object
   */
  static createConfig(overrides = {}) {
    logStart('TestDataFactory.createConfig', overrides);
    
    const id = this.nextId();
    const config = {
      id: `config-${id}`,
      name: `Test Configuration ${id}`,
      environment: 'test',
      settings: {
        apiUrl: `https://api-test-${id}.example.com`,
        timeout: 5000,
        retries: 3,
        debug: true
      },
      features: {
        authentication: true,
        logging: true,
        monitoring: false
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
    
    logReturn('TestDataFactory.createConfig', config);
    return config;
  }

  /**
   * Creates multiple test entities of the same type
   * 
   * @param {Function} factory - Factory function to use
   * @param {number} count - Number of entities to create
   * @param {Object} baseOverrides - Base overrides for all entities
   * @returns {Array} Array of created entities
   */
  static createMultiple(factory, count, baseOverrides = {}) {
    logStart('TestDataFactory.createMultiple', factory.name, count, baseOverrides);
    
    const entities = Array.from({ length: count }, (_, index) => {
      return factory.call(this, { ...baseOverrides, index });
    });
    
    logReturn('TestDataFactory.createMultiple', `${count} entities created`);
    return entities;
  }

  /**
   * Creates related test entities (user with API keys, etc.)
   * 
   * @param {Object} options - Configuration for related entities
   * @returns {Object} Object containing all related entities
   */
  static createRelatedEntities(options = {}) {
    logStart('TestDataFactory.createRelatedEntities', options);
    
    const {
      userCount = 1,
      apiKeysPerUser = 2,
      logsPerUser = 3,
      configCount = 1
    } = options;
    
    const users = this.createMultiple(this.createUser, userCount);
    const apiKeys = [];
    const logs = [];
    
    users.forEach(user => {
      // Create API keys for each user
      const userApiKeys = this.createMultiple(
        this.createApiKey,
        apiKeysPerUser,
        { userId: user.id }
      );
      apiKeys.push(...userApiKeys);
      
      // Create logs for each user
      const userLogs = this.createMultiple(
        this.createLogEntry,
        logsPerUser,
        { userId: user.id }
      );
      logs.push(...userLogs);
    });
    
    const configs = this.createMultiple(this.createConfig, configCount);
    
    const result = {
      users,
      apiKeys,
      logs,
      configs
    };
    
    logReturn('TestDataFactory.createRelatedEntities', result);
    return result;
  }

  /**
   * Resets the counter for consistent test data generation
   */
  static reset() {
    this.counter = 0;
  }
}

/**
 * Performance Testing Helper for Load and Timing Tests
 * 
 * This class provides standardized performance measurement across test suites
 * with timing assertions and concurrency testing capabilities.
 * 
 * Design approach:
 * - High-resolution timing using process.hrtime.bigint()
 * - Concurrent operation testing for race condition detection
 * - Memory usage tracking for resource-intensive operations
 * - Statistical analysis of performance metrics
 */
class PerformanceTestHelper {
  /**
   * Measures execution time of async operations with high precision
   * 
   * @param {Function} operation - Async operation to measure
   * @returns {Promise<Object>} Result object with operation result and timing
   */
  static async measureTime(operation) {
    logStart('PerformanceTestHelper.measureTime', operation.name || 'anonymous');
    
    try {
      const start = process.hrtime.bigint();
      const result = await operation();
      const end = process.hrtime.bigint();
      
      const durationNs = Number(end - start);
      const durationMs = durationNs / 1000000; // Convert nanoseconds to milliseconds
      
      const measurement = {
        result,
        duration: durationMs,
        durationNs,
        timestamp: new Date()
      };
      
      logReturn('PerformanceTestHelper.measureTime', `${durationMs.toFixed(2)}ms`);
      return measurement;
    } catch (error) {
      logReturn('PerformanceTestHelper.measureTime', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts operation completes within time limit
   * 
   * @param {Function} operation - Operation to test
   * @param {number} maxDuration - Maximum allowed duration in milliseconds
   * @returns {Promise<any>} Operation result if within time limit
   */
  static async assertTimingConstraint(operation, maxDuration) {
    logStart('PerformanceTestHelper.assertTimingConstraint', operation.name, maxDuration);
    
    try {
      const { result, duration } = await this.measureTime(operation);
      
      if (duration > maxDuration) {
        throw new Error(
          `Operation took ${duration.toFixed(2)}ms, exceeding limit of ${maxDuration}ms`
        );
      }
      
      logReturn('PerformanceTestHelper.assertTimingConstraint', `passed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      logReturn('PerformanceTestHelper.assertTimingConstraint', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Tests concurrent operations for race conditions and performance
   * 
   * @param {Array<Function>} operations - Array of async operations to run concurrently
   * @returns {Promise<Object>} Results with timing and concurrency analysis
   */
  static async testConcurrency(operations) {
    logStart('PerformanceTestHelper.testConcurrency', `${operations.length} operations`);
    
    try {
      const start = process.hrtime.bigint();
      
      // Run all operations concurrently
      const promises = operations.map(async (operation, index) => {
        try {
          const opStart = process.hrtime.bigint();
          const result = await operation();
          const opEnd = process.hrtime.bigint();
          
          return {
            index,
            result,
            duration: Number(opEnd - opStart) / 1000000,
            success: true
          };
        } catch (error) {
          return {
            index,
            error: error.message,
            duration: 0,
            success: false
          };
        }
      });
      
      const results = await Promise.all(promises);
      const end = process.hrtime.bigint();
      
      const totalDuration = Number(end - start) / 1000000;
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      const analysis = {
        results,
        totalDuration,
        successful: successful.length,
        failed: failed.length,
        averageDuration: successful.length > 0 
          ? successful.reduce((sum, r) => sum + r.duration, 0) / successful.length 
          : 0,
        maxDuration: successful.length > 0 
          ? Math.max(...successful.map(r => r.duration)) 
          : 0,
        minDuration: successful.length > 0 
          ? Math.min(...successful.map(r => r.duration)) 
          : 0
      };
      
      logReturn('PerformanceTestHelper.testConcurrency', 
        `${successful.length}/${operations.length} successful in ${totalDuration.toFixed(2)}ms`);
      return analysis;
    } catch (error) {
      logReturn('PerformanceTestHelper.testConcurrency', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Measures memory usage of operations
   * 
   * @param {Function} operation - Operation to measure
   * @returns {Promise<Object>} Result with memory usage statistics
   */
  static async measureMemory(operation) {
    logStart('PerformanceTestHelper.measureMemory', operation.name || 'anonymous');
    
    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const beforeMemory = process.memoryUsage();
      const result = await operation();
      const afterMemory = process.memoryUsage();
      
      const memoryDelta = {
        rss: afterMemory.rss - beforeMemory.rss,
        heapTotal: afterMemory.heapTotal - beforeMemory.heapTotal,
        heapUsed: afterMemory.heapUsed - beforeMemory.heapUsed,
        external: afterMemory.external - beforeMemory.external
      };
      
      const measurement = {
        result,
        beforeMemory,
        afterMemory,
        memoryDelta,
        timestamp: new Date()
      };
      
      logReturn('PerformanceTestHelper.measureMemory', 
        `heap used: ${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      return measurement;
    } catch (error) {
      logReturn('PerformanceTestHelper.measureMemory', `error: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Unified Test Suite Builder for Comprehensive Test Setup
 * 
 * This class provides a fluent interface for configuring comprehensive test
 * environments with all necessary utilities. It combines all helper utilities
 * into a single, easy-to-use API that eliminates setup boilerplate.
 * 
 * Usage pattern:
 * ```javascript
 * const suite = new TestSuiteBuilder()
 *   .withDatabase()
 *   .withMocks()
 *   .withPerformance()
 *   .build();
 * ```
 */
class TestSuiteBuilder {
  constructor() {
    this.dbHelper = null;
    this.mockManager = new MockManager();
    this.includePerformance = false;
    this.autoCleanup = true;
  }

  /**
   * Enables database testing with automatic setup/teardown
   * 
   * @returns {TestSuiteBuilder} This instance for chaining
   */
  withDatabase() {
    logStart('TestSuiteBuilder.withDatabase');
    this.dbHelper = new DatabaseTestHelper(); // Use direct instantiation to avoid hook issues
    logReturn('TestSuiteBuilder.withDatabase', 'enabled');
    return this;
  }

  /**
   * Enables API mocking with standard patterns
   * 
   * @param {Object} options - Mock configuration options
   * @returns {TestSuiteBuilder} This instance for chaining
   */
  withApiMocks(options = {}) {
    logStart('TestSuiteBuilder.withApiMocks', options);
    this.mockManager.setupApiClientMocks(options.apiResponses);
    logReturn('TestSuiteBuilder.withApiMocks', 'enabled');
    return this;
  }

  /**
   * Enables console mocking for output testing
   * 
   * @returns {TestSuiteBuilder} This instance for chaining
   */
  withConsoleMocks() {
    logStart('TestSuiteBuilder.withConsoleMocks');
    this.mockManager.setupConsoleMocks();
    logReturn('TestSuiteBuilder.withConsoleMocks', 'enabled');
    return this;
  }

  /**
   * Enables environment variable mocking
   * 
   * @param {Object} envVars - Environment variables to set
   * @returns {TestSuiteBuilder} This instance for chaining
   */
  withEnvironmentMocks(envVars = {}) {
    logStart('TestSuiteBuilder.withEnvironmentMocks', envVars);
    this.mockManager.setupEnvironmentMocks(envVars);
    logReturn('TestSuiteBuilder.withEnvironmentMocks', 'enabled');
    return this;
  }

  /**
   * Enables email mocking for notification testing
   * 
   * @returns {TestSuiteBuilder} This instance for chaining
   */
  withEmailMocks() {
    logStart('TestSuiteBuilder.withEmailMocks');
    this.mockManager.setupEmailMocks();
    logReturn('TestSuiteBuilder.withEmailMocks', 'enabled');
    return this;
  }

  /**
   * Enables HTTP integration testing
   * 
   * @param {Array} responses - HTTP response configurations
   * @returns {TestSuiteBuilder} This instance for chaining
   */
  withHttpMocks(responses = []) {
    logStart('TestSuiteBuilder.withHttpMocks', responses);
    this.mockManager.setupHttpMocks(responses);
    logReturn('TestSuiteBuilder.withHttpMocks', 'enabled');
    return this;
  }

  /**
   * Enables performance testing utilities
   * 
   * @returns {TestSuiteBuilder} This instance for chaining
   */
  withPerformance() {
    logStart('TestSuiteBuilder.withPerformance');
    this.includePerformance = true;
    logReturn('TestSuiteBuilder.withPerformance', 'enabled');
    return this;
  }

  /**
   * Disables automatic cleanup (use for manual cleanup control)
   * 
   * @returns {TestSuiteBuilder} This instance for chaining
   */
  withoutAutoCleanup() {
    logStart('TestSuiteBuilder.withoutAutoCleanup');
    this.autoCleanup = false;
    logReturn('TestSuiteBuilder.withoutAutoCleanup', 'disabled auto cleanup');
    return this;
  }

  /**
   * Builds and returns the configured test suite utilities
   * 
   * @returns {Object} Object containing all configured test utilities
   */
  build() {
    logStart('TestSuiteBuilder.build');
    
    // Set up automatic cleanup if enabled
    if (this.autoCleanup) {
      // Try to set up beforeEach hook for mock cleanup
      try {
        if (typeof beforeEach === 'function') {
          const isValidTestContext = typeof describe === 'function' && typeof it === 'function';
          
          if (isValidTestContext) {
            beforeEach(() => {
              this.mockManager.clearAll();
              TestDataFactory.reset();
            });
          } else {
            console.log('Warning: Not in valid test context - manual cleanup required');
          }
        }
      } catch (error) {
        console.log('Warning: Could not set up automatic cleanup hooks');
      }
    }

    const suite = {
      db: this.dbHelper,
      mocks: this.mockManager,
      assert: AssertionHelper,
      data: TestDataFactory,
      ...(this.includePerformance && { performance: PerformanceTestHelper })
    };

    logReturn('TestSuiteBuilder.build', 'test suite built');
    return suite;
  }
}

// Export all utilities for flexible usage
module.exports = {
  DatabaseTestHelper,
  MockManager,
  AssertionHelper,
  TestDataFactory,
  PerformanceTestHelper,
  TestSuiteBuilder
};