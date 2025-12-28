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

// Re-export from focused modules for backward compatibility
export {
  stubMethod,
  createStubMethod,
  type StubRestoreFunction,
  type StubFunction,
  type SinonSpy,
  type SinonStub,
  type SinonMock
} from './stubbing/coreStubbing.js';

export {
  spyOnMethod,
  spyOnFunction
} from './stubbing/spying.js';

export {
  createMock,
  createFake
} from './stubbing/basicMockCreation.js';

export {
  createFakeServer,
  createFakeXHR
} from './stubbing/networkMocking.js';

export {
  createFakeTimers,
  createFakeClock,
  restoreTimers,
  type SinonFakeTimers
} from './stubbing/timerManagement.js';

export {
  getSinonLibrary,
  restoreAll
} from './stubbing/utilities.js';

export {
  verifyCallCount,
  verifyCalledWith,
  verifyCalledOnce
} from './stubbing/verification.js';

// Import for internal use
import {
  stubMethod,
  createStubMethod
} from './stubbing/coreStubbing.js';

import {
  spyOnMethod as _spyOnMethod,
  spyOnFunction as _spyOnFunction
} from './stubbing/spying.js';

import {
  createMock as _createMock,
  createFake as _createFake
} from './stubbing/basicMockCreation.js';

import {
  createFakeServer as _createFakeServer,
  createFakeXHR as _createFakeXHR
} from './stubbing/networkMocking.js';

import {
  createFakeTimers as _createFakeTimers,
  createFakeClock as _createFakeClock,
  restoreTimers as _restoreTimers
} from './stubbing/timerManagement.js';

import {
  getSinonLibrary as _getSinonLibrary,
  restoreAll as _restoreAll
} from './stubbing/utilities.js';

import {
  verifyCallCount as _verifyCallCount,
  verifyCalledWith as _verifyCalledWith,
  verifyCalledOnce as _verifyCalledOnce
} from './stubbing/verification.js';

// Export all stubbing utilities
export const stubUtilities = {
  // Core stubbing
  stubMethod,
  createStubMethod,
  
  // Spying
  spyOnMethod: _spyOnMethod,
  spyOnFunction: _spyOnFunction,
  
  // Mock creation
  createMock: _createMock,
  createFake: _createFake,
  
  // Timer management
  createFakeTimers: _createFakeTimers,
  createFakeClock: _createFakeClock,
  
  // Network mocking
  createFakeServer: _createFakeServer,
  createFakeXHR: _createFakeXHR,
  
  // Utilities
  getSinonLibrary: _getSinonLibrary,
  restoreAll: _restoreAll,
  restoreTimers: _restoreTimers,
  
  // Verification
  verifyCallCount: _verifyCallCount,
  verifyCalledWith: _verifyCalledWith,
  verifyCalledOnce: _verifyCalledOnce,
};

// Default export for backward compatibility
export default stubMethod;