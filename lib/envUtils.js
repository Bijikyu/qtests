
/**
 * Environment Management Utilities
 * 
 * This module provides utilities for managing test environments, including
 * environment variable manipulation, offline mode testing, and complex
 * test scenario setup. These utilities help create isolated, predictable
 * test environments.
 * 
 * Design philosophy:
 * - Environment isolation to prevent test interference
 * - Predictable test conditions with known values
 * - Easy setup and teardown of test environments
 * - Support for both simple and complex testing scenarios
 */

const testEnv = require('../utils/testEnv');
const offlineMode = require('../utils/offlineMode');
const testHelpers = require('../utils/testHelpers');

/**
 * Export environment management utilities
 * 
 * These utilities help manage test environments and complex scenarios:
 * - testEnv: Environment and mock management for complex test scenarios
 * - offlineMode: Offline/online mode utility with automatic switching
 * - testHelpers: Advanced testing utilities for module reloading and mocking
 */
module.exports = {
  testEnv,         // Environment and mock management for complex test scenarios
  offlineMode,     // Offline/online mode utility with automatic axios and qerrors switching
  testHelpers      // Advanced testing utilities for module reloading and mocking
};
