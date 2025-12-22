/**
 * Mock Creation Functions
 * 
 * This module provides mock and fake object creation capabilities
 * for complex object simulation in tests.
 */

// Re-export from focused modules
export {
  createMock,
  createFake
} from './basicMockCreation.js';

export {
  createFakeServer,
  createFakeXHR
} from './networkMocking.js';