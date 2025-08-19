/**
 * Base Mock Model Class
 * 
 * This class focuses solely on providing the foundation for Mongoose-compatible mock models.
 * It handles core model functionality like save, remove, and collection management.
 */

// Global registry for all mock model collections with parallel-test isolation
const mockCollections = new Map();

/**
 * Get test-isolated collection key to prevent race conditions
 * Only applies isolation when truly running in parallel (detected by environment)
 */
function getTestIsolatedKey(modelName) {
  // Only apply isolation in very specific parallel execution scenarios
  // Check for Jest worker ID (indicates Jest is running with multiple workers)
  const isJestParallel = process.env.JEST_WORKER_ID && process.env.JEST_WORKER_ID !== '1';
  
  // Check if explicitly set to parallel mode
  const isExplicitParallel = process.env.QTESTS_PARALLEL_MODE === 'true';
  
  if (!isJestParallel && !isExplicitParallel) {
    // Normal testing - use simple model name for shared collections
    return modelName;
  }
  
  // Parallel testing - use isolation
  let testContext = '';
  try {
    if (typeof expect !== 'undefined' && expect.getState) {
      const state = expect.getState();
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
  /**
   * Constructor for mock model instances
   * 
   * @param {Object} data - Initial data for the model instance
   */
  constructor(data = {}) {
    console.log(`${this.constructor.name} constructor is running with ${typeof data}`);
    
    try {
      Object.assign(this, data);
      
      // Generate _id if not provided (mimics Mongoose behavior)
      if (!this._id) {
        this._id = this.constructor.generateId();
      }
      
      console.log(`${this.constructor.name} constructor is returning instance`);
    } catch (error) {
      console.log(`${this.constructor.name} constructor error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Save instance to in-memory collection
   * 
   * @returns {Promise<Object>} Promise resolving to the saved instance
   */
  save() {
    console.log(`${this.constructor.name}.save is running with instance`);
    
    try {
      const collection = this.constructor.getCollection();
      
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
    } catch (error) {
      console.log(`${this.constructor.name}.save error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Remove instance from collection
   * 
   * @returns {Promise<Object>} Promise resolving to the removed instance
   */
  remove() {
    console.log(`${this.constructor.name}.remove is running with instance`);
    
    try {
      const collection = this.constructor.getCollection();
      const index = collection.findIndex(doc => doc._id === this._id);
      
      if (index >= 0) {
        collection.splice(index, 1);
        console.log(`${this.constructor.name}.remove is returning removed instance`);
        return Promise.resolve(this);
      } else {
        console.log(`${this.constructor.name}.remove is returning null (not found)`);
        return Promise.resolve(null);
      }
    } catch (error) {
      console.log(`${this.constructor.name}.remove error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get or create collection for this model class
   * 
   * @returns {Array} Array serving as the in-memory collection
   */
  static getCollection() {
    const key = getTestIsolatedKey(this.name || 'Anonymous');
    
    if (!mockCollections.has(key)) {
      mockCollections.set(key, []);
    }
    
    return mockCollections.get(key);
  }
  
  /**
   * Clear collection for this model class
   * 
   * Removes all documents from the in-memory collection for this specific model
   */
  static clearCollection() {
    console.log(`${this.name}.clearCollection is running`);
    
    try {
      const key = getTestIsolatedKey(this.name || 'Anonymous');
      mockCollections.set(key, []);
      console.log(`${this.name}.clearCollection completed`);
    } catch (error) {
      console.log(`${this.name}.clearCollection error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Delete many documents matching query
   * 
   * @param {Object} query - Query object to match documents for deletion
   * @returns {Promise<Object>} Promise resolving to deletion result
   */
  static deleteMany(query = {}) {
    console.log(`${this.name}.deleteMany is running with ${JSON.stringify(query)}`);
    
    try {
      const collection = this.getCollection();
      const initialLength = collection.length;
      
      // Filter out documents that match the query
      const remainingDocs = collection.filter(doc => !this.matchesQuery(doc, query));
      const deletedCount = initialLength - remainingDocs.length;
      
      // Update the collection
      const key = getTestIsolatedKey(this.name || 'Anonymous');
      mockCollections.set(key, remainingDocs);
      
      console.log(`${this.name}.deleteMany deleted ${deletedCount} documents`);
      return Promise.resolve({ deletedCount, acknowledged: true });
    } catch (error) {
      console.log(`${this.name}.deleteMany error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Update many documents matching query
   * 
   * @param {Object} query - Query object to match documents for update
   * @param {Object} update - Update object
   * @returns {Promise<Object>} Promise resolving to update result
   */
  static updateMany(query = {}, update = {}) {
    console.log(`${this.name}.updateMany is running with query and update`);
    
    try {
      const collection = this.getCollection();
      let modifiedCount = 0;
      
      collection.forEach(doc => {
        if (this.matchesQuery(doc, query)) {
          Object.assign(doc, update);
          modifiedCount++;
        }
      });
      
      console.log(`${this.name}.updateMany modified ${modifiedCount} documents`);
      return Promise.resolve({ modifiedCount, acknowledged: true });
    } catch (error) {
      console.log(`${this.name}.updateMany error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Count documents matching query
   * 
   * @param {Object} query - Query object to match documents
   * @returns {Promise<number>} Promise resolving to count
   */
  static countDocuments(query = {}) {
    console.log(`${this.name}.countDocuments is running with ${JSON.stringify(query)}`);
    
    try {
      const collection = this.getCollection();
      const count = collection.filter(doc => this.matchesQuery(doc, query)).length;
      
      console.log(`${this.name}.countDocuments is returning ${count}`);
      return Promise.resolve(count);
    } catch (error) {
      console.log(`${this.name}.countDocuments error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate unique ID for new documents
   * 
   * @returns {string} Unique identifier
   */
  static generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
  
  /**
   * Find documents in collection
   * 
   * @param {Object} query - Query object
   * @returns {Object} Query chain object with lean() method
   */
  static find(query = {}) {
    console.log(`${this.name}.find is running with ${JSON.stringify(query)}`);
    
    try {
      const collection = this.getCollection();
      let results = collection.filter(doc => this.matchesQuery(doc, query));
      
      // Return chainable object with full query chain (Mongoose-style)
      const chain = {
        _data: results,
        _sortBy: null,
        _skipCount: 0,
        _limitCount: null,
        
        sort(sortObj) {
          this._sortBy = sortObj;
          return this;
        },
        
        skip(count) {
          this._skipCount = count;
          return this;
        },
        
        limit(count) {
          this._limitCount = count;
          return this;
        },
        
        _applyChain() {
          let data = [...this._data];
          
          // Apply sorting
          if (this._sortBy) {
            const sortKey = Object.keys(this._sortBy)[0];
            const sortOrder = this._sortBy[sortKey];
            data.sort((a, b) => {
              if (sortOrder === 1) return a[sortKey] > b[sortKey] ? 1 : -1;
              return a[sortKey] < b[sortKey] ? 1 : -1;
            });
          }
          
          // Apply skip
          if (this._skipCount > 0) {
            data = data.slice(this._skipCount);
          }
          
          // Apply limit
          if (this._limitCount) {
            data = data.slice(0, this._limitCount);
          }
          
          return data;
        },
        
        lean() {
          const finalData = this._applyChain();
          console.log(`${this.name}.find.lean is returning ${finalData.length} documents`);
          return Promise.resolve(finalData);
        },
        
        exec() {
          const finalData = this._applyChain();
          console.log(`${this.name}.find.exec is returning ${finalData.length} documents`);
          return Promise.resolve(finalData);
        }
      };
      
      console.log(`${this.name}.find is returning query chain`);
      return chain;
    } catch (error) {
      console.log(`${this.name}.find error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Find one document in collection
   * 
   * @param {Object} query - Query object
   * @returns {Promise<Object|null>} Promise resolving to matching document or null
   */
  static findOne(query = {}) {
    console.log(`${this.name}.findOne is running with ${JSON.stringify(query)}`);
    
    try {
      const collection = this.getCollection();
      const result = collection.find(doc => this.matchesQuery(doc, query)) || null;
      
      console.log(`${this.name}.findOne is returning ${result ? 'document' : 'null'}`);
      return Promise.resolve(result);
    } catch (error) {
      console.log(`${this.name}.findOne error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Find and update one document
   * 
   * @param {Object} query - Query object
   * @param {Object} update - Update object
   * @param {Object} options - Update options (including upsert)
   * @returns {Promise<Object|null>} Promise resolving to updated document or null
   * @returns {Promise<Object|null>} Promise resolving to updated document or null
   */
  static findOneAndUpdate(query, update, options = {}) {
    console.log(`${this.name}.findOneAndUpdate is running with query and update`);
    
    try {
      const collection = this.getCollection();
      let doc = collection.find(d => this.matchesQuery(d, query));
      
      if (!doc) {
        if (options.upsert) {
          // Create new document combining query and update
          const newDoc = {
            _id: this.generateId(),
            ...query,
            ...update,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Add to collection  
          const modelName = this.name || 'Anonymous';
          const currentCollection = mockCollections.get(modelName) || [];
          currentCollection.push(newDoc);
          mockCollections.set(modelName, currentCollection);
          
          console.log(`${this.name}.findOneAndUpdate created new document with upsert`);
          return Promise.resolve(newDoc);
        } else {
          console.log(`${this.name}.findOneAndUpdate is returning null`);
          return Promise.resolve(null);
        }
      }
      
      Object.assign(doc, update, { updatedAt: new Date() });
      console.log(`${this.name}.findOneAndUpdate is returning updated document`);
      return Promise.resolve(doc);
    } catch (error) {
      console.log(`${this.name}.findOneAndUpdate error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Find and delete one document
   * 
   * @param {Object} query - Query object
   * @returns {Promise<Object|null>} Promise resolving to deleted document or null
   */
  static findOneAndDelete(query) {
    console.log(`${this.name}.findOneAndDelete is running with ${JSON.stringify(query)}`);
    
    try {
      const collection = this.getCollection();
      const index = collection.findIndex(doc => this.matchesQuery(doc, query));
      
      if (index === -1) {
        console.log(`${this.name}.findOneAndDelete is returning null`);
        return Promise.resolve(null);
      }
      
      const deleted = collection.splice(index, 1)[0];
      console.log(`${this.name}.findOneAndDelete is returning deleted document`);
      return Promise.resolve(deleted);
    } catch (error) {
      console.log(`${this.name}.findOneAndDelete error ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Check if document matches query
   * 
   * @param {Object} doc - Document to test
   * @param {Object} query - Query object with field/value pairs
   * @returns {boolean} True if document matches query
   */
  static matchesQuery(doc, query) {
    if (!query || Object.keys(query).length === 0) {
      return true; // empty query matches all documents
    }
    
    for (const [field, value] of Object.entries(query)) {
      if (doc[field] !== value) {
        return false; // field doesn't match
      }
    }
    
    return true; // all fields match
  }
}

module.exports = {
  BaseMockModel,
  mockCollections
};