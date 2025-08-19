/**
 * Model Factory and Utilities
 * 
 * This module focuses solely on model creation, factory functions, and collection management.
 * It provides utilities for creating custom models and managing collections.
 */

const { BaseMockModel, mockCollections } = require('./baseMockModel');
const { mockApiKeys } = require('./apiKeyModel');
const { mockLogs } = require('./apiLogModel');

/**
 * Create custom mock model class
 * 
 * Factory function that creates a new mock model class with the specified name.
 * The created class extends BaseMockModel and can be used like any Mongoose model.
 * 
 * @param {string} modelName - Name for the new model class
 * @param {Object} schema - Optional schema definition for validation
 * @returns {Class} New mock model class
 * 
 * @example
 * const User = createMockModel('User');
 * const user = new User({ name: 'John', email: 'john@example.com' });
 * await user.save();
 */
function createMockModel(modelName, schema = {}) {
  console.log(`createMockModel is running with ${modelName}`);
  
  try {
    // Create dynamic class with specified name
    const ModelClass = class extends BaseMockModel {
      constructor(data) {
        super(data);
        this.constructor.modelName = modelName;
      }
    };
    
    // Set the class name for debugging and logging
    Object.defineProperty(ModelClass, 'name', { value: modelName });
    
    console.log(`createMockModel is returning ${modelName} class`);
    return ModelClass;
  } catch (error) {
    console.log(`createMockModel error ${error.message}`);
    throw error;
  }
}

/**
 * Reset all mock collections
 * 
 * Utility function that clears all in-memory collections for clean test state.
 * Useful for test setup and teardown to ensure test isolation.
 * 
 * @returns {void}
 */
function resetAllCollections() {
  console.log(`resetAllCollections is running with none`);
  
  try {
    // Clear the global collections map
    mockCollections.clear();
    
    // Clear legacy arrays for backward compatibility
    mockApiKeys.length = 0;
    mockLogs.length = 0;
    
    console.log(`resetAllCollections completed`);
  } catch (error) {
    console.log(`resetAllCollections error ${error.message}`);
    throw error;
  }
}

/**
 * Get all collections for debugging or testing
 * 
 * @returns {Map} Map of all mock collections
 */
function getAllCollections() {
  return mockCollections;
}

/**
 * Clear specific collection by model name
 * 
 * @param {string} modelName - Name of the model collection to clear
 * @returns {boolean} True if collection was found and cleared
 */
function clearCollection(modelName) {
  console.log(`clearCollection is running with ${modelName}`);
  
  try {
    if (mockCollections.has(modelName)) {
      const collection = mockCollections.get(modelName);
      collection.length = 0;
      console.log(`clearCollection cleared ${modelName}`);
      return true;
    }
    
    console.log(`clearCollection ${modelName} not found`);
    return false;
  } catch (error) {
    console.log(`clearCollection error ${error.message}`);
    throw error;
  }
}

module.exports = {
  createMockModel,
  resetAllCollections,
  getAllCollections,
  clearCollection
};