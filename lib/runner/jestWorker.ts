/**
 * Jest Worker Thread for Parallel Test Execution
 * 
 * This module implements a Node.js worker thread that runs Jest tests
 * in parallel for improved performance. Each worker receives a batch of
 * test files and executes them independently, reporting results back to
 * the main thread.
 * 
 * Key features:
 * - Parallel test execution using worker threads
 * - Jest CLI integration with custom configuration
 * - Robust error handling and process management
 * - Detailed result reporting with timing information
 * - Working directory management for test isolation
 * 
 * Worker responsibilities:
 * - Execute assigned test files using Jest CLI
 * - Collect test results and performance metrics
 * - Report results back to main thread via postMessage
 * - Handle errors gracefully with detailed reporting
 * 
 * Performance considerations:
 * - Isolated working directory to prevent conflicts
 * - Sequential test execution within worker (runInBand)
 * - Minimal logging to reduce I/O overhead
 * - Efficient result aggregation and reporting
 */

import { parentPort, workerData } from 'worker_threads';
import { createRequire } from 'module';

/**
 * Input data structure for worker threads
 * Contains all necessary information to execute tests in this worker
 */
type WorkerInput = {
  /** Path to Jest configuration file */
  configPath: string;
  /** Root directory of the project */
  projectRoot: string;
  /** Array of test file paths to execute */
  testFiles: string[];
};

/**
 * Result structure sent back to main thread
 * Contains aggregated results for all test files executed by this worker
 */
type WorkerResult = {
  /** Number of test files that passed successfully */
  passedFiles: number;
  /** Number of test files that failed */
  failedFiles: number;
  /** Detailed results for each test file */
  results: Array<{
    /** Path to the test file */
    file: string;
    /** Whether the test file passed all tests */
    success: boolean;
    /** Execution time in milliseconds */
    durationMs: number;
    /** Error message if tests failed */
    failureMessage: string;
  }>;
};

/**
 * Main worker execution function
 * 
 * This function orchestrates the test execution process:
 * 1. Parse worker input data
 * 2. Initialize Jest CLI interface
 * 3. Change to project working directory
 * 4. Execute each test file sequentially
 * 5. Aggregate results and report back to main thread
 * 
 * Error handling:
 * - All operations wrapped in try-catch blocks
 * - Process directory restored on completion
 * - Errors reported via postMessage to main thread
 */
async function runWorker(): Promise<void> {
  // Extract worker configuration from shared data
  const { configPath, projectRoot, testFiles } = workerData as WorkerInput;
  
  // Create require function for ESM module loading
  const require = createRequire(import.meta.url);
  
  // Load Jest module and access CLI interface
  const jestModule = require('jest');
  const runCLI = jestModule?.runCLI;
  
  // Validate Jest CLI availability
  if (typeof runCLI !== 'function') {
    throw new Error('Jest runCLI API unavailable');
  }

  // Initialize result tracking
  let passedFiles = 0;
  let failedFiles = 0;
  const results: WorkerResult['results'] = [];

  // Store original working directory for restoration
  const originalCwd = process.cwd();
  
  try {
    // Change to project root for proper module resolution
    // Use try-catch to handle permission issues gracefully
    try { 
      process.chdir(projectRoot); 
    } catch {
      // Continue in original directory if change fails
    }

    // Execute each test file sequentially to prevent race conditions
    for (const testFile of testFiles) {
      // Configure Jest CLI for single test file execution
      const argv: any = {
        config: configPath,           // Use provided Jest configuration
        passWithNoTests: true,        // Don't fail when no tests found
        cache: true,                 // Enable Jest cache for performance
        coverage: false,              // Disable coverage for speed
        runTestsByPath: true,        // Run specific file path
        runInBand: true,             // Sequential execution within worker
        silent: true,                 // Reduce output noise
        _: [testFile],               // Target test file
        $0: 'jest'                  // Simulate Jest CLI
      };

      // Execute Jest CLI for this test file
      const { results: runResults } = await runCLI(argv, [projectRoot]);
      
      // Extract test result information from Jest output
      const tr = (runResults?.testResults || [])[0];
      const success = tr ? 
        (tr.numFailingTests || 0) === 0 && !tr.failureMessage : 
        runResults?.success !== false;
      
      // Calculate execution duration from performance stats
      const durationMs = tr?.perfStats?.end && tr?.perfStats?.start ? 
        tr.perfStats.end - tr.perfStats.start : 0;
      
      // Extract failure message for debugging
      const failureMessage = tr?.failureMessage ? String(tr.failureMessage) : '';

      // Update counters based on test result
      if (success) {
        passedFiles += 1;
      } else {
        failedFiles += 1;
      }

      // Store detailed result for this test file
      results.push({
        file: testFile,
        success,
        durationMs,
        failureMessage
      });
    }
  } finally {
    // Always restore original working directory
    try { 
      process.chdir(originalCwd); 
    } catch {
      // Silently ignore restoration errors
    }
  }

  // Send aggregated results back to main thread
  const payload: WorkerResult = { passedFiles, failedFiles, results };
  parentPort?.postMessage(payload);
}

/**
 * Error handling for worker execution
 * 
 * Catches any unhandled errors in the worker and reports
 * them back to the main thread for proper error aggregation.
 */
runWorker().catch((error) => {
  parentPort?.postMessage({
    error: {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }
  });
});
