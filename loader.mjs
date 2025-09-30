// qtests ESM loader (optional): provides early interception for ESM imports of common deps
// Usage: node --loader=qtests/loader.mjs app.mjs
// NOTE: This is optional. The runtime require-hook covers CommonJS; this loader helps pure ESM.

import { fileURLToPath, pathToFileURL } from 'url';

// Minimal inline stubs for common modules; robust mocking is available via the runtime registry.
const INLINE = {
  axios: 'export default {};',
  winston: 'export default { createLogger: () => ({ error(){}, warn(){}, info(){}, debug(){}, verbose(){}, silly(){} }), format: {}, transports: {} };',
  mongoose: 'export default { model: () => ({}) };'
};

export async function resolve(specifier, context, defaultResolve) {
  if (Object.prototype.hasOwnProperty.call(INLINE, specifier)) {
    // Use a data URL for inline ESM source
    const source = INLINE[specifier];
    const url = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
    return { url, shortCircuit: true, format: 'module' };
  }
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (url.startsWith('data:text/javascript')) {
    const source = Buffer.from(url.split(',')[1], 'base64').toString('utf8');
    return { format: 'module', source, shortCircuit: true };
  }
  return defaultLoad(url, context, defaultLoad);
}

