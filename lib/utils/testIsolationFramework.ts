/**
 * Shared Test Isolation Framework
 * 
 * Provides common test isolation patterns and utilities to reduce
 * duplication across test isolation modules.
 */

// Simple error logging to avoid type issues
const logError = (context: string, error: any, details: any = {}) => {
  const errorMessage = error?.message || String(error);
  console.error(`❌ ${context}: ${errorMessage}`, details);
};
import { measureAsyncTime } from './timingUtils.js';

declare const global: any;

// Centralized isolation state interface
export interface IsolationState {
  originalEnv: Record<string, string | undefined>;
  mockRestoreStack: (() => void)[];
  serverInstances: any[];
  dbConnections: any[];
  activeModules: Set<string>;
  maxStackItems: number;
  testId?: string;
  startTime: number;
}

// Isolation configuration interface
export interface IsolationConfig {
  maxStackItems?: number;
  enableModuleTracking?: boolean;
  enableServerTracking?: boolean;
  enableDatabaseTracking?: boolean;
  enableEnvironmentTracking?: boolean;
  cleanupTimeout?: number;
}

// Cleanup operation interface
export interface CleanupOperation {
  name: string;
  cleanup: () => Promise<void> | void;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Centralized isolation manager
 */
export class TestIsolationManager {
  private static STATE_KEY = '__QTESTS_ISOLATION_STATE__';
  
  /**
   * Get or initialize isolation state
   */
  static getState(): IsolationState {
    if (!global[this.STATE_KEY]) {
      global[this.STATE_KEY] = {
        originalEnv: {} as Record<string, string | undefined>,
        mockRestoreStack: [] as (() => void)[],
        serverInstances: [] as any[],
        dbConnections: [] as any[],
        activeModules: new Set<string>(),
        maxStackItems: 1000,
        testId: undefined,
        startTime: Date.now()
      };
    }
    return global[this.STATE_KEY];
  }

  /**
   * Configure isolation settings
   */
  static configure(config: IsolationConfig): void {
    const state = this.getState();
    
    if (config.maxStackItems !== undefined) {
      state.maxStackItems = config.maxStackItems;
    }
    
    console.log('🔧 Test isolation configured:', {
      maxStackItems: state.maxStackItems,
      moduleTracking: config.enableModuleTracking,
      serverTracking: config.enableServerTracking,
      databaseTracking: config.enableDatabaseTracking,
      environmentTracking: config.enableEnvironmentTracking
    });
  }

  /**
   * Start new test isolation session
   */
  static startSession(testId?: string): string {
    const sessionId = testId || `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const state = this.getState();
    
    state.testId = sessionId;
    state.startTime = Date.now();
    
    console.log(`🧪 Starting test isolation session: ${sessionId}`);
    return sessionId;
  }

  /**
   * End current test session and cleanup
   */
  static async endSession(): Promise<{
    sessionId: string;
    duration: number;
    cleanupResults: Array<{ operation: string; success: boolean; error?: string }>;
  }> {
    const state = this.getState();
    const sessionId = state.testId || 'unknown';
    const duration = Date.now() - state.startTime;
    
    console.log(`🧹 Ending test isolation session: ${sessionId} (${duration}ms)`);
    
    const cleanupResults = await this.performCleanup();
    
    // Reset session-specific state
    state.testId = undefined;
    state.startTime = Date.now();
    
    return {
      sessionId,
      duration,
      cleanupResults
    };
  }

  /**
   * Register mock restore function with memory management
   */
  static registerMockRestore(restoreFn: () => void): void {
    const state = this.getState();
    
    // Prevent memory leaks by limiting stack size
    if (state.mockRestoreStack.length >= state.maxStackItems) {
      console.warn('⚠️ Mock restore stack approaching limit, forcing cleanup');
      const halfSize = Math.floor(state.maxStackItems / 2);
      state.mockRestoreStack.splice(0, halfSize);
    }
    
    state.mockRestoreStack.push(restoreFn);
  }

  /**
   * Restore all registered mocks with error handling
   */
  static restoreAllMocks(): void {
    const state = this.getState();
    const restoreCount = state.mockRestoreStack.length;
    
    console.log(`🔄 Restoring ${restoreCount} mock(s)`);
    
    while (state.mockRestoreStack.length > 0) {
      const restoreFn = state.mockRestoreStack.pop();
      try {
        if (typeof restoreFn === 'function') {
          restoreFn();
        }
      } catch (error) {
        console.error('❌ Mock restore error:', error?.message || String(error));
      }
    }
  }

  /**
   * Track server instances for cleanup
   */
  static trackServerInstance(server: any): void {
    const state = this.getState();
    state.serverInstances.push(server);
    
    console.log(`🖥️ Server instance tracked (total: ${state.serverInstances.length})`);
  }

  /**
   * Close all server instances
   */
  static async closeAllServers(timeout: number = 5000): Promise<void> {
    const state = this.getState();
    const serverCount = state.serverInstances.length;
    
    if (serverCount === 0) {
      console.log('🖥️ No server instances to close');
      return;
    }
    
    console.log(`🖥️ Closing ${serverCount} server instance(s)`);
    
    const closePromises = state.serverInstances.map(async (server, index) => {
      try {
        if (server && typeof server.close === 'function') {
          // Add timeout to prevent hanging
          await Promise.race([
            server.close(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Server close timeout')), timeout)
            )
          ]);
        }
      } catch (error) {
        console.error('Server close error:', String(error));
      }
    });
    
    await Promise.allSettled(closePromises);
    state.serverInstances = [];
  }

  /**
   * Track database connections for cleanup
   */
  static trackDbConnection(connection: any): void {
    const state = this.getState();
    state.dbConnections.push(connection);
    
    console.log(`🗄️ Database connection tracked (total: ${state.dbConnections.length})`);
  }

  /**
   * Close all database connections
   */
  static async closeAllDbConnections(timeout: number = 5000): Promise<void> {
    const state = this.getState();
    const connectionCount = state.dbConnections.length;
    
    if (connectionCount === 0) {
      console.log('🗄️ No database connections to close');
      return;
    }
    
    console.log(`🗄️ Closing ${connectionCount} database connection(s)`);
    
    const closePromises = state.dbConnections.map(async (connection, index) => {
      try {
        if (connection && typeof connection.close === 'function') {
          // Add timeout to prevent hanging
          await Promise.race([
            connection.close(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('DB connection close timeout')), timeout)
            )
          ]);
        }
      } catch (error) {
        console.error('DB connection close error:', String(error));
      }
    });
    
    await Promise.allSettled(closePromises);
    state.dbConnections = [];
  }

  /**
   * Track active modules
   */
  static trackModule(moduleName: string): void {
    const state = this.getState();
    state.activeModules.add(moduleName);
    
    console.log(`📦 Module tracked: ${moduleName} (total: ${state.activeModules.size})`);
  }

  /**
   * Clear tracked modules
   */
  static clearTrackedModules(): void {
    const state = this.getState();
    const moduleCount = state.activeModules.size;
    
    if (moduleCount > 0) {
      console.log(`🗑️ Clearing ${moduleCount} tracked module(s)`);
      state.activeModules.clear();
    }
  }

  /**
   * Backup environment variables
   */
  static backupEnvironment(): void {
    const state = this.getState();
    state.originalEnv = { ...process.env };
    
    console.log(`🌍 Backed up ${Object.keys(state.originalEnv).length} environment variable(s)`);
  }

  /**
   * Restore environment variables
   */
  static restoreEnvironment(): void {
    const state = this.getState();
    const restoreCount = Object.keys(state.originalEnv).length;
    
    if (restoreCount > 0) {
      console.log(`🌍 Restoring ${restoreCount} environment variable(s)`);
      
      // Clear current environment
      Object.keys(process.env).forEach(key => {
        if (!(key in state.originalEnv)) {
          delete process.env[key];
        }
      });
      
      // Restore original environment
      Object.entries(state.originalEnv).forEach(([key, value]) => {
        if (value !== undefined) {
          process.env[key] = value;
        } else {
          delete process.env[key];
        }
      });
    }
  }

  /**
   * Perform comprehensive cleanup
   */
  static async performCleanup(): Promise<Array<{ operation: string; success: boolean; error?: string }>> {
    const operations: CleanupOperation[] = [
      { name: 'restoreMocks', cleanup: async () => { this.restoreAllMocks(); }, priority: 'high' },
      { name: 'closeServers', cleanup: async () => { await this.closeAllServers(); }, priority: 'high' },
      { name: 'closeDbConnections', cleanup: async () => { await this.closeAllDbConnections(); }, priority: 'high' },
      { name: 'restoreEnvironment', cleanup: async () => { this.restoreEnvironment(); }, priority: 'medium' },
      { name: 'clearModules', cleanup: async () => { this.clearTrackedModules(); }, priority: 'low' }
    ];

    const results = [];
    
    // Sort by priority
    operations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (const operation of operations) {
      try {
        console.log(`🧹 Performing cleanup operation: ${operation.name}`);
        
        const startTime = Date.now();
        await Promise.resolve(operation.cleanup());
        const duration = Date.now() - startTime;
        
        results.push({
          operation: operation.name,
          success: true
        });
        
        console.log(`✅ Cleanup operation ${operation.name} completed (${duration}ms)`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        results.push({
          operation: operation.name,
          success: false,
          error: errorMessage
        });
        
        console.error(`❌ Cleanup operation ${operation.name} failed: ${errorMessage}`);
      }
    }
    
    return results;
  }

  /**
   * Get isolation statistics
   */
  static getStats(): {
    mockRestoreCount: number;
    serverInstanceCount: number;
    dbConnectionCount: number;
    activeModuleCount: number;
    currentSession?: string;
    sessionDuration: number;
  } {
    const state = this.getState();
    
    return {
      mockRestoreCount: state.mockRestoreStack.length,
      serverInstanceCount: state.serverInstances.length,
      dbConnectionCount: state.dbConnections.length,
      activeModuleCount: state.activeModules.size,
      currentSession: state.testId,
      sessionDuration: state.testId ? Date.now() - state.startTime : 0
    };
  }

  /**
   * Reset isolation state
   */
  static reset(): void {
    const state = this.getState();
    
    console.log('🔄 Resetting test isolation state');
    
    // Clear all tracked items
    state.mockRestoreStack = [];
    state.serverInstances = [];
    state.dbConnections = [];
    state.activeModules.clear();
    state.originalEnv = {};
    state.testId = undefined;
    state.startTime = Date.now();
  }

  /**
   * Check isolation health
   */
  static getHealthCheck(): {
    healthy: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const stats = this.getStats();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for memory leaks
    if (stats.mockRestoreCount > 100) {
      issues.push('High mock restore count - potential memory leak');
      recommendations.push('Review mock registration patterns');
    }

    // Check for resource leaks
    if (stats.serverInstanceCount > 10) {
      issues.push('High server instance count - potential resource leak');
      recommendations.push('Ensure servers are properly closed');
    }

    if (stats.dbConnectionCount > 20) {
      issues.push('High database connection count - potential connection leak');
      recommendations.push('Ensure database connections are properly closed');
    }

    // Check session duration
    if (stats.sessionDuration > 300000) { // 5 minutes
      issues.push('Long test session duration');
      recommendations.push('Consider breaking down long-running tests');
    }

    return {
      healthy: issues.length === 0,
      issues,
      recommendations
    };
  }
}

// Utility functions for backward compatibility
export const isolationUtils = {
  registerMockRestore: TestIsolationManager.registerMockRestore,
  restoreAllMocks: TestIsolationManager.restoreAllMocks,
  trackDbConnection: TestIsolationManager.trackDbConnection,
  closeAllDbConnections: TestIsolationManager.closeAllDbConnections,
  trackServerInstance: TestIsolationManager.trackServerInstance,
  closeAllServers: TestIsolationManager.closeAllServers,
  backupEnvironment: TestIsolationManager.backupEnvironment,
  restoreEnvironment: TestIsolationManager.restoreEnvironment,
  getStats: TestIsolationManager.getStats,
  reset: TestIsolationManager.reset
};

// Quick setup functions
export const quickSetup = {
  // Quick isolation setup for common scenarios
  standard: () => {
    TestIsolationManager.configure({
      maxStackItems: 1000,
      enableModuleTracking: true,
      enableServerTracking: true,
      enableDatabaseTracking: true,
      enableEnvironmentTracking: true
    });
    TestIsolationManager.backupEnvironment();
  },

  // Minimal setup for lightweight tests
  minimal: () => {
    TestIsolationManager.configure({
      maxStackItems: 100,
      enableModuleTracking: false,
      enableServerTracking: false,
      enableDatabaseTracking: false,
      enableEnvironmentTracking: false
    });
  },

  // Full setup for comprehensive integration tests
  comprehensive: () => {
    TestIsolationManager.configure({
      maxStackItems: 2000,
      enableModuleTracking: true,
      enableServerTracking: true,
      enableDatabaseTracking: true,
      enableEnvironmentTracking: true,
      cleanupTimeout: 10000
    });
    TestIsolationManager.backupEnvironment();
  }
};