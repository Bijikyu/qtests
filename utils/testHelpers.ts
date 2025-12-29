/**
 * Test Helpers - Consolidated Testing Utility Functions
 * 
 * This module provides a unified export point for commonly used test helper functions.
 * It consolidates utilities from various helper modules to offer:
 * - Module reloading capabilities for dynamic test scenarios
 * - Error handling stubs for consistent test environments
 * - Console mocking utilities for clean test output
 * - HTTP response mocking for API testing
 * - Environment variable management for test isolation
 * - Key generation utilities for test data
 * 
 * Usage Pattern:
 * Import this single module instead of multiple individual helper modules
 * to reduce import complexity and maintain a clean test file structure.
 */

import { reload, moduleReloadLock } from './helpers/moduleReloader.js';
import { stubQerrors } from './helpers/qerrorsStub.js';
import { withMockConsole } from './mockConsole.js';
import { createJsonRes, createRes } from './helpers/responseMocker.js';
import { backupEnvVars, restoreEnvVars, withSavedEnv } from './helpers/envManager.js';
import { generateKey } from './helpers/keyGenerator.js';

// Export all utilities for easy consumption in test files
export {
  reload,                    // Module reloading for dynamic test scenarios
  moduleReloadLock,          // Lock management for safe module reloading
  stubQerrors,               // Error handling stub for consistent test environment
  withMockConsole,           // Console mocking for clean test output
  createJsonRes,             // JSON response mocking for API testing
  createRes,                 // Generic response mocking utilities
  backupEnvVars,             // Environment variable backup for test isolation
  restoreEnvVars,            // Environment variable restoration after tests
  withSavedEnv,              // Wrapper for temporary environment changes
  generateKey                // Key generation for test data creation
};