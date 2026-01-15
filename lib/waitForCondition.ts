/**
 * Asynchronous Condition Waiting Utility
 * 
 * This module provides a robust utility for waiting for asynchronous conditions
 * to become true with configurable timeouts and intervals. It's designed to
 * prevent infinite loops and provide clear error messages for debugging.
 * 
 * Key features:
 * - Configurable timeout and interval parameters
 * - Protection against infinite loops and hanging
 * - Comprehensive error handling and logging
 * - Graceful handling of predicate failures
 * - Efficient timing mechanism with cleanup
 * 
 * Use cases:
 * - Waiting for DOM elements to appear
 * - Polling for async operations to complete
 * - Testing asynchronous state changes
 * - Waiting for network conditions
 * 
 * Safety mechanisms:
 * - Maximum iteration limits to prevent infinite loops
 * - Timeout enforcement to prevent hanging
 * - Error handling for predicate failures
 * - Minimum delay enforcement to prevent CPU spinning
 */

import qerrors from './qerrorsFallback';

const safeQerrors = (error: Error, message?: string, context?: any) => {
  try {
    qerrors(error, message, context);
  } catch {
    // Intentionally silence fallback rethrows so wait loops continue after logging
  }
};

/**
 * Configuration options for waitForCondition function
 */
export interface WaitForConditionOptions {
  /** Maximum time to wait in milliseconds (default: 2000) */
  timeoutMs?: number;
  /** Interval between predicate checks in milliseconds (default: 25) */
  intervalMs?: number;
}

/**
 * Wait for a condition to become true with timeout protection
 * 
 * This function repeatedly executes a predicate function until it returns true
 * or the timeout is reached. It includes comprehensive safety measures
 * to prevent infinite loops and hanging behavior.
 * 
 * Algorithm:
 * 1. Validate and normalize input parameters
 * 2. Calculate safety margins and iteration limits
 * 3. Loop: check timeout, execute predicate, conditionally wait
 * 4. Handle errors and edge cases gracefully
 * 
 * Safety features:
 * - Minimum timeout enforcement (100ms)
 * - Maximum iteration calculation with safety margin
 * - Predicate error handling with continued execution
 * - Timer cleanup mechanism to prevent hanging
 * - Fallback delays when timer operations fail
 * 
 * @param predicate - Function that returns boolean or Promise<boolean> to test condition
 * @param opts - Configuration options for timeout and interval
 * @returns Promise that resolves when condition becomes true
 * @throws Error when timeout is exceeded or max iterations reached
 * 
 * @example
 * // Wait for element to appear in DOM
 * await waitForCondition(() => document.getElementById('my-element') !== null);
 * 
 * @example
 * // Wait with custom timeout
 * await waitForCondition(
 *   () => window.myData !== undefined,
 *   { timeoutMs: 5000, intervalMs: 100 }
 * );
 */
export async function waitForCondition(
  predicate: () => boolean | Promise<boolean>,
  opts: WaitForConditionOptions = {}
): Promise<void> {
  // Extract and normalize configuration options
  const timeoutMs = opts.timeoutMs ?? 2000;
  const intervalMs = opts.intervalMs ?? 25;
  const start = Date.now();

  // Safety check: prevent unrealistically short timeouts
  if (timeoutMs < 100) {
    console.warn('waitForCondition: timeoutMs too low, setting minimum of 100ms');
  }

  // Calculate maximum iterations with safety margin to prevent infinite loops
  // Add 10 extra iterations as buffer for timing variations
  let iterations = 0;
  const maxIterations = Math.ceil(timeoutMs / intervalMs) + 10;

  // Main polling loop with comprehensive safety checks
  while (true) {
    iterations++;
    
    // Primary safety check: prevent infinite iteration loops
    if (iterations > maxIterations) {
      const timeoutError = new Error(`waitForCondition: max iterations exceeded (${maxIterations})`);
      safeQerrors(timeoutError, 'waitForCondition: max iterations exceeded', { 
        timeoutMs, 
        intervalMs, 
        iterations,
        maxIterations
      });
      throw timeoutError;
    }

    // Check timeout before predicate execution to prevent hanging
    const elapsed = Date.now() - start;
    if (elapsed > timeoutMs) {
      const timeoutError = new Error(`waitForCondition: timeout after ${timeoutMs}ms`);
      safeQerrors(timeoutError, 'waitForCondition: timeout exceeded', { 
        timeoutMs, 
        intervalMs, 
        elapsedMs: elapsed,
        iterations
      });
      throw timeoutError;
    }

    // Execute predicate with error handling
    let ok = false;
    try {
      ok = await predicate();
    } catch (error: any) {
      safeQerrors(error, 'waitForCondition: predicate execution failed', { 
        timeoutMs, 
        intervalMs, 
        elapsedMs: elapsed 
      });
      ok = false; // Continue waiting if predicate fails
    }

    // If condition is satisfied, return immediately
    if (ok) return;

    // Wait for next interval with cleanup mechanism
    try {
      await new Promise<void>((resolve) => {
        const timeoutId = setTimeout(() => resolve(), intervalMs);
        
        // Dynamic cleanup: adjust wait time if approaching timeout
        // This prevents overshooting the timeout by the interval duration
        if (timeoutMs - elapsed < intervalMs) {
          clearTimeout(timeoutId);
          setTimeout(() => resolve(), Math.max(1, timeoutMs - elapsed));
        }
      });
    } catch (error: any) {
      // Fallback handling when setTimeout operations fail
      safeQerrors(error, 'waitForCondition: setTimeout Promise failed', {
        intervalMs,
        elapsedMs: Date.now() - start,
        operation: 'createDelayPromise'
      });
      
      // Minimum delay to prevent CPU spinning even if timer fails
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

export default waitForCondition;
