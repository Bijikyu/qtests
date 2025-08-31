/**
 * Database Testing Helper for In-Memory Database Management - TypeScript Implementation
 * 
 * This class provides centralized database testing utilities using qtests mockModels
 * instead of external database dependencies. It focuses solely on database testing concerns.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';

// Type definitions
interface MockModels {
  clearAllModels?: () => void;
  mockApiKeys?: any[];
  mockLogs?: any[];
  [key: string]: any;
}

/**
 * Database Testing Helper for In-Memory Database Management
 * 
 * This class provides centralized database testing utilities using qtests mockModels
 * instead of external database dependencies. It eliminates duplicate beforeEach/afterEach
 * patterns across storage tests while maintaining qtests zero-dependency approach.
 */
class DatabaseTestHelper {
  private models: MockModels | null;
  private isSetup: boolean;

  constructor() {
    this.models = null;
    this.isSetup = false;
  }

  /**
   * Sets up in-memory database models and clears existing data
   */
  async setup(): Promise<void> {
    logStart('DatabaseTestHelper.setup');
    
    try {
      // For now, use a simple mock models implementation
      // This would need to be connected to actual qtests mockModels
      this.models = {
        clearAllModels: () => {
          if (this.models?.mockApiKeys) this.models.mockApiKeys.length = 0;
          if (this.models?.mockLogs) this.models.mockLogs.length = 0;
        },
        mockApiKeys: [],
        mockLogs: []
      };
      
      // Clear existing model data for clean test state
      if (this.models.clearAllModels) {
        this.models.clearAllModels();
      }
      
      this.isSetup = true;
      logReturn('DatabaseTestHelper.setup', 'completed');
    } catch (error: any) {
      logReturn('DatabaseTestHelper.setup', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Tears down database connections and clears model state
   */
  async teardown(): Promise<void> {
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
    } catch (error: any) {
      logReturn('DatabaseTestHelper.teardown', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creates a complete test suite setup with automatic cleanup
   */
  static createSuite(): DatabaseTestHelper {
    logStart('DatabaseTestHelper.createSuite');
    
    const helper = new DatabaseTestHelper();
    
    // Only set up hooks if they're available and we're at the right scope
    try {
      if (typeof (globalThis as any).beforeEach === 'function' && typeof (globalThis as any).afterEach === 'function') {
        // Check if we're in a test context
        const isValidTestContext = typeof (globalThis as any).describe === 'function' && typeof (globalThis as any).it === 'function';
        
        if (isValidTestContext) {
          (globalThis as any).beforeEach(async () => {
            await helper.setup();
          });

          (globalThis as any).afterEach(async () => {
            await helper.teardown();
          });
        }
      }
    } catch (error) {
      // Hooks not available or not in test context, helper can still be used manually
    }
    
    logReturn('DatabaseTestHelper.createSuite', helper);
    return helper;
  }

  /**
   * Gets mock models instance
   */
  getModels(): MockModels | null {
    return this.models;
  }

  /**
   * Checks if helper is properly set up
   */
  isReady(): boolean {
    return this.isSetup && this.models !== null;
  }

  /**
   * Creates a test entity in the mock database
   */
  async createTestEntity(modelName: string, data: any): Promise<any> {
    logStart('DatabaseTestHelper.createTestEntity', modelName, data);
    
    try {
      if (!this.isSetup || !this.models) {
        throw new Error('DatabaseTestHelper not set up. Call setup() first.');
      }
      
      // Simple mock entity creation
      const entity = {
        id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data
      };
      
      // Store in appropriate mock array
      const mockArray = this.models[`mock${modelName}s`] || [];
      mockArray.push(entity);
      
      logReturn('DatabaseTestHelper.createTestEntity', entity);
      return entity;
    } catch (error: any) {
      logReturn('DatabaseTestHelper.createTestEntity', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Finds test entities by criteria
   */
  async findTestEntities(modelName: string, criteria: any = {}): Promise<any[]> {
    logStart('DatabaseTestHelper.findTestEntities', modelName, criteria);
    
    try {
      if (!this.isSetup || !this.models) {
        throw new Error('DatabaseTestHelper not set up. Call setup() first.');
      }
      
      const mockArray = this.models[`mock${modelName}s`] || [];
      
      // Simple filtering based on criteria
      const results = mockArray.filter((entity: any) => {
        return Object.entries(criteria).every(([key, value]) => entity[key] === value);
      });
      
      logReturn('DatabaseTestHelper.findTestEntities', results);
      return results;
    } catch (error: any) {
      logReturn('DatabaseTestHelper.findTestEntities', `error: ${error.message}`);
      throw error;
    }
  }
}

// Export DatabaseTestHelper using ES module syntax
export { DatabaseTestHelper };