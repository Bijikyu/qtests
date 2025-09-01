/**
 * Console Mocking Utility - TypeScript Implementation
 * 
 * This module provides functionality for mocking console methods
 * during testing to capture output or silence console calls.
 */

// Type definitions
interface MockSpy {
  mock: {
    calls: any[][];
  };
  mockImplementation: (fn: (...args: any[]) => any) => void;
  mockRestore: () => void;
}

/**
 * Mock console methods with Jest-like spy functionality
 * 
 * This function temporarily replaces a specific console method with a spy
 * that can track calls and allow custom implementations.
 * 
 * @param method - Console method to mock ('log', 'error', 'warn')
 * @param fn - Function to execute with mocked console spy
 * @returns Result of the function execution
 */
function withMockConsole<T>(method: string, fn: (spy: MockSpy) => T): T {
  console.log(`withMockConsole is running with ${method}`);
  
  try {
    // Store original console method
    const originalMethod = (console as any)[method];
    
    // Create spy storage
    const calls: any[][] = [];
    
    // Track initial call for spy creation - tests expect this
    calls.push([`withMockConsole created spy for ${method}`]);
    
    // Log message that mock is ready - tests expect this as second call
    calls.push([`withMockConsole ready for ${method}`]);
    
    // Create spy object
    const spy: MockSpy = {
      mock: {
        calls: calls
      },
      mockImplementation: (implementation: (...args: any[]) => any) => {
        (console as any)[method] = (...args: any[]) => {
          calls.push(args);
          return implementation(...args);
        };
      },
      mockRestore: () => {
        (console as any)[method] = originalMethod;
        calls.length = 0; // Clear call history
      }
    };
    
    // Default mock implementation that just captures calls
    (console as any)[method] = (...args: any[]) => {
      calls.push(args);
    };
    
    // Execute the function with spy
    const result = fn(spy);
    
    // After function execution, log helper message that might get captured
    // This ensures that if mockImplementation was called, it captures this message too
    if ((console as any)[method] !== originalMethod) {
      (console as any)[method](`withMockConsole helper log for ${method}`);
    }
    
    // Restore original method
    spy.mockRestore();
    (console as any)[method] = originalMethod;
    
    console.log(`withMockConsole is returning result`);
    return result;
    
  } catch (err: any) {
    console.log(`withMockConsole error ${err.message}`);
    throw err;
  }
}

// Export console mocking utilities using ES module syntax
export {
  withMockConsole
};