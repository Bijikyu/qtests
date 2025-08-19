/**
 * Database Testing Helper for In-Memory Database Management
 * 
 * This class provides centralized database testing utilities using qtests mockModels
 * instead of external database dependencies. It focuses solely on database testing concerns.
 */

const { logStart, logReturn } = require('../../lib/logUtils');

/**
 * Database Testing Helper for In-Memory Database Management
 * 
 * This class provides centralized database testing utilities using qtests mockModels
 * instead of external database dependencies. It eliminates duplicate beforeEach/afterEach
 * patterns across storage tests while maintaining qtests zero-dependency approach.
 */
class DatabaseTestHelper {
  constructor() {
    this.models = null;
    this.isSetup = false;
  }

  /**
   * Sets up in-memory database models and clears existing data
   * 
   * @returns {Promise<void>} Resolves when setup is complete
   */
  async setup() {
    logStart('DatabaseTestHelper.setup');
    
    try {
      // Import qtests mockModels for in-memory database simulation
      const { mockModels } = require('../../lib/envUtils');
      this.models = mockModels;
      
      // Clear existing model data for clean test state
      if (this.models.clearAllModels) {
        this.models.clearAllModels();
      } else {
        // Manual clearing if clearAllModels not available
        if (this.models.mockApiKeys) this.models.mockApiKeys.length = 0;
        if (this.models.mockLogs) this.models.mockLogs.length = 0;
      }
      
      this.isSetup = true;
      logReturn('DatabaseTestHelper.setup', 'completed');
    } catch (error) {
      logReturn('DatabaseTestHelper.setup', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Tears down database connections and clears model state
   * 
   * @returns {Promise<void>} Resolves when teardown is complete
   */
  async teardown() {
    logStart('DatabaseTestHelper.teardown');
    
    try {
      if (this.models) {
        // Clear all model data
        if (this.models.clearAllModels) {
          this.models.clearAllModels();
        } else {
          // Manual clearing if clearAllModels not available
          if (this.models.mockApiKeys) this.models.mockApiKeys.length = 0;
          if (this.models.mockLogs) this.models.mockLogs.length = 0;
        }
      }
      
      this.models = null;
      this.isSetup = false;
      logReturn('DatabaseTestHelper.teardown', 'completed');
    } catch (error) {
      logReturn('DatabaseTestHelper.teardown', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creates a complete test suite setup with automatic cleanup
   * 
   * @returns {DatabaseTestHelper} Configured helper instance
   */
  static createSuite() {
    logStart('DatabaseTestHelper.createSuite');
    
    const helper = new DatabaseTestHelper();
    
    // Only set up hooks if they're available and we're at the right scope
    try {
      if (typeof beforeEach === 'function' && typeof afterEach === 'function') {
        // Check if we're in a test context by attempting to define hooks
        const isValidTestContext = typeof describe === 'function' && typeof it === 'function';
        
        if (isValidTestContext) {
          beforeEach(async () => {
            await helper.setup();
          });

          afterEach(async () => {
            await helper.teardown();
          });
        } else {
          console.log('[DatabaseTestHelper] Hooks available but not in valid test context - use manual setup/teardown');
        }
      } else {
        console.log('[DatabaseTestHelper] No test hooks detected - use manual setup/teardown');
      }
    } catch (error) {
      console.log('[DatabaseTestHelper] Could not set up automatic hooks - use manual setup/teardown');
    }
    
    logReturn('DatabaseTestHelper.createSuite', helper);
    return helper;
  }

  /**
   * Get direct access to models for advanced testing scenarios
   * 
   * @returns {Object} Mock models object with ApiKey, ApiLog, etc.
   */
  getModels() {
    if (!this.isSetup) {
      throw new Error('DatabaseTestHelper must be set up before accessing models');
    }
    return this.models;
  }
}

module.exports = {
  DatabaseTestHelper
};