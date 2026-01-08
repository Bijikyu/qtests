#!/usr/bin/env node
// Simplified Memory Benchmark using available memory monitoring
import { MemorySnapshotManager } from '../../dist/lib/memory/snapshotManager.js';
import { performance } from 'perf_hooks';

class SimpleMemoryBenchmark {
  constructor() {
    this.snapshotManager = new MemorySnapshotManager();
    this.results = [];
    console.log('Simple Memory Benchmark Initialized');
  }

  async runAllBenchmarks() {
    console.log('Starting memory benchmarks...');
    
    const scenarios = [
      { name: 'Light Load', targetMemory: 100 * 1024 * 1024, duration: 5000 },
      { name: 'Moderate Load', targetMemory: 300 * 1024 * 1024, duration: 5000 },
      { name: 'High Load', targetMemory: 600 * 1024 * 1024, duration: 5000 }
    ];

    for (const scenario of scenarios) {
      const result = await this.runScenario(scenario);
      this.results.push(result);
      console.log(`Completed: ${scenario.name} - Memory: ${Math.round(result.peakMemory / 1024 / 1024)}MB`);
      await this.recoveryPeriod(2000);
    }
    
    return this.results;
  }

  async runScenario(scenario) {
    console.log(`Testing: ${scenario.name} (${Math.round(scenario.targetMemory / 1024 / 1024)}MB target)`);
    
    const startTime = Date.now();
    const startSnapshot = this.snapshotManager.takeSnapshot('start');
    let peakMemory = 0;
    
    try {
      const memoryChunks = this.createMemoryLoad(scenario.targetMemory);
      const endTime = startTime + scenario.duration;
      
      while (Date.now() < endTime) {
        this.applyMemoryPressure(memoryChunks);
        const currentMemory = process.memoryUsage();
        peakMemory = Math.max(peakMemory, currentMemory.heapUsed);
        await this.sleep(100);
      }
      
      // Cleanup
      const cleanupStart = Date.now();
      memoryChunks.length = 0; // Clear array
      if (global.gc) global.gc();
      const cleanupTime = Date.now() - cleanupStart;
      
      const endSnapshot = this.snapshotManager.takeSnapshot('end');
      
      return {
        scenario: scenario.name,
        targetMemory: scenario.targetMemory,
        peakMemory,
        startMemory: startSnapshot.heapUsed * 1024 * 1024,
        endMemory: endSnapshot.heapUsed * 1024 * 1024,
        cleanupPerformance: cleanupTime,
        memoryFreed: Math.max(0, startSnapshot.heapUsed * 1024 * 1024 - endSnapshot.heapUsed * 1024 * 1024),
        totalDuration: Date.now() - startTime,
        success: true
      };
    } catch (error) {
      console.error(`Scenario ${scenario.name} failed:`, error);
      return {
        scenario: scenario.name,
        targetMemory: scenario.targetMemory,
        peakMemory: 0,
        startMemory: 0,
        endMemory: 0,
        cleanupPerformance: 0,
        memoryFreed: 0,
        totalDuration: Date.now() - startTime,
        success: false
      };
    }
  }

  createMemoryLoad(targetBytes) {
    const chunks = [];
    const chunkSize = 10 * 1024 * 1024; // 10MB chunks
    const numChunks = Math.floor(targetBytes / chunkSize);
    
    for (let i = 0; i < numChunks; i++) {
      chunks.push(new Uint8Array(chunkSize));
    }
    
    return chunks;
  }

  applyMemoryPressure(memoryChunks) {
    if (!memoryChunks || memoryChunks.length === 0) return;
    
    const activeChunks = Math.floor(Math.random() * memoryChunks.length) + 1;
    for (let i = 0; i < activeChunks && i < memoryChunks.length; i++) {
      const chunk = memoryChunks[i];
      // Modify some bytes to ensure memory is actually used
      for (let j = 0; j < Math.min(chunk.length, 1024); j += 100) {
        chunk[j] = Math.random() * 255;
      }
    }
  }

  async recoveryPeriod(ms) {
    console.log(`Recovery period: ${ms}ms`);
    if (global.gc) global.gc();
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateReport() {
    console.log('\nMEMORY BENCHMARK REPORT');
    console.log('='.repeat(50));
    
    for (const result of this.results) {
      const status = result.success ? 'PASS' : 'FAIL';
      const peakMemoryMB = Math.round(result.peakMemory / 1024 / 1024);
      const memoryFreedMB = Math.round(result.memoryFreed / 1024 / 1024);
      
      console.log(`${status} ${result.scenario.padEnd(15)}`);
      console.log(`  Target Memory:    ${Math.round(result.targetMemory / 1024 / 1024)}MB`);
      console.log(`  Peak Memory:      ${peakMemoryMB}MB`);
      console.log(`  Memory Freed:     ${memoryFreedMB}MB`);
      console.log(`  Cleanup Time:     ${result.cleanupPerformance}ms`);
      console.log(`  Duration:         ${result.totalDuration}ms`);
      console.log('');
    }
    
    const successful = this.results.filter(r => r.success);
    const avgPeakMemory = successful.reduce((sum, r) => sum + r.peakMemory, 0) / successful.length;
    const avgCleanupTime = successful.reduce((sum, r) => sum + r.cleanupPerformance, 0) / successful.length;
    
    console.log('PERFORMANCE SUMMARY');
    console.log(`  Success Rate:      ${successful.length}/${this.results.length} (${Math.round(successful.length / this.results.length * 100)}%)`);
    console.log(`  Avg Peak Memory:   ${Math.round(avgPeakMemory / 1024 / 1024)}MB`);
    console.log(`  Avg Cleanup Time:  ${Math.round(avgCleanupTime)}ms`);
  }
}

// Run benchmark if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  const benchmark = new SimpleMemoryBenchmark();
  benchmark.runAllBenchmarks()
    .then(() => {
      benchmark.generateReport();
      process.exit(0);
    })
    .catch(error => {
      console.error('Benchmark failed:', error);
      process.exit(1);
    });
}