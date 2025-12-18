/**
 * Unified HTTP Client Mock Factory
 * Consolidates mock HTTP implementations from mockAxios.ts and mockAxiosModern.ts
 * Provides adapter pattern for different mocking strategies
 */

import { http } from 'msw';
import { setupServer } from 'msw/node';

// Import logging control utility for consistent framework behavior
import { setLogging } from '../lib/logUtils.js';
if (process.env.NODE_ENV !== 'test') setLogging(false);

/**
 * Mock strategy types for different HTTP mocking approaches
 */
export type MockStrategy = 'legacy-axios' | 'msw-modern' | 'simple-axios';

/**
 * Base mock response interface
 */
export interface MockResponse {
  status?: number;
  statusText?: string;
  headers?: Record<string, any>;
  data?: any;
  delay?: number; // Response delay in milliseconds
}

/**
 * Axios-compatible response interface
 */
export interface AxiosResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, any>;
  config: Record<string, any>;
  request: Record<string, any>;
}

/**
 * Request matcher interface for defining which requests to mock
 */
export interface RequestMatcher {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string | RegExp;
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Configuration options for mock HTTP client factory
 */
export interface MockHttpClientConfig {
  strategy?: MockStrategy;
  defaultResponse?: any;
  defaultStatus?: number;
  simulateErrors?: boolean;
  responseDelay?: number;
  presetData?: Record<string, { data: any; status: number; reject?: boolean }>;
}

/**
 * Base interface for mock HTTP clients
 */
export interface MockHttpClient {
  get(url: string, config?: any): Promise<MockResponse | AxiosResponse>;
  post(url: string, data?: any, config?: any): Promise<MockResponse | AxiosResponse>;
  put(url: string, data?: any, config?: any): Promise<MockResponse | AxiosResponse>;
  delete(url: string, config?: any): Promise<MockResponse | AxiosResponse>;
  request(config?: any): Promise<MockResponse | AxiosResponse>;
  cleanup?(): void; // For MSW-based implementations
}

/**
 * Extended interface for user-configurable axios mocks
 */
export interface UserMockAxios extends MockHttpClient {
  __set?(url: string, data: any, status?: number, reject?: boolean): void;
}

/**
 * Factory configuration for creating mock HTTP clients
 */
export interface MockClientFactory {
  create(config?: MockHttpClientConfig): MockHttpClient;
  createUserMock?(presetData?: Record<string, any>): UserMockAxios;
  createSimple?(defaultData?: any): MockHttpClient;
}

/**
 * Creates a standardized axios-compatible response object
 */
function createAxiosStyleResponse(
  data: any = {},
  status: number = 200,
  statusText: string = 'OK'
): AxiosResponse {
  return {
    data,
    status,
    statusText,
    headers: {},
    config: {},
    request: {}
  };
}

/**
 * Legacy axios mock implementation
 * Simulates axios without actual network requests
 */
class LegacyAxiosMock implements MockHttpClient {
  private defaultResponse: any;
  private defaultStatus: number;
  private simulateErrors: boolean;
  protected responses: Map<string, { data: any; status: number; reject: boolean }>;

  constructor(config: MockHttpClientConfig = {}) {
    this.defaultResponse = config.defaultResponse || {};
    this.defaultStatus = config.defaultStatus || 200;
    this.simulateErrors = config.simulateErrors || false;
    this.responses = new Map();
    
    // Convert presetData to Map entries
    if (config.presetData) {
      Object.entries(config.presetData).forEach(([url, response]) => {
        this.responses.set(url, {
          data: response.data,
          status: response.status,
          reject: response.reject || false
        });
      });
    }
    
    // Add default preset if none provided
    if (this.responses.size === 0) {
      this.responses.set('http://a', { data: { mock: true }, status: 200, reject: false });
    }
  }

  async get(url: string, _config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.get: ${url}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.get returning: ${JSON.stringify(response)}`);
    return response;
  }

  async post(url: string, _data: any = {}, _config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.post: ${url}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.post returning: ${JSON.stringify(response)}`);
    return response;
  }

  async put(url: string, _data: any = {}, _config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.put: ${url}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.put returning: ${JSON.stringify(response)}`);
    return response;
  }

  async delete(url: string, _config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.delete: ${url}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.delete returning: ${JSON.stringify(response)}`);
    return response;
  }

  async request(config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.request: ${JSON.stringify(config)}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.request returning: ${JSON.stringify(response)}`);
    return response;
  }
}

/**
 * User-configurable axios mock implementation
 * Allows setting custom responses per URL
 */
class UserConfigurableAxiosMock extends LegacyAxiosMock implements UserMockAxios {
  __set(url: string, data: any, status: number = 200, reject: boolean = false): void {
    this.responses.set(url, { data, status, reject });
  }

  async get(url: string, _config: any = {}): Promise<AxiosResponse> {
    console.log(`UserConfigurableAxiosMock.get: ${url}`);
    const mock = this.responses.get(url);
    
    if (mock) {
      const response = createAxiosStyleResponse(mock.data, mock.status);
      if (mock.reject) {
        return Promise.reject({ response });
      }
      return response;
    }

    // Return error for unknown URLs
    const error = { response: { status: 500, data: 'error' } };
    return Promise.reject(error);
  }
}

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
    const { json, delay } = require('msw');
    
    if (this.responseDelay > 0) {
      return delay(this.responseDelay);
    }
    
    return json(this.defaultResponse);
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

/**
 * Main HTTP client mock factory
 * Provides unified interface for creating different types of mock HTTP clients
 */
export function createMockHttpClient(config: MockHttpClientConfig = {}): MockHttpClient {
  const strategy = config.strategy || 'legacy-axios';
  
  console.log(`Creating mock HTTP client with strategy: ${strategy}`);
  
  try {
    switch (strategy) {
      case 'msw-modern':
        return new ModernMSWMock(config);
      
      case 'simple-axios':
        return new LegacyAxiosMock({ ...config, simulateErrors: false });
      
      case 'legacy-axios':
      default:
        return new LegacyAxiosMock(config);
    }
  } catch (error: any) {
    console.log(`createMockHttpClient error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a user-configurable mock axios instance
 * Allows setting custom responses per URL with __set method
 */
export function createUserConfigurableMock(presetData: Record<string, any> = {}): UserMockAxios {
  console.log(`Creating user-configurable mock with preset data`);
  
  try {
    const config: MockHttpClientConfig = {
      presetData,
      strategy: 'legacy-axios'
    };
    
    return new UserConfigurableAxiosMock(config);
  } catch (error: any) {
    console.log(`createUserConfigurableMock error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a simple mock HTTP client for basic usage
 * Provides default behavior without error simulation
 */
export function createSimpleMockClient(defaultData: any = {}): MockHttpClient {
  console.log(`Creating simple mock client`);
  
  try {
    const config: MockHttpClientConfig = {
      defaultResponse: defaultData,
      strategy: 'simple-axios'
    };
    
    return createMockHttpClient(config);
  } catch (error: any) {
    console.log(`createSimpleMockClient error: ${error.message}`);
    throw error;
  }
}

/**
 * Create a mock server with custom response patterns
 * For advanced MSW-based mocking scenarios
 */
export function createCustomMockServer(responsePatterns: Array<{
  method: string;
  url: string | RegExp;
  response: MockResponse;
}>): { server: ReturnType<typeof setupServer>; cleanup: () => void } {
  const handlers = responsePatterns.map(pattern => ({
    request: {
      method: pattern.method.toUpperCase() as any,
      url: pattern.url,
    },
    response: pattern.response,
  }));

  const mswHandlers = handlers.map(({ request, response }) => {
    return http[request.method](request.url, (_req: any, _res: any, ctx: any) => {
      if (response.delay) {
        return _res(ctx.delay(response.delay));
      }
      
      return _res(
        ctx.status(response.status || 200, response.statusText),
        ctx.json(response.data || {}),
        ...Object.entries(response.headers || {}).map(([key, value]) => ctx.set(key, value))
      );
    });
  });

  const server = setupServer(...mswHandlers);
  server.listen();

  return {
    server,
    cleanup: () => server.close()
  };
}

// Export the unified factory interface
export const httpClientMockFactory = {
  create: createMockHttpClient,
  createUserMock: createUserConfigurableMock,
  createSimple: createSimpleMockClient,
  createCustomServer: createCustomMockServer
};

// Export default factory for easier importing
export default httpClientMockFactory;