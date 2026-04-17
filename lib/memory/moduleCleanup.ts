/**
 * Module Cache Cleanup
 * Handles clearing of Node.js module cache
 */

import { createRequire } from 'module';
import qerrors from '../qerrorsFallback.js';

// CJS-and-ESM-compatible require: in CommonJS (the typical compiled-TypeScript
// case, including Jest), `require` is already a global so we use it directly.
// In native ESM environments `require` is absent, so we fall back to
// createRequire anchored to the process working directory.
// Using `import.meta.url` here would compile to a literal `import.meta.url`
// in the CJS output and crash with "Cannot use 'import.meta' outside a module".
const _require: NodeJS.Require =
  typeof require !== 'undefined'
    ? require
    : createRequire(process.cwd() + '/index.cjs');

export const clearModuleCache = (): number => {
  try {
    const cache = (_require as any).cache || {};
    const moduleKeys = Object.keys(cache);
    let cleared = 0;

    moduleKeys.forEach(key => {
      const normalizedKey = String(key).replace(/\\/g, '/'); // Windows-safe
      if (normalizedKey.includes('.test.') ||
          normalizedKey.includes('.spec.') ||
          normalizedKey.includes('GeneratedTest') ||
          normalizedKey.includes('/tests/') ||
          normalizedKey.includes('testHelpers')) {
        delete cache[key];
        cleared++;
      }
    });

    return cleared;
  } catch (error: any) {
    qerrors(error, 'moduleCleanup.clearModuleCache: module cache clearing failed', {
      errorType: error?.constructor?.name || 'Unknown',
      errorMessage: error?.message || String(error)
    });
    return 0;
  }
};
