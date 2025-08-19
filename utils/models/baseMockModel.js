/**
 * Base Mock Model Class
 * 
 * This class focuses solely on providing the foundation for Mongoose-compatible mock models.
 * It handles core model functionality like save, remove, and collection management.
 */

// Global registry for all mock model collections
const mockCollections = new Map();

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
    const modelName = this.name || 'Anonymous';
    
    if (!mockCollections.has(modelName)) {
      mockCollections.set(modelName, []);
    }
    
    return mockCollections.get(modelName);
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
   * @returns {Promise<Array>} Promise resolving to array of matching documents
   */
  static find(query = {}) {
    console.log(`${this.name}.find is running with ${JSON.stringify(query)}`);
    
    try {
      const collection = this.getCollection();
      const results = collection.filter(doc => this.matchesQuery(doc, query));
      
      console.log(`${this.name}.find is returning ${results.length} documents`);
      return Promise.resolve(results);
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
   * @param {Object} options - Update options
   * @returns {Promise<Object|null>} Promise resolving to updated document or null
   */
  static findOneAndUpdate(query, update, options = {}) {
    console.log(`${this.name}.findOneAndUpdate is running with query and update`);
    
    try {
      const collection = this.getCollection();
      const doc = collection.find(d => this.matchesQuery(d, query));
      
      if (!doc) {
        console.log(`${this.name}.findOneAndUpdate is returning null`);
        return Promise.resolve(null);
      }
      
      Object.assign(doc, update);
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