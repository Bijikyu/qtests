/**
 * Entity Factory Functions
 * 
 * This module provides factory functions for creating
 * test entities with realistic properties.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';
import { User, ApiKey, LogEntry } from './dataTypes.js';

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
class EntityFactory {
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
    const random = Math.random().toString(36).substring(2, 11);
    return `${hrTime}-${random}`;
  }

  /**
   * Creates a test user with realistic properties
   */
  static createUser(overrides: Partial<User> = {}): User {
    logStart('EntityFactory.createUser', overrides);
    
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
    
    logReturn('EntityFactory.createUser', user);
    return user;
  }

  /**
   * Creates a test API key with realistic properties
   */
  static createApiKey(overrides: Partial<ApiKey> = {}): ApiKey {
    logStart('EntityFactory.createApiKey', overrides);
    
    const id = this.nextId();
    const apiKey: ApiKey = {
      id: `key-${id}`,
      key: `test-api-key-${id}-${Math.random().toString(36).substring(2, 11)}`, // Fixed deprecated substr
      name: `Test API Key ${id}`,
      userId: `user-${id}`,
      isActive: true,
      permissions: ['read', 'write'],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      ...overrides
    };
    
    logReturn('EntityFactory.createApiKey', apiKey);
    return apiKey;
  }

  /**
   * Creates a test log entry with realistic properties
   */
  static createLogEntry(overrides: Partial<LogEntry> = {}): LogEntry {
    logStart('EntityFactory.createLogEntry', overrides);
    
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
    
    logReturn('EntityFactory.createLogEntry', logEntry);
    return logEntry;
  }

  /**
   * Creates multiple test users in batch
   */
  static createUsers(count: number, baseOverrides: Partial<User> = {}): User[] {
    logStart('EntityFactory.createUsers', count, baseOverrides);
    
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
    
    logReturn('EntityFactory.createUsers', users);
    return users;
  }

  /**
   * Resets counter for predictable test IDs
   */
  static resetCounter(): void {
    this.counter = 0;
  }
}

export { EntityFactory };