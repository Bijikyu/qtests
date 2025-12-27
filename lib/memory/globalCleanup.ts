/**
 * Global Reference Cleanup
 * Handles cleanup of global references that might cause memory leaks
 */

declare const global: any;
import qerrors from 'qerrors';

export const clearGlobalRefs = (): void => {
  const refsToClear = [
    'testServer',
    'mongoConnection',
    '__MONGO_DB__',
    '__MONGOD__',
    'app',
    'server',
    'io',
    'redisClient'
  ];

  refsToClear.forEach(ref => {
    if (global[ref]) {
      try {
        if (typeof global[ref].close === 'function') {
          global[ref].close();
        }
        if (typeof global[ref].disconnect === 'function') {
          global[ref].disconnect();
        }
      } catch (error) {
        qerrors(error, 'globalCleanup.clearGlobalRefs: cleanup operation failed', {
          refName: ref,
          hasClose: typeof global[ref]?.close === 'function',
          hasDisconnect: typeof global[ref]?.disconnect === 'function'
        });
      }
      global[ref] = null;
    }
  });
};