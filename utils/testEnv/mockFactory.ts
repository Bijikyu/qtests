/**
 * Test Environment Mock Factory
 * 
 * This module serves as a centralized export point for all mock creation
 * utilities used in test environments. It provides a unified interface
 * for creating spies, function mocks, and HTTP client mocks.
 * 
 * Design philosophy:
 * - Centralized access to all mock creation utilities
 * - Backward compatibility with existing test patterns
 * - Clear separation of concerns between different mock types
 * - Consistent API across all mock creation functions
 * 
 * Export organization:
 * - Spy utilities: For attaching spies to existing objects
 * - Function mocks: For creating mock functions with logging
 * - HTTP mocks: For creating network request mocks
 * 
 * Usage patterns:
 * - Import specific utilities: import { createAxiosMock } from 'qtests/utils/testEnv/mockFactory'
 * - Import all utilities: import * as mockFactory from 'qtests/utils/testEnv/mockFactory'
 */

// =============================================================================
// SPY UTILITIES - Attaching spies to existing objects
// =============================================================================

/**
 * Spy attachment utilities for existing objects
 * These functions attach spies to object methods while preserving
 * original functionality and providing call tracking.
 */
export {
  attachMockSpies,    // Attach multiple spies to an object
  makeLoggedMock      // Create mock with automatic logging
} from './spyAttacher.js';

// =============================================================================
// FUNCTION MOCKS - Creating mock functions
// =============================================================================

/**
 * Function mocking utilities for standalone mock creation
 * These functions create independent mock functions with configurable
 * behavior and return values.
 */
export {
  createScheduleMock,   // Create scheduling-related function mocks
  createQerrorsMock      // Create error logging function mocks
} from './functionMocks.js';

// =============================================================================
// HTTP MOCKS - Network request mocking
// =============================================================================

/**
 * HTTP client mocking utilities for network isolation
 * These functions create mocks for HTTP clients and related
 * networking functionality to prevent actual network calls.
 */
export {
  createAxiosMock,    // Create axios HTTP client mocks
  resetMocks           // Reset all created mocks to clean state
} from './axiosMocks.js';