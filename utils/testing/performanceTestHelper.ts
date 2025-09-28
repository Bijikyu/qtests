/**
 * Performance Testing Helper for Load and Timing Tests - TypeScript Implementation
 * 
 * This class focuses solely on performance measurement and testing concerns.
 * It provides standardized performance measurement across test suites.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';

// Type definitions
interface TimingMeasurement {
  result: any;
  duration: number;
  durationNs: number;
  timestamp: Date;
}

interface ConcurrencyResult {
  index: number;
  result?: any;
  error?: string;
  duration: number;
  success: boolean;
}

interface ConcurrencyTestResult {
  results: ConcurrencyResult[];
  totalDuration: number;
  successCount: number;
  errorCount: number;
  averageDuration: number;
  maxDuration: number;
  minDuration: number;
}

/**
 * Performance Testing Helper for Load and Timing Tests
 * 
 * This class provides standardized performance measurement across test suites
 * with timing assertions and concurrency testing capabilities.
 */
class PerformanceTestHelper {
  /**
   * Measures execution time of async operations with high precision
   */
  static async measureTime(operation: () => Promise<any>): Promise<TimingMeasurement> {
    logStart('PerformanceTestHelper.measureTime', operation.name || 'anonymous');
    
    try {
      const start = process.hrtime.bigint();
      const result = await operation();
      const end = process.hrtime.bigint();
      
      const durationNs = Number(end - start);
      const durationMs = durationNs / 1000000; // Convert nanoseconds to milliseconds
      
      const measurement: TimingMeasurement = {
        result,
        duration: durationMs,
        durationNs,
        timestamp: new Date()
      };
      
      logReturn('PerformanceTestHelper.measureTime', `${durationMs.toFixed(2)}ms`);
      return measurement;
    } catch (error: any) {
      logReturn('PerformanceTestHelper.measureTime', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts operation completes within time limit
   */
  static async assertTimingConstraint(operation: () => Promise<any>, maxDuration: number): Promise<any> {
    logStart('PerformanceTestHelper.assertTimingConstraint', `${operation.name || 'anonymous'}, ${maxDuration}ms`);
    
    try {
      const { result, duration } = await this.measureTime(operation);
      
      if (duration > maxDuration) {
        throw new Error(
          `Operation took ${duration.toFixed(2)}ms, exceeding limit of ${maxDuration}ms`
        );
      }
      
      logReturn('PerformanceTestHelper.assertTimingConstraint', `passed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error: any) {
      logReturn('PerformanceTestHelper.assertTimingConstraint', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Tests concurrent operations for race conditions and performance
   */
  static async testConcurrency(operations: Array<() => Promise<any>>): Promise<ConcurrencyTestResult> {
    logStart('PerformanceTestHelper.testConcurrency', `${operations.length} operations`);
    
    try {
      const start = process.hrtime.bigint();
      
      // Run all operations concurrently
      const promises = operations.map(async (operation, index) => {
        try {
          const opStart = process.hrtime.bigint();
          const result = await operation();
          const opEnd = process.hrtime.bigint();
          
          return {
            index,
            result,
            duration: Number(opEnd - opStart) / 1000000,
            success: true
          };
        } catch (error: any) {
          return {
            index,
            error: error.message,
            duration: 0,
            success: false
          };
        }
      });
      
      const results = await Promise.all(promises);
      const end = process.hrtime.bigint();
      
      const totalDuration = Number(end - start) / 1000000;
      const successResults = results.filter(r => r.success);
      const successCount = successResults.length;
      const errorCount = results.length - successCount;
      
      const durations = successResults.map(r => r.duration);
      const averageDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
      const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
      const minDuration = durations.length > 0 ? Math.min(...durations) : 0;
      
      const testResult: ConcurrencyTestResult = {
        results,
        totalDuration,
        successCount,
        errorCount,
        averageDuration,
        maxDuration,
        minDuration
      };
      
      logReturn('PerformanceTestHelper.testConcurrency', testResult);
      return testResult;
    } catch (error: any) {
      logReturn('PerformanceTestHelper.testConcurrency', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Measures memory usage during operation execution
   */
  static async measureMemory(operation: () => Promise<any>): Promise<{ result: any; memoryUsage: NodeJS.MemoryUsage }> {
    logStart('PerformanceTestHelper.measureMemory', operation.name || 'anonymous');
    
    try {
      // Force garbage collection if available
      if (typeof (global as any).gc === 'function') {
        (global as any).gc();
      }
      
      const initialMemory = process.memoryUsage();
      const result = await operation();
      const finalMemory = process.memoryUsage();
      
      const memoryUsage = {
        rss: finalMemory.rss - initialMemory.rss,
        heapTotal: finalMemory.heapTotal - initialMemory.heapTotal,
        heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
        external: finalMemory.external - initialMemory.external,
        arrayBuffers: (finalMemory as any).arrayBuffers - (initialMemory as any).arrayBuffers || 0
      };
      
      const measurement = { result, memoryUsage };
      logReturn('PerformanceTestHelper.measureMemory', memoryUsage);
      return measurement;
    } catch (error: any) {
      logReturn('PerformanceTestHelper.measureMemory', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Runs load testing with specified concurrent users
   */
  static async loadTest(operation: () => Promise<any>, concurrentUsers: number, iterations: number): Promise<any> {
    logStart('PerformanceTestHelper.loadTest', `${concurrentUsers} users, ${iterations} iterations`);
    
    try {
      const allOperations: Array<() => Promise<any>> = [];
      
      // Create operations for each user and iteration
      for (let user = 0; user < concurrentUsers; user++) {
        for (let iteration = 0; iteration < iterations; iteration++) {
          allOperations.push(async () => {
            const userIteration = { user, iteration };
            return await operation();
          });
        }
      }
      
      const results = await this.testConcurrency(allOperations);
      
      const loadTestResults = {
        ...results,
        concurrentUsers,
        iterations,
        totalOperations: allOperations.length,
        operationsPerSecond: allOperations.length / (results.totalDuration / 1000),
        averageResponseTime: results.averageDuration
      };
      
      logReturn('PerformanceTestHelper.loadTest', loadTestResults);
      return loadTestResults;
    } catch (error: any) {
      logReturn('PerformanceTestHelper.loadTest', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creates a performance benchmark suite
   */
  static createBenchmarkSuite(operations: Record<string, () => Promise<any>>): any {
    logStart('PerformanceTestHelper.createBenchmarkSuite', Object.keys(operations));
    
    const suite = {
      operations,
      results: {} as Record<string, TimingMeasurement>,
      
      async run(): Promise<Record<string, TimingMeasurement>> {
        for (const [name, operation] of Object.entries(operations)) {
          this.results[name] = await PerformanceTestHelper.measureTime(operation);
        }
        return this.results;
      },
      
      compare(): any {
        // Explicitly type entries to satisfy TS inference of Object.entries
        const results = Object.entries(this.results) as Array<[string, TimingMeasurement]>;
        const sorted = results.sort((a, b) => a[1].duration - b[1].duration);
        const fastest = sorted[0];
        
        return sorted.map(([name, result]) => ({
          name,
          duration: result.duration,
          relative: fastest ? result.duration / fastest[1].duration : 1
        }));
      }
    };
    
    logReturn('PerformanceTestHelper.createBenchmarkSuite', suite);
    return suite;
  }
}

// Export PerformanceTestHelper using ES module syntax
export { PerformanceTestHelper };
