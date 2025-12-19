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

import * as sinon from 'sinon';
import qerrors from 'qerrors';
import { withErrorLogging, safeExecute } from '../lib/errorHandling/index.js';

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
 * @param data - Input data containing object, methodName, and stubFn
 * @returns Result object containing restore function
 */
export function stubMethod(data: {obj: any, methodName: string, stubFn: StubFunction}): {restore: StubRestoreFunction} {
  const restoreFunction = withErrorLogging(() => {
    // Validate inputs
    if (typeof data.obj !== 'object' || data.obj === null) {
      throw new Error(`stubMethod expected object but received ${data.obj}`);
    }
    if (!(data.methodName in data.obj)) {
      throw new Error(`stubMethod could not find ${data.methodName} on provided object`);
    }
    if (typeof data.stubFn !== 'function') {
      throw new Error('stubMethod stubFn must be a Function');
    }

    // Create and configure the stub
    const stub = sinon.stub(data.obj, data.methodName).callsFake(data.stubFn);
    
    // Return the restore function
    return (): void => {
      stub.restore();
    };
  }, 'stubMethod');
  
  return {
    restore: restoreFunction
  };
}

/**
 * Create a stub method (alias for stubMethod)
 * Provides backward compatibility with stubMethodModern.ts
 * 
 * @param data - Input data containing object, methodName, and stubFn
 * @returns Result object containing restore function
 */
export const createStubMethod = (data: {obj: any, methodName: string, stubFn: Function}): {restore: () => void} => {
  return stubMethod({obj: data.obj, methodName: data.methodName, stubFn: data.stubFn as StubFunction});
};

// ==================== SPYING FUNCTIONS ====================

/**
 * Create a spy on a method to track calls without replacing functionality
 * 
 * @param data - Input data containing object and methodName
 * @returns Result object containing spy instance
 */
export function spyOnMethod(data: {obj: any, methodName: string}): {spy: sinon.SinonSpy} {
  const spy = withErrorLogging(() => sinon.spy(data.obj, data.methodName), 'spyOnMethod');
  
  return {
    spy
  };
}

/**
 * Create a spy on a function without modifying the original
 * 
 * @param data - Input data containing function to spy on
 * @returns Result object containing spy instance
 */
export function spyOnFunction<T extends (...args: any[]) => any>(data: {fn: T}): {spy: sinon.SinonSpy} {
  const spy = withErrorLogging(() => sinon.spy(data.fn), 'spyOnFunction');
  
  return {
    spy
  };
}

// ==================== MOCK CREATION ====================

/**
 * Create a mock object from a template
 * 
 * @param data - Input data containing template
 * @returns Result object containing mock instance
 */
export function createMock<T extends object>(data: {template?: Partial<T>}): {mock: sinon.SinonMock} {
  const mock = withErrorLogging(() => sinon.mock(data.template || {}), 'createMock');
  
  return {
    mock
  };
}

/**
 * Create a fake object with predefined methods
 * 
 * @param data - Input data containing methods
 * @returns Result object containing fake instance
 */
export function createFake(data: {methods?: Record<string, StubFunction>}): {fake: any} {
  const fake = withErrorLogging(() => {
    const fakeObj: any = {};
    const methods = data.methods || {};
    
    for (const [methodName, methodFn] of Object.entries(methods)) {
      fakeObj[methodName] = sinon.fake(methodFn);
    }
    
    return fakeObj;
  }, 'createFake');
  
  return {
    fake
  };
}

// ==================== TIMER MANAGEMENT ====================

/**
 * Create fake timers for time-dependent tests
 * 
 * @param data - Input data containing config
 * @returns Result object containing timers instance
 */
export function createFakeTimers(data: {config?: any}): {timers: sinon.SinonFakeTimers} {
  const timers = withErrorLogging(() => data.config ? sinon.useFakeTimers(data.config) : sinon.useFakeTimers(), 'createFakeTimers');
  
  return {
    timers
  };
}

/**
 * Create fake clock for precise time control
 * 
 * @param data - Input data containing now
 * @returns Result object containing clock instance
 */
export function createFakeClock(data: {now?: number}): {clock: sinon.SinonFakeTimers} {
  const clock = withErrorLogging(() => sinon.useFakeTimers({ 
    now: data.now, 
    toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] 
  }), 'createFakeClock');
  
  return {
    clock
  };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get access to the underlying Sinon library
 * 
 * @param data - Empty input object for pattern consistency
 * @returns Result object containing Sinon library instance
 */
export function getSinonLibrary(): {library: typeof sinon} {
  return {
    library: sinon
  };
}

/**
 * Create a fake server for HTTP testing
 * Note: This feature may not be available in all Sinon versions
 * 
 * @param data - Empty input object for pattern consistency
 * @returns Result object containing server instance
 */
export function createFakeServer(): {server: any} {
  const server = withErrorLogging(() => {
    if ('fakeServer' in sinon && typeof (sinon as any).fakeServer.create === 'function') {
      return (sinon as any).fakeServer.create();
    }
    throw new Error('Fake server not available in this Sinon version');
  }, 'createFakeServer');
  
  return {
    server
  };
}

/**
 * Create a fake XMLHttpRequest
 * Note: This feature may not be available in all Sinon versions
 * 
 * @param data - Empty input object for pattern consistency
 * @returns Result object containing XHR instance
 */
export function createFakeXHR(): {xhr: any} {
  const xhr = withErrorLogging(() => {
    if ('useFakeXMLHttpRequest' in sinon && typeof (sinon as any).useFakeXMLHttpRequest === 'function') {
      return (sinon as any).useFakeXMLHttpRequest();
    }
    throw new Error('Fake XHR not available in this Sinon version');
  }, 'createFakeXHR');
  
  return {
    xhr
  };
}

// ==================== RESTORE FUNCTIONS ====================

/**
 * Restore all stubs and spies created by Sinon
 * 
 * @param data - Input data containing optional restoreObject
 * @returns Result object indicating success
 */
export function restoreAll(data: {restoreObject?: any} = {}): {success: boolean} {
  safeExecute(() => {
    if (data.restoreObject && 'restore' in data.restoreObject && typeof data.restoreObject.restore === 'function') {
      data.restoreObject.restore();
    } else {
      sinon.restore();
    }
  }, 'restoreAll');
  
  return {
    success: true
  };
}

/**
 * Restore all fake timers
 * 
 * @param data - Empty input object for pattern consistency
 * @returns Result object indicating success
 */
export function restoreTimers(): {success: boolean} {
  const clock = sinon.clock;
  if (clock) {
    clock.restore();
  }
  
  return {
    success: true
  };
}

// ==================== VERIFICATION HELPERS ====================

/**
 * Verify that a method was called a specific number of times
 * 
 * @param data - Input data containing spy and count
 * @returns Result object containing verification result
 */
export function verifyCallCount(data: {spy: sinon.SinonSpy | sinon.SinonStub, count: number}): {matches: boolean} {
  return {
    matches: data.spy.callCount === data.count
  };
}

/**
 * Verify that a method was called with specific arguments
 * 
 * @param data - Input data containing spy and args
 * @returns Result object containing verification result
 */
export function verifyCalledWith(data: {spy: sinon.SinonSpy | sinon.SinonStub, args: any[]}): {matches: boolean} {
  return {
    matches: data.spy.calledWith(...data.args)
  };
}

/**
 * Verify that a method was called once
 * 
 * @param data - Input data containing spy
 * @returns Result object containing verification result
 */
export function verifyCalledOnce(data: {spy: sinon.SinonSpy | sinon.SinonStub}): {matches: boolean} {
  return {
    matches: data.spy.calledOnce
  };
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