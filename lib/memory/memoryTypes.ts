/**
 * Memory Monitoring Types
 * Defines interfaces for memory snapshots and deltas
 */

export interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  arrayBuffers?: number;
}

export interface MemoryDelta {
  heap: number;
  rss: number;
}