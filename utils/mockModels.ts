/**
 * Mock Models for Testing - Re-exported from superior implementation
 * 
 * @deprecated This file re-exports from utils/models/baseMockModel.ts
 * Consider importing directly from '../utils/models/baseMockModel' for new code
 */

// Import the superior implementation
import { BaseMockModel } from './models/baseMockModel.js';

// ==================== TYPE DEFINITIONS ====================

interface QueryObject {
  [key: string]: any;
}

interface DeleteResult {
  deletedCount: number;
  acknowledged: boolean;
}

interface UpdateResult {
  matchedCount: number;
  modifiedCount: number;
  acknowledged: boolean;
}

// ==================== ENHANCED MOCK MODELS ====================

/**
 * Pre-built API Key model
 */
class ApiKey extends BaseMockModel {
  static modelName = 'ApiKey';
  key: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  
  constructor(data: Record<string, any> = {}) {
    super(data);
    this.key = data.key || '';
    this.name = data.name || '';
    this.permissions = data.permissions || [];
    this.createdAt = data.createdAt || new Date();
  }
}

/**
 * Pre-built API Log model  
 */
class ApiLog extends BaseMockModel {
  static modelName = 'ApiLog';
  endpoint: string;
  method: string;
  statusCode: number;
  timestamp: Date;
  
  constructor(data: Record<string, any> = {}) {
    super(data);
    this.endpoint = data.endpoint || '';
    this.method = data.method || 'GET';
    this.statusCode = data.statusCode || 200;
    this.timestamp = data.timestamp || new Date();
  }
}

// ==================== FACTORY FUNCTIONS ====================

/**
 * Create mock model class with enhanced functionality
 */
function createMockModel(modelName: string) {
  class MockModel extends BaseMockModel {
    static modelName = modelName;
  }
  MockModel.modelName = modelName;
  return MockModel;
}

/**
 * Reset all collections (enhanced with test isolation awareness)
 */
function resetAllCollections(): void {
  // Clear all collections including test-isolated ones
  // This is a simplified version - the full implementation would need
  // access to the internal mockCollections map from baseMockModel
  console.log('resetAllCollections called - clearing base model collections');
  BaseMockModel.clearCollection();
}

// ==================== EXPORTS ====================

// Export mock model utilities using ES module syntax
export {
  BaseMockModel,
  ApiKey,
  ApiLog,
  createMockModel,
  resetAllCollections
};

// Default export for main functionality (maintaining backward compatibility)
const mockModels = {
  BaseMockModel,
  ApiKey,
  ApiLog,
  createMockModel,
  resetAllCollections,
  // Legacy exports for compatibility
  mockApiKeys: () => ApiKey.getCollection(),
  mockLogs: () => ApiLog.getCollection()
};

export default mockModels;