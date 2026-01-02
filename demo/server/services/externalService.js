// External service wrapper centralizing HTTP client usage.
// Rationale: centralizing network calls simplifies stubbing and keeps routes thin.
const { httpClient } = require('../../lib/utils/httpClient');
const winston = require('winston');
const qerrors = require('qerrors');

/**
 * fetchHello
 * Calls an external endpoint. In tests, qtests stubs axios to a no-op returning a truthy object.
 * We `await` the result so real axios Promises and stubbed plain objects both work.
 * @returns {Promise<any>} resolves to axios response or stubbed object
 */
async function fetchHello() {
  try {
    // Use a stable public endpoint; qtests stubs will short-circuit in tests.
    // Add timeout and retry configuration for robustness
    const result = await httpClient.get('https://example.com/');
    try { winston.info('external call complete'); } catch (_) { /* no-op under stubs */ }
    return result;
  } catch (err) {
    qerrors(err, 'externalService.fetchHello: network call failed', { 
      url: 'https://example.com/',
      timeout: 10000,
      errorType: err.code || 'unknown'
    });
    // Re-throw with a clean message for upstream handlers.
    const message = err && err.message ? err.message : 'external_call_failed';
    const error = new Error(message);
    error.cause = err;
    throw error;
  }
}

// Export at bottom per repo conventions.
module.exports = { fetchHello };
