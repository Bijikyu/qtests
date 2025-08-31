/**
 * Test Data Factory for Creating Realistic Test Entities - TypeScript Implementation
 * 
 * This class focuses solely on test data creation and management.
 * It eliminates duplicate test data creation across test files.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';

// Type definitions
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}

interface ApiKey {
  id: string;
  key: string;
  name: string;
  userId: string;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  expiresAt: Date;
  [key: string]: any;
}

interface LogEntry {
  id: string;
  level: string;
  message: string;
  timestamp: Date;
  userId?: string;
  source: string;
  [key: string]: any;
}

/**
 * Test Data Factory for Creating Realistic Test Entities
 * 
 * This class eliminates duplicate test data creation across test files
 * by providing standardized factory methods for common test entities.
 * 
 * PARALLEL TEST SAFETY:
 * - Uses process.hrtime.bigint() for unique IDs to avoid race conditions
 * - No shared static state between parallel test executions
 * - Each test gets unique data that won't conflict with other tests
 */
class TestDataFactory {
  private static counter = 0;

  /**
   * Gets next unique ID for test data (parallel-safe when needed)
   */
  static nextId(): string | number {
    // Only use complex IDs in very specific parallel execution scenarios
    const isJestParallel = process.env.JEST_WORKER_ID && process.env.JEST_WORKER_ID !== '1';
    const isExplicitParallel = process.env.QTESTS_PARALLEL_MODE === 'true';
    
    if (!isJestParallel && !isExplicitParallel) {
      // Normal testing - use simple counter for expected format
      return ++this.counter;
    }
    
    // Parallel testing - use complex unique identifier
    const hrTime = process.hrtime.bigint();
    const random = Math.random().toString(36).substr(2, 9);
    return `${hrTime}-${random}`;
  }

  /**
   * Creates a test user with realistic properties
   */
  static createUser(overrides: Partial<User> = {}): User {
    logStart('TestDataFactory.createUser', overrides);
    
    const id = this.nextId();
    const user: User = {
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
   */
  static createApiKey(overrides: Partial<ApiKey> = {}): ApiKey {
    logStart('TestDataFactory.createApiKey', overrides);
    
    const id = this.nextId();
    const apiKey: ApiKey = {
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
   */
  static createLogEntry(overrides: Partial<LogEntry> = {}): LogEntry {
    logStart('TestDataFactory.createLogEntry', overrides);
    
    const id = this.nextId();
    const logEntry: LogEntry = {
      id: `log-${id}`,
      level: 'info',
      message: `Test log message ${id}`,
      timestamp: new Date(),
      userId: `user-${id}`,
      source: 'test-system',
      ...overrides
    };
    
    logReturn('TestDataFactory.createLogEntry', logEntry);
    return logEntry;
  }

  /**
   * Creates multiple test users in batch
   */
  static createUsers(count: number, baseOverrides: Partial<User> = {}): User[] {
    logStart('TestDataFactory.createUsers', count, baseOverrides);
    
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      const overrides = { ...baseOverrides };
      if (overrides.username) {
        overrides.username = `${overrides.username}${i + 1}`;
      }
      if (overrides.email) {
        overrides.email = `test${i + 1}@example.com`;
      }
      users.push(this.createUser(overrides));
    }
    
    logReturn('TestDataFactory.createUsers', users);
    return users;
  }

  /**
   * Creates a complete test dataset with related entities
   */
  static createTestDataset(): { users: User[]; apiKeys: ApiKey[]; logs: LogEntry[] } {
    logStart('TestDataFactory.createTestDataset');
    
    // Create 3 test users
    const users = this.createUsers(3);
    
    // Create API keys for each user
    const apiKeys = users.map(user => this.createApiKey({ userId: user.id }));
    
    // Create log entries for each user
    const logs = users.flatMap(user => [
      this.createLogEntry({ userId: user.id, level: 'info', message: `User ${user.username} logged in` }),
      this.createLogEntry({ userId: user.id, level: 'debug', message: `User ${user.username} performed action` })
    ]);
    
    const dataset = { users, apiKeys, logs };
    logReturn('TestDataFactory.createTestDataset', dataset);
    return dataset;
  }

  /**
   * Creates test HTTP request data
   */
  static createHttpRequest(overrides: any = {}): any {
    logStart('TestDataFactory.createHttpRequest', overrides);
    
    const id = this.nextId();
    const request = {
      method: 'GET',
      url: `/api/test/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'qtests-test-agent'
      },
      body: null,
      timestamp: new Date(),
      ...overrides
    };
    
    logReturn('TestDataFactory.createHttpRequest', request);
    return request;
  }

  /**
   * Creates test HTTP response data
   */
  static createHttpResponse(overrides: any = {}): any {
    logStart('TestDataFactory.createHttpResponse', overrides);
    
    const response = {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
        'X-Test-Response': 'true'
      },
      data: { success: true, message: 'Test response' },
      timestamp: new Date(),
      ...overrides
    };
    
    logReturn('TestDataFactory.createHttpResponse', response);
    return response;
  }

  /**
   * Resets the counter for predictable test IDs
   */
  static resetCounter(): void {
    this.counter = 0;
  }
}

// Export TestDataFactory using ES module syntax
export { TestDataFactory };