
/**
 * Environment Management Utilities
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
 * 
 * Why environment management is critical:
 * 1. Tests must be deterministic - same input should always produce same output
 * 2. Tests should not depend on the host system's environment variables
 * 3. Tests should not affect each other through shared global state
 * 4. Environment setup should be simple and consistent across test suites
 * 
 * Module organization rationale:
 * This module focuses solely on environment variable management and test
 * isolation, providing a clean separation of concerns from other testing
 * utilities like HTTP mocking, database simulation, and advanced test helpers.
 */

// Import testEnv utility for comprehensive environment variable management
// testEnv provides save/restore functionality for environment variables
// and mock management for environment-dependent testing scenarios
const testEnv = require('../utils/testEnv');

// Import specialized utility modules for organized access
const coreUtils = require('./coreUtils');
const httpUtils = require('./httpUtils');
const dataUtils = require('./dataUtils');
const testUtils = require('./testUtils');

/**
 * Export environment management utilities and provide access to other utility categories
 * 
 * This module serves as the main entry point for qtests utilities while maintaining
 * proper organization by category. Environment-specific utilities are exported directly,
 * while other utility categories are accessible through their respective modules.
 * 
 * Organization strategy:
 * - Direct exports for environment-specific utilities (testEnv)
 * - Category-based access for other utilities (http, data, test)
 * - Maintains backward compatibility with existing code
 * - Clear separation of concerns while providing unified access
 * 
 * Usage patterns:
 * const { testEnv } = require('qtests/lib/envUtils');
 * const { httpTest, mockAxios } = require('qtests/lib/envUtils').http;
 * const { mockModels, sendEmail } = require('qtests/lib/envUtils').data;
 * const { testSuite, testHelpers } = require('qtests/lib/envUtils').test;
 * 
 * Backward compatibility:
 * For existing code, all utilities remain accessible through direct imports:
 * const { testSuite, mockModels, httpTest } = require('qtests/lib/envUtils');
 */
module.exports = {
  // Environment variable management and test isolation (primary focus)
  testEnv,
  
  // Core testing utilities (stubMethod, mockConsole)
  ...coreUtils,
  
  // HTTP testing utilities (mockAxios, httpTest, offlineMode)
  ...httpUtils,
  
  // Data and database utilities (mockModels, sendEmail)
  ...dataUtils,
  
  // Advanced testing utilities (testHelpers, testSuite)
  ...testUtils,
  
  // Category-based access for organized imports
  core: coreUtils,
  http: httpUtils,
  data: dataUtils,
  test: testUtils
};
