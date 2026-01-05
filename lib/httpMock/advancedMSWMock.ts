/**
 * MSW-based HTTP Mock Utilities
 * Modern replacement for legacy axios mocking with superior security and performance
 */

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { MockHttpClient, MockHttpClientConfig, MockResponse, UserMockAxios } from './mockTypes.js';
import { createAxiosStyleResponse } from './mockUtilities.js';
import qerrors from 'qerrors';

/**
 * MSW-based Advanced Mock Implementation
 * Provides user-configurable responses with MSW's superior architecture
 */
class AdvancedMSWMock implements MockHttpClient, UserMockAxios {
  private server: ReturnType<typeof setupServer> | null = null;
  private defaultResponse: any;
  private defaultStatus: number;
  private responseDelay: number;
  private customResponses: Map<string, any> = new Map();
  private responseHandlers: Map<string, Function> = new Map();

  constructor(config: MockHttpClientConfig = {}) {
    this.defaultResponse = config.defaultResponse || {};
    this.defaultStatus = config.defaultStatus || 200;
    this.responseDelay = config.responseDelay || 0;
    
    // Initialize with preset data if provided
    if (config.presetData) {
      Object.entries(config.presetData).forEach(([url, response]) => {
        this.customResponses.set(url, response);
      });
    }
    
    this.setupServer();
  }

  private setupServer(): void {
    // Create handlers that can handle custom responses
    const handlers = [
      http.get('*', (req) => this.handleRequest(req)),
      http.post('*', (req) => this.handleRequest(req)),
      http.put('*', (req) => this.handleRequest(req)),
      http.delete('*', (req) => this.handleRequest(req)),
      http.patch('*', (req) => this.handleRequest(req)),
    ];

    this.server = setupServer(...handlers);
    this.server.listen();
  }

  private async handleRequest(req: any): Promise<HttpResponse<any>> {
    const url = req.url.toString();
    const method = req.method.toLowerCase();
    
    // Check for custom response first
    if (this.customResponses.has(url)) {
      const response = this.customResponses.get(url);
      return HttpResponse.json(response, { status: this.defaultStatus });
    }
    
    // Check for custom handler
    const handlerKey = `${method}:${url}`;
    if (this.responseHandlers.has(handlerKey)) {
      const handler = this.responseHandlers.get(handlerKey);
      try {
        if (handler) {
          const result = await handler(req);
          return HttpResponse.json(result.data || result, { 
            status: result.status || this.defaultStatus 
          });
        }
      } catch (error: any) {
        qerrors(error, 'AdvancedMSWMock: custom handler failed', {
          url,
          method,
          handlerKey
        });
        return HttpResponse.json({ error: 'Handler failed' }, { status: 500 });
      }
    }
    
    // Return default response
    return HttpResponse.json(this.defaultResponse, { status: this.defaultStatus });
  }

  // User-configurable methods (compatible with legacy interface)
  __set(url: string, response: any): void {
    this.customResponses.set(url, response);
  }

  __reset(): void {
    this.customResponses.clear();
    this.responseHandlers.clear();
  }

  __get(url: string): any {
    return this.customResponses.get(url);
  }

  __setHandler(method: string, url: string, handler: Function): void {
    const handlerKey = `${method.toLowerCase()}:${url}`;
    this.responseHandlers.set(handlerKey, handler);
  }

  // Standard HTTP client methods
  async get(url: string, _config?: any): Promise<MockResponse> {
    const response = this.customResponses.get(url) || this.defaultResponse;
    return createAxiosStyleResponse(response, this.defaultStatus);
  }

  async post(url: string, data?: any, _config?: any): Promise<MockResponse> {
    const response = this.customResponses.get(url) || this.defaultResponse;
    return createAxiosStyleResponse(response, this.defaultStatus);
  }

  async put(url: string, data?: any, _config?: any): Promise<MockResponse> {
    const response = this.customResponses.get(url) || this.defaultResponse;
    return createAxiosStyleResponse(response, this.defaultStatus);
  }

  async delete(url: string, _config?: any): Promise<MockResponse> {
    const response = this.customResponses.get(url) || this.defaultResponse;
    return createAxiosStyleResponse(response, this.defaultStatus);
  }

  async patch(url: string, data?: any, _config?: any): Promise<MockResponse> {
    const response = this.customResponses.get(url) || this.defaultResponse;
    return createAxiosStyleResponse(response, this.defaultStatus);
  }

  async request(_config?: any): Promise<MockResponse> {
    return createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
  }

  cleanup(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    this.customResponses.clear();
    this.responseHandlers.clear();
  }
}

/**
 * Create an advanced MSW-based mock with user-configurable responses
 * Replaces the legacy UserConfigurableAxiosMock with superior MSW architecture
 */
export function createAdvancedMSWMock(config: MockHttpClientConfig = {}): AdvancedMSWMock {
  console.log('Creating advanced MSW mock with user-configurable responses');
  
  try {
    return new AdvancedMSWMock({
      ...config,
      strategy: 'msw-modern'
    });
  } catch (error: any) {
    qerrors(error, 'advancedMSWMock.createAdvancedMSWMock: creation failed', {
      hasConfig: Object.keys(config).length > 0,
      configKeys: Object.keys(config)
    });
    throw error;
  }
}

/**
 * Create a modern user-configurable mock using MSW
 * Drop-in replacement for createUserConfigurableMock with better security
 */
export function createModernUserConfigurableMock(presetData: Record<string, any> = {}): AdvancedMSWMock {
  console.log('Creating modern user-configurable MSW mock');
  
  try {
    const config: MockHttpClientConfig = {
      presetData,
      strategy: 'msw-modern'
    };
    
    return new AdvancedMSWMock(config);
  } catch (error: any) {
    qerrors(error, 'advancedMSWMock.createModernUserConfigurableMock: creation failed', {
      presetDataKeys: Object.keys(presetData),
      presetDataSize: JSON.stringify(presetData).length
    });
    throw error;
  }
}

export { AdvancedMSWMock };