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
    const handlers = [
      http.get('*', () => this.createMSWResponse()),
      http.post('*', () => this.createMSWResponse()),
      http.put('*', () => this.createMSWResponse()),
      http.delete('*', () => this.createMSWResponse()),
      http.patch('*', () => this.createMSWResponse()),
    ];

    this.server = setupServer(...handlers);
    this.server.listen();
  }

  private createMSWResponse(): any {
    if (this.responseDelay > 0) {
      return (_req: any, _res: any, ctx: any) => ctx.delay(this.responseDelay);
    }
    
    return (_req: any, _res: any, ctx: any) => ctx.json(this.defaultResponse);
  }

  async get(_url: string, _config?: any): Promise<MockResponse> {
    // MSW handles this automatically
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  async post(_url: string, _data?: any, _config?: any): Promise<MockResponse> {
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  async put(_url: string, _data?: any, _config?: any): Promise<MockResponse> {
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  async delete(_url: string, _config?: any): Promise<MockResponse> {
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  async patch(_url: string, _data?: any, _config?: any): Promise<MockResponse> {
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  async request(_config?: any): Promise<MockResponse> {
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  cleanup(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}

export { ModernMSWMock };