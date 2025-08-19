/**
 * Mock Models for Testing - Working Implementation
 */

// Collections storage
const collections = new Map();

/**
 * Base Mock Model class
 */
class BaseMockModel {
  constructor(data = {}) {
    this._id = data._id || `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    Object.assign(this, data);
  }
  
  async save() {
    const collectionName = this.constructor.modelName || 'default';
    if (!collections.has(collectionName)) {
      collections.set(collectionName, []);
    }
    
    const collection = collections.get(collectionName);
    const existingIndex = collection.findIndex(item => item._id === this._id);
    
    if (existingIndex >= 0) {
      collection[existingIndex] = this;
    } else {
      collection.push(this);
    }
    
    return this;
  }
  
  static getCollection() {
    const collectionName = this.modelName || 'default';
    return collections.get(collectionName) || [];
  }
  
  static find(query = {}) {
    const collection = this.getCollection();
    if (Object.keys(query).length === 0) {
      return [...collection]; // Return copy
    }
    
    return collection.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }
}

/**
 * Create mock model class
 */
function createMockModel(modelName) {
  class MockModel extends BaseMockModel {
    static modelName = modelName;
  }
  MockModel.modelName = modelName;
  return MockModel;
}

/**
 * Pre-built API Key model
 */
class ApiKey extends BaseMockModel {
  static modelName = 'ApiKey';
  
  constructor(data = {}) {
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
  
  constructor(data = {}) {
    super(data);
    this.endpoint = data.endpoint || '';
    this.method = data.method || 'GET';
    this.statusCode = data.statusCode || 200;
    this.timestamp = data.timestamp || new Date();
  }
}

/**
 * Reset all collections
 */
function resetAllCollections() {
  collections.clear();
}

module.exports = {
  BaseMockModel,
  ApiKey,
  ApiLog,
  createMockModel,
  resetAllCollections,
  // Legacy exports for compatibility
  mockApiKeys: () => ApiKey.getCollection(),
  mockLogs: () => ApiLog.getCollection()
};