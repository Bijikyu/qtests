// External service wrapper centralizing axios usage.
// Rationale: centralizing network calls simplifies stubbing and keeps routes thin.
const axios = require('axios');
const winston = require('winston');

/**
 * fetchHello
 * Calls an external endpoint. In tests, qtests stubs axios to a no-op returning a truthy object.
 * We `await` the result so real axios Promises and stubbed plain objects both work.
 * @returns {Promise<any>} resolves to axios response or stubbed object
 */
async function fetchHello() {
  try {
    // Use a stable public endpoint; qtests stubs will short-circuit in tests.
    const result = await axios.get('https://example.com/');
    try { winston.info('external call complete'); } catch (_) { /* no-op under stubs */ }
    return result;
  } catch (err) {
    // Re-throw with a clean message for upstream handlers.
    const message = err && err.message ? err.message : 'external_call_failed';
    const error = new Error(message);
    error.cause = err;
    throw error;
  }
}

// Export at bottom per repo conventions.
module.exports = { fetchHello };
