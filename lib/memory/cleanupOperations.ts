/**
 * Memory Cleanup Operations
 * Utilities for memory cleanup and garbage collection
 */

import { forceGC } from './index.js';
import { checkpointMemory } from './monitoringOrchestration.js';

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
    const { clearGlobalRefs } = require('./globalCleanup.js');
    const { clearModuleCache } = require('./moduleCleanup.js');
    
    clearGlobalRefs();
    const clearedModules = clearModuleCache();
    forceGC();
    console.log(`Memory cleanup: cleared ${clearedModules} modules`);
  } catch (error: any) {
    console.warn('Memory cleanup warning:', error.message);
  }
};