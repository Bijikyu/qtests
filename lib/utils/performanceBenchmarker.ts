/**
 * Performance Benchmark Suite
 * 
 * Establishes baseline metrics and monitors performance over time
 */

import { Timer } from './timingUtils.js';
import { PerformanceMonitor } from '../performanceMonitor.js';
import { log } from './structuredLogger.js';

export interface BenchmarkConfig {
  name: string;
  iterations: number;
  warmupIterations: number;
  timeout: number;
  memoryThreshold: number; // bytes
}

export interface BenchmarkResult {
  name: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  p50: number;
  p95: number;
  p99: number;
  memoryBefore: number;
  memoryAfter: number;
  memoryDelta: number;
  passed: boolean;
  warnings: string[];
}

export interface BenchmarkSuite {
  name: string;
  benchmarks: BenchmarkResult[];
  timestamp: number;
  environment: {
    nodeVersion: string;
    platform: string;
    arch: string;
    memory: NodeJS.MemoryUsage;
  };
}

class PerformanceBenchmarker {
  private results: BenchmarkResult[] = [];
  private monitor: PerformanceMonitor;

  constructor() {
    this.monitor = new PerformanceMonitor({
      samplingInterval: 100,
      historySize: 100,
      adaptiveSampling: false
    });
  }

  /**
   * Run a single benchmark
   */
  async runBenchmark(
    fn: () => void | Promise<void>,
    config: BenchmarkConfig
  ): Promise<BenchmarkResult> {
    const { name, iterations, warmupIterations, timeout, memoryThreshold } = config;
    
    log.info(`Starting benchmark: ${name}`, { iterations, warmupIterations }, 'benchmark');

    const memoryBefore = process.memoryUsage();
    
    // Warmup phase
    for (let i = 0; i < warmupIterations; i++) {
      await fn();
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const times: number[] = [];
    const warnings: string[] = [];

    this.monitor.startMonitoring();

    // Main benchmark phase
    for (let i = 0; i < iterations; i++) {
      const timer = new Timer(`benchmark-${name}-${i}`);
      timer.start();
      
      try {
        await Promise.race([
          Promise.resolve(fn()),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Benchmark timeout')), timeout)
          )
        ]);
        
        const elapsed = timer.stop().duration;
        times.push(elapsed);
      } catch (error) {
        warnings.push(`Iteration ${i} failed: ${error}`);
      }
    }

    this.monitor.stopMonitoring();
    const memoryAfter = process.memoryUsage();

    // Calculate statistics
    times.sort((a, b) => a - b);
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / times.length;
    
    const result: BenchmarkResult = {
      name,
      iterations: times.length,
      totalTime,
      averageTime,
      minTime: times[0] || 0,
      maxTime: times[times.length - 1] || 0,
      p50: times[Math.floor(times.length * 0.5)] || 0,
      p95: times[Math.floor(times.length * 0.95)] || 0,
      p99: times[Math.floor(times.length * 0.99)] || 0,
      memoryBefore: memoryBefore.heapUsed,
      memoryAfter: memoryAfter.heapUsed,
      memoryDelta: memoryAfter.heapUsed - memoryBefore.heapUsed,
      passed: true,
      warnings
    };

    // Performance validation
    if (result.averageTime > timeout / 2) {
      warnings.push('Average execution time is approaching timeout limit');
    }

    if (Math.abs(result.memoryDelta) > memoryThreshold) {
      warnings.push('Memory usage exceeds threshold');
      result.passed = false;
    }

    if (times.length < iterations * 0.95) {
      warnings.push(`High failure rate: ${iterations - times.length}/${iterations} iterations failed`);
      result.passed = false;
    }

    log.info(`Benchmark completed: ${name}`, {
      averageTime: result.averageTime,
      memoryDelta: result.memoryDelta,
      passed: result.passed,
      warnings: result.warnings.length
    }, 'benchmark');

    return result;
  }

  /**
   * Run multiple benchmarks as a suite
   */
  async runSuite(
    benchmarks: Array<{ fn: () => void | Promise<void>; config: BenchmarkConfig }>,
    suiteName: string = 'benchmark-suite'
  ): Promise<BenchmarkSuite> {
    log.info(`Starting benchmark suite: ${suiteName}`, { count: benchmarks.length }, 'benchmark');

    const results: BenchmarkResult[] = [];

    for (const { fn, config } of benchmarks) {
      try {
        const result = await this.runBenchmark(fn, config);
        results.push(result);
      } catch (error) {
        log.error(`Benchmark failed: ${config.name}`, error as Error, {}, 'benchmark');
        results.push({
          name: config.name,
          iterations: 0,
          totalTime: 0,
          averageTime: 0,
          minTime: 0,
          maxTime: 0,
          p50: 0,
          p95: 0,
          p99: 0,
          memoryBefore: 0,
          memoryAfter: 0,
          memoryDelta: 0,
          passed: false,
          warnings: [`Benchmark execution failed: ${error}`]
        });
      }
    }

    const suite: BenchmarkSuite = {
      name: suiteName,
      benchmarks: results,
      timestamp: Date.now(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage()
      }
    };

    log.info(`Benchmark suite completed: ${suiteName}`, {
      totalBenchmarks: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length
    }, 'benchmark');

    return suite;
  }

  /**
   * Compare two benchmark suites
   */
  compareSuites(baseline: BenchmarkSuite, current: BenchmarkSuite): void {
    log.info('Comparing benchmark suites', {}, 'benchmark');

    const baselineMap = new Map(baseline.benchmarks.map(b => [b.name, b]));
    const currentMap = new Map(current.benchmarks.map(b => [b.name, b]));

    for (const [name, baselineResult] of baselineMap) {
      const currentResult = currentMap.get(name);
      if (!currentResult) {
        log.warn(`Benchmark missing in current suite: ${name}`, {}, 'benchmark');
        continue;
      }

      const timeDiff = ((currentResult.averageTime - baselineResult.averageTime) / baselineResult.averageTime) * 100;
      const memoryDiff = ((currentResult.memoryDelta - baselineResult.memoryDelta) / Math.abs(baselineResult.memoryDelta)) * 100;

      if (Math.abs(timeDiff) > 10) {
        if (timeDiff > 0) {
          log.warn(`Performance regression detected: ${name}`, {
            regression: `${timeDiff.toFixed(1)}%`,
            baseline: baselineResult.averageTime,
            current: currentResult.averageTime
          }, 'benchmark');
        } else {
          log.info(`Performance improvement detected: ${name}`, {
            improvement: `${Math.abs(timeDiff).toFixed(1)}%`,
            baseline: baselineResult.averageTime,
            current: currentResult.averageTime
          }, 'benchmark');
        }
      }

      if (Math.abs(memoryDiff) > 20) {
        if (memoryDiff > 0) {
          log.warn(`Memory usage regression detected: ${name}`, {
            regression: `${memoryDiff.toFixed(1)}%`,
            baseline: baselineResult.memoryDelta,
            current: currentResult.memoryDelta
          }, 'benchmark');
        } else {
          log.info(`Memory usage improvement detected: ${name}`, {
            improvement: `${Math.abs(memoryDiff).toFixed(1)}%`,
            baseline: baselineResult.memoryDelta,
            current: currentResult.memoryDelta
          }, 'benchmark');
        }
      }
    }
  }

  /**
   * Generate benchmark report
   */
  generateReport(suite: BenchmarkSuite): string {
    const lines: string[] = [];
    
    lines.push('# Benchmark Report');
    lines.push(`## ${suite.name}`);
    lines.push(`**Generated:** ${new Date(suite.timestamp).toISOString()}`);
    lines.push('');
    
    lines.push('### Environment');
    lines.push(`- Node.js: ${suite.environment.nodeVersion}`);
    lines.push(`- Platform: ${suite.environment.platform}`);
    lines.push(`- Architecture: ${suite.environment.arch}`);
    lines.push(`- Memory: ${Math.round(suite.environment.memory.heapUsed / 1024 / 1024)}MB`);
    lines.push('');

    lines.push('### Results');
    lines.push('| Benchmark | Iterations | Avg Time (ms) | Min | Max | P95 | P99 | Memory (KB) | Status |');
    lines.push('|-----------|------------|----------------|-----|-----|-----|-----|--------------|--------|');

    for (const benchmark of suite.benchmarks) {
      const status = benchmark.passed ? '✅ PASS' : '❌ FAIL';
      const memoryKB = Math.round(benchmark.memoryDelta / 1024);
      
      lines.push(`| ${benchmark.name} | ${benchmark.iterations} | ${benchmark.averageTime.toFixed(2)} | ${benchmark.minTime.toFixed(2)} | ${benchmark.maxTime.toFixed(2)} | ${benchmark.p95.toFixed(2)} | ${benchmark.p99.toFixed(2)} | ${memoryKB} | ${status} |`);
      
      if (benchmark.warnings.length > 0) {
        lines.push(`| **Warnings:** ${benchmark.warnings.join(', ')} | | | | | | | | |`);
      }
    }

    const passed = suite.benchmarks.filter(b => b.passed).length;
    const failed = suite.benchmarks.filter(b => !b.passed).length;
    
    lines.push('');
    lines.push('### Summary');
    lines.push(`- **Total Benchmarks:** ${suite.benchmarks.length}`);
    lines.push(`- **Passed:** ${passed}`);
    lines.push(`- **Failed:** ${failed}`);
    lines.push(`- **Success Rate:** ${((passed / suite.benchmarks.length) * 100).toFixed(1)}%`);

    return lines.join('\n');
  }
}

// Global benchmarker instance
export const benchmarker = new PerformanceBenchmarker();

// Convenience functions
export const runBenchmark = (
  fn: () => void | Promise<void>,
  config: BenchmarkConfig
): Promise<BenchmarkResult> => benchmarker.runBenchmark(fn, config);

export const runSuite = (
  benchmarks: Array<{ fn: () => void | Promise<void>; config: BenchmarkConfig }>,
  suiteName?: string
): Promise<BenchmarkSuite> => benchmarker.runSuite(benchmarks, suiteName);

export const compareSuites = (baseline: BenchmarkSuite, current: BenchmarkSuite): void => 
  benchmarker.compareSuites(baseline, current);

export const generateReport = (suite: BenchmarkSuite): string => 
  benchmarker.generateReport(suite);