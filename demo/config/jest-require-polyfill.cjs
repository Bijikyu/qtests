// Provide a CommonJS `require` in Jest environments that default to ESM.
// qtests runner adds this file in setupFiles to keep `require(...)` available.
try {
  if (typeof globalThis.require !== 'function') {
    const { createRequire } = require('module');
    // Use project root as base for resolution.
    globalThis.require = createRequire(process.cwd() + '/');
  }
} catch (_e) {
  // Silently ignore; tests that need require will fail loudly if truly unavailable.
}

module.exports = {};

