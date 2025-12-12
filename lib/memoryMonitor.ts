import { performance } from 'perf_hooks';

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

export class MemoryMonitor {
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

  detectLeaks(): boolean {
    if (this.snapshots.length < 3) return false;

    const recent = this.snapshots.slice(-3);
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

  printSummary(): void {
    if (this.snapshots.length === 0) return;

    const latest = this.snapshots[this.snapshots.length - 1];
    const first = this.snapshots[0];
    const delta = this.getDelta();

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

export const memoryMonitor = new MemoryMonitor();

export const detectMemoryLeaks = (): boolean => {
  return memoryMonitor.detectLeaks();
};

export const startMemoryMonitoring = (): void => {
  memoryMonitor.reset();
  memoryMonitor.takeSnapshot('start');
};

export const checkpointMemory = (label: string): void => {
  memoryMonitor.takeSnapshot(label);
};

export const endMemoryMonitoring = (): void => {
  memoryMonitor.takeSnapshot('end');
  memoryMonitor.printSummary();
};

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
