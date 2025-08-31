/**
 * API Key Model - TypeScript Implementation
 * 
 * This class focuses solely on API key model functionality and behavior.
 * It extends BaseMockModel with API key-specific methods and properties.
 */

import { BaseMockModel } from './baseMockModel.js';

// Type definitions
interface ApiKeyData {
  _id?: string;
  key?: string;
  name?: string;
  userId?: string;
  isActive?: boolean;
  createdAt?: Date;
  [key: string]: any;
}

interface QueryChain {
  data: any[];
  sort: () => QueryChain;
  lean: () => Promise<any[]>;
  exec: () => Promise<any[]>;
}

// Legacy array for backwards compatibility
const mockApiKeys: any[] = [];

/**
 * API Key Model Class
 * 
 * Provides Mongoose-compatible API key model for testing scenarios.
 * Includes API key-specific validation and methods.
 */
class ApiKey extends BaseMockModel {
  public key?: string;
  public name?: string;
  public userId?: string;
  public isActive?: boolean;
  public createdAt?: Date;

  constructor(data: ApiKeyData = {}) {
    super(data);
    // Set default values specific to ApiKey
    if (!this.createdAt) this.createdAt = new Date();
    if (this.isActive === undefined) this.isActive = true;
  }
  
  // Override getCollection to use legacy array for backwards compatibility
  static getCollection(): any[] {
    return mockApiKeys;
  }
  
  // Legacy methods for backward compatibility with existing code
  static findOne(query: { key?: string; [key: string]: any }): Promise<any | null> {
    console.log(`ApiKey.findOne is running with ${JSON.stringify(query)}`);
    const result = mockApiKeys.find(k => k.key === query.key) || null;
    console.log(`ApiKey.findOne is returning ${result ? 'key' : 'null'}`);
    return Promise.resolve(result);
  }
  
  static findOneAndDelete(query: { key?: string; [key: string]: any }): Promise<any | null> {
    console.log(`ApiKey.findOneAndDelete is running with ${JSON.stringify(query)}`);
    const idx = mockApiKeys.findIndex(k => k.key === query.key);
    if (idx === -1) {
      console.log(`ApiKey.findOneAndDelete is returning null`);
      return Promise.resolve(null);
    }
    const deleted = mockApiKeys.splice(idx, 1)[0];
    console.log(`ApiKey.findOneAndDelete is returning deleted key`);
    return Promise.resolve(deleted);
  }
  
  static findOneAndUpdate(query: { key?: string; [key: string]: any }, update: any): Promise<any | null> {
    console.log(`ApiKey.findOneAndUpdate is running with query and update`);
    const key = mockApiKeys.find(k => k.key === query.key);
    if (!key) {
      console.log(`ApiKey.findOneAndUpdate is returning null`);
      return Promise.resolve(null);
    }
    Object.assign(key, update);
    console.log(`ApiKey.findOneAndUpdate is returning updated key`);
    return Promise.resolve(key);
  }
  
  static find(): QueryChain {
    console.log(`ApiKey.find is running with none`);
    const chain: QueryChain = { 
      data: mockApiKeys,
      sort: () => chain,
      lean: () => {
        console.log(`ApiKey.find.lean is returning ${chain.data.length} keys`);
        return Promise.resolve(chain.data);
      },
      exec: () => {
        console.log(`ApiKey.find.exec is returning ${chain.data.length} keys`);
        return Promise.resolve(chain.data);
      }
    };
    return chain;
  }
}

// Export using ES module syntax
export { ApiKey, mockApiKeys };