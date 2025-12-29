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
  checkpointMemory('pre-cleanup');

  if ((global as any).gc) {
    for (let i = 0; i < 3; i++) {
      (global as any).gc();
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  checkpointMemory('post-cleanup');
};

export const aggressiveCleanup = (): void => {
  try {
    clearGlobalRefs();
    const clearedModules = clearModuleCache();
    forceGC();
    console.log(`Memory cleanup: cleared ${clearedModules} modules`);
  } catch (error: any) {
    qerrors(error, 'cleanupOperations.aggressiveCleanup: memory cleanup failed', {
      errorType: error.constructor?.name || 'Unknown',
      errorMessage: error?.message || String(error)
    });
    console.warn('Memory cleanup warning:', error?.message || String(error));
  }
};