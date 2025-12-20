/**
 * Memory Snapshot Management
 * Handles taking and managing memory snapshots
 */

import { performance } from 'perf_hooks';
import { MemorySnapshot, MemoryDelta } from './memoryTypes.js';

export class MemorySnapshotManager {
  private snapshots: MemorySnapshot[] = [];
  private maxSnapshots = 10;

  takeSnapshot(label?: string): MemorySnapshot {
    const usage = process.memoryUsage();
    const snapshot: MemorySnapshot = {
      timestamp: performance.now(),
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      external: Math.round(usage.external / 1024 / 1024),
      rss: Math.round(usage.rss / 1024 / 1024),
      arrayBuffers: usage.arrayBuffers ? Math.round(usage.arrayBuffers / 1024 / 1024) : undefined
    };

    this.snapshots.push(snapshot);

    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    if (label) {
      console.log(`Memory [${label}]: ${snapshot.heapUsed}MB heap, ${snapshot.rss}MB RSS`);
    }

    return snapshot;
  }

  getDelta(): MemoryDelta {
    if (this.snapshots.length < 2) {
      return { heap: 0, rss: 0 };
    }

    const latest = this.snapshots[this.snapshots.length - 1];
    const first = this.snapshots[0];

    return {
      heap: latest.heapUsed - first.heapUsed,
      rss: latest.rss - first.rss
    };
  }

  reset(): void {
    this.snapshots = [];
  }

  getAllSnapshots(): MemorySnapshot[] {
    return [...this.snapshots];
  }
}