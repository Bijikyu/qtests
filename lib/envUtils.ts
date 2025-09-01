/**
 * Environment Management Utilities - TypeScript ES Module Implementation
 * 
 * This module provides utilities specifically for managing test environments,
 * including environment variable manipulation and test isolation. These utilities
 * help create isolated, predictable test environments without side effects.
 * 
 * Design philosophy:
 * - Environment isolation to prevent test interference
 * - Predictable test conditions with known values
 * - Easy setup and teardown of test environments
 * - Simple, focused functionality for environment management
 */

// Import environment management utilities using ES module syntax
import {
  defaultEnv,
  setTestEnv,
  saveEnv,
  restoreEnv,
  attachMockSpies,
  makeLoggedMock,
  createScheduleMock,
  createQerrorsMock,
  createAxiosMock,
  resetMocks,
  initSearchTest
} from '../utils/testEnv.js';
import { 
  setOfflineMode,
  isOfflineMode,
  getAxios,
  getQerrors,
  getEnvironmentState,
  createEnvironmentAdapters,
  clearOfflineCache
} from '../utils/offlineMode.js';
import {
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
} from '../utils/testHelpers.js';

// Create testEnv object from individual functions
const testEnv = {
  defaultEnv,
  setTestEnv,
  saveEnv,
  restoreEnv,
  attachMockSpies,
  makeLoggedMock,
  createScheduleMock,
  createQerrorsMock,
  createAxiosMock,
  resetMocks,
  initSearchTest
};

// Create offlineMode object from individual functions
const offlineMode = {
  setOfflineMode,
  isOfflineMode,
  getAxios,
  getQerrors,
  getEnvironmentState,
  createEnvironmentAdapters,
  clearOfflineCache
};

// Create testHelpers object from individual functions
const testHelpers = {
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

// Export the core utilities that our TypeScript index needs
export {
  testEnv,     // environment variable management and test isolation
  offlineMode, // offline/online mode utility with automatic switching
  testHelpers  // advanced testing utilities for module reloading and mocking
};