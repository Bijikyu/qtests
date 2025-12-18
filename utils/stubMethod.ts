/**
 * Consolidated Method Stubbing Utilities
 * Provides comprehensive Sinon-based method stubbing and spying capabilities
 * Consolidates functionality from stubMethod.ts and stubMethodModern.ts
 * Eliminates ~75% code duplication while preserving all features
 * 
 * Design philosophy:
 * - Sinon-based implementation for reliable test doubles
 * - Multiple stubbing patterns for different testing needs
 * - Spy functionality for behavior verification
 * - Mock creation for complex object simulation
 * - Timer management for time-dependent tests
 */

import sinon from 'sinon';

// ==================== TYPE DEFINITIONS ====================

export type StubRestoreFunction = () => void;
export type StubFunction = (...args: any[]) => any;

// Export Sinon types for external use
export type SinonSpy = sinon.SinonSpy;
export type SinonStub = sinon.SinonStub;
export type SinonMock = sinon.SinonMock;
export type SinonFakeTimers = sinon.SinonFakeTimers;

// ==================== CORE STUBBING FUNCTIONS ====================

/**
 * Stub a method on an object with a custom implementation
 * 
 * @param obj - Object containing the method to stub
 * @param methodName - Name of the method to stub
 * @param stubFn - Function to replace the original method
 * @returns Restore function to undo the stub
 */
export function stubMethod(obj: any, methodName: string, stubFn: StubFunction): StubRestoreFunction {
  try {
    // Validate inputs
    if (typeof obj !== 'object' || obj === null) {
      throw new Error(`stubMethod expected object but received ${obj}`);
    }
    if (!(methodName in obj)) {
      throw new Error(`stubMethod could not find ${methodName} on provided object`);
    }
    if (typeof stubFn !== 'function') {
      throw new Error('stubMethod stubFn must be a Function');
    }

    // Create and configure the stub
    const stub = sinon.stub(obj, methodName).callsFake(stubFn);
    
    return function restore(): void {
      stub.restore();
    };
  } catch (error: any) {
    console.log(`stubMethod error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a stub method (alias for stubMethod)
 * Provides backward compatibility with stubMethodModern.ts
 * 
 * @param obj - Object containing the method to stub
 * @param methodName - Name of the method to stub
 * @param stubFn - Function to replace the original method
 * @returns Restore function to undo the stub
 */
export const createStubMethod = (obj: any, methodName: string, stubFn: Function): (() => void) => {
  return stubMethod(obj, methodName, stubFn as StubFunction);
};

// ==================== SPYING FUNCTIONS ====================

/**
 * Create a spy on a method to track calls without replacing functionality
 * 
 * @param obj - Object containing the method to spy on
 * @param methodName - Name of the method to spy on
 * @returns Sinon spy instance
 */
export function spyOnMethod(obj: any, methodName: string): sinon.SinonSpy {
  try {
    return sinon.spy(obj, methodName);
  } catch (error: any) {
    console.log(`spyOnMethod error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a spy on a function without modifying the original
 * 
 * @param fn - Function to spy on
 * @returns Sinon spy instance
 */
export function spyOnFunction<T extends (...args: any[]) => any>(fn: T): sinon.SinonSpy {
  try {
    return sinon.spy(fn);
  } catch (error: any) {
    console.log(`spyOnFunction error: ${error.message}`);
    throw error;
  }
}

// ==================== MOCK CREATION ====================

/**
 * Create a mock object from a template
 * 
 * @param template - Partial object to use as template
 * @returns Mock object with Sinon expectations
 */
export function createMock<T extends object>(template: Partial<T> = {}): sinon.SinonMock {
  try {
    return sinon.mock(template);
  } catch (error: any) {
    console.log(`createMock error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a fake object with predefined methods
 * 
 * @param methods - Object with method definitions
 * @returns Fake object with all methods stubbed
 */
export function createFake(methods: Record<string, StubFunction> = {}): any {
  try {
    const fake: any = {};
    
    for (const [methodName, methodFn] of Object.entries(methods)) {
      fake[methodName] = sinon.fake(methodFn);
    }
    
    return fake;
  } catch (error: any) {
    console.log(`createFake error: ${error.message}`);
    throw error;
  }
}

// ==================== TIMER MANAGEMENT ====================

/**
 * Create fake timers for time-dependent tests
 * 
 * @param config - Timer configuration options
 * @returns Sinon fake timers instance
 */
export function createFakeTimers(config?: any): sinon.SinonFakeTimers {
  try {
    return config ? sinon.useFakeTimers(config) : sinon.useFakeTimers();
  } catch (error: any) {
    console.log(`createFakeTimers error: ${error.message}`);
    throw error;
  }
}

/**
 * Create fake clock for precise time control
 * 
 * @param now - Initial time (default: Date.now())
 * @returns Sinon fake clock instance
 */
export function createFakeClock(now?: number): sinon.SinonFakeTimers {
  try {
    return sinon.useFakeTimers({ now, toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
  } catch (error: any) {
    console.log(`createFakeClock error: ${error.message}`);
    throw error;
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get access to the underlying Sinon library
 * 
 * @returns Sinon library instance
 */
export function getSinonLibrary(): typeof sinon {
  return sinon;
}

/**
 * Create a fake server for HTTP testing
 * Note: This feature may not be available in all Sinon versions
 * 
 * @returns Fake server instance
 */
export function createFakeServer(): any {
  try {
    if ('fakeServer' in sinon && typeof (sinon as any).fakeServer.create === 'function') {
      return (sinon as any).fakeServer.create();
    }
    throw new Error('Fake server not available in this Sinon version');
  } catch (error: any) {
    console.log(`createFakeServer error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a fake XMLHttpRequest
 * Note: This feature may not be available in all Sinon versions
 * 
 * @returns Fake XHR instance
 */
export function createFakeXHR(): any {
  try {
    if ('useFakeXMLHttpRequest' in sinon && typeof (sinon as any).useFakeXMLHttpRequest === 'function') {
      return (sinon as any).useFakeXMLHttpRequest();
    }
    throw new Error('Fake XHR not available in this Sinon version');
  } catch (error: any) {
    console.log(`createFakeXHR error: ${error.message}`);
    throw error;
  }
}

// ==================== RESTORE FUNCTIONS ====================

/**
 * Restore all stubs and spies created by Sinon
 * 
 * @param restoreObject - Optional specific object to restore (note: sinon.restore() doesn't accept parameters in most versions)
 */
export function restoreAll(restoreObject?: any): void {
  try {
    if (restoreObject && 'restore' in restoreObject && typeof restoreObject.restore === 'function') {
      restoreObject.restore();
    } else {
      sinon.restore();
    }
  } catch (error: any) {
    console.log(`restoreAll error: ${error.message}`);
  }
}

/**
 * Restore all fake timers
 */
export function restoreTimers(): void {
  const clock = sinon.clock;
  if (clock) {
    clock.restore();
  }
}

// ==================== VERIFICATION HELPERS ====================

/**
 * Verify that a method was called a specific number of times
 * 
 * @param spy - Sinon spy or stub
 * @param count - Expected call count
 * @returns True if called expected number of times
 */
export function verifyCallCount(spy: sinon.SinonSpy | sinon.SinonStub, count: number): boolean {
  return spy.callCount === count;
}

/**
 * Verify that a method was called with specific arguments
 * 
 * @param spy - Sinon spy or stub
 * @param args - Expected arguments
 * @returns True if called with matching arguments
 */
export function verifyCalledWith(spy: sinon.SinonSpy | sinon.SinonStub, ...args: any[]): boolean {
  return spy.calledWith(...args);
}

/**
 * Verify that a method was called once
 * 
 * @param spy - Sinon spy or stub
 * @returns True if called exactly once
 */
export function verifyCalledOnce(spy: sinon.SinonSpy | sinon.SinonStub): boolean {
  return spy.calledOnce;
}

// ==================== EXPORTS ====================

// Export all stubbing utilities
export const stubUtilities = {
  // Core stubbing
  stubMethod,
  createStubMethod,
  
  // Spying
  spyOnMethod,
  spyOnFunction,
  
  // Mock creation
  createMock,
  createFake,
  
  // Timer management
  createFakeTimers,
  createFakeClock,
  
  // Network mocking
  createFakeServer,
  createFakeXHR,
  
  // Utilities
  getSinonLibrary,
  restoreAll,
  restoreTimers,
  
  // Verification
  verifyCallCount,
  verifyCalledWith,
  verifyCalledOnce,
};

// Default export for backward compatibility
export default stubMethod;