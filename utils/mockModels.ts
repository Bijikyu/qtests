/**
 * Mock Models for Testing - TypeScript Implementation
 */

// Collections storage
const collections = new Map<string, any[]>();

/**
 * Base Mock Model class
 */
class BaseMockModel {
  _id: string;
  [key: string]: any;

  constructor(data: Record<string, any> = {}) {
    this._id = data._id || `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    Object.assign(this, data);
  }
  
  async save(): Promise<this> {
    const collectionName = (this.constructor as any).modelName || 'default';
    if (!collections.has(collectionName)) {
      collections.set(collectionName, []);
    }
    
    const collection = collections.get(collectionName)!;
    const existingIndex = collection.findIndex(item => item._id === this._id);
    
    if (existingIndex >= 0) {
      collection[existingIndex] = this;
    } else {
      collection.push(this);
    }
    
    return this;
  }
  
  static getCollection(): any[] {
    const collectionName = (this as any).modelName || 'default';
    return collections.get(collectionName) || [];
  }
  
  static find(query: Record<string, any> = {}): any[] {
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
function createMockModel(modelName: string) {
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

/**
 * Reset all collections
 */
function resetAllCollections(): void {
  collections.clear();
}

// Export mock model utilities using ES module syntax
export {
  BaseMockModel,
  ApiKey,
  ApiLog,
  createMockModel,
  resetAllCollections
};

// Default export for main functionality
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