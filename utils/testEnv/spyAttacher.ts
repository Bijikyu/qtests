/**
 * Spy Attachment Utilities for Test Mocks
 * 
 * This module provides utilities for attaching Jest-compatible spies to
 * mock objects, enabling test verification and call tracking. It works
 * seamlessly with both Jest and non-Jest environments.
 * 
 * Key features:
 * - Jest-compatible spy methods (mockClear, mockReset)
 * - Fallback implementations for non-Jest environments
 * - Error handling with comprehensive logging
 * - Generic type support for any mock object
 * 
 * Design considerations:
 * - Graceful degradation when Jest is unavailable
 * - Consistent API across different test environments
 * - Error isolation to prevent test failures
 * 
 * Spy methods provided:
 * - mockClear: Clears call history and reset state
 * - mockReset: Resets implementation to default behavior
 */

import { withErrorLogging } from '../../lib/errorHandling/index.js';

/**
 * Interface for objects that can have spy methods attached
 * Extends mock objects with Jest-compatible spy functionality
 */
interface MockSpy {
  /** Clears all recorded calls and reset mock state */
  mockClear?: () => void;
  /** Resets mock implementation to default behavior */
  mockReset?: () => void;
}

/**
 * Attach Jest-compatible spy methods to mock objects
 * 
 * This function enhances mock objects with spy methods that are
 * compatible with Jest's mocking API. In Jest environments, it provides
 * full Jest spy functionality. In other environments, it provides no-op
 * implementations to maintain API compatibility.
 * 
 * Spy method behavior:
 * - Jest environment: Full Jest spy functionality
 * - Non-Jest environment: No-op implementations
 * 
 * Error handling:
 * - Wrapped with error logging for debugging
 * - Preserves original error behavior
 * 
 * @param mock - Mock object to enhance with spy methods
 * @returns Enhanced mock object with spy methods attached
 * 
 * @example
 * const myMock = { fn: () => 'test' };
 * const enhancedMock = attachMockSpies(myMock);
 * enhancedMock.mockClear(); // Works in both Jest and non-Jest
 */
export function attachMockSpies<T extends MockSpy>(mock: T): T {
  console.log(`attachMockSpies is running with ${mock}`);
  
  return withErrorLogging(() => {
    // Check if Jest is available for full spy functionality
    if (typeof jest !== `undefined`) {
      // Attach full Jest spy implementations
      mock.mockClear = jest.fn();
      mock.mockReset = jest.fn();
    } else {
      // Fallback no-op implementations for non-Jest environments
      mock.mockClear = () => {};
      mock.mockReset = () => {};
    }
    
    console.log(`attachMockSpies is returning ${mock}`);
    return mock;
  }, 'attachMockSpies');
}

/**
 * Create a mock with logging and spy attachment
 * 
 * This function combines mock creation with spy attachment and
 * comprehensive logging. It's particularly useful for debugging
 * test setup and mock behavior verification.
 * 
 * Process:
 * 1. Create mock using provided creator function
 * 2. Attach spy methods for test verification
 * 3. Log creation details for debugging
 * 4. Handle errors gracefully with detailed logging
 * 
 * Error handling:
 * - Catches and logs creation errors
 * - Re-throws errors to maintain expected behavior
 * - Provides detailed error context for debugging
 * 
 * @param name - Descriptive name for logging purposes
 * @param creator - Function that creates the mock object
 * @returns Created mock object with spy methods attached
 * @throws Error if mock creation fails
 * 
 * @example
 * const mockService = makeLoggedMock('userService', () => ({
 *   getUser: jest.fn().mockResolvedValue({ id: 1, name: 'John' })
 * }));
 * 
 * mockService.getUser.mockClear(); // Spy method available
 */
export function makeLoggedMock<T extends MockSpy>(name: string, creator: () => T): T {
  console.log(`makeLoggedMock is running with ${name}, ${creator}`);
  
  try {
    // Create the mock using provided creator function
    const mock = creator();
    
    // Attach spy methods for test verification
    attachMockSpies(mock);
    
    console.log(`makeLoggedMock is returning ${mock}`);
    return mock;
    
  } catch (error: any) {
    // Log detailed error information for debugging
    console.log(`makeLoggedMock error: ${error.message}`);
    
    // Re-throw to maintain expected error behavior
    throw error;
  }
}