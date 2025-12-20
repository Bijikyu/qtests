/**
 * Memory Monitoring Utilities
 * High-level utilities for memory monitoring with leak detection
 */

import { MemorySnapshotManager } from './snapshotManager.js';
import { MemoryLeakDetector } from './leakDetector.js';
import { forceGC } from './index.js';

const snapshotManager = new MemorySnapshotManager();
const leakDetector = new MemoryLeakDetector();

export const memoryMonitor = snapshotManager;
export const detectMemoryLeaks = (): boolean => {
  return leakDetector.detectLeaks();
};

export const startMemoryMonitoring = (): void => {
  snapshotManager.reset();
  snapshotManager.takeSnapshot('start');
};

export const checkpointMemory = (label: string): void => {
  snapshotManager.takeSnapshot(label);
};

export const endMemoryMonitoring = (): void => {
  snapshotManager.takeSnapshot('end');
  leakDetector.printSummary();
};

export const cleanupWithMemoryTracking = async (): Promise<void> => {
  await checkpointMemory('pre-cleanup');

  if ((global as any).gc) {
    for (let i = 0; i < 3; i++) {
      (global as any).gc();
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  await checkpointMemory('post-cleanup');
};

// Export classes for direct usage
export { MemorySnapshotManager, MemoryLeakDetector };

// Import aggressiveCleanup for compatibility from other modules
export const aggressiveCleanup = (): void => {
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