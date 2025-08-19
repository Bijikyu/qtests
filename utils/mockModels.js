/**
 * Mock Models (Refactored)
 * 
 * This module has been refactored to follow Single Responsibility Principle.
 * It now coordinates between focused model utilities for better maintainability.
 * 
 * Components:
 * - models/baseMockModel.js - Base mock model functionality
 * - models/apiKeyModel.js - API key model implementation
 * - models/apiLogModel.js - API log model implementation
 * - models/modelFactory.js - Model creation and collection utilities
 */

// Import logging control utility for consistent framework behavior
const { setLogging } = require('../lib/logUtils');
if (process.env.NODE_ENV !== 'test') setLogging(false);

// Import focused model components
const { BaseMockModel } = require('./models/baseMockModel');
const { ApiKey, mockApiKeys } = require('./models/apiKeyModel');
const { ApiLog, mockLogs } = require('./models/apiLogModel');
const { 
  createMockModel, 
  resetAllCollections, 
  getAllCollections, 
  clearCollection 
} = require('./models/modelFactory');

// Export all mock model utilities for backward compatibility
module.exports = {
  BaseMockModel, // base class for creating custom mock models
  ApiKey, // pre-built API key model for common testing scenarios
  ApiLog, // pre-built API log model for logging tests
  createMockModel, // factory function for creating custom model classes
  resetAllCollections, // utility for cleaning up test data
  getAllCollections, // utility for debugging collections
  clearCollection, // utility for clearing specific collections
  mockApiKeys, // direct access to API keys array for legacy compatibility
  mockLogs // direct access to logs array for legacy compatibility
};