/**
 * Memory Leak Detection
 * Handles detection of memory leaks based on snapshot analysis
 */

import { MemorySnapshotManager } from './snapshotManager.js';
import qerrors from 'qerrors';

export class MemoryLeakDetector {
  private snapshotManager: MemorySnapshotManager;

  constructor() {
    this.snapshotManager = new MemorySnapshotManager();
  }

  detectLeaks(): boolean {
    try {
      const snapshots = this.snapshotManager.getAllSnapshots();
      
      // Need at least 3 snapshots to establish a trend and detect consistent growth
      if (snapshots.length < 3) return false;

      const recent = snapshots.slice(-3); // Analyze the 3 most recent snapshots
      const heapGrowth = recent[2].heapUsed - recent[0].heapUsed; // Calculate heap memory growth
      const rssGrowth = recent[2].rss - recent[0].rss; // Calculate RSS (Resident Set Size) growth

      // Conservative thresholds to avoid false positives
      // Heap growth of 50MB+ or RSS growth of 100MB+ across 3 snapshots indicates potential leak
      const heapLeakThreshold = 50;
      const rssLeakThreshold = 100;

      if (heapGrowth > heapLeakThreshold || rssGrowth > rssLeakThreshold) {
        console.warn(`⚠️  Potential memory leak detected:`);
        console.warn(`   Heap growth: +${heapGrowth}MB`);
        console.warn(`   RSS growth: +${rssGrowth}MB`);
        return true;
      }

      return false;
    } catch (error: any) {
      qerrors(error, 'leakDetector.detectLeaks: leak detection failed', {
        snapshotCount: this.snapshotManager.getAllSnapshots().length,
        errorMessage: error?.message || String(error),
        errorType: error?.constructor?.name || 'Unknown'
      });
      return false;
    }
  }

  printSummary(): void {
    try {
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
    } catch (error: any) {
      qerrors(error, 'leakDetector.printSummary: summary print failed', {
        snapshotCount: this.snapshotManager.getAllSnapshots().length,
        errorMessage: error?.message || String(error),
        errorType: error?.constructor?.name || 'Unknown'
      });
      console.log('   ❌ Failed to print memory summary');
    }
  }
}