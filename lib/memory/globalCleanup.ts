/**
 * Global Reference Cleanup
 * Handles cleanup of global references that might cause memory leaks
 */

declare const global: any;
import qerrors from 'qerrors';

export const clearGlobalRefs = (): void => {
  // List of common global references that can cause memory leaks in test environments
  // These are typically created during test setup and not properly cleaned up
  const refsToClear = [
    'testServer',        // Express/Fastify test servers
    'mongoConnection',   // MongoDB database connections
    '__MONGO_DB__',      // MongoDB memory server instances
    '__MONGOD__',        // MongoDB memory server processes
    'app',              // Express application instances
    'server',           // HTTP server instances
    'io',               // Socket.IO instances
    'redisClient'       // Redis client connections
  ];

  refsToClear.forEach(ref => {
    if (global[ref]) {
      try {
        // Attempt graceful cleanup by calling available cleanup methods
        // Different services use different method names for cleanup
        if (typeof global[ref].close === 'function') {
          global[ref].close(); // Common method for servers and connections
        }
        if (typeof global[ref].disconnect === 'function') {
          global[ref].disconnect(); // Common method for database clients
        }
      } catch (error: any) {
        // Log cleanup failures but continue with nullification to prevent memory leaks
        qerrors(error, 'globalCleanup.clearGlobalRefs: cleanup operation failed', {
          refName: ref,
          hasClose: typeof global[ref]?.close === 'function',
          hasDisconnect: typeof global[ref]?.disconnect === 'function'
        });
      }
      global[ref] = null; // Remove reference to allow garbage collection
    }
  });
};