/**
 * Enhanced HTTP Mock System with MSW Integration
 * 
 * Enhanced MSW-centric mocking system while maintaining qtests-specific
 * module resolution and backward compatibility.
 */

import { http, HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';
import { MockHttpClient, MockHttpClientConfig, MockResponse } from './mockTypes.js';
import { createAxiosStyleResponse } from './mockUtilities.js';
import qerrors from '../qerrorsFallback.js';

/**
 * Enhanced MSW Mock with qtests-specific features
 */
class EnhancedMSWMock implements MockHttpClient {
  private server: ReturnType<typeof setupServer> | null = null;
  private handlers = new Map<string, any>();
  private defaultResponse: any;
  private defaultStatus: number;
  private responseDelay: number;
  private moduleResolutionEnabled: boolean;

  constructor(config: MockHttpClientConfig & { moduleResolutionEnabled?: boolean } = {}) {
    this.defaultResponse = config.defaultResponse || {};
    this.defaultStatus = config.defaultStatus || 200;
    this.responseDelay = config.responseDelay || 0;
    this.moduleResolutionEnabled = config.moduleResolutionEnabled !== false;
    this.setupServer();
  }

  private setupServer(): void {
    // Create comprehensive handlers for HTTP and GraphQL
    const handlers = [
      // HTTP methods
      http.get('*', ({ request, params, cookies }) => this.handleRequest('GET', request as Request, params, cookies)),
      http.post('*', ({ request, params, cookies }) => this.handleRequest('POST', request as Request, params, cookies)),
      http.put('*', ({ request, params, cookies }) => this.handleRequest('PUT', request as Request, params, cookies)),
      http.patch('*', ({ request, params, cookies }) => this.handleRequest('PATCH', request as Request, params, cookies)),
      http.delete('*', ({ request, params, cookies }) => this.handleRequest('DELETE', request as Request, params, cookies)),
      
      // GraphQL support
      graphql.query('*', ({ query, variables }) => this.handleGraphQLRequest('query', query, variables)),
      graphql.mutation('*', ({ query, variables }) => this.handleGraphQLRequest('mutation', query, variables)),
    ];

    // Setup MSW server with all handlers
    this.server = setupServer(...handlers);
    this.server.listen();

    console.log('🔧 Enhanced MSW Mock Server started with qtests module resolution');
  }

  private async handleRequest(method: string, request: Request, params: any, cookies: any): Promise<any> {
    try {
      const url = request.url.toString();
      console.log(`📥 ${method} ${url}`);

      // Handle qtests-specific module resolution
      if (this.moduleResolutionEnabled && this.isModuleRequest(url)) {
        return this.handleModuleResolution(url);
      }

      // Check for custom handlers
      const customHandler = this.handlers.get(`${method}:${url}`);
      if (customHandler) {
        return customHandler(request, params, cookies);
      }

      // Default response
      return this.createMSWResponse();
    } catch (error) {
      qerrors(error as Error, 'EnhancedMSWMock.handleRequest: request handling failed', {
        method,
        url: request.url
      });
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  private async handleGraphQLRequest(operationType: string, query: any, variables: any): Promise<any> {
    try {
      console.log(`📥 GraphQL ${operationType}`);

      // Check for GraphQL handlers
      const handlerKey = `graphql:${operationType}`;
      const handler = this.handlers.get(handlerKey);
      
      if (handler) {
        return handler(query, variables);
      }

      // Default GraphQL response
      return HttpResponse.json({
        data: {},
        errors: null
      });
    } catch (error) {
      qerrors(error as Error, 'EnhancedMSWMock.handleGraphQLRequest: GraphQL handling failed', {
        operationType,
        query: typeof query === 'string' ? query.substring(0, 100) : 'non-string query'
      });
      return HttpResponse.json({
        data: null,
        errors: [{ message: 'Internal server error' }]
      }, { status: 500 });
    }
  }

  private isModuleRequest(url: string): boolean {
    // Check if this is a qtests module resolution request
    return url.includes('/node_modules/') || 
           url.includes('axios') || 
           url.includes('winston') ||
           url.includes('fs-extra');
  }

  private handleModuleResolution(url: string): any {
    console.log(`🔧 Module resolution for: ${url}`);
    
    // Return mock module response
    if (url.includes('axios')) {
      return HttpResponse.json({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      });
    }
    
    if (url.includes('winston')) {
      return HttpResponse.json({
        level: 'info',
        message: 'Mock winston response',
        timestamp: new Date().toISOString()
      });
    }

    // Default module response
    return HttpResponse.json({ module: 'mocked' });
  }

  private createMSWResponse(): any {
    const responseData = this.defaultResponse;
    
    if (this.responseDelay > 0) {
      // Return handler that applies delay
      return () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(HttpResponse.json(responseData, { status: this.defaultStatus }));
          }, this.responseDelay);
        });
      };
    }

    return HttpResponse.json(responseData, { status: this.defaultStatus });
  }

  // HTTP method implementations
  async get(url: string, config: any = {}): Promise<MockResponse> {
    console.log(`📤 GET ${url}`);
    return createAxiosStyleResponse({}, this.defaultStatus, 'OK');
  }

  async post(url: string, data: any = {}, config: any = {}): Promise<MockResponse> {
    console.log(`📤 POST ${url}`, data);
    return createAxiosStyleResponse(data, this.defaultStatus, 'OK');
  }

  async put(url: string, data: any = {}, config: any = {}): Promise<MockResponse> {
    console.log(`📤 PUT ${url}`, data);
    return createAxiosStyleResponse(data, this.defaultStatus, 'OK');
  }

  async patch(url: string, data: any = {}, config: any = {}): Promise<MockResponse> {
    console.log(`📤 PATCH ${url}`, data);
    return createAxiosStyleResponse(data, this.defaultStatus, 'OK');
  }

  async delete(url: string, config: any = {}): Promise<MockResponse> {
    console.log(`📤 DELETE ${url}`);
    return createAxiosStyleResponse({}, this.defaultStatus, 'OK');
  }

  // Implement request method for MockHttpClient interface
  async request(config: any): Promise<MockResponse> {
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url;
    const data = config.data;

    console.log(`📤 ${method} ${url}`, data);

    switch (method) {
      case 'GET':
        return this.get(url, config);
      case 'POST':
        return this.post(url, data, config);
      case 'PUT':
        return this.put(url, data, config);
      case 'PATCH':
        return this.patch(url, data, config);
      case 'DELETE':
        return this.delete(url, config);
      default:
        return createAxiosStyleResponse(data, this.defaultStatus, 'OK');
    }
  }

  // Cleanup method for MSW
  cleanup(): void {
    this.stop();
  }

  // Custom handler management
  addCustomHandler(method: string, url: string, handler: Function): void {
    const key = `${method.toUpperCase()}:${url}`;
    this.handlers.set(key, handler);
    console.log(`🔧 Added custom handler for ${key}`);
  }

  removeCustomHandler(method: string, url: string): void {
    const key = `${method.toUpperCase()}:${url}`;
    this.handlers.delete(key);
    console.log(`🗑️ Removed custom handler for ${key}`);
  }

  // GraphQL handler management
  addGraphQLHandler(operationType: 'query' | 'mutation', handler: Function): void {
    const key = `graphql:${operationType}`;
    this.handlers.set(key, handler);
    console.log(`🔧 Added GraphQL handler for ${key}`);
  }

  removeGraphQLHandler(operationType: 'query' | 'mutation'): void {
    const key = `graphql:${operationType}`;
    this.handlers.delete(key);
    console.log(`🗑️ Removed GraphQL handler for ${key}`);
  }

  // Configuration methods
  setDefaultResponse(response: any, status: number = 200): void {
    this.defaultResponse = response;
    this.defaultStatus = status;
  }

  setResponseDelay(delay: number): void {
    this.responseDelay = delay;
  }

  enableModuleResolution(enabled: boolean): void {
    this.moduleResolutionEnabled = enabled;
    console.log(`🔧 Module resolution ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Lifecycle management
  start(): void {
    if (this.server) {
      this.server.listen();
      console.log('🚀 Enhanced MSW Mock Server started');
    }
  }

  stop(): void {
    if (this.server) {
      this.server.close();
      console.log('🛑 Enhanced MSW Mock Server stopped');
    }
  }

  reset(): void {
    this.handlers.clear();
    console.log('🔄 Enhanced MSW Mock handlers reset');
  }

  // Get server instance for advanced usage
  getServerInstance(): ReturnType<typeof setupServer> | null {
    return this.server;
  }

  // Get current handlers
  getHandlers(): Map<string, any> {
    return new Map(this.handlers);
  }

  // Mock statistics and debugging
  getMockInfo(): {
    handlersCount: number;
    moduleResolutionEnabled: boolean;
    defaultStatus: number;
    responseDelay: number;
  } {
    return {
      handlersCount: this.handlers.size,
      moduleResolutionEnabled: this.moduleResolutionEnabled,
      defaultStatus: this.defaultStatus,
      responseDelay: this.responseDelay
    };
  }
}

/**
 * Factory function to create enhanced MSW mock
 * @param config - Mock configuration
 * @returns Enhanced MSW mock instance
 */
export function createEnhancedMSWMock(
  config: MockHttpClientConfig & { moduleResolutionEnabled?: boolean } = {}
): EnhancedMSWMock {
  return new EnhancedMSWMock(config);
}

/**
 * Quick setup function for common qtests scenarios
 */
export function setupQtestsMock(): EnhancedMSWMock {
  const mock = new EnhancedMSWMock({
    defaultResponse: { data: 'mocked' },
    defaultStatus: 200,
    responseDelay: 0,
    moduleResolutionEnabled: true
  });

  // Add common qtests handlers
  mock.addCustomHandler('GET', '*/api/test', () => {
    return HttpResponse.json({ message: 'qtests mock working' });
  });

  mock.addCustomHandler('POST', '*/api/log', async ({ request }: { request: Request }) => {
    const body = await request.json();
    console.log('📝 Log request:', body);
    return HttpResponse.json({ success: true });
  });

  return mock;
}

/**
 * Enhanced mock factory with MSW as primary backend
 */
export function createMockHttpClient(
  config: MockHttpClientConfig & { moduleResolutionEnabled?: boolean } = {}
): MockHttpClient {
  return createEnhancedMSWMock(config);
}

// Export MSW utilities for direct use
export { http, HttpResponse, graphql, setupServer };

// Export enhanced mock as default
export default EnhancedMSWMock;