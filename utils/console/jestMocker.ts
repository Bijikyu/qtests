/**
 * Jest Console Mocking Operations
 * 
 * This module provides Jest-specific console mocking capabilities
 * for testing environments where Jest is available.
 */

import { withErrorLogging, safeExecute } from '../../lib/errorHandling/index.js';
import { logStart } from '../../lib/logUtils.js';

/**
 * Console method names that can be mocked
 */
export type ConsoleMethod = 'log' | 'error' | 'warn' | 'info' | 'debug';

/**
 * Jest-compatible spy interface
 */
export interface JestSpy<TArgs extends any[] = any[]> {
  mock: { calls: TArgs[] };
  mockRestore: () => void;
  mockImplementation: (fn: (...args: any[]) => any) => JestSpy;
  mockClear: () => void;
  mockReset: () => void;
}

/**
 * Console mock configuration options
 */
export interface ConsoleMockOptions {
  /** Whether to capture calls or just silence */
  captureCalls?: boolean;
  
  /** Whether to silence the original method */
  silent?: boolean;
  
  /** Custom implementation for the mocked method */
  implementation?: (...args: any[]) => any;
  
  /** Whether to use Jest if available */
  preferJest?: boolean;
}

/**
 * Create a Jest-compatible spy if Jest is available
 * 
 * @param method - Console method to mock
 * @param silent - Whether to silence the method
 * @param implementation - Custom implementation
 * @returns Jest spy or null if Jest unavailable
 */
export function tryCreateJestSpy(
  method: ConsoleMethod,
  silent: boolean,
  implementation?: (...args: any[]) => any
): JestSpy | null {
  return safeExecute(() => {
    const globalAny = globalThis as any;
    const jest = globalAny.jest;
    
    if (!jest || typeof jest.spyOn !== 'function') {
      return null;
    }

    // Create Jest spy
    const jestSpy = jest.spyOn(console, method);
    
    // Set mock implementation
    if (implementation) {
      jestSpy.mockImplementation(implementation);
    } else if (silent) {
      jestSpy.mockImplementation(() => {});
    }

    console.log(`mockConsole is returning Jest spy for ${method}`);
    return jestSpy as JestSpy;
  }, 'tryCreateJestSpy');
}

/**
 * Mock a console method using Jest if available
 * 
 * @param method - Console method to mock
 * @param options - Mock configuration options
 * @returns Jest spy or null if Jest unavailable
 */
export function mockConsoleWithJest(
  method: ConsoleMethod, 
  options: ConsoleMockOptions = {}
): JestSpy | null {
  logStart('mockConsoleWithJest', method);

  return withErrorLogging(() => {
    const {
      silent = true,
      implementation
    } = options;

    return tryCreateJestSpy(method, silent, implementation);
  }, 'mockConsoleWithJest');
}