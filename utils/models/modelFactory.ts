/**
 * Model Factory and Utilities - TypeScript Implementation
 * 
 * This module focuses solely on model creation, factory functions, and collection management.
 * It provides utilities for creating custom models and managing collections.
 */

import { BaseMockModel, mockCollections } from './baseMockModel.js';
import { mockApiKeys } from './apiKeyModel.js';
import { mockLogs } from './apiLogModel.js';

// Type definitions
interface MockModelConstructor {
  new (data?: any): BaseMockModel;
  modelName?: string;
}

interface SchemaDefinition {
  [key: string]: any;
}

/**
 * Create custom mock model class
 * 
 * Factory function that creates a new mock model class with the specified name.
 * The created class extends BaseMockModel and can be used like any Mongoose model.
 * 
 * @example
 * const User = createMockModel('User');
 * const user = new User({ name: 'John', email: 'john@example.com' });
 * await user.save();
 */
function createMockModel(modelName: string, schema: SchemaDefinition = {}): MockModelConstructor {
  console.log(`createMockModel is running with ${modelName}`);
  
  try {
    // Create dynamic class with specified name
    class ModelClass extends BaseMockModel {
      static modelName = modelName;

      constructor(data?: any) {
        super(data);
        (this.constructor as any).modelName = modelName;
      }
    }
    
    // Set the class name for debugging and logging
    Object.defineProperty(ModelClass, 'name', { value: modelName });
    
    console.log(`createMockModel is returning ${modelName} class`);
    return ModelClass as MockModelConstructor;
  } catch (error: any) {
    console.log(`createMockModel error ${error.message}`);
    throw error;
  }
}

/**
 * Reset all mock collections
 * 
 * Utility function that clears all in-memory collections for clean test state.
 * Useful for test setup and teardown to ensure test isolation.
 */
function resetAllCollections(): void {
  console.log(`resetAllCollections is running with none`);
  
  try {
    // Clear the global collections map
    mockCollections.clear();
    
    // Clear legacy arrays for backward compatibility
    mockApiKeys.length = 0;
    mockLogs.length = 0;
    
    console.log(`resetAllCollections completed`);
  } catch (error: any) {
    console.log(`resetAllCollections error ${error.message}`);
    throw error;
  }
}

/**
 * Get all collections for debugging or testing
 */
function getAllCollections(): Map<string, any[]> {
  return mockCollections;
}

/**
 * Clear specific collection by model name
 */
function clearCollection(modelName: string): boolean {
  console.log(`clearCollection is running with ${modelName}`);
  
  try {
    if (mockCollections.has(modelName)) {
      const collection = mockCollections.get(modelName);
      if (collection) {
        collection.length = 0;
      }
      console.log(`clearCollection cleared ${modelName}`);
      return true;
    }
    
    console.log(`clearCollection ${modelName} not found`);
    return false;
  } catch (error: any) {
    console.log(`clearCollection error ${error.message}`);
    throw error;
  }
}

// Export using ES module syntax
export {
  createMockModel,
  resetAllCollections,
  getAllCollections,
  clearCollection
};