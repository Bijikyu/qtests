/**
 * Memory Cleanup Operations
 * Utilities for memory cleanup and garbage collection
 */

import { forceGC } from './garbageCollection';
import { checkpointMemory } from './monitoringOrchestration';
import qerrors from 'qerrors';

import { clearGlobalRefs } from './globalCleanup';
import { clearModuleCache } from './moduleCleanup';

export const cleanupWithMemoryTracking = async (): Promise<void> => {
  checkpointMemory('pre-cleanup'); // Record memory state before cleanup for comparison

  if ((global as any).gc) {
    // Run garbage collection multiple times with delays to ensure thorough cleanup
    // Multiple passes help catch objects that become eligible for GC in subsequent passes
    for (let i = 0; i < 3; i++) {
      (global as any).gc(); // Force garbage collection if available (requires --expose-gc flag)
      await new Promise(resolve => setTimeout(resolve, 10)); // Fixed timeout - use safe delay value
    }
  }

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
    qerrors(error, 'cleanupOperations.aggressiveCleanup: memory cleanup failed', {
      errorType: error.constructor?.name || 'Unknown',
      errorMessage: error?.message || String(error)
    });
    console.warn('Memory cleanup warning:', error?.message || String(error));
  }
};