/**
 * Consolidated Console Mocking Utilities
 * Provides comprehensive console mocking capabilities for testing
 * Consolidates functionality from mockConsole.ts and consoleMocker.ts
 * Eliminates ~80% code duplication while preserving all features
 * 
 * Design philosophy:
 * - Multiple mocking strategies for different testing frameworks
 * - Jest-compatible API for seamless integration
 * - Fallback implementation for non-Jest environments
 * - Call tracking and restoration utilities
 * - TypeScript-safe with proper type preservation
 */

import { withErrorLogging } from '../lib/errorHandling/index.js';
import { logStart } from '../lib/logUtils.js';

// Re-export from focused modules for backward compatibility
export {
  ConsoleMethod,
  JestSpy,
  ConsoleMockOptions,
  tryCreateJestSpy,
  mockConsoleWithJest
} from './console/jestMocker.js';

export {
  FallbackMock,
  createFallbackMock,
  mockConsoleWithFallback
} from './console/fallbackMocker.js';

export {
  MockSpy,
  withMockConsole,
  mockAllConsole,
  withAllMockedConsole,
  isMocked,
  restoreMock,
  restoreAllMocks
} from './console/consoleUtils.js';

// Import for internal use
import { tryCreateJestSpy } from './console/jestMocker.js';
import { createFallbackMock } from './console/fallbackMocker.js';
import { 
  withMockConsole,
  mockAllConsole,
  withAllMockedConsole,
  isMocked,
  restoreMock,
  restoreAllMocks
} from './console/consoleUtils.js';
import type { ConsoleMethod, ConsoleMockOptions, JestSpy } from './console/jestMocker.js';
import type { FallbackMock } from './console/fallbackMocker.js';

/**
 * Mock a console method with automatic detection of testing framework
 * 
 * @param method - Console method to mock
 * @param options - Mock configuration options
 * @returns Mock spy with Jest-compatible interface
 */
export function mockConsole(
  method: ConsoleMethod, 
  options: ConsoleMockOptions = {}
): JestSpy | FallbackMock {
  logStart('mockConsole', method);

  return withErrorLogging(() => {
    const {
      captureCalls = true,
      silent = true,
      implementation,
      preferJest = true
    } = options;

    // Try Jest first if preferred and available
    if (preferJest) {
      const jestSpy = tryCreateJestSpy(method, silent, implementation);
      if (jestSpy) {
        console.log(`mockConsole is returning Jest spy`);
        return jestSpy;
      }
    }

    // Fall back to custom implementation
    console.log(`mockConsole is using fallback implementation`);
    return createFallbackMock(method, captureCalls, silent, implementation);
  }, 'mockConsole');
}

// Export all console mocking utilities
export const consoleMocking = {
  // Core functions
  mockConsole,
  withMockConsole,
  mockAllConsole,
  withAllMockedConsole,
  
  // Utility functions
  isMocked,
  restoreMock,
  restoreAllMocks,
};

// Default export for backward compatibility
export default mockConsole;