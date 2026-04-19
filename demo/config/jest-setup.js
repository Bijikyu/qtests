// Additional Jest setup after qtests/setup runs.
// Keep a light createRequire shim even though setupFiles covers most cases.
try {
  if (typeof globalThis.require !== 'function') {
    const { createRequire } = require('module');
    globalThis.require = createRequire(__filename);
  }
} catch (_e) {
  // Safe no-op; qtests/setup should already have prepared environment hooks.
}

module.exports = {};

