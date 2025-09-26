// Jest proxy for 'external-service-client' to leverage qtests custom stubs (CJS)
const resolver = (globalThis && globalThis.__QTESTS_RESOLVE_CUSTOM_STUB) || (() => undefined);
const stub = resolver('external-service-client');
if (!stub) {
  throw new Error("custom stub not registered for 'external-service-client'");
}
module.exports = stub;

// Avoid caching so that subsequent require() re-evaluates after unregister
try { if (require && require.cache) { delete require.cache[__filename]; } } catch {}
