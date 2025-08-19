/**
 * Console Mocking Utility
 * 
 * This module provides utilities for mocking console methods during testing.
 * It focuses solely on console interaction management.
 */

const { mockConsole } = require('../mockConsole');

/**
 * Execute a callback with a mocked console method
 *
 * This helper creates a console spy using mockConsole, runs the callback,
 * then restores the original console method. It simplifies tests that need
 * temporary console interception.
 *
 * @param {string} method - Console method name to spy on
 * @param {Function} fn - Callback to execute with the spy
 * @returns {Promise<*>} Result returned by the callback
 */
async function withMockConsole(method, fn) {
  const spy = mockConsole(method);
  console.log(`withMockConsole is running with ${method}`);
  try {
    const result = await fn(spy);
    console.log(`withMockConsole is returning ${result}`);
    return result;
  } catch (err) {
    console.log(`withMockConsole error ${err.message}`);
    throw err;
  } finally {
    if (spy.mockRestore) { spy.mockRestore(); }
  }
}

module.exports = {
  withMockConsole
};