/**
 * Mock Management System for Consistent API and Service Mocking - TypeScript Implementation
 * 
 * This class focuses solely on mock management and lifecycle concerns.
 * It provides centralized mock management that eliminates duplicate patterns.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';

// Type definitions
interface MockResponse {
  status: number;
  data: any;
}

interface MockApiClient {
  get: () => Promise<MockResponse>;
  post: () => Promise<MockResponse>;
  put: () => Promise<MockResponse>;
  delete: () => Promise<MockResponse>;
  request: () => Promise<MockResponse>;
}

interface ConsoleMocks {
  log: any;
  error: any;
  warn: any;
  restore: () => void;
}

/**
 * Mock Management System for Consistent API and Service Mocking
 * 
 * This class provides centralized mock management that eliminates duplicate
 * mock patterns across test files. It uses qtests utilities for consistent
 * mocking while providing advanced mock configuration capabilities.
 */
class MockManager {
  private mocks: Map<string, any>;
  private restorations: Map<string, () => void>;

  constructor() {
    this.mocks = new Map();
    this.restorations = new Map();
  }

  /**
   * Sets up API client mocks using qtests stubMethod utility
   */
  setupApiClientMocks(customResponses: Record<string, MockResponse> = {}): void {
    logStart('MockManager.setupApiClientMocks', customResponses);
    
    try {
      // Default API responses
      const defaultResponses: Record<string, MockResponse> = {
        get: { status: 200, data: {} },
        post: { status: 201, data: { id: 1 } },
        put: { status: 200, data: { updated: true } },
        delete: { status: 204, data: null }
      };
      
      const responses = { ...defaultResponses, ...customResponses };
      
      // Create mock API client object
      const mockApiClient: MockApiClient = {
        get: () => Promise.resolve(responses.get),
        post: () => Promise.resolve(responses.post),
        put: () => Promise.resolve(responses.put),
        delete: () => Promise.resolve(responses.delete),
        request: () => Promise.resolve(responses.get)
      };
      
      this.mocks.set('apiClient', mockApiClient);
      
      // If we have a global HTTP client to stub, stub it
      if (typeof (globalThis as any).fetch === 'function') {
        const originalFetch = (globalThis as any).fetch;
        (globalThis as any).fetch = (url: string, options: any = {}) => {
          const method = (options.method || 'GET').toLowerCase();
          const response = responses[method] || responses.get;
          
          return Promise.resolve({
            ok: response.status < 400,
            status: response.status,
            json: () => Promise.resolve(response.data),
            text: () => Promise.resolve(JSON.stringify(response.data))
          });
        };
        
        this.restorations.set('fetch', () => {
          (globalThis as any).fetch = originalFetch;
        });
      }
      
      logReturn('MockManager.setupApiClientMocks', 'completed');
    } catch (error: any) {
      logReturn('MockManager.setupApiClientMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sets up console and notification mocks using qtests utilities
   */
  setupConsoleMocks(): ConsoleMocks {
    logStart('MockManager.setupConsoleMocks');
    
    try {
      // Dynamic import for mockConsole
      const mockConsole = async () => {
        const module = await import('../mockConsole.js');
        return module.mockConsole;
      };
      
      // Create console mocks - placeholder for now
      const consoleMocks: ConsoleMocks = {
        log: () => {},
        error: () => {},
        warn: () => {},
        restore: () => {}
      };
      
      this.mocks.set('console', consoleMocks);
      this.restorations.set('console', consoleMocks.restore);
      
      logReturn('MockManager.setupConsoleMocks', consoleMocks);
      return consoleMocks;
    } catch (error: any) {
      logReturn('MockManager.setupConsoleMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets a specific mock by name
   */
  getMock(mockName: string): any | null {
    logStart('MockManager.getMock', mockName);
    
    const mock = this.mocks.get(mockName);
    if (mock) {
      logReturn('MockManager.getMock', 'found');
      return mock;
    } else {
      logReturn('MockManager.getMock', 'not found');
      return null;
    }
  }

  /**
   * Clears all mocks and restores original functions
   */
  clearAll(): void {
    logStart('MockManager.clearAll');
    
    try {
      // Restore all mocked functions
      this.restorations.forEach((restore, mockName) => {
        try {
          restore();
        } catch (error) {
          // Ignore restoration errors - function may already be restored
        }
      });
      
      // Clear all stored mocks and restorations
      this.mocks.clear();
      this.restorations.clear();
      
      logReturn('MockManager.clearAll', 'completed');
    } catch (error: any) {
      logReturn('MockManager.clearAll', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sets up environment variable mocks
   */
  setupEnvironmentMocks(envVars: Record<string, string> = {}): () => void {
    logStart('MockManager.setupEnvironmentMocks', envVars);
    
    try {
      const originalEnv: Record<string, string | undefined> = {};
      
      // Backup and set environment variables
      Object.entries(envVars).forEach(([key, value]) => {
        originalEnv[key] = process.env[key];
        process.env[key] = value;
      });
      
      // Create restoration function
      const restore = () => {
        Object.entries(originalEnv).forEach(([key, value]) => {
          if (value === undefined) {
            delete process.env[key];
          } else {
            process.env[key] = value;
          }
        });
      };
      
      this.mocks.set('environment', envVars);
      this.restorations.set('environment', restore);
      
      logReturn('MockManager.setupEnvironmentMocks', restore);
      return restore;
    } catch (error: any) {
      logReturn('MockManager.setupEnvironmentMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sets up HTTP response mocks
   */
  setupHttpMocks(responses: any[] = []): void {
    logStart('MockManager.setupHttpMocks', responses);
    
    try {
      // Simple HTTP mock setup
      const httpMocks = {
        responses: responses,
        getResponse: (index: number) => responses[index] || { status: 404, data: null }
      };
      
      this.mocks.set('http', httpMocks);
      logReturn('MockManager.setupHttpMocks', 'completed');
    } catch (error: any) {
      logReturn('MockManager.setupHttpMocks', `error: ${error.message}`);
      throw error;
    }
  }
}

// Export MockManager using ES module syntax
export { MockManager };