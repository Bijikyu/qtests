/**
 * Module Cache Cleanup
 * Handles clearing of Node.js module cache
 */

import { createRequire } from 'module';
import qerrors from 'qerrors';

export const clearModuleCache = (): number => {
  try {
    const moduleKeys = Object.keys(require.cache);
    let cleared = 0;

    moduleKeys.forEach(key => {
      if (key.includes('.test.') ||
          key.includes('.spec.') ||
          key.includes('GeneratedTest') ||
          key.includes('/tests/') ||
          key.includes('testHelpers')) {
        delete require.cache[key];
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