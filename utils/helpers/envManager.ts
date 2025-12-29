/**
 * Environment Manager - Unified Environment Variable Utilities
 * 
 * This module provides a consolidated interface for environment variable management
 * in test scenarios. It re-exports functionality from focused modules to provide:
 * - Environment variable backup and restoration
 * - Safe environment variable manipulation during tests
 * - Automatic cleanup utilities for test isolation
 * 
 * Design Philosophy:
 * - Modular: Each utility is in its own focused module
 * - Type-safe: Full TypeScript support with proper interfaces
 * - Test-friendly: Designed specifically for test environment scenarios
 * - Backward Compatible: Maintains existing API while improving organization
 */

// Re-export from focused modules for backward compatibility
export {
  backupEnvVars,
  type EnvBackup
} from './envBackup.js';

export {
  restoreEnvVars
} from './envRestore.js';

export {
  withSavedEnv
} from './envWrapper.js';