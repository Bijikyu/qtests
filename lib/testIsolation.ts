/**
 * Legacy Test Isolation - Refactored for SRP
 * 
 * This file now serves as a compatibility layer that re-exports
 * the modular test isolation functionality while maintaining backward compatibility.
 * 
 * The actual implementation has been split into:
 * - testIsolation/environmentManager.ts - Environment variable management
 * - testIsolation/mockManager.ts - Mock restoration tracking
 * - testIsolation/serverManager.ts - Server instance tracking
 * - testIsolation/databaseManager.ts - Database connection tracking
 * - testIsolation/isolationOrchestrator.ts - High-level orchestration
 */

// Import modular test isolation components
import {
  setupTestIsolation,
  teardownTestIsolation,
  setupJestIsolation,
  backupEnvironment,
  restoreEnvironment,
  registerMockRestore,
  restoreAllMocks,
  trackServer,
  closeAllServers,
  trackDbConnection,
  closeAllDbConnections
} from './testIsolation/index.js';

// Re-export all functionality for backward compatibility
export {
  setupTestIsolation,
  teardownTestIsolation,
  setupJestIsolation,
  backupEnvironment,
  restoreEnvironment,
  registerMockRestore,
  restoreAllMocks,
  trackServer,
  closeAllServers,
  trackDbConnection,
  closeAllDbConnections,
};

// Default export for backward compatibility
export default {
  setupTestIsolation,
  teardownTestIsolation,
  backupEnvironment,
  restoreEnvironment,
  registerMockRestore,
  restoreAllMocks,
  trackServer,
  closeAllServers,
  trackDbConnection,
  closeAllDbConnections,
  setupJestIsolation
};
