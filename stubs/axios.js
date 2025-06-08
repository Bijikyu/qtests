
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
module.exports = {
  /**
   * Mock implementation of axios.get()
   * Works like axios.get but instantly resolves an empty object.
   * @param {...any} args - Parameters ignored to prevent network use
   * @returns {Promise<Object>} Promise resolving to empty object
   */
  get: async () => ({}) ,
  /**
   * Mock implementation of axios.post()
   * 
   * This replaces axios.post() calls with a function that immediately
   * resolves to an empty object. This prevents real HTTP requests while
   * maintaining the async interface that calling code expects.
   * 
   * Parameter handling:
   * - Accepts any parameters (url, data, config) like real axios
   * - Ignores all parameters to prevent side effects
   * - Returns same type regardless of input for predictability
   * 
   * Why async with immediate resolution:
   * - Maintains promise interface for await/then compatibility
   * - Prevents "promise not resolved" errors in test code
   * - Allows testing of async/await patterns
   * - Fast execution (no actual network delay)
   * 
   * @param {...any} args - Any arguments (ignored for safety)
   * @returns {Promise<Object>} Promise resolving to empty object
   */
  post: async () => ({}) // Always resolves to empty object, no actual HTTP request
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
