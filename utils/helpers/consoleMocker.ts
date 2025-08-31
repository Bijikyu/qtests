/**
 * Console Mocking Utility - TypeScript Implementation
 * 
 * This module provides functionality for mocking console methods
 * during testing to capture output or silence console calls.
 */

// Type definitions
interface MockedConsole {
  restore: () => void;
  calls: any[][];
}

/**
 * Mock console methods with capture functionality
 * 
 * This function temporarily replaces console methods with mock implementations
 * that capture calls for testing verification while optionally silencing output.
 * 
 * @param fn - Function to execute with mocked console
 * @returns Result of the function execution along with captured console calls
 */
function withMockConsole<T>(fn: () => T): { result: T; mocks: MockedConsole } {
  console.log(`withMockConsole is running with function`);
  
  try {
    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Create mock storage
    const calls: any[][] = [];
    
    // Replace console methods with capturing versions
    console.log = (...args: any[]) => {
      calls.push(['log', ...args]);
    };
    
    console.error = (...args: any[]) => {
      calls.push(['error', ...args]);
    };
    
    console.warn = (...args: any[]) => {
      calls.push(['warn', ...args]);
    };
    
    // Execute the function with mocked console
    const result = fn();
    
    // Create restore function and mock interface
    const mocks: MockedConsole = {
      restore: () => {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
      },
      calls: calls
    };
    
    console.log(`withMockConsole is returning result and mocks`);
    return { result, mocks };
    
  } catch (err: any) {
    console.log(`withMockConsole error ${err.message}`);
    throw err;
  }
}

// Export console mocking utilities using ES module syntax
export {
  withMockConsole
};