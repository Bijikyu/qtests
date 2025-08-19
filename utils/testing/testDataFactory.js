/**
 * Test Data Factory for Creating Realistic Test Entities
 * 
 * This class focuses solely on test data creation and management.
 * It eliminates duplicate test data creation across test files.
 */

const { logStart, logReturn } = require('../../lib/logUtils');

/**
 * Test Data Factory for Creating Realistic Test Entities
 * 
 * This class eliminates duplicate test data creation across test files
 * by providing standardized factory methods for common test entities.
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
      name: `Test Config ${id}`,
      value: `test-value-${id}`,
      environment: 'test',
      type: 'string',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
    
    logReturn('TestDataFactory.createConfig', config);
    return config;
  }

  /**
   * Creates multiple related entities for complex test scenarios
   * 
   * @param {Object} options - Options for entity creation
   * @returns {Object} Object containing all created entities
   */
  static createRelatedEntities(options = {}) {
    logStart('TestDataFactory.createRelatedEntities', options);
    
    const {
      userCount = 1,
      apiKeyCount = 1,
      logCount = 1,
      configCount = 1,
      userOverrides = {},
      apiKeyOverrides = {},
      logOverrides = {},
      configOverrides = {}
    } = options;
    
    const result = {
      users: [],
      apiKeys: [],
      logs: [],
      configs: []
    };
    
    // Create users first
    for (let i = 0; i < userCount; i++) {
      result.users.push(this.createUser(userOverrides));
    }
    
    // Create API keys linked to users
    for (let i = 0; i < apiKeyCount; i++) {
      const linkedUser = result.users[i % result.users.length];
      result.apiKeys.push(this.createApiKey({
        userId: linkedUser?.id,
        ...apiKeyOverrides
      }));
    }
    
    // Create log entries linked to users
    for (let i = 0; i < logCount; i++) {
      const linkedUser = result.users[i % result.users.length];
      result.logs.push(this.createLogEntry({
        userId: linkedUser?.id,
        ...logOverrides
      }));
    }
    
    // Create configurations
    for (let i = 0; i < configCount; i++) {
      result.configs.push(this.createConfig(configOverrides));
    }
    
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

module.exports = {
  TestDataFactory
};