/**
 * Module Cache Cleanup
 * Handles clearing of Node.js module cache
 */

import { createRequire } from 'module';
import qerrors from '../qerrorsFallback.js';

// Node ESM: `require` is not global; use a scoped require so `require.cache` is available.
const require = createRequire(import.meta.url);

export const clearModuleCache = (): number => {
  try {
    const cache = (require as any).cache || {};
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
