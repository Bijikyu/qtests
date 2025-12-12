// Sinon.js-based Method Stubbing Utility
// 
// This module replaces the custom stubMethod implementation with industry-standard Sinon.js
// Provides superior mocking capabilities with comprehensive assertion support
// 
// Migration Benefits:
// - Industry-standard implementation (9.8k stars, battle-tested)
// - Rich assertion capabilities through sinon-chai
// - Fake timers, spies, mocks in one library
// - Better error handling and debugging
// - No maintenance burden

import sinon from 'sinon';

// Type definitions for backward compatibility
export type StubRestoreFunction = () => void;
export type StubFunction = (...args: any[]) => any;

/**
 * Stub a method on an object using Sinon.js
 * 
 * @param obj - Object containing the method to stub
 * @param methodName - Name of the method to stub
 * @param stubFn - Function to replace the original method with
 * @returns Restoration function
 */
function stubMethod(obj: any, methodName: string, stubFn: StubFunction): StubRestoreFunction {
  try {
    // Input validation - same as original implementation
    if (typeof obj !== 'object' || obj === null) {
      throw new Error(`stubMethod expected object but received ${obj}`);
    }
    if (!(methodName in obj)) {
      throw new Error(`stubMethod could not find ${methodName} on provided object`);
    }
    if (typeof stubFn !== 'function') {
      throw new Error('stubMethod stubFn must be a Function');
    }

    // Use Sinon for superior stubbing capabilities
    const stub = sinon.stub(obj, methodName).callsFake(stubFn);
    
    // Return restoration function for backward compatibility
    return function restore(): void {
      stub.restore();
    };
  } catch (error: any) {
    console.log(`stubMethod error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a spy on a method without replacing it
 * New capability provided by Sinon.js
 * 
 * @param obj - Object containing the method to spy on
 * @param methodName - Name of the method to spy on
 * @returns Sinon spy object
 */
function spyOnMethod(obj: any, methodName: string): sinon.SinonSpy {
  try {
    return sinon.spy(obj, methodName);
  } catch (error: any) {
    console.log(`spyOnMethod error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a complete mock object with Sinon.js
 * New capability for comprehensive object mocking
 * 
 * @param template - Template object structure to mock
 * @returns Mocked object with Sinon spies/stubs
 */
function createMock<T extends object>(template: Partial<T> = {}): T {
  try {
    return sinon.mock(template) as any;
  } catch (error: any) {
    console.log(`createMock error: ${error.message}`);
    throw error;
  }
}

/**
 * Create fake timers for time-based testing
 * New capability provided by Sinon.js
 * 
 * @returns Sinon fake timers object
 */
function createFakeTimers(): sinon.SinonFakeTimers {
  try {
    return sinon.useFakeTimers();
  } catch (error: any) {
    console.log(`createFakeTimers error: ${error.message}`);
    throw error;
  }
}

/**
 * Get access to the underlying Sinon library for advanced use cases
 * Allows migration to full Sinon API when needed
 */
function getSinonLibrary(): typeof sinon {
  return sinon;
}

// Export both the stub method and additional Sinon utilities
// This provides migration path to full Sinon usage while maintaining backward compatibility
export {
  stubMethod,
  spyOnMethod,
  createMock,
  createFakeTimers,
  getSinonLibrary
};

// Default export for backward compatibility
export default stubMethod;

// Re-export commonly used Sinon types for convenience
export type SinonSpy = sinon.SinonSpy;
export type SinonStub = sinon.SinonStub;
export type SinonMock = sinon.SinonMock;