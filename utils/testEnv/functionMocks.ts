/**
 * Function Mock Creation Utilities
 * 
 * This module provides utilities for creating mock functions with
 * specific behaviors for testing. These mocks are designed to replace
 * real implementations while maintaining Jest-compatible spy functionality.
 * 
 * Mock types provided:
 * - Schedule mock: For timing/scheduling function replacement
 * - Qerrors mock: For error logging function replacement
 * 
 * Design principles:
 * - Immediate resolution to prevent test delays
 * - Spy integration for call tracking
 * - Error handling with detailed logging
 * - Jest compatibility for test frameworks
 * 
 * Usage patterns:
 * - Dependency injection in test setup
 * - Function stubbing for isolated testing
 * - Call verification and assertion in tests
 */

import { makeLoggedMock } from './spyAttacher.js';

/**
 * Interface for objects that can have spy methods attached
 * Ensures type compatibility with spy attachment utilities
 */
interface MockSpy {
  /** Clears all recorded calls and reset mock state */
  mockClear?: () => void;
  /** Resets mock implementation to default behavior */
  mockReset?: () => void;
}

/**
 * Create a scheduling function mock
 * 
 * This function creates a mock that replaces scheduling-related
 * functions (like setTimeout, setInterval, etc.) with immediate
 * resolution to prevent test delays and timing flakiness.
 * 
 * Mock behavior:
 * - Immediately resolves input function call
 * - Wraps result in Promise for async compatibility
 * - Includes spy methods for call verification
 * 
 * Use cases:
 * - Testing asynchronous operations without delays
 * - Preventing time-based test flakiness
 * - Controlling timing behavior in tests
 * - Verifying scheduling function calls
 * 
 * @returns Mock function with spy capabilities
 * 
 * @example
 * const mockSchedule = createScheduleMock();
 * const result = await mockSchedule(() => 'test');
 * expect(mockSchedule).toHaveBeenCalled();
 */
export function createScheduleMock(): Function & MockSpy {
  console.log(`createScheduleMock is running with none`);
  
  try {
    // Create mock that immediately resolves any function
    const scheduleMock = function(fn: Function): Promise<any> {
      // Execute function immediately and wrap in Promise
      return Promise.resolve(fn());
    } as Function & MockSpy;
    
    // Attach spy methods for test verification
    return makeLoggedMock('createScheduleMock', () => scheduleMock);
    
  } catch (error: any) {
    console.log(`createScheduleMock error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a qerrors function mock
 * 
 * This function creates a mock that replaces the qerrors
 * error logging function with a no-op implementation that simply
 * returns the provided arguments. This prevents actual error logging
 * during tests while maintaining function call compatibility.
 * 
 * Mock behavior:
 * - Accepts any number of arguments
 * - Returns arguments array for inspection
 * - No actual logging or error throwing
 * - Includes spy methods for call verification
 * 
 * Use cases:
 * - Preventing error logging during test execution
 * - Verifying error logging calls in tests
 * - Mocking error handling without side effects
 * - Testing error flow without actual log output
 * 
 * @returns Mock function with spy capabilities
 * 
 * @example
 * const mockQerrors = createQerrorsMock();
 * const result = mockQerrors('error message', { context: 'test' });
 * expect(result).toEqual(['error message', { context: 'test' }]);
 * expect(mockQerrors).toHaveBeenCalled();
 */
export function createQerrorsMock(): Function & MockSpy {
  console.log(`createQerrorsMock is running with none`);
  
  try {
    // Create mock that captures arguments without logging
    const qerrorsMock = function(...args: any[]): any[] {
      // Return all arguments for test inspection
      return args;
    } as Function & MockSpy;
    
    // Attach spy methods for test verification
    return makeLoggedMock('createQerrorsMock', () => qerrorsMock);
    
  } catch (error: any) {
    console.log(`createQerrorsMock error: ${error.message}`);
    throw error;
  }
}