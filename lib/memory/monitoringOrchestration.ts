/**
 * Memory Monitoring Orchestration
 * High-level utilities for memory monitoring workflow management
 */

import { MemorySnapshotManager } from './snapshotManager.js';
import { MemoryLeakDetector } from './leakDetector.js';

const snapshotManager = new MemorySnapshotManager();
const leakDetector = new MemoryLeakDetector();

export const memoryMonitor = snapshotManager;

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

export const detectMemoryLeaks = (): boolean => {
  return leakDetector.detectLeaks();
};

// Export classes for direct usage
export { MemorySnapshotManager, MemoryLeakDetector };