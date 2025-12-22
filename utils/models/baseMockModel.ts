/**
 * Base Mock Model Class - TypeScript Implementation
 * 
 * This class focuses solely on providing the foundation for Mongoose-compatible mock models.
 * It handles core model functionality like save, remove, and collection management.
 */

import { JEST_WORKER_ID, QTESTS_PARALLEL_MODE } from '../../config/localVars.js';

// Type definitions
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

// Global registry for all mock model collections with parallel-test isolation
const mockCollections = new Map<string, any[]>();

/**
 * Get test-isolated collection key to prevent race conditions
 * Only applies isolation when truly running in parallel (detected by environment)
 */
function getTestIsolatedKey(modelName: string): string {
  // Only apply isolation in very specific parallel execution scenarios
  // Check for Jest worker ID (indicates Jest is running with multiple workers)
  const isJestParallel = JEST_WORKER_ID && JEST_WORKER_ID !== '1';
  
  // Check if explicitly set to parallel mode
  const isExplicitParallel = QTESTS_PARALLEL_MODE === 'true';
  
  if (!isJestParallel && !isExplicitParallel) {
    // Normal testing - use simple model name for shared collections
    return modelName;
  }
  
  // Parallel testing - use isolation
  let testContext = '';
  try {
    if (typeof (globalThis as any).expect !== 'undefined' && (globalThis as any).expect.getState) {
      const state = (globalThis as any).expect.getState();
      testContext = `${state.testPath || ''}-${state.currentTestName || ''}`;
    }
  } catch (e) {
    // Fallback if Jest context not available
  }
  
  // Add process PID and high-resolution time for uniqueness in parallel mode
  const processId = process.pid;
  const hrTime = process.hrtime.bigint();
  const unique = `${processId}-${hrTime}`;
  
  return `${modelName}-${testContext}-${unique}`;
}

/**
 * Base Mock Model Class
 * 
 * This class provides the foundation for creating Mongoose-compatible mock models
 * that store data in memory instead of a database. It implements the most commonly
 * used Mongoose model methods for comprehensive testing scenarios.
 */
class BaseMockModel {
  public _id?: string;
  [key: string]: any;

  /**
   * Constructor for mock model instances
   */
  constructor(data: any = {}) {
    console.log(`${this.constructor.name} constructor is running with ${typeof data}`);
    
    try {
      Object.assign(this, data);
      
      // Generate _id if not provided (mimics Mongoose behavior)
      if (!this._id) {
        this._id = (this.constructor as typeof BaseMockModel).generateId();
      }
      
      console.log(`${this.constructor.name} constructor is returning instance`);
    } catch (error: any) {
      console.log(`${this.constructor.name} constructor error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Save instance to in-memory collection
   */
  save(): Promise<this> {
    console.log(`${this.constructor.name}.save is running with instance`);
    
    try {
      const collection = (this.constructor as typeof BaseMockModel).getCollection();
      
      // Check if this is an update (document already exists) or a new save
      const existingIndex = collection.findIndex(doc => doc._id === this._id);
      
      if (existingIndex >= 0) {
        // Update existing document
        collection[existingIndex] = this;
        console.log(`${this.constructor.name}.save is returning updated instance`);
      } else {
        // Add new document
        collection.push(this);
        console.log(`${this.constructor.name}.save is returning new instance`);
      }
      
      return Promise.resolve(this);
    } catch (error: any) {
      console.log(`${this.constructor.name}.save error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Remove instance from collection
   */
  remove(): Promise<this | null> {
    console.log(`${this.constructor.name}.remove is running with instance`);
    
    try {
      const collection = (this.constructor as typeof BaseMockModel).getCollection();
      const index = collection.findIndex(doc => doc._id === this._id);
      
      if (index >= 0) {
        collection.splice(index, 1);
        console.log(`${this.constructor.name}.remove is returning removed instance`);
        return Promise.resolve(this);
      } else {
        console.log(`${this.constructor.name}.remove is returning null (not found)`);
        return Promise.resolve(null);
      }
    } catch (error: any) {
      console.log(`${this.constructor.name}.remove error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get or create collection for this model class
   */
  static getCollection(): any[] {
    const key = getTestIsolatedKey(this.name || 'Anonymous');
    
    if (!mockCollections.has(key)) {
      mockCollections.set(key, []);
    }
    
    return mockCollections.get(key)!;
  }
  
  /**
   * Clear collection for this model class
   */
  static clearCollection(): void {
    console.log(`${this.name}.clearCollection is running`);
    
    try {
      const key = getTestIsolatedKey(this.name || 'Anonymous');
      mockCollections.set(key, []);
      console.log(`${this.name}.clearCollection completed`);
    } catch (error: any) {
      console.log(`${this.name}.clearCollection error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Delete many documents matching query
   */
  static deleteMany(query: QueryObject = {}): Promise<DeleteResult> {
    console.log(`${this.name}.deleteMany is running with ${JSON.stringify(query)}`);
    
    try {
      const collection = this.getCollection();
      const initialCount = collection.length;
      
      // Simple query matching
      const matchingIndices: number[] = [];
      collection.forEach((doc, index) => {
        let matches = true;
        for (const [key, value] of Object.entries(query)) {
          if (doc[key] !== value) {
            matches = false;
            break;
          }
        }
        if (matches) {
          matchingIndices.push(index);
        }
      });
      
      // Remove matching documents (in reverse order to maintain indices)
      for (let i = matchingIndices.length - 1; i >= 0; i--) {
        collection.splice(matchingIndices[i], 1);
      }
      
      const deletedCount = matchingIndices.length;
      const result: DeleteResult = {
        deletedCount,
        acknowledged: true
      };
      
      console.log(`${this.name}.deleteMany is returning result with ${deletedCount} deleted`);
      return Promise.resolve(result);
    } catch (error: any) {
      console.log(`${this.name}.deleteMany error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Find one document matching query
   */
  static findOne(query: QueryObject = {}): Promise<any | null> {
    console.log(`${this.name}.findOne is running with ${JSON.stringify(query)}`);
    
    try {
      const collection = this.getCollection();
      
      const result = collection.find(doc => {
        for (const [key, value] of Object.entries(query)) {
          if (doc[key] !== value) {
            return false;
          }
        }
        return true;
      }) || null;
      
      console.log(`${this.name}.findOne is returning ${result ? 'document' : 'null'}`);
      return Promise.resolve(result);
    } catch (error: any) {
      console.log(`${this.name}.findOne error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Find all documents matching query
   */
  static find(query: QueryObject = {}): any {
    console.log(`${this.name}.find is running with ${JSON.stringify(query)}`);
    
    try {
      const collection = this.getCollection();
      
      const filtered = collection.filter(doc => {
        for (const [key, value] of Object.entries(query)) {
          if (doc[key] !== value) {
            return false;
          }
        }
        return true;
      });
      
      // Return chainable query object
      const chain = {
        data: filtered,
        sort: () => chain,
        skip: () => chain,
        limit: () => chain,
        lean: () => {
          console.log(`${this.name}.find.lean is returning ${chain.data.length} documents`);
          return Promise.resolve(chain.data);
        },
        exec: () => {
          console.log(`${this.name}.find.exec is returning ${chain.data.length} documents`);
          return Promise.resolve(chain.data);
        }
      };
      
      return chain;
    } catch (error: any) {
      console.log(`${this.name}.find error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Update many documents matching query
   */
  static updateMany(query: QueryObject, update: QueryObject): Promise<UpdateResult> {
    console.log(`${this.name}.updateMany is running with query and update`);
    
    try {
      const collection = this.getCollection();
      let modifiedCount = 0;
      
      collection.forEach(doc => {
        let matches = true;
        for (const [key, value] of Object.entries(query)) {
          if (doc[key] !== value) {
            matches = false;
            break;
          }
        }
        
        if (matches) {
          Object.assign(doc, update);
          modifiedCount++;
        }
      });
      
      const result: UpdateResult = {
        matchedCount: modifiedCount,
        modifiedCount,
        acknowledged: true
      };
      
      console.log(`${this.name}.updateMany is returning result with ${modifiedCount} modified`);
      return Promise.resolve(result);
    } catch (error: any) {
      console.log(`${this.name}.updateMany error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate unique ID for model instances
   */
  static generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `mock-${timestamp}-${random}`;
  }
  
  /**
   * Create new model instance
   */
  static create(data: any): Promise<any> {
    console.log(`${this.name}.create is running with data`);
    
    try {
      const instance = new (this as any)(data);
      return instance.save();
    } catch (error: any) {
      console.log(`${this.name}.create error ${error.message}`);
      throw error;
    }
  }
}

// Export using ES module syntax
export { BaseMockModel, mockCollections };