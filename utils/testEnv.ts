/**
 * Test Environment Utilities - Consolidated Test Environment Management
 * 
 * This module provides a unified interface for test environment setup and management.
 * It re-exports functionality from focused test environment modules to provide:
 * - Environment variable manipulation for test isolation
 * - Mock factory utilities for common testing scenarios
 * - Test initialization helpers for consistent test setup
 * - Mock spy attachment for behavior verification
 * 
 * Design Philosophy:
 * - Modular: Each utility is in its own focused module
 * - Type-safe: Full TypeScript support with proper interfaces
 * - Test-friendly: Designed specifically for test environment scenarios
 * - Backward Compatible: Maintains existing API while improving organization
 */

// Re-export from focused modules for backward compatibility
export {
  defaultEnv,        // Default test environment configuration
  setTestEnv,        // Set test environment variables
  saveEnv,           // Save current environment state
  restoreEnv         // Restore saved environment state
} from './testEnv/envManager.js';

export {
  attachMockSpies,    // Attach spies to existing objects for verification
  makeLoggedMock,     // Create mocks with logging capabilities
  createScheduleMock,  // Create schedule/timer mocks for async testing
  createQerrorsMock,   // Create qerrors utility mocks
  createAxiosMock,     // Create axios HTTP client mocks
  resetMocks          // Reset all mocks to clean state
} from './testEnv/mockFactory.js';

export {
  initSearchTest     // Initialize search-specific test environments
} from './testEnv/testInitializer.js';