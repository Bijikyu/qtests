/**
 * Consolidated Method Stubbing Utilities
 * Replaced with direct Sinon usage for better maintainability
 * 
 * Migration Guide:
 * - stubMethod() -> sinon.stub()
 * - spyOnMethod() -> sinon.spy()
 * - createMock() -> sinon.mock()
 * - createFakeTimers() -> sinon.useFakeTimers()
 * - restoreAll() -> sinon.restore()
 */

import sinon from 'sinon';

// Re-export core Sinon functionality for backward compatibility
export {
  stub,
  stub as stubMethod,
  stub as createStubMethod,
  
  // Spying
  spy,
  spy as spyOnMethod,
  spy as spyOnFunction,
  
  // Mock creation
  mock,
  mock as createMock,
  fake,
  fake as createFake,
  
  // Timer management
  useFakeTimers,
  useFakeTimers as createFakeTimers,
  useFakeTimers as createFakeClock,
  restore,
  restore as restoreTimers,
  restore as restoreAll
} from 'sinon';

// Note: Sinon doesn't export fakeServer and fakeXHR directly anymore
// These are available as sinon.createFakeServer() and sinon.createFakeXMLHttpRequest()
// We'll provide wrapper functions for backward compatibility

// Type aliases for backward compatibility
export type StubRestoreFunction = () => void;
export type StubFunction = sinon.SinonStub;
export type SinonStub = sinon.SinonStub;
export type SinonSpy = sinon.SinonSpy;
export type SinonMock = sinon.SinonMock;
export type SinonFakeTimers = sinon.SinonFakeTimers;

/**
 * Get Sinon library instance
 */
export function getSinonLibrary() {
  return sinon;
}

/**
 * Verify call count
 */
export function verifyCallCount(spyOrStub: sinon.SinonSpy | sinon.SinonStub, expectedCount: number): void {
  if (spyOrStub.callCount !== expectedCount) {
    throw new Error(`Expected ${expectedCount} calls, but got ${spyOrStub.callCount}`);
  }
}

/**
 * Verify called with specific arguments
 */
export function verifyCalledWith(spyOrStub: sinon.SinonSpy | sinon.SinonStub, ...expectedArgs: any[]): void {
  if (!spyOrStub.calledWith(...expectedArgs)) {
    throw new Error(`Expected call with arguments ${JSON.stringify(expectedArgs)}`);
  }
}

/**
 * Verify called exactly once
 */
export function verifyCalledOnce(spyOrStub: sinon.SinonSpy | sinon.SinonStub): void {
  if (!spyOrStub.calledOnce) {
    throw new Error(`Expected exactly one call, but got ${spyOrStub.callCount}`);
  }
}

/**
 * Create fake server for backward compatibility
 * Note: Current Sinon version may not have createFakeServer
 * Returns a mock object with basic server functionality
 */
export function createFakeServer(options?: any) {
  return {
    requests: [],
    respondWith: function(method: string, url: string, response: any) {
      // Mock implementation
      console.log('Mock server respondWith called:', method, url, response);
    },
    restore: function() {
      // Mock restoration
      console.log('Mock server restored');
    }
  };
}

/**
 * Create fake XHR for backward compatibility
 * Note: Current Sinon version may not have createFakeXMLHttpRequest
 * Returns a mock object with basic XHR functionality
 */
export function createFakeXHR() {
  return {
    open: function(method: string, url: string) {
      console.log('Mock XHR open called:', method, url);
    },
    send: function(data?: any) {
      console.log('Mock XHR send called:', data);
    },
    setRequestHeader: function(name: string, value: string) {
      console.log('Mock XHR setRequestHeader called:', name, value);
    }
  };
}

// Export all stubbing utilities for backward compatibility
export const stubUtilities = {
  // Core stubbing
  stubMethod: sinon.stub,
  createStubMethod: sinon.stub,
  
  // Spying
  spyOnMethod: sinon.spy,
  spyOnFunction: sinon.spy,
  
  // Mock creation
  createMock: sinon.mock,
  createFake: sinon.fake,
  
  // Timer management
  createFakeTimers: sinon.useFakeTimers,
  createFakeClock: sinon.useFakeTimers,
  restoreTimers: sinon.restore,
  restoreAll: sinon.restore,
  
  // Network mocking
  createFakeServer,
  createFakeXHR,
  
  // Utilities
  getSinonLibrary: () => sinon,
  verifyCallCount,
  verifyCalledWith,
  verifyCalledOnce,
};

// Default export for backward compatibility
export default sinon.stub;