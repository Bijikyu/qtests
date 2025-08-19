/**
 * API Log Model
 * 
 * This class focuses solely on API log model functionality and behavior.
 * It extends BaseMockModel with logging-specific methods and properties.
 */

const { BaseMockModel } = require('./baseMockModel');

// Legacy array for backwards compatibility
const mockLogs = [];

/**
 * API Log Model Class
 * 
 * Provides Mongoose-compatible API log model for testing scenarios.
 * Includes logging-specific validation and query methods.
 */
class ApiLog extends BaseMockModel {
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
  static find(query = {}) {
    console.log(`ApiLog.find is running with ${JSON.stringify(query)}`);
    const filtered = query.allowedApi 
      ? mockLogs.filter(l => l.allowedApi === query.allowedApi) 
      : mockLogs;
    
    const chain = { data: filtered };
    chain.sort = () => chain;
    chain.skip = () => chain;
    chain.limit = () => chain;
    chain.lean = () => {
      console.log(`ApiLog.find.lean is returning ${chain.data.length} logs`);
      return Promise.resolve(chain.data);
    };
    return chain;
  }
}

module.exports = {
  ApiLog,
  mockLogs
};