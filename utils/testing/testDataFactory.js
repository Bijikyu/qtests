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
      name: `Test Configuration ${id}`,
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
   * Creates multiple test entities using a factory function
   * 
   * @param {Function} factoryFn - Factory function to create single entities
   * @param {number} count - Number of entities to create
   * @param {Object} baseOverrides - Base overrides applied to all entities
   * @returns {Array} Array of created test entities
   */
  static createMultiple(factoryFn, count = 10, baseOverrides = {}) {
    logStart('TestDataFactory.createMultiple', { count, baseOverrides });
    
    const entities = [];
    for (let i = 0; i < count; i++) {
      const entityOverrides = { ...baseOverrides };
      entities.push(factoryFn.call(this, entityOverrides));
    }
    
    logReturn('TestDataFactory.createMultiple', `${entities.length} entities`);
    return entities;
  }

  // Instance method wrappers for compatibility with TestSuiteBuilder
  createUser(overrides) {
    return TestDataFactory.createUser(overrides);
  }

  createApiKey(overrides) {
    return TestDataFactory.createApiKey(overrides);
  }

  createLogEntry(overrides) {
    return TestDataFactory.createLogEntry(overrides);
  }

  createConfig(overrides) {
    return TestDataFactory.createConfig(overrides);
  }

  createMultiple(factoryFn, count, baseOverrides) {
    return TestDataFactory.createMultiple(factoryFn.bind(this), count, baseOverrides);
  }

  // Static method for resetting counter
  static reset() {
    this.counter = 0;
  }

  /**
   * Creates related entities with relationships
   * 
   * @param {Object} config - Configuration for creating related entities
   * @returns {Object} Object with created entities and relationships
   */
  static createRelatedEntities(config) {
    logStart('TestDataFactory.createRelatedEntities', config);
    
    try {
      const {
        userCount = 1,
        apiKeysPerUser = 1,
        logsPerUser = 1
      } = config;
      
      const users = [];
      const apiKeys = [];
      const logs = [];
      
      // Create users first
      for (let i = 0; i < userCount; i++) {
        users.push(this.createUser());
      }
      
      // Create API keys for each user
      users.forEach(user => {
        for (let i = 0; i < apiKeysPerUser; i++) {
          apiKeys.push(this.createApiKey({
            userId: user.id,
            key: `${user.username}-key-${i + 1}`
          }));
        }
      });
      
      // Create logs for each user
      users.forEach(user => {
        for (let i = 0; i < logsPerUser; i++) {
          logs.push(this.createLogEntry({
            userId: user.id,
            endpoint: `/api/users/${user.id}/data-${i + 1}`
          }));
        }
      });
      
      const result = {
        users,
        apiKeys,
        logs,
        relationships: {
          userToApiKeys: users.reduce((acc, user) => {
            acc[user.id] = apiKeys.filter(key => key.userId === user.id);
            return acc;
          }, {}),
          userToLogs: users.reduce((acc, user) => {
            acc[user.id] = logs.filter(log => log.userId === user.id);
            return acc;
          }, {})
        }
      };
      
      logReturn('TestDataFactory.createRelatedEntities', `created ${users.length} users, ${apiKeys.length} API keys, ${logs.length} logs`);
      return result;
    } catch (error) {
      logReturn('TestDataFactory.createRelatedEntities', `error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = {
  TestDataFactory
};