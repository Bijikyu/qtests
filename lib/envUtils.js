/**
 * Environment Management Utilities - ES Module Version
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
import testEnv from '../utils/testEnv.js';
import offlineMode from '../utils/offlineMode.js';
import testHelpers from '../utils/testHelpers.js';

// Export the core utilities that our TypeScript index needs
export {
  testEnv,     // environment variable management and test isolation
  offlineMode, // offline/online mode utility with automatic switching
  testHelpers  // advanced testing utilities for module reloading and mocking
};