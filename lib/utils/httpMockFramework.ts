/**
 * Shared HTTP Mock Framework
 * 
 * Provides common HTTP mocking patterns and utilities to reduce
 * duplication across MSW-based mock implementations.
 */

import { http, HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';
import { MockHttpClient, MockHttpClientConfig, MockResponse } from '../httpMock/mockTypes.js';
import { createAxiosStyleResponse } from '../httpMock/mockUtilities.js';
import { handleError } from '../utils/errorHandling.js';
import { measureAsyncTime } from '../utils/timingUtils.js';

// Common mock configuration interface
export interface SharedMockConfig extends MockHttpClientConfig {
  moduleResolutionEnabled?: boolean;
  enableGraphQL?: boolean;
  logRequests?: boolean;
  customHandlers?: Map<string, Function>;
  presetResponses?: Map<string, any>;
  defaultResponse?: any;
  defaultStatus?: number;
  responseDelay?: number;
}

// Request handler interface
export interface RequestHandler {
  method: string;
  url: string;
  handler: Function;
}

// GraphQL handler interface
export interface GraphQLHandler {
  operationType: 'query' | 'mutation';
  handler: Function;
}

/**
 * Base HTTP Mock class with shared functionality
 */
export abstract class BaseHttpMock implements MockHttpClient {
  protected server: ReturnType<typeof setupServer> | null = null;
  protected defaultResponse: any;
  protected defaultStatus: number;
  protected responseDelay: number;
  protected config: SharedMockConfig;

  constructor(config: SharedMockConfig = {}) {
    this.config = {
      moduleResolutionEnabled: true,
      enableGraphQL: false,
      logRequests: true,
      ...config
    };
    
    this.defaultResponse = config.defaultResponse || {};
    this.defaultStatus = config.defaultStatus || 200;
    this.responseDelay = config.responseDelay || 0;
    
    this.setupServer();
  }

  protected abstract setupServer(): void;

  protected abstract handleRequest(method: string, request: any): Promise<any>;

  protected abstract handleGraphQLRequest(operationType: string, query: any, variables: any): Promise<any>;

  protected isModuleRequest(url: string): boolean {
    // Standard module detection logic
    return url.includes('/node_modules/') || 
           url.includes('axios') || 
           url.includes('winston') ||
           url.includes('fs-extra');
  }

  protected handleModuleResolution(url: string): any {
    const mockResponses = {
      'axios': {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      },
      'winston': {
        level: 'info',
        message: 'Mock winston response',
        timestamp: new Date().toISOString()
      },
      'default': { module: 'mocked' }
    };

    // Find appropriate mock response
    for (const [key, response] of Object.entries(mockResponses)) {
      if (url.includes(key)) {
        return response;
      }
    }
    
    return mockResponses.default;
  }

  protected createResponse(data: any, status?: number): any {
    const actualStatus = status || this.defaultStatus;
    
    if (this.responseDelay > 0) {
      return async () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(HttpResponse.json(data, { status: actualStatus }));
          }, this.responseDelay);
        });
      };
    }

    return HttpResponse.json(data, { status: actualStatus });
  }

  protected logRequest(method: string, url: string, data?: any): void {
    if (this.config.logRequests) {
      const dataInfo = data ? ` with data: ${JSON.stringify(data).substring(0, 100)}` : '';
      console.log(`📤 ${method} ${url}${dataInfo}`);
    }
  }

  protected async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T | null> {
    return measureAsyncTime(
      async () => {
        try {
          return await operation();
        } catch (error) {
          handleError(error, context, {
            logToConsole: true
          });
          throw error;
        }
      },
      context
    ).then(({ result }) => result);
  }

  // Common HTTP method implementations
  async get(url: string, config: any = {}): Promise<MockResponse> {
    return this.executeWithErrorHandling(
      () => this.handleRequest('GET', { url, method: 'GET', config }),
      'httpMock.get'
    ).then(result => result || createAxiosStyleResponse(this.defaultResponse, this.defaultStatus));
  }

  async post(url: string, data: any = {}, config: any = {}): Promise<MockResponse> {
    this.logRequest('POST', url, data);
    return this.executeWithErrorHandling(
      () => this.handleRequest('POST', { url, method: 'POST', data, config }),
      'httpMock.post'
    ).then(result => result || createAxiosStyleResponse(data, this.defaultStatus));
  }

  async put(url: string, data: any = {}, config: any = {}): Promise<MockResponse> {
    this.logRequest('PUT', url, data);
    return this.executeWithErrorHandling(
      () => this.handleRequest('PUT', { url, method: 'PUT', data, config }),
      'httpMock.put'
    ).then(result => result || createAxiosStyleResponse(data, this.defaultStatus));
  }

  async patch(url: string, data: any = {}, config: any = {}): Promise<MockResponse> {
    this.logRequest('PATCH', url, data);
    return this.executeWithErrorHandling(
      () => this.handleRequest('PATCH', { url, method: 'PATCH', data, config }),
      'httpMock.patch'
    ).then(result => result || createAxiosStyleResponse(data, this.defaultStatus));
  }

  async delete(url: string, config: any = {}): Promise<MockResponse> {
    this.logRequest('DELETE', url);
    return this.executeWithErrorHandling(
      () => this.handleRequest('DELETE', { url, method: 'DELETE', config }),
      'httpMock.delete'
    ).then(result => result || createAxiosStyleResponse({}, this.defaultStatus));
  }

  async request(config: any): Promise<MockResponse> {
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url;
    const data = config.data;

    return this.executeWithErrorHandling(
      () => this.handleRequest(method, { url, method, data, config }),
      'httpMock.request'
    ).then(result => result || createAxiosStyleResponse(data, this.defaultStatus));
  }

  // Lifecycle methods
  cleanup(): void {
    this.stop();
  }

  start(): void {
    if (this.server) {
      this.server.listen();
    }
  }

  stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  reset(): void {
    // Implementation specific to subclass
  }
}

/**
 * MSW-based Mock Implementation
 */
export class MSWMock extends BaseHttpMock {
  private customHandlers: Map<string, Function> = new Map();

  protected setupServer(): void {
    const handlers = [];

    // Add HTTP method handlers
    if (this.config.enableGraphQL) {
      handlers.push(
        http.get('*', ({ request }) => this.handleRequest('GET', request)),
        http.post('*', ({ request }) => this.handleRequest('POST', request)),
        http.put('*', ({ request }) => this.handleRequest('PUT', request)),
        http.patch('*', ({ request }) => this.handleRequest('PATCH', request)),
        http.delete('*', ({ request }) => this.handleRequest('DELETE', request)),
        
        // GraphQL handlers
        graphql.query('*', ({ query, variables }) => this.handleGraphQLRequest('query', query, variables)),
        graphql.mutation('*', ({ query, variables }) => this.handleGraphQLRequest('mutation', query, variables))
      );
    } else {
      handlers.push(
        http.get('*', ({ request }) => this.handleRequest('GET', request)),
        http.post('*', ({ request }) => this.handleRequest('POST', request)),
        http.put('*', ({ request }) => this.handleRequest('PUT', request)),
        http.patch('*', ({ request }) => this.handleRequest('PATCH', request)),
        http.delete('*', ({ request }) => this.handleRequest('DELETE', request))
      );
    }

    this.server = setupServer(...handlers);
    this.server.listen();

    console.log('🔧 MSW Mock Server started');
  }

  protected async handleRequest(method: string, request: any): Promise<any> {
    const url = request.url.toString();

    // Handle module resolution
    if (this.config.moduleResolutionEnabled && this.isModuleRequest(url)) {
      return this.handleModuleResolution(url);
    }

    // Check custom handlers
    const handlerKey = `${method}:${url}`;
    const customHandler = this.customHandlers.get(handlerKey);
    if (customHandler) {
      return customHandler(request);
    }

    // Check preset responses
    if (this.config.presetResponses?.has(url)) {
      return this.createResponse(this.config.presetResponses.get(url));
    }

    return this.createResponse(this.defaultResponse);
  }

  protected async handleGraphQLRequest(operationType: string, query: any, variables: any): Promise<any> {
    // Check for GraphQL handlers
    const handlerKey = `graphql:${operationType}`;
    const handler = this.customHandlers.get(handlerKey);
    
    if (handler) {
      return handler(query, variables);
    }

    // Default GraphQL response
    return HttpResponse.json({
      data: {},
      errors: null
    });
  }

  // Custom handler management
  addCustomHandler(method: string, url: string, handler: Function): void {
    const key = `${method.toUpperCase()}:${url}`;
    this.customHandlers.set(key, handler);
  }

  removeCustomHandler(method: string, url: string): void {
    const key = `${method.toUpperCase()}:${url}`;
    this.customHandlers.delete(key);
  }

  addGraphQLHandler(operationType: 'query' | 'mutation', handler: Function): void {
    const key = `graphql:${operationType}`;
    this.customHandlers.set(key, handler);
  }

  removeGraphQLHandler(operationType: 'query' | 'mutation'): void {
    const key = `graphql:${operationType}`;
    this.customHandlers.delete(key);
  }

  reset(): void {
    this.customHandlers.clear();
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
    this.config.moduleResolutionEnabled = enabled;
  }
}

// Mock factory functions
export function createMSWMock(config: SharedMockConfig = {}): MSWMock {
  return new MSWMock(config);
}

export function createQtestsMock(): MSWMock {
  return createMSWMock({
    defaultResponse: { data: 'mocked' },
    defaultStatus: 200,
    responseDelay: 0,
    moduleResolutionEnabled: true,
    logRequests: true
  });
}

export function createGraphQLMock(config: SharedMockConfig = {}): MSWMock {
  return createMSWMock({
    ...config,
    enableGraphQL: true
  });
}

// Utility functions for common mock patterns
export const mockUtils = {
  // Create mock with preset responses
  withPresetResponses: (responses: Record<string, any>) => createMSWMock({
    presetResponses: new Map(Object.entries(responses))
  }),

  // Create mock for specific endpoints
  forEndpoints: (endpoints: RequestHandler[]) => {
    const mock = createMSWMock();
    endpoints.forEach(({ method, url, handler }) => {
      mock.addCustomHandler(method, url, handler);
    });
    return mock;
  },

  // Create GraphQL mock
  forGraphQL: (handlers: GraphQLHandler[]) => {
    const mock = createGraphQLMock();
    handlers.forEach(({ operationType, handler }) => {
      mock.addGraphQLHandler(operationType, handler);
    });
    return mock;
  },

  // Create mock with delay
  withDelay: (delay: number, config: SharedMockConfig = {}) => createMSWMock({
    ...config,
    responseDelay: delay
  }),

  // Create silent mock
  silent: (config: SharedMockConfig = {}) => createMSWMock({
    ...config,
    logRequests: false
  })
};