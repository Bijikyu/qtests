/**
 * Memory Cleanup Operations
 * Utilities for memory cleanup and garbage collection
 */

import { forceGC } from './garbageCollection';
import { checkpointMemory } from './monitoringOrchestration';
import { handleMemoryError } from '../utils/errorHandling.js';

import { clearGlobalRefs } from './globalCleanup';
import { clearModuleCache } from './moduleCleanup';
import { performGarbageCollection, performMemoryCleanup } from '../utils/memoryManagement.js';

export const cleanupWithMemoryTracking = async (): Promise<void> => {
  checkpointMemory('pre-cleanup'); // Record memory state before cleanup for comparison

  await performGarbageCollection({
    forceGC: true,
    gcPasses: 3,
    delayBetweenPasses: 10
  });

  checkpointMemory('post-cleanup'); // Record final memory state to measure cleanup effectiveness
};

export const aggressiveCleanup = (): void => {
  try {
    clearGlobalRefs(); // Clear global references that might prevent GC (database connections, servers, etc.)
    const clearedModules = clearModuleCache(); // Remove test modules from require.cache to free memory
    forceGC(); // Force garbage collection to reclaim memory from cleared references
    console.log(`Memory cleanup: cleared ${clearedModules} modules`); // Log cleanup success for debugging
  } catch (error: any) {
    // Log detailed error information for debugging while allowing cleanup to continue
    handleMemoryError(error, 'aggressiveCleanup', {
      errorType: error.constructor?.name || 'Unknown',
      errorMessage: error?.message || String(error)
    });
    console.warn('Memory cleanup warning:', error?.message || String(error));
  }
};