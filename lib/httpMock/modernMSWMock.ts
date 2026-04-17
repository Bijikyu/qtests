/**
 * MSW-based Modern Mock Implementation
 */

import { createRequire } from 'module';
import { MockHttpClient, MockHttpClientConfig, MockResponse } from './mockTypes.js';
import { createAxiosStyleResponse } from './mockUtilities.js';

// Use globalThis.require (set by jest-require-polyfill) or fall back to createRequire
// This avoids static ESM imports of msw which break CJS require() in Jest
const _require: NodeRequire = (globalThis as any).require || createRequire(process.cwd() + '/package.json');

/**
 * MSW-based modern mock implementation
 * Uses service worker for request interception
 */
class ModernMSWMock implements MockHttpClient {
  private server: any | null = null;
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
    try {
      const { http } = _require('msw');
      const { setupServer } = _require('msw/node');

      const handlers = [
        http.get('*', () => this.createMSWResponse()),
        http.post('*', () => this.createMSWResponse()),
        http.put('*', () => this.createMSWResponse()),
        http.delete('*', () => this.createMSWResponse()),
        http.patch('*', () => this.createMSWResponse()),
      ];

      this.server = setupServer(...handlers);
      this.server.listen();
    } catch {
      // msw not available; continue without server interception
    }
  }

  private createMSWResponse(): any {
    if (this.responseDelay > 0) {
      return (_req: any, _res: any, ctx: any) => ctx.delay(this.responseDelay);
    }
    return (_req: any, _res: any, ctx: any) => ctx.json(this.defaultResponse);
  }

  async get(_url: string, _config?: any): Promise<MockResponse> {
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
