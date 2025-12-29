/**
 * MSW-based Modern Mock Implementation
 */

import { http } from 'msw';
import { setupServer } from 'msw/node';
import { MockHttpClient, MockHttpClientConfig, MockResponse } from './mockTypes.js';
import { createAxiosStyleResponse } from './mockUtilities.js';

/**
 * MSW-based modern mock implementation
 * Uses service worker for request interception
 */
class ModernMSWMock implements MockHttpClient {
  private server: ReturnType<typeof setupServer> | null = null;
  private defaultResponse: any;
  private defaultStatus: number;
  private responseDelay: number;

  constructor(config: MockHttpClientConfig = {}) {
    this.defaultResponse = config.defaultResponse || {};
    this.defaultStatus = config.defaultStatus || 200;
    this.responseDelay = config.responseDelay || 0;
    this.setupServer();
  }

  private setupServer(): void {
    // Create handlers for all HTTP methods using wildcard URL matching
    // This allows the mock to intercept any HTTP request regardless of method or URL
    const handlers = [
      http.get('*', () => this.createMSWResponse()),
      http.post('*', () => this.createMSWResponse()),
      http.put('*', () => this.createMSWResponse()),
      http.delete('*', () => this.createMSWResponse()),
      http.patch('*', () => this.createMSWResponse()),
    ];

    // Setup MSW server with all handlers and start listening
    // MSW uses service worker API to intercept requests at the network level
    this.server = setupServer(...handlers);
    this.server.listen();
  }

  private createMSWResponse(): any {
    // Return different response handlers based on configuration
    // This allows for optional response delay simulation
    if (this.responseDelay > 0) {
      // Return handler that applies delay before responding
      // Useful for testing loading states and timeout scenarios
      return (_req: any, _res: any, ctx: any) => ctx.delay(this.responseDelay);
    }
    
    // Return handler that immediately responds with default JSON data
    // Most common scenario for fast, predictable mocking
    return (_req: any, _res: any, ctx: any) => ctx.json(this.defaultResponse);
  }

  async get(_url: string, _config?: any): Promise<MockResponse> {
    // MSW handles request interception automatically at the network level
    // These methods exist for API compatibility but don't do actual work
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  async post(_url: string, _data?: any, _config?: any): Promise<MockResponse> {
    // All HTTP methods return the same response because MSW handles method-specific routing
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  async put(_url: string, _data?: any, _config?: any): Promise<MockResponse> {
    // Method-specific implementations could be added here if needed for different behaviors
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  async delete(_url: string, _config?: any): Promise<MockResponse> {
    // Maintains consistent interface across all HTTP methods
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  async patch(_url: string, _data?: any, _config?: any): Promise<MockResponse> {
    // All methods delegate to MSW's network-level interception
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  async request(_config?: any): Promise<MockResponse> {
    // Generic request method for axios compatibility
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  cleanup(): void {
    // Properly cleanup MSW server to prevent memory leaks
    // Essential for test isolation and preventing cross-test interference
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}

export { ModernMSWMock };