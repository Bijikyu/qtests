/**
 * Memory Leak Detection
 * Handles detection of memory leaks based on snapshot analysis
 */

import { MemorySnapshotManager } from './snapshotManager.js';

export class MemoryLeakDetector {
  private snapshotManager: MemorySnapshotManager;

  constructor() {
    this.snapshotManager = new MemorySnapshotManager();
  }

  detectLeaks(): boolean {
    const snapshots = this.snapshotManager.getAllSnapshots();
    
    if (snapshots.length < 3) return false;

    const recent = snapshots.slice(-3);
    const heapGrowth = recent[2].heapUsed - recent[0].heapUsed;
    const rssGrowth = recent[2].rss - recent[0].rss;

    const heapLeakThreshold = 50;
    const rssLeakThreshold = 100;

    if (heapGrowth > heapLeakThreshold || rssGrowth > rssLeakThreshold) {
      console.warn(`⚠️  Potential memory leak detected:`);
      console.warn(`   Heap growth: +${heapGrowth}MB`);
      console.warn(`   RSS growth: +${rssGrowth}MB`);
      return true;
    }

    return false;
  }

  printSummary(): void {
    const snapshots = this.snapshotManager.getAllSnapshots();
    
    if (snapshots.length === 0) return;

    const latest = snapshots[snapshots.length - 1];
    const first = snapshots[0];
    const delta = this.snapshotManager.getDelta();

    console.log('\n📊 Memory Summary:');
    console.log(`   Start: ${first.heapUsed}MB heap, ${first.rss}MB RSS`);
    console.log(`   End: ${latest.heapUsed}MB heap, ${latest.rss}MB RSS`);
    console.log(`   Delta: ${delta.heap > 0 ? '+' : ''}${delta.heap}MB heap, ${delta.rss > 0 ? '+' : ''}${delta.rss}MB RSS`);

    if (this.detectLeaks()) {
      console.log('   🔍 Memory leaks detected!');
    } else {
      console.log('   ✅ No significant memory leaks detected');
    }
  }
}