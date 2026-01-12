/**
 * Test Environment Utilities - Consolidated Test Environment Management
 * 
 * This module serves as the central export point for all test environment
 * management utilities in the qtests framework. It provides a unified interface
 * for environment variable management, mock creation, and test initialization.
 * 
 * Key responsibilities:
 * - Environment variable isolation between tests
 * - Mock and spy creation for external dependencies
 * - Test setup and initialization utilities
 * - Consistent API across different testing scenarios
 * 
 * Design philosophy:
 * - Centralized exports for easy importing
 * - Logical grouping of related functionality
 * - Backward compatibility with existing test patterns
 * - Clear separation of concerns between utilities
 * 
 * Usage patterns:
 * - Import individual utilities: import { setTestEnv } from 'qtests/utils/testEnv'
 * - Import all utilities: import * as testEnv from 'qtests/utils/testEnv'
 * - Use in test setup files for consistent environment management
 */

// Environment variable management utilities
// These functions handle environment variable isolation, allowing tests
// to run with predictable environment configurations without affecting
// other tests or the actual system environment.
export { 
  defaultEnv,           // Get default environment values
  setTestEnv,           // Set test-specific environment variables
  saveEnv,              // Save current environment state
  restoreEnv,           // Restore previously saved environment state
  snapshotEnv,          // Snapshot specific environment variables with logging
  handleSnapshotError   // Error handler for snapshot operations
} from './testEnv/envManager.js';

// Mock and spy creation utilities
// These functions create mocks and spies for common external dependencies,
// enabling isolated testing without actual network calls or side effects.
export { 
  attachMockSpies,    // Attach spies to existing objects
  makeLoggedMock,      // Create mocks with logging capabilities
  createScheduleMock, // Create scheduling-related mocks
  createQerrorsMock,   // Create qerrors library mocks
  createAxiosMock,    // Create HTTP client mocks
  resetMocks          // Reset all created mocks to clean state
} from './testEnv/mockFactory.js';

// Test initialization utilities
// These functions handle test setup and initialization, ensuring
// consistent test environments and proper cleanup procedures.
export { 
  initSearchTest   // Initialize search-related test environments
} from './testEnv/testInitializer.js';