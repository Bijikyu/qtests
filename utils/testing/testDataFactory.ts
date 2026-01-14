/**
 * Test Data Factory for Creating Realistic Test Entities - TypeScript Implementation
 * 
 * This module consolidates test data creation functionality from focused modules.
 * It eliminates duplicate test data creation across test files.
 */

// Re-export from focused modules for backward compatibility
export {
  User,
  ApiKey,
  LogEntry
} from './dataTypes.js';

export {
  EntityFactory
} from './entityFactory.js';

export {
  createHttpRequest,
  createHttpResponse
} from './httpDataFactory.js';

export {
  createTestDataset
} from './datasetFactory.js';

export {
  createTimedAxios,
  makeRequest,
  waitForServer,
  waitForPort,
  cleanupTestData,
  initializeTestData,
  getNextCounter,
  testAxios
} from './integrationTestHelper.js';

export {
  PortAllocator,
  allocatePort,
  releasePort,
  releaseAllPorts,
  cleanupPortAllocator,
  portAllocator
} from './portAllocator.js';

// Import for internal use
import { EntityFactory } from './entityFactory.js';
import { createHttpRequest as _createHttpRequest, createHttpResponse as _createHttpResponse } from './httpDataFactory.js';
import { createTestDataset as _createTestDataset } from './datasetFactory.js';

// Legacy alias for backward compatibility
export const TestDataFactory = EntityFactory;

// Export convenience methods
export const createUser = EntityFactory.createUser;
export const createApiKey = EntityFactory.createApiKey;
export const createLogEntry = EntityFactory.createLogEntry;
export const createUsers = EntityFactory.createUsers;
export const createTestDataset_legacy = _createTestDataset;
export const createHttpRequest_legacy = _createHttpRequest;
export const createHttpResponse_legacy = _createHttpResponse;
export const resetCounter = EntityFactory.resetCounter;