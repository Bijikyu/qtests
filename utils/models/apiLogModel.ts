/**
 * API Log Model - TypeScript Implementation
 * 
 * This class focuses solely on API log model functionality and behavior.
 * It extends BaseMockModel with logging-specific methods and properties.
 */

import { BaseMockModel } from './baseMockModel.js';

// Type definitions
interface ApiLogData {
  _id?: string;
  level?: string;
  message?: string;
  timestamp?: Date;
  allowedApi?: string;
  [key: string]: any;
}

interface LogQueryChain {
  data: any[];
  sort: () => LogQueryChain;
  skip: () => LogQueryChain;
  limit: () => LogQueryChain;
  lean: () => Promise<any[]>;
}

// Legacy array for backwards compatibility
const mockLogs: any[] = [];

/**
 * API Log Model Class
 * 
 * Provides Mongoose-compatible API log model for testing scenarios.
 * Includes logging-specific validation and query methods.
 */
class ApiLog extends BaseMockModel {
  public level?: string;
  public message?: string;
  public timestamp?: Date;
  public allowedApi?: string;

  constructor(data: ApiLogData = {}) {
    super(data);
    // Set default values specific to ApiLog
    if (!this.timestamp) this.timestamp = new Date();
    if (!this.level) this.level = 'info';
  }
  
  // Override getCollection to use legacy array for backwards compatibility
  static getCollection(): any[] {
    return mockLogs;
  }
  
  // Legacy methods for backward compatibility
  static find(query: { allowedApi?: string; [key: string]: any } = {}): LogQueryChain {
    console.log(`ApiLog.find is running with ${JSON.stringify(query)}`);
    const filtered = query.allowedApi 
      ? mockLogs.filter(l => l.allowedApi === query.allowedApi) 
      : mockLogs;
    
    const chain: LogQueryChain = { 
      data: filtered,
      sort: () => chain,
      skip: () => chain,
      limit: () => chain,
      lean: () => {
        console.log(`ApiLog.find.lean is returning ${chain.data.length} logs`);
        return Promise.resolve(chain.data);
      }
    };
    return chain;
  }
}

// Export using ES module syntax
export { ApiLog, mockLogs };