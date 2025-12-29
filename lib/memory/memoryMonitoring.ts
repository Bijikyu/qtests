/**
 * Memory Monitoring Utilities (Legacy Compatibility)
 * DEPRECATED: This file maintains backward compatibility.
 * Use the specific modules instead:
 * - monitoringOrchestration.ts for monitoring workflow
 * - cleanupOperations.ts for cleanup operations
 */

// Re-export all functions from specialized modules for backward compatibility
export {
  memoryMonitor,
  startMemoryMonitoring,
  checkpointMemory,
  endMemoryMonitoring,
  detectMemoryLeaks,
  MemorySnapshotManager,
  MemoryLeakDetector
} from './monitoringOrchestration.js';

export {
  cleanupWithMemoryTracking,
  aggressiveCleanup
} from './cleanupOperations';