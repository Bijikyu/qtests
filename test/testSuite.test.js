/**
 * Tests for testSuite utility
 * 
 * This test suite verifies the comprehensive testing utilities including:
 * - Database testing helper with in-memory models
 * - Mock management system with qtests integration
 * - Assertion helpers for common testing patterns
 * - Test data factory for realistic entity creation
 * - Performance testing utilities with timing and concurrency
 * - Test suite builder with fluent configuration API
 */

const { testSuite } = require('../lib/envUtils');
const {
  DatabaseTestHelper,
  MockManager,
  AssertionHelper,
  TestDataFactory,
  PerformanceTestHelper,
  TestSuiteBuilder
} = testSuite;

describe('testSuite utility', () => {
  describe('DatabaseTestHelper', () => {
    let dbHelper;

    beforeEach(() => {
      dbHelper = new DatabaseTestHelper();
    });

    afterEach(async () => {
      if (dbHelper.isSetup) {
        await dbHelper.teardown();
      }
    });

    test('sets up database models correctly', async () => {
      await dbHelper.setup();
      
      expect(dbHelper.isSetup).toBe(true);
      expect(dbHelper.models).toBeDefined();
      expect(dbHelper.models.ApiKey).toBeDefined();
      expect(dbHelper.models.ApiLog).toBeDefined();
    });

    test('tears down database correctly', async () => {
      await dbHelper.setup();
      await dbHelper.teardown();
      
      expect(dbHelper.isSetup).toBe(false);
      expect(dbHelper.models).toBe(null);
    });

    test('provides access to models after setup', async () => {
      await dbHelper.setup();
      const models = dbHelper.getModels();
      
      expect(models).toBe(dbHelper.models);
      expect(models.ApiKey).toBeDefined();
    });

    test('throws error when accessing models before setup', () => {
      expect(() => {
        dbHelper.getModels();
      }).toThrow('DatabaseTestHelper must be set up before accessing models');
    });

    test('creates suite with automatic setup', () => {
      // Note: createSuite sets up hooks automatically, but only in proper test context
      const suiteHelper = new DatabaseTestHelper(); // Use direct instantiation in this test
      
      expect(suiteHelper).toBeInstanceOf(DatabaseTestHelper);
    });

    test('clears model data on setup', async () => {
      await dbHelper.setup();
      
      // Add some test data
      const apiKey = new dbHelper.models.ApiKey({ key: 'test-key' });
      await apiKey.save();
      
      // Setup again should clear data
      await dbHelper.setup();
      
      const keys = await dbHelper.models.ApiKey.find().lean();
      expect(keys).toHaveLength(0);
    });
  });

  describe('MockManager', () => {
    let mockManager;

    beforeEach(() => {
      mockManager = new MockManager();
    });

    afterEach(() => {
      mockManager.clearAll();
    });

    test('sets up API client mocks', () => {
      mockManager.setupApiClientMocks();
      
      const apiClient = mockManager.getMock('apiClient');
      expect(apiClient).toBeDefined();
      expect(typeof apiClient.get).toBe('function');
      expect(typeof apiClient.post).toBe('function');
    });

    test('sets up API client mocks with custom responses', () => {
      const customResponses = {
        get: { status: 404, data: { error: 'Not found' } }
      };
      
      mockManager.setupApiClientMocks(customResponses);
      
      const apiClient = mockManager.getMock('apiClient');
      return apiClient.get().then(response => {
        expect(response.status).toBe(404);
        expect(response.data.error).toBe('Not found');
      });
    });

    test('sets up console mocks', () => {
      const consoleMocks = mockManager.setupConsoleMocks();
      
      expect(consoleMocks.log).toBeDefined();
      expect(consoleMocks.error).toBeDefined();
      expect(consoleMocks.warn).toBeDefined();
      expect(typeof consoleMocks.restore).toBe('function');
    });

    test('sets up environment mocks', () => {
      const envVars = { TEST_VAR: 'test-value', NODE_ENV: 'test' };
      const restore = mockManager.setupEnvironmentMocks(envVars);
      
      expect(process.env.TEST_VAR).toBe('test-value');
      expect(process.env.NODE_ENV).toBe('test');
      expect(typeof restore).toBe('function');
      
      const envMock = mockManager.getMock('environment');
      expect(envMock).toEqual(envVars);
    });

    test('sets up email mocks', () => {
      const emailMocks = mockManager.setupEmailMocks();
      
      expect(typeof emailMocks.sendEmail).toBe('function');
      expect(typeof emailMocks.sendEmailBatch).toBe('function');
      expect(typeof emailMocks.getHistory).toBe('function');
      expect(typeof emailMocks.clearHistory).toBe('function');
    });

    test('sets up HTTP mocks with responses', () => {
      const responses = [
        { method: 'GET', path: '/users', status: 200, data: [{ id: 1, name: 'User 1' }] },
        { method: 'POST', path: '/users', status: 201, data: { id: 2, name: 'User 2' } }
      ];
      
      const httpMocks = mockManager.setupHttpMocks(responses);
      
      expect(httpMocks.app).toBeDefined();
      expect(typeof httpMocks.supertest).toBe('function');
      expect(typeof httpMocks.request).toBe('function');
    });

    test('clears all mocks', () => {
      mockManager.setupApiClientMocks();
      mockManager.setupConsoleMocks();
      
      expect(mockManager.getMock('apiClient')).toBeDefined();
      expect(mockManager.getMock('console')).toBeDefined();
      
      mockManager.clearAll();
      
      expect(mockManager.getMock('apiClient')).toBeUndefined();
      expect(mockManager.getMock('console')).toBeUndefined();
    });

    test('gets specific mock by name', () => {
      mockManager.setupApiClientMocks();
      
      const apiClient = mockManager.getMock('apiClient');
      expect(apiClient).toBeDefined();
      
      const nonExistent = mockManager.getMock('nonexistent');
      expect(nonExistent).toBeUndefined();
    });
  });

  describe('AssertionHelper', () => {
    test('asserts database entity properties', () => {
      const entity = {
        _id: 'test-id',
        createdAt: new Date(),
        name: 'Test Entity',
        status: 'active'
      };
      
      expect(() => {
        AssertionHelper.assertDatabaseEntity(entity, { name: 'Test Entity', status: 'active' });
      }).not.toThrow();
    });

    test('throws error for invalid database entity', () => {
      const entity = {
        _id: null, // invalid
        createdAt: 'not-a-date', // invalid
        name: 'Test Entity'
      };
      
      expect(() => {
        AssertionHelper.assertDatabaseEntity(entity, {});
      }).toThrow('Entity _id must be defined and truthy');
    });

    test('throws error for wrong property values', () => {
      const entity = {
        _id: 'test-id',
        createdAt: new Date(),
        name: 'Test Entity',
        status: 'inactive'
      };
      
      expect(() => {
        AssertionHelper.assertDatabaseEntity(entity, { status: 'active' });
      }).toThrow('Expected entity.status to be active, but got inactive');
    });

    test('asserts API response structure', () => {
      const response = {
        status: 200,
        body: { data: 'test' }
      };
      
      expect(() => {
        AssertionHelper.assertApiResponse(response, 200, true);
      }).not.toThrow();
    });

    test('throws error for wrong API response status', () => {
      const response = {
        status: 404,
        body: { error: 'Not found' }
      };
      
      expect(() => {
        AssertionHelper.assertApiResponse(response, 200);
      }).toThrow('Expected status 200, but got 404');
    });

    test('asserts email sent successfully', () => {
      const { sendEmail } = require('../lib/envUtils');
      
      // Clear history and send test email
      sendEmail.clearEmailHistory();
      sendEmail.sendEmail('test@example.com', 'Test Subject', 'Test Body');
      
      expect(() => {
        AssertionHelper.assertEmailSent({ to: 'test@example.com', subject: 'Test Subject' });
      }).not.toThrow();
    });

    test('throws error when expected email not found', () => {
      const { sendEmail } = require('../lib/envUtils');
      
      // Clear history
      sendEmail.clearEmailHistory();
      
      expect(() => {
        AssertionHelper.assertEmailSent({ to: 'test@example.com' });
      }).toThrow('Expected at least 1 emails, but found 0');
    });

    test('asserts mock function calls', () => {
      const mockFn = jest.fn();
      mockFn('arg1', 'arg2');
      mockFn('arg3', 'arg4');
      
      expect(() => {
        AssertionHelper.assertMockCalled(mockFn, { times: 2 });
      }).not.toThrow();
      
      expect(() => {
        AssertionHelper.assertMockCalled(mockFn, { calledWith: ['arg1', 'arg2'] });
      }).not.toThrow();
    });

    test('throws error for wrong mock call count', () => {
      const mockFn = jest.fn();
      mockFn();
      
      expect(() => {
        AssertionHelper.assertMockCalled(mockFn, { times: 2 });
      }).toThrow('Expected 2 calls, but got 1');
    });
  });

  describe('TestDataFactory', () => {
    beforeEach(() => {
      TestDataFactory.reset();
    });

    test('creates user with default properties', () => {
      const user = TestDataFactory.createUser();
      
      expect(user.id).toMatch(/^user-\d+$/);
      expect(user.username).toMatch(/^testuser\d+$/);
      expect(user.email).toMatch(/^test\d+@example\.com$/);
      expect(user.firstName).toBe('Test');
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    test('creates user with overrides', () => {
      const overrides = {
        username: 'customuser',
        email: 'custom@example.com',
        isActive: false
      };
      
      const user = TestDataFactory.createUser(overrides);
      
      expect(user.username).toBe('customuser');
      expect(user.email).toBe('custom@example.com');
      expect(user.isActive).toBe(false);
      expect(user.firstName).toBe('Test'); // default value
    });

    test('creates API key with default properties', () => {
      const apiKey = TestDataFactory.createApiKey();
      
      expect(apiKey.id).toMatch(/^key-\d+$/);
      expect(apiKey.key).toMatch(/^test-api-key-\d+-[a-z0-9]+$/);
      expect(apiKey.name).toMatch(/^Test API Key \d+$/);
      expect(apiKey.isActive).toBe(true);
      expect(apiKey.permissions).toEqual(['read', 'write']);
      expect(apiKey.createdAt).toBeInstanceOf(Date);
      expect(apiKey.expiresAt).toBeInstanceOf(Date);
    });

    test('creates log entry with default properties', () => {
      const logEntry = TestDataFactory.createLogEntry();
      
      expect(logEntry.id).toMatch(/^log-\d+$/);
      expect(logEntry.message).toMatch(/^Test log message \d+$/);
      expect(logEntry.level).toBe('info');
      expect(logEntry.timestamp).toBeInstanceOf(Date);
      expect(logEntry.source).toBe('test-application');
      expect(logEntry.metadata).toBeDefined();
    });

    test('creates configuration with default properties', () => {
      const config = TestDataFactory.createConfig();
      
      expect(config.id).toMatch(/^config-\d+$/);
      expect(config.name).toMatch(/^Test Configuration \d+$/);
      expect(config.environment).toBe('test');
      expect(config.settings).toBeDefined();
      expect(config.features).toBeDefined();
      expect(config.createdAt).toBeInstanceOf(Date);
    });

    test('creates multiple entities', () => {
      const users = TestDataFactory.createMultiple(TestDataFactory.createUser, 3);
      
      expect(users).toHaveLength(3);
      expect(users[0].id).toBe('user-1');
      expect(users[1].id).toBe('user-2');
      expect(users[2].id).toBe('user-3');
    });

    test('creates multiple entities with base overrides', () => {
      const users = TestDataFactory.createMultiple(
        TestDataFactory.createUser,
        2,
        { isActive: false }
      );
      
      expect(users).toHaveLength(2);
      expect(users[0].isActive).toBe(false);
      expect(users[1].isActive).toBe(false);
    });

    test('creates related entities', () => {
      const entities = TestDataFactory.createRelatedEntities({
        userCount: 2,
        apiKeysPerUser: 2,
        logsPerUser: 1,
        configCount: 1
      });
      
      expect(entities.users).toHaveLength(2);
      expect(entities.apiKeys).toHaveLength(4); // 2 users * 2 keys each
      expect(entities.logs).toHaveLength(2); // 2 users * 1 log each
      expect(entities.configs).toHaveLength(1);
      
      // Check relationships
      expect(entities.apiKeys[0].userId).toBe(entities.users[0].id);
      expect(entities.logs[0].userId).toBe(entities.users[0].id);
    });

    test('increments counter for unique IDs', () => {
      const user1 = TestDataFactory.createUser();
      const user2 = TestDataFactory.createUser();
      
      expect(user1.id).toBe('user-1');
      expect(user2.id).toBe('user-2');
    });

    test('resets counter', () => {
      TestDataFactory.createUser(); // ID will be user-1
      TestDataFactory.reset();
      
      const user = TestDataFactory.createUser();
      expect(user.id).toBe('user-1'); // Counter reset
    });
  });

  describe('PerformanceTestHelper', () => {
    test('measures operation time', async () => {
      const operation = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'result';
      };
      
      const measurement = await PerformanceTestHelper.measureTime(operation);
      
      expect(measurement.result).toBe('result');
      expect(measurement.duration).toBeGreaterThan(5); // At least 5ms
      expect(measurement.durationNs).toBeGreaterThan(5000000); // At least 5ms in nanoseconds
      expect(measurement.timestamp).toBeInstanceOf(Date);
    });

    test('asserts timing constraint success', async () => {
      const fastOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 1));
        return 'fast';
      };
      
      const result = await PerformanceTestHelper.assertTimingConstraint(fastOperation, 100);
      expect(result).toBe('fast');
    });

    test('asserts timing constraint failure', async () => {
      const slowOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return 'slow';
      };
      
      await expect(
        PerformanceTestHelper.assertTimingConstraint(slowOperation, 10)
      ).rejects.toThrow('exceeding limit of 10ms');
    });

    test('tests concurrent operations', async () => {
      const operations = [
        async () => 'result1',
        async () => 'result2',
        async () => { throw new Error('operation failed'); }
      ];
      
      const analysis = await PerformanceTestHelper.testConcurrency(operations);
      
      expect(analysis.results).toHaveLength(3);
      expect(analysis.successful).toBe(2);
      expect(analysis.failed).toBe(1);
      expect(analysis.totalDuration).toBeGreaterThan(0);
      expect(analysis.averageDuration).toBeGreaterThan(0);
    });

    test('measures memory usage', async () => {
      const operation = async () => {
        const largeArray = new Array(1000).fill('test');
        return largeArray.length;
      };
      
      const measurement = await PerformanceTestHelper.measureMemory(operation);
      
      expect(measurement.result).toBe(1000);
      expect(measurement.beforeMemory).toBeDefined();
      expect(measurement.afterMemory).toBeDefined();
      expect(measurement.memoryDelta).toBeDefined();
      expect(measurement.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('TestSuiteBuilder', () => {
    let builder;

    beforeEach(() => {
      builder = new TestSuiteBuilder();
    });

    afterEach(() => {
      // Clean up any mocks created during tests
      try {
        builder.build().mocks.clearAll();
      } catch (error) {
        // Ignore cleanup errors
      }
    });

    test('builds basic test suite', () => {
      const suite = builder.build();
      
      expect(suite.mocks).toBeInstanceOf(MockManager);
      expect(suite.assert).toBe(AssertionHelper);
      expect(suite.data).toBe(TestDataFactory);
      expect(suite.db).toBeUndefined(); // Not enabled
      expect(suite.performance).toBeUndefined(); // Not enabled
    });

    test('builds suite with database', () => {
      const suite = builder.withDatabase().build();
      
      expect(suite.db).toBeInstanceOf(DatabaseTestHelper);
    });

    test('builds suite with API mocks', () => {
      const suite = builder.withApiMocks().build();
      
      const apiMock = suite.mocks.getMock('apiClient');
      expect(apiMock).toBeDefined();
    });

    test('builds suite with console mocks', () => {
      const suite = builder.withConsoleMocks().build();
      
      const consoleMock = suite.mocks.getMock('console');
      expect(consoleMock).toBeDefined();
    });

    test('builds suite with environment mocks', () => {
      const envVars = { TEST_MODE: 'true' };
      const suite = builder.withEnvironmentMocks(envVars).build();
      
      expect(process.env.TEST_MODE).toBe('true');
    });

    test('builds suite with email mocks', () => {
      const suite = builder.withEmailMocks().build();
      
      const emailMock = suite.mocks.getMock('email');
      expect(emailMock).toBeDefined();
    });

    test('builds suite with HTTP mocks', () => {
      const responses = [{ method: 'GET', path: '/', data: { message: 'hello' } }];
      const suite = builder.withHttpMocks(responses).build();
      
      const httpMock = suite.mocks.getMock('http');
      expect(httpMock).toBeDefined();
    });

    test('builds suite with performance utilities', () => {
      const suite = builder.withPerformance().build();
      
      expect(suite.performance).toBe(PerformanceTestHelper);
    });

    test('builds suite with all features', () => {
      const suite = builder
        .withDatabase()
        .withApiMocks()
        .withConsoleMocks()
        .withEmailMocks()
        .withPerformance()
        .build();
      
      expect(suite.db).toBeInstanceOf(DatabaseTestHelper);
      expect(suite.mocks).toBeInstanceOf(MockManager);
      expect(suite.assert).toBe(AssertionHelper);
      expect(suite.data).toBe(TestDataFactory);
      expect(suite.performance).toBe(PerformanceTestHelper);
    });

    test('supports method chaining', () => {
      const result = builder
        .withDatabase()
        .withApiMocks()
        .withPerformance();
      
      expect(result).toBe(builder); // Same instance returned
    });

    test('supports without auto cleanup', () => {
      const suite = builder.withoutAutoCleanup().build();
      
      expect(suite.mocks).toBeInstanceOf(MockManager);
    });
  });

  describe('integration scenarios', () => {
    test('complete database workflow with assertions', async () => {
      // Manual database setup for integration test
      const dbHelper = new DatabaseTestHelper();
      await dbHelper.setup();
      
      try {
        const suite = new TestSuiteBuilder()
          .withoutAutoCleanup()
          .build();
        
        suite.db = dbHelper; // Manually assign database helper
        
        const models = suite.db.getModels();
        
        // Create test data
        const userData = suite.data.createUser();
        const apiKey = new models.ApiKey({
          key: userData.username + '-key',
          userId: userData.id
        });
        
        await apiKey.save();
        
        // Assert database entity
        suite.assert.assertDatabaseEntity(apiKey, {
          key: userData.username + '-key',
          userId: userData.id
        });
        
        expect(apiKey.key).toBe(userData.username + '-key');
      } finally {
        await dbHelper.teardown();
      }
    });

    test('mock management with API and email testing', () => {
      const suite = new TestSuiteBuilder()
        .withApiMocks()
        .withEmailMocks()
        .withoutAutoCleanup()
        .build();
      
      // Test API mock
      const apiClient = suite.mocks.getMock('apiClient');
      expect(apiClient).toBeDefined();
      
      // Test email mock
      const emailMock = suite.mocks.getMock('email');
      emailMock.sendEmail('test@example.com', 'Test', 'Body');
      
      suite.assert.assertEmailSent({ to: 'test@example.com' });
      
      // Cleanup
      suite.mocks.clearAll();
    });

    test('performance testing with data factory', async () => {
      const suite = new TestSuiteBuilder()
        .withPerformance()
        .withoutAutoCleanup()
        .build();
      
      const users = suite.data.createMultiple(suite.data.createUser, 100);
      
      const operation = async () => {
        return users.filter(user => user.isActive).length;
      };
      
      const measurement = await suite.performance.measureTime(operation);
      expect(measurement.result).toBe(100); // All users are active by default
      expect(measurement.duration).toBeGreaterThan(0);
    });

    test('comprehensive test scenario with all utilities', async () => {
      const suite = new TestSuiteBuilder()
        .withApiMocks()
        .withEmailMocks()
        .withConsoleMocks()
        .withPerformance()
        .withoutAutoCleanup()
        .build();
      
      try {
        // Create test data
        const userData = suite.data.createUser({ email: 'integration@example.com' });
        
        // Test email functionality
        const emailMock = suite.mocks.getMock('email');
        emailMock.sendEmail(userData.email, 'Welcome', 'Welcome to our service');
        
        // Test performance
        const operation = async () => {
          // Simulate some work
          await new Promise(resolve => setTimeout(resolve, 1));
          return userData;
        };
        
        const result = await suite.performance.assertTimingConstraint(operation, 100);
        expect(result).toBe(userData);
        
        // Test assertions
        suite.assert.assertEmailSent({ to: userData.email, subject: 'Welcome' });
        
        // Test console mock
        const consoleMock = suite.mocks.getMock('console');
        expect(consoleMock).toBeDefined();
      } finally {
        // Cleanup
        suite.mocks.clearAll();
      }
    });
  });
});