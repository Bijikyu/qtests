/**
 * Performance Testing Helper for Load and Timing Tests
 * 
 * This class focuses solely on performance measurement and testing concerns.
 * It provides standardized performance measurement across test suites.
 */

const { logStart, logReturn } = require('../../lib/logUtils');

/**
 * Performance Testing Helper for Load and Timing Tests
 * 
 * This class provides standardized performance measurement across test suites
 * with timing assertions and concurrency testing capabilities.
 */
class PerformanceTestHelper {
  /**
   * Measures execution time of async operations with high precision
   * 
   * @param {Function} operation - Async operation to measure
   * @returns {Promise<Object>} Result object with operation result and timing
   */
  static async measureTime(operation) {
    logStart('PerformanceTestHelper.measureTime', operation.name || 'anonymous');
    
    try {
      const start = process.hrtime.bigint();
      const result = await operation();
      const end = process.hrtime.bigint();
      
      const durationNs = Number(end - start);
      const durationMs = durationNs / 1000000; // Convert nanoseconds to milliseconds
      
      const measurement = {
        result,
        duration: durationMs,
        durationNs,
        timestamp: new Date()
      };
      
      logReturn('PerformanceTestHelper.measureTime', `${durationMs.toFixed(2)}ms`);
      return measurement;
    } catch (error) {
      logReturn('PerformanceTestHelper.measureTime', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts operation completes within time limit
   * 
   * @param {Function} operation - Operation to test
   * @param {number} maxDuration - Maximum allowed duration in milliseconds
   * @returns {Promise<any>} Operation result if within time limit
   */
  static async assertTimingConstraint(operation, maxDuration) {
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
    } catch (error) {
      logReturn('PerformanceTestHelper.assertTimingConstraint', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Tests concurrent operations for race conditions and performance
   * 
   * @param {Array<Function>} operations - Array of async operations to run concurrently
   * @returns {Promise<Object>} Results with timing and concurrency analysis
   */
  static async testConcurrency(operations) {
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
        } catch (error) {
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
      const successful = results.filter(r => r.success).length;
      const failed = results.length - successful;
      
      const analysis = {
        totalDuration,
        successful,
        failed,
        results,
        averageDuration: results.reduce((sum, r) => sum + r.duration, 0) / results.length,
        maxDuration: Math.max(...results.map(r => r.duration)),
        minDuration: Math.min(...results.map(r => r.duration))
      };
      
      logReturn('PerformanceTestHelper.testConcurrency', `${successful}/${results.length} succeeded in ${totalDuration.toFixed(2)}ms`);
      return analysis;
    } catch (error) {
      logReturn('PerformanceTestHelper.testConcurrency', `error: ${error.message}`);
      throw error;
    }
  }

  // Instance method wrappers for compatibility with TestSuiteBuilder
  async measureTime(operation) {
    return PerformanceTestHelper.measureTime(operation);
  }

  async assertTimingConstraint(operation, maxDuration) {
    return PerformanceTestHelper.assertTimingConstraint(operation, maxDuration);
  }

  async testConcurrency(operations) {
    return PerformanceTestHelper.testConcurrency(operations);
  }
}

module.exports = {
  PerformanceTestHelper
};