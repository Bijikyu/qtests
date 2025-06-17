/** //(introduces simple in-memory models for tests)
 * Mimics mongoose models without a database. //(simulate schema behavior)
 * Rationale: unit tests need persistence without Mongo. //(explain reason)
 */ //(close introductory comment)

// Import logging control utility for consistent framework behavior
const { setLogging } = require('../lib/logUtils');
if (process.env.NODE_ENV !== 'test') setLogging(false);

// Global registry for all mock model collections
const mockCollections = new Map(); //(store all model collections)

/**
 * Base Mock Model Class
 * 
 * This class provides the foundation for creating Mongoose-compatible mock models
 * that store data in memory instead of a database. It implements the most commonly
 * used Mongoose model methods for comprehensive testing scenarios.
 * 
 * Design philosophy:
 * - Drop-in replacement for Mongoose models in testing
 * - Maintains Mongoose API compatibility for seamless testing
 * - In-memory storage for fast, isolated test execution
 * - Promise-based interface matching modern Mongoose usage
 * 
 * Key benefits:
 * 1. Zero database dependencies for unit testing
 * 2. Fast test execution without database I/O
 * 3. Predictable data state for reliable testing
 * 4. Full control over test data without external setup
 * 
 * Use cases:
 * - Unit testing models and business logic
 * - Integration testing without database setup
 * - Testing data validation and transformation
 * - API testing with controlled data scenarios
 */
class BaseMockModel {
  /**
   * Constructor for mock model instances
   * 
   * Creates a new model instance with the provided data. This mimics
   * the behavior of creating a new Mongoose document.
   * 
   * @param {Object} data - Initial data for the model instance
   */
  constructor(data = {}) {
    console.log(`${this.constructor.name} constructor is running with ${typeof data}`); // log creation
    
    try {
      Object.assign(this, data); // assign provided data to instance
      
      // Generate _id if not provided (mimics Mongoose behavior)
      if (!this._id) {
        this._id = this.constructor.generateId();
      }
      
      console.log(`${this.constructor.name} constructor is returning instance`); // log completion
    } catch (error) {
      console.log(`${this.constructor.name} constructor error ${error.message}`); // log error
      throw error;
    }
  }
  
  /**
   * Save instance to in-memory collection
   * 
   * This method mimics Mongoose's save() functionality by adding the
   * instance to the in-memory collection. It handles both new documents
   * and updates to existing documents.
   * 
   * @returns {Promise<Object>} Promise resolving to the saved instance
   */
  save() {
    console.log(`${this.constructor.name}.save is running with instance`); // log save operation
    
    try {
      const collection = this.constructor.getCollection();
      
      // Check if document already exists (for updates)
      const existingIndex = collection.findIndex(doc => doc._id === this._id);
      
      if (existingIndex >= 0) {
        // Update existing document
        collection[existingIndex] = this;
      } else {
        // Add new document
        collection.push(this);
      }
      
      console.log(`${this.constructor.name}.save is returning saved instance`); // log return
      return Promise.resolve(this); // return saved instance
    } catch (error) {
      console.log(`${this.constructor.name}.save error ${error.message}`); // log error
      return Promise.reject(error);
    }
  }
  
  /**
   * Remove instance from collection
   * 
   * This method removes the current instance from the in-memory collection,
   * mimicking Mongoose's remove() or deleteOne() functionality.
   * 
   * @returns {Promise<Object>} Promise resolving to the removed instance
   */
  remove() {
    console.log(`${this.constructor.name}.remove is running with instance`); // log removal
    
    try {
      const result = this.constructor.findOneAndDelete({ _id: this._id });
      console.log(`${this.constructor.name}.remove is returning removed instance`); // log return
      return result;
    } catch (error) {
      console.log(`${this.constructor.name}.remove error ${error.message}`); // log error
      return Promise.reject(error);
    }
  }
  
  /**
   * Get or initialize collection for this model
   * 
   * Static method that returns the in-memory collection for this model type.
   * Creates the collection if it doesn't exist.
   * 
   * @returns {Array} In-memory collection array
   */
  static getCollection() {
    const modelName = this.name;
    if (!mockCollections.has(modelName)) {
      mockCollections.set(modelName, []);
    }
    return mockCollections.get(modelName);
  }
  
  /**
   * Clear all data from collection
   * 
   * Static method to reset the collection to empty state.
   * Useful for test cleanup and isolation.
   * 
   * @returns {void}
   */
  static clearCollection() {
    console.log(`${this.name}.clearCollection is running with none`); // log clearing
    
    try {
      mockCollections.set(this.name, []);
      console.log(`${this.name}.clearCollection completed`); // log completion
    } catch (error) {
      console.log(`${this.name}.clearCollection error ${error.message}`); // log error
      throw error;
    }
  }
  
  /**
   * Generate unique ID for documents
   * 
   * Creates MongoDB-style ObjectId strings for document identification.
   * Uses timestamp and random components for uniqueness.
   * 
   * @returns {string} Generated ObjectId-style string
   */
  static generateId() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const random = Math.random().toString(16).substr(2, 16);
    return timestamp + random.padEnd(16, '0');
  }
  
  /**
   * Find one document matching query
   * 
   * Static method that finds the first document matching the provided query.
   * Supports simple field matching and returns null if no match found.
   * 
   * @param {Object} query - Query object with field/value pairs
   * @returns {Promise<Object|null>} Promise resolving to found document or null
   */
  static findOne(query = {}) {
    console.log(`${this.name}.findOne is running with ${JSON.stringify(query)}`); // log query
    
    try {
      const collection = this.getCollection();
      const result = collection.find(doc => this.matchesQuery(doc, query)) || null;
      
      console.log(`${this.name}.findOne is returning ${result ? 'document' : 'null'}`); // log result
      return Promise.resolve(result);
    } catch (error) {
      console.log(`${this.name}.findOne error ${error.message}`); // log error
      return Promise.reject(error);
    }
  }
  
  /**
   * Find one document and delete it
   * 
   * Static method that finds and removes the first document matching the query.
   * Returns the deleted document or null if no match found.
   * 
   * @param {Object} query - Query object with field/value pairs
   * @returns {Promise<Object|null>} Promise resolving to deleted document or null
   */
  static findOneAndDelete(query = {}) {
    console.log(`${this.name}.findOneAndDelete is running with ${JSON.stringify(query)}`); // log operation
    
    try {
      const collection = this.getCollection();
      const index = collection.findIndex(doc => this.matchesQuery(doc, query));
      
      if (index === -1) {
        console.log(`${this.name}.findOneAndDelete is returning null`); // log no match
        return Promise.resolve(null);
      }
      
      const deleted = collection.splice(index, 1)[0]; // remove and return document
      console.log(`${this.name}.findOneAndDelete is returning deleted document`); // log success
      return Promise.resolve(deleted);
    } catch (error) {
      console.log(`${this.name}.findOneAndDelete error ${error.message}`); // log error
      return Promise.reject(error);
    }
  }
  
  /**
   * Find one document and update it
   * 
   * Static method that finds and updates the first document matching the query.
   * Applies the update object to the found document and returns the updated version.
   * 
   * @param {Object} query - Query object with field/value pairs
   * @param {Object} update - Update object with new field values
   * @param {Object} options - Update options (upsert, new, etc.)
   * @returns {Promise<Object|null>} Promise resolving to updated document or null
   */
  static findOneAndUpdate(query = {}, update = {}, options = {}) {
    console.log(`${this.name}.findOneAndUpdate is running with query and update`); // log operation
    
    try {
      const collection = this.getCollection();
      const document = collection.find(doc => this.matchesQuery(doc, query));
      
      if (!document) {
        if (options.upsert) {
          // Create new document if upsert is true
          const newDoc = new this({ ...query, ...update });
          return newDoc.save();
        }
        console.log(`${this.name}.findOneAndUpdate is returning null`); // log no match
        return Promise.resolve(null);
      }
      
      // Apply updates to found document
      Object.assign(document, update);
      
      console.log(`${this.name}.findOneAndUpdate is returning updated document`); // log success
      return Promise.resolve(document);
    } catch (error) {
      console.log(`${this.name}.findOneAndUpdate error ${error.message}`); // log error
      return Promise.reject(error);
    }
  }
  
  /**
   * Find multiple documents with query chaining
   * 
   * Static method that returns a query chain object supporting common
   * Mongoose query operations like sort, skip, limit, and lean.
   * 
   * @param {Object} query - Query object with field/value pairs
   * @returns {Object} Query chain object with chaining methods
   */
  static find(query = {}) {
    console.log(`${this.name}.find is running with ${JSON.stringify(query)}`); // log query
    
    try {
      const collection = this.getCollection();
      const filtered = collection.filter(doc => this.matchesQuery(doc, query));
      
      // Create chainable query object
      const chain = {
        data: filtered,
        _sortOptions: null,
        _skipCount: 0,
        _limitCount: null
      };
      
      // Sort method for query chaining
      chain.sort = (sortOptions) => {
        console.log(`${this.name}.find.sort is running with options`); // log sort
        chain._sortOptions = sortOptions;
        
        if (sortOptions && chain.data.length > 0) {
          chain.data.sort((a, b) => {
            for (const [field, direction] of Object.entries(sortOptions)) {
              const aVal = a[field];
              const bVal = b[field];
              const modifier = direction === -1 || direction === 'desc' ? -1 : 1;
              
              if (aVal < bVal) return -1 * modifier;
              if (aVal > bVal) return 1 * modifier;
            }
            return 0;
          });
        }
        
        return chain; // return chain for continued chaining
      };
      
      // Skip method for pagination
      chain.skip = (count) => {
        console.log(`${this.name}.find.skip is running with ${count}`); // log skip
        chain._skipCount = count;
        return chain; // return chain for continued chaining
      };
      
      // Limit method for pagination
      chain.limit = (count) => {
        console.log(`${this.name}.find.limit is running with ${count}`); // log limit
        chain._limitCount = count;
        return chain; // return chain for continued chaining
      };
      
      // Lean method to return plain objects
      chain.lean = () => {
        console.log(`${this.name}.find.lean is running with none`); // log lean
        
        let result = chain.data;
        
        // Apply skip if specified
        if (chain._skipCount > 0) {
          result = result.slice(chain._skipCount);
        }
        
        // Apply limit if specified
        if (chain._limitCount !== null) {
          result = result.slice(0, chain._limitCount);
        }
        
        console.log(`${this.name}.find.lean is returning ${result.length} documents`); // log result
        return Promise.resolve(result);
      };
      
      // Exec method to execute query
      chain.exec = () => {
        return chain.lean();
      };
      
      console.log(`${this.name}.find is returning query chain`); // log chain creation
      return chain;
    } catch (error) {
      console.log(`${this.name}.find error ${error.message}`); // log error
      throw error;
    }
  }
  
  /**
   * Delete multiple documents matching query
   * 
   * Static method that removes all documents matching the provided query.
   * Returns information about the deletion operation.
   * 
   * @param {Object} query - Query object with field/value pairs
   * @returns {Promise<Object>} Promise resolving to deletion result
   */
  static deleteMany(query = {}) {
    console.log(`${this.name}.deleteMany is running with ${JSON.stringify(query)}`); // log operation
    
    try {
      const collection = this.getCollection();
      const initialCount = collection.length;
      
      // Filter out matching documents
      const remaining = collection.filter(doc => !this.matchesQuery(doc, query));
      const deletedCount = initialCount - remaining.length;
      
      // Update collection
      mockCollections.set(this.name, remaining);
      
      const result = { deletedCount, acknowledged: true };
      console.log(`${this.name}.deleteMany is returning result with ${deletedCount} deleted`); // log result
      return Promise.resolve(result);
    } catch (error) {
      console.log(`${this.name}.deleteMany error ${error.message}`); // log error
      return Promise.reject(error);
    }
  }
  
  /**
   * Update multiple documents matching query
   * 
   * Static method that updates all documents matching the provided query
   * with the specified update operations.
   * 
   * @param {Object} query - Query object with field/value pairs
   * @param {Object} update - Update object with new field values
   * @returns {Promise<Object>} Promise resolving to update result
   */
  static updateMany(query = {}, update = {}) {
    console.log(`${this.name}.updateMany is running with query and update`); // log operation
    
    try {
      const collection = this.getCollection();
      let modifiedCount = 0;
      
      collection.forEach(doc => {
        if (this.matchesQuery(doc, query)) {
          Object.assign(doc, update);
          modifiedCount++;
        }
      });
      
      const result = { modifiedCount, acknowledged: true };
      console.log(`${this.name}.updateMany is returning result with ${modifiedCount} modified`); // log result
      return Promise.resolve(result);
    } catch (error) {
      console.log(`${this.name}.updateMany error ${error.message}`); // log error
      return Promise.reject(error);
    }
  }
  
  /**
   * Count documents matching query
   * 
   * Static method that returns the count of documents matching the query.
   * 
   * @param {Object} query - Query object with field/value pairs
   * @returns {Promise<number>} Promise resolving to document count
   */
  static countDocuments(query = {}) {
    console.log(`${this.name}.countDocuments is running with ${JSON.stringify(query)}`); // log count
    
    try {
      const collection = this.getCollection();
      const count = collection.filter(doc => this.matchesQuery(doc, query)).length;
      
      console.log(`${this.name}.countDocuments is returning ${count}`); // log result
      return Promise.resolve(count);
    } catch (error) {
      console.log(`${this.name}.countDocuments error ${error.message}`); // log error
      return Promise.reject(error);
    }
  }
  
  /**
   * Check if document matches query
   * 
   * Helper method that determines if a document matches the provided query.
   * Supports simple field equality matching.
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

// Pre-built model classes for common use cases

const mockApiKeys = []; //(in-memory apiKey collection)
class ApiKey extends BaseMockModel { //(minimal stand-in for mongoose model)
  constructor(data) {
    super(data);
    // Set default values specific to ApiKey
    if (!this.createdAt) this.createdAt = new Date();
    if (!this.isActive) this.isActive = true;
  }
  
  // Override getCollection to use legacy array for backwards compatibility
  static getCollection() {
    return mockApiKeys;
  }
  
  // Legacy methods for backward compatibility with existing code
  static findOne(query) {
    console.log(`ApiKey.findOne is running with ${JSON.stringify(query)}`); // log query
    const result = mockApiKeys.find(k => k.key === query.key) || null;
    console.log(`ApiKey.findOne is returning ${result ? 'key' : 'null'}`); // log result
    return Promise.resolve(result);
  }
  
  static findOneAndDelete(query) { //(remove matching key)
    console.log(`ApiKey.findOneAndDelete is running with ${JSON.stringify(query)}`); // log operation
    const idx = mockApiKeys.findIndex(k => k.key === query.key);
    if (idx === -1) {
      console.log(`ApiKey.findOneAndDelete is returning null`); // log no match
      return Promise.resolve(null);
    }
    const deleted = mockApiKeys.splice(idx, 1)[0];
    console.log(`ApiKey.findOneAndDelete is returning deleted key`); // log success
    return Promise.resolve(deleted);
  }
  
  static findOneAndUpdate(query, update) {
    console.log(`ApiKey.findOneAndUpdate is running with query and update`); // log operation
    const key = mockApiKeys.find(k => k.key === query.key);
    if (!key) {
      console.log(`ApiKey.findOneAndUpdate is returning null`); // log no match
      return Promise.resolve(null);
    }
    Object.assign(key, update); //(apply updates)
    console.log(`ApiKey.findOneAndUpdate is returning updated key`); // log success
    return Promise.resolve(key);
  }
  
  static find() { //(provide find interface for admin tests)
    console.log(`ApiKey.find is running with none`); // log find
    const chain = { data: mockApiKeys }; //(return all keys)
    chain.sort = () => chain; //(noop sort chain)
    chain.lean = () => {
      console.log(`ApiKey.find.lean is returning ${chain.data.length} keys`); // log result
      return Promise.resolve(chain.data);
    };
    return chain; //(return chain object)
  }
}

const mockLogs = []; //(array of logged proxy calls)
class ApiLog extends BaseMockModel { //(simplified logging model)
  constructor(data) {
    super(data);
    // Set default values specific to ApiLog
    if (!this.timestamp) this.timestamp = new Date();
    if (!this.level) this.level = 'info';
  }
  
  // Override getCollection to use legacy array for backwards compatibility
  static getCollection() {
    return mockLogs;
  }
  
  // Legacy methods for backward compatibility
  static find(query = {}) { //(support chained query helpers)
    console.log(`ApiLog.find is running with ${JSON.stringify(query)}`); // log query
    const filtered = query.allowedApi 
      ? mockLogs.filter(l => l.allowedApi === query.allowedApi) 
      : mockLogs; //(filter logs by service)
    
    const chain = { data: filtered };
    chain.sort = () => chain; //(noop for sort)
    chain.skip = () => chain; //(noop for skip)
    chain.limit = () => chain; //(noop for limit)
    chain.lean = () => {
      console.log(`ApiLog.find.lean is returning ${chain.data.length} logs`); // log result
      return Promise.resolve(chain.data);
    };
    return chain; //(return chain object)
  }
}

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
  console.log(`createMockModel is running with ${modelName}`); // log creation
  
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
    
    console.log(`createMockModel is returning ${modelName} class`); // log return
    return ModelClass;
  } catch (error) {
    console.log(`createMockModel error ${error.message}`); // log error
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
  console.log(`resetAllCollections is running with none`); // log reset
  
  try {
    // Clear the global collections map
    mockCollections.clear();
    
    // Clear legacy arrays for backward compatibility
    mockApiKeys.length = 0;
    mockLogs.length = 0;
    
    console.log(`resetAllCollections completed`); // log completion
  } catch (error) {
    console.log(`resetAllCollections error ${error.message}`); // log error
    throw error;
  }
}

// Export mock model utilities at bottom per requirements
module.exports = {
  BaseMockModel, // base class for creating custom mock models
  ApiKey, // pre-built API key model for common testing scenarios
  ApiLog, // pre-built API log model for logging tests
  createMockModel, // factory function for creating custom model classes
  resetAllCollections, // utility for cleaning up test data
  mockApiKeys, // direct access to API keys array for legacy compatibility
  mockLogs // direct access to logs array for legacy compatibility
};