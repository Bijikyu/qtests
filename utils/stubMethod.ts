/** Consolidated Method Stubbing Utilities */
import sinon from 'sinon';
import { withErrorLogging } from '../lib/errorHandling/index.js';

// Re-export Sinon functionality
export { 
  stub, 
  stub as createStubMethod, 
  spy, 
  spy as spyOnMethod, 
  spy as spyOnFunction, 
  mock, 
  mock as createMock, 
  fake, 
  fake as createFake, 
  useFakeTimers, 
  useFakeTimers as createFakeTimers, 
  useFakeTimers as createFakeClock, 
  restore, 
  restore as restoreTimers, 
  restore as restoreAll 
} from 'sinon';

// Type definitions
export type StubRestoreFunction = () => void;
export type StubFunction = (...args: any[]) => any;
export type SinonStub = sinon.SinonStub;
export type SinonSpy = sinon.SinonSpy;
export type SinonMock = sinon.SinonMock;
export type SinonFakeTimers = sinon.SinonFakeTimers;

/**
 * Get the Sinon library instance
 */
export const getSinonLibrary = () => sinon;

/**
 * Verification utilities
 */
export const verifyCallCount = (spyOrStub: sinon.SinonSpy | sinon.SinonStub, expectedCount: number) => {
  if (spyOrStub.callCount !== expectedCount) {
    throw new Error(`Expected ${expectedCount} calls, but got ${spyOrStub.callCount}`);
  }
};

export const verifyCalledWith = (spyOrStub: sinon.SinonSpy | sinon.SinonStub, ...expectedArgs: any[]) => {
  if (!spyOrStub.calledWith(...expectedArgs)) {
    throw new Error(`Expected call with arguments ${JSON.stringify(expectedArgs)}`);
  }
};

export const verifyCalledOnce = (spyOrStub: sinon.SinonSpy | sinon.SinonStub) => {
  if (!spyOrStub.calledOnce) {
    throw new Error(`Expected exactly one call, but got ${spyOrStub.callCount}`);
  }
};

/**
 * Mock server utilities (legacy compatibility)
 */
export const createFakeServer = (options?: any) => ({
  requests: [],
  respondWith: function(method: string, url: string, response: any) {
    console.log('Mock server respondWith called:', method, url, response);
  },
  restore: function() {
    console.log('Mock server restored');
  }
});

export const createFakeXHR = () => ({
  open: function(method: string, url: string) {
    console.log('Mock XHR open called:', method, url);
  },
  send: function(data?: any) {
    console.log('Mock XHR send called:', data);
  },
  setRequestHeader: function(name: string, value: string) {
    console.log('Mock XHR setRequestHeader called:', name, value);
  }
});

/**
 * Enhanced stub creation with validation
 */
export const stubMethod = (data: { obj: any, methodName: string, stubFn: StubFunction }): { restore: StubRestoreFunction } => {
  const restoreFunction = withErrorLogging(() => {
    // Validation
    if (typeof data.obj !== 'object' || data.obj === null) {
      throw new Error(`stubMethod expected object but received ${data.obj}`);
    }
    if (typeof data.methodName !== 'string' || !data.methodName?.trim()) {
      throw new Error(`stubMethod methodName must be a non-empty string, received ${data.methodName}`);
    }
    if (!(data.methodName in data.obj)) {
      throw new Error(`stubMethod could not find ${data.methodName} on provided object`);
    }
    if (typeof data.obj[data.methodName] !== 'function') {
      throw new Error(`stubMethod ${data.methodName} exists but is not a function on provided object`);
    }
    if (typeof data.stubFn !== 'function') {
      throw new Error('stubMethod stubFn must be a Function');
    }

    let stub;
    try {
      stub = sinon.stub(data.obj, data.methodName).callsFake(data.stubFn);
    } catch (sinonError) {
      throw new Error(`stubMethod failed to create Sinon stub for ${data.methodName}: ${(sinonError as Error).message}`);
    }
    
    return (): void => {
      try {
        stub && typeof stub.restore === 'function' && stub.restore();
      } catch (restoreError) {
        console.warn(`stubMethod: Failed to restore stub for ${data.methodName}:`, restoreError);
      }
    };
  }, 'stubMethod');
  
  return { restore: restoreFunction };
};

/**
 * Utility collection
 */
export const stubUtilities = {
  // Enhanced stub method with validation
  enhancedStubMethod: stubMethod,
  // Direct Sinon exports
  stubMethod: sinon.stub,
  createStubMethod: sinon.stub,
  spyOnMethod: sinon.spy,
  spyOnFunction: sinon.spy,
  createMock: sinon.mock,
  createFake: sinon.fake,
  createFakeTimers: sinon.useFakeTimers,
  createFakeClock: sinon.useFakeTimers,
  restoreTimers: sinon.restore,
  restoreAll: sinon.restore,
  createFakeServer,
  createFakeXHR,
  getSinonLibrary: () => sinon,
  verifyCallCount,
  verifyCalledWith,
  verifyCalledOnce
};

export default sinon.stub;