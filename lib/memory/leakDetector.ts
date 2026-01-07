/**
 * Memory Leak Detection
 * Handles detection of memory leaks based on snapshot analysis
 */

import { MemorySnapshotManager } from './snapshotManager.js';
import { handleMemoryError, getErrorMessage } from '../utils/errorHandling.js';
import { 
  getMemorySnapshot, 
  analyzeMemoryGrowth, 
  calculateMemoryDelta,
  formatMemorySnapshot 
} from '../utils/memoryManagement.js';

export class MemoryLeakDetector {
  private snapshotManager: MemorySnapshotManager;

  constructor() {
    this.snapshotManager = new MemorySnapshotManager();
  }

  detectLeaks(): boolean {
    try {
      const snapshots = this.snapshotManager.getAllSnapshots();
      
      // Need at least 5 snapshots for better trend analysis
      if (snapshots.length < 5) return false;

      const recent = snapshots.slice(-5); // Analyze 5 most recent snapshots
      const timeSpan = recent[4].timestamp - recent[0].timestamp;
      
      // Calculate growth rates instead of absolute values
      const heapGrowthRate = (recent[4].heapUsed - recent[0].heapUsed) / (timeSpan / 1000); // MB per second
      const rssGrowthRate = (recent[4].rss - recent[0].rss) / (timeSpan / 1000); // MB per second
      
      // Detect abnormal growth patterns
      const heapLeakThreshold = timeSpan > 60000 ? 1 : 5; // 1MB/s for long runs, 5MB/s for short
      const rssLeakThreshold = timeSpan > 60000 ? 2 : 10; // 2MB/s for long runs, 10MB/s for short
      
      // Check for consistent growth (not just spikes)
      const heapConsistentGrowth = this.checkConsistentGrowth(recent.map(s => s.heapUsed));
      const rssConsistentGrowth = this.checkConsistentGrowth(recent.map(s => s.rss));

      const isHeapLeaking = heapGrowthRate > heapLeakThreshold && heapConsistentGrowth;
      const isRssLeaking = rssGrowthRate > rssLeakThreshold && rssConsistentGrowth;

      if (isHeapLeaking || isRssLeaking) {
        console.warn(`⚠️  Potential memory leak detected:`);
        console.warn(`   Time span: ${(timeSpan / 1000).toFixed(1)}s`);
        console.warn(`   Heap growth rate: ${heapGrowthRate.toFixed(2)}MB/s (threshold: ${heapLeakThreshold}MB/s)`);
        console.warn(`   RSS growth rate: ${rssGrowthRate.toFixed(2)}MB/s (threshold: ${rssLeakThreshold}MB/s)`);
        console.warn(`   Heap consistent growth: ${heapConsistentGrowth}`);
        console.warn(`   RSS consistent growth: ${rssConsistentGrowth}`);
        return true;
      }

      return false;
    } catch (error: any) {
      handleMemoryError(error, 'detectLeaks', {
        snapshotCount: this.snapshotManager.getAllSnapshots().length,
        errorMessage: getErrorMessage(error),
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
      handleMemoryError(error, 'printSummary', {
        snapshotCount: this.snapshotManager.getAllSnapshots().length,
        errorMessage: getErrorMessage(error),
        errorType: error?.constructor?.name || 'Unknown'
      });
      console.log('   ❌ Failed to print memory summary');
    }
  }

  private checkConsistentGrowth(values: number[]): boolean {
    if (values.length < 3) return false;
    
    // Calculate correlation coefficient for growth trend
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = values.reduce((sum, yi) => sum + yi * yi, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    // Return true if strong positive correlation (> 0.7)
    return correlation > 0.7;
  }
}