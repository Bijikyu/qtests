/**
 * HTTP Testing Utilities
 * 
 * This module provides utilities for HTTP client mocking, integration testing,
 * and network simulation. These utilities help test applications that make
 * HTTP requests without requiring actual network connectivity.
 * 
 * Design philosophy:
 * - Network-free testing for reliable, fast tests
 * - Configurable mock behavior for different scenarios
 * - Integration testing support without external dependencies
 * - Offline mode simulation for robust testing
 * 
 * Why HTTP utilities are grouped together:
 * 1. All utilities deal with HTTP/network interactions
 * 2. They share common patterns for request/response mocking
 * 3. Often used together in integration testing scenarios
 * 4. Provide complementary functionality for comprehensive HTTP testing
 * 
 * Module organization rationale:
 * These utilities are grouped because they all serve the purpose of
 * testing HTTP-dependent code without actual network calls, providing
 * different levels of abstraction and configuration options.
 */

// Import mockAxios factory for creating configurable HTTP client mocks
// mockAxios provides enhanced mock HTTP clients with customizable behavior
// for comprehensive offline testing and HTTP simulation scenarios
import * as mockAxios from '../utils/mockAxios.js';

// Import httpTest utilities for lightweight integration testing
// httpTest provides supertest-like functionality without external dependencies
// for testing HTTP endpoints and applications in Node.js core
import * as httpTest from '../utils/httpTest.js';

// Import offlineMode utility for network-free testing
// offlineMode automatically switches between real and stub implementations
// based on whether the test should simulate offline conditions
import * as offlineMode from '../utils/offlineMode.js';

/**
 * Export HTTP testing utilities
 * 
 * These utilities are exported together because they provide
 * complementary functionality for HTTP testing:
 * 
 * - mockAxios: For mocking HTTP client behavior
 * - httpTest: For integration testing of HTTP endpoints
 * - offlineMode: For simulating offline conditions
 * 
 * Export strategy:
 * - Named exports for ES module compatibility
 * - Descriptive property names that indicate purpose
 * - Grouped by functionality for developer convenience
 */
export {
  // HTTP client mocking for axios and similar libraries
  mockAxios,
  
  // Lightweight HTTP integration testing utilities
  httpTest,
  
  // Environment-aware offline mode simulation
  offlineMode
};
