
/**
 * Axios HTTP Client Stub for Testing
 * 
 * This module provides a minimal, side-effect-free replacement for the axios
 * HTTP client library. When tests require('axios') after qtests/setup, they
 * get this stub instead of the real axios, preventing actual network requests.
 * 
 * Design philosophy:
 * - Minimal interface: only implements commonly used methods
 * - Predictable behavior: always returns empty objects
 * - No side effects: no network requests, no state changes
 * - Fast execution: immediate promise resolution
 * 
 * Why stub axios specifically:
 * - Extremely common in Node.js applications
 * - Network requests slow down tests significantly
 * - Real HTTP calls can fail due to network issues
 * - Tests should be isolated from external dependencies
 * 
 * Implementation approach:
 * - Async functions that resolve immediately
 * - Return empty objects (truthy but minimal)
 * - Can be extended if tests need more specific behavior
 * - Compatible with basic axios usage patterns
 */

/**
 * Axios stub module exports
 * 
 * Currently implements the GET and POST methods as these are the most commonly
 * stubbed in testing scenarios. Additional verbs can easily be added if needed.
 * Method selection rationale:
 * - POST is most common for API interactions
 * - Often the method that needs stubbing in integration tests
 * - Easy to add other methods following the same pattern
 * 
 * Return value approach:
 * - Empty object {} is truthy (passes if (result) checks)
 * - Minimal memory footprint
 * - No properties that might interfere with test assertions
 * - Can be extended to return more realistic response shapes
 */
// Enhanced axios stub with all HTTP methods and response structure
const mockResponse = {
  status: 200,
  statusText: 'OK',
  data: {},
  headers: {},
  config: {}
};

module.exports = {
  get: async () => mockResponse, // mock get method returns mock response
  post: async () => mockResponse, // mock post method returns mock response
  put: async () => mockResponse, // mock put method returns mock response
  delete: async () => mockResponse, // mock delete method returns mock response  
  patch: async () => mockResponse, // mock patch method returns mock response
  head: async () => mockResponse, // mock head method returns mock response
  options: async () => mockResponse, // mock options method returns mock response
  request: async () => mockResponse // mock generic request method returns mock response
};

/**
 * Usage in tests:
 * 
 * After requiring 'qtests/setup', any code that does:
 *   const axios = require('axios');
 *   const data = await axios.get(`https://api.example.com`);
 *   await axios.post('https://api.example.com', data);
 * 
 * Will actually call this stub instead, which:
 * - Returns immediately without network I/O
 * - Resolves to {} for predictable test behavior
 * - Doesn't log or store any request data
 * 
 * This allows testing of HTTP-dependent code without actual HTTP calls.
 */
