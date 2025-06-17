
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
 * 
 * Why environment management is critical:
 * 1. Tests must be deterministic - same input should always produce same output
 * 2. Tests should not depend on the host system's environment variables
 * 3. Tests should not affect each other through shared global state
 * 4. Complex applications often require multiple environment setups for different scenarios
 * 
 * Module organization rationale:
 * These three utilities are grouped together because they all deal with
 * controlling the execution environment during testing. While they serve
 * different purposes, they share the common goal of environmental isolation.
 */

// Import testEnv utility for comprehensive environment variable management
// testEnv provides save/restore functionality for environment variables
// and mock management for complex testing scenarios
const testEnv = require('../utils/testEnv');

// Import offlineMode utility for network-free testing
// offlineMode automatically switches between real and stub implementations
// based on whether the test should simulate offline conditions
const offlineMode = require('../utils/offlineMode');

// Import testHelpers for advanced testing scenarios
// testHelpers provides module reloading, response mocking, and other
// specialized utilities needed for integration and complex unit testing
const testHelpers = require('../utils/testHelpers');

// Import mockAxios factory for creating configurable HTTP client mocks
// mockAxios provides enhanced mock HTTP clients with customizable behavior
// for comprehensive offline testing and HTTP simulation scenarios
const mockAxios = require('../utils/mockAxios');

// Import httpTest utilities for lightweight integration testing
// httpTest provides supertest-like functionality without external dependencies
// for testing HTTP endpoints and applications in Node.js core
const httpTest = require('../utils/httpTest');

// Import mockModels utilities for in-memory database testing
// mockModels provides Mongoose-compatible models without database dependencies
// for unit testing with predictable data state and fast execution
const mockModels = require('../utils/mockModels');

/**
 * Export environment management utilities
 * 
 * These utilities are grouped together because they all serve the purpose
 * of controlling and isolating the test execution environment:
 * 
 * Strategic grouping rationale:
 * 1. All three utilities deal with environmental concerns during testing
 * 2. They are often used together in complex testing scenarios
 * 3. Grouping them makes it clear they serve environmental management
 * 4. They share similar patterns of setup/teardown and state management
 * 
 * Usage patterns:
 * - testEnv: Most commonly used for API testing with known environment variables
 * - offlineMode: Used when testing should not make network calls
 * - testHelpers: Used for integration testing and complex mock scenarios
 */
// export environment management utilities at bottom per requirements
module.exports = {
  testEnv: require(`../utils/testEnv`), // environment variable management with backticks
  offlineMode: require(`../utils/offlineMode`), // offline mode simulation with backticks
  testHelpers: require(`../utils/testHelpers`), // advanced testing utilities with backticks
  mockAxios: require(`../utils/mockAxios`), // configurable HTTP client mock factory with backticks
  httpTest: require(`../utils/httpTest`), // lightweight supertest alternative for integration testing with backticks
  mockModels: require(`../utils/mockModels`), // in-memory Mongoose model replacements for database-free testing with backticks
  sendEmail: require(`../utils/sendEmail`), // lightweight email mocking without external mail service dependencies with backticks
  testSuite: require(`../utils/testSuite`) // comprehensive testing utilities for eliminating duplicate patterns across test suites with backticks
};
