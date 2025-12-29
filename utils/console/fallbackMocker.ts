/**
 * Fallback Console Mocking Operations
 * 
 * This module provides console mocking capabilities for non-Jest
 * testing environments using custom implementations.
 */

import { withErrorLogging } from '../../lib/errorHandling/index.js';
import { logStart } from '../../lib/logUtils.js';
import { ConsoleMethod, ConsoleMockOptions } from './jestMocker.js';

/**
 * Fallback mock interface for non-Jest environments
 */
export interface FallbackMock<TArgs extends any[] = any[]> {
  mock: { calls: TArgs[] | null };
  mockRestore: () => void;
}

/**
 * Create a fallback mock for non-Jest environments
 * 
 * @param method - Console method to mock
 * @param captureCalls - Whether to capture calls
 * @param silent - Whether to silence the method
 * @param implementation - Custom implementation
 * @returns Fallback mock
 */
export function createFallbackMock(
  method: ConsoleMethod,
  captureCalls: boolean,
  silent: boolean,
  implementation?: (...args: any[]) => any
): FallbackMock {
  const originalMethod = (console as any)[method];
  const calls: any[] | null = captureCalls ? [] : null;

  // Define the mocked method
  const mockedMethod = function (...args: any[]) {
    if (captureCalls && calls) {
      calls.push(args);
    }
    
    if (implementation) {
      return implementation(...args);
    }
    
    if (!silent && originalMethod) {
      return originalMethod.apply(console, args);
    }
  };

  // Replace the method
  (console as any)[method] = mockedMethod;

  // Create restore function
  const mockObject: FallbackMock = {
    mock: { calls },
    mockRestore: function () {
      (console as any)[method] = originalMethod;
      if (calls) calls.length = 0;
      this.mock.calls = null;
    }
  };

  console.log(`mockConsole is returning fallback mock for ${method}`);
  return mockObject;
}

/**
 * Mock a console method using fallback implementation
 * 
 * @param method - Console method to mock
 * @param options - Mock configuration options
 * @returns Fallback mock
 */
export function mockConsoleWithFallback(
  method: ConsoleMethod, 
  options: ConsoleMockOptions = {}
): FallbackMock {
  logStart('mockConsoleWithFallback', method);

  return withErrorLogging(() => {
    const {
      captureCalls = true,
      silent = true,
      implementation
    } = options;

    return createFallbackMock(method, captureCalls, silent, implementation);
  }, 'mockConsoleWithFallback');
}