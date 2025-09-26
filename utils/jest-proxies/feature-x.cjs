// Jest proxy for 'feature-x' to leverage qtests custom stubs (CJS)
const resolver = (globalThis && globalThis.__QTESTS_RESOLVE_CUSTOM_STUB) || (() => undefined);
const stub = resolver('feature-x');
if (!stub) {
  throw new Error("custom stub not registered for 'feature-x'");
}
module.exports = stub;

// Avoid caching so that subsequent require() re-evaluates after unregister
try { if (require && require.cache) { delete require.cache[__filename]; } } catch {}
