/**
 * Advanced Testing Helper Utilities - TypeScript Implementation (Refactored)
 * 
 * This module has been refactored to follow Single Responsibility Principle.
 * It now coordinates between focused helper utilities for better maintainability.
 * 
 * Components:
 * - helpers/moduleReloader.ts - Module cache management and reloading
 * - helpers/qerrorsStub.ts - QErrors stubbing functionality
 * - helpers/consoleMocker.ts - Console mocking utilities
 * - helpers/responseMocker.ts - Response object mocking for API testing
 */

// Import focused helper utilities
import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
import { stubQerrors } from './helpers/qerrorsStub.js';
import { withMockConsole } from './helpers/consoleMocker.js';
import { createJsonRes, createRes } from './helpers/responseMocker.js';
import { backupEnvVars, restoreEnvVars, withSavedEnv } from './helpers/envManager.js';
import { generateKey } from './helpers/keyGenerator.js';

// Export all helper utilities following qtests framework patterns using ES module syntax
export {
  reload,
  moduleReloadLock,
  stubQerrors,
  withMockConsole,
  createJsonRes,
  createRes,
  backupEnvVars,
  restoreEnvVars,
  withSavedEnv,
  generateKey
};