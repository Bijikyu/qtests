/**
 * HTTP Client Mock Factory - Replaced with MSW (Mock Service Worker)
 * 
 * Migration Guide:
 * - Use MSW directly: setupServer() from msw/node
 * - MockResponse -> HttpResponse.json() from msw
 * - Better browser and Node.js compatibility
 * 
 * Benefits of MSW:
 * - Industry standard for API mocking
 * - Service Worker technology for realistic interception
 * - First-class request/response matching
 * - TypeScript support out of box
 */

import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

export type MockStrategy = 'legacy-axios' | 'msw-modern' | 'simple-axios' | 'user-configurable';

export interface MockHttpClientConfig {
  strategy?: MockStrategy;
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

export interface MockResponse {
  data?: any;
  status: number;
  headers?: Record<string, string>;
}

export interface AxiosResponse {
  data: any;
  status: number;
  headers: Record<string, string>;
  config?: any;
}

export interface UserMockAxios {
  get: (url: string) => Promise<any>;
  post: (url: string, data?: any) => Promise<any>;
  put: (url: string, data?: any) => Promise<any>;
  delete: (url: string) => Promise<any>;
  __set: (data: Record<string, any>) => void;
}

export interface MockHttpClient {
  get: (url: string) => Promise<any>;
  post: (url: string, data?: any) => Promise<any>;
  put: (url: string, data?: any) => Promise<any>;
  delete: (url: string) => Promise<any>;
}

// Import logging control utility for consistent framework behavior
import { setLogging } from '../lib/logUtils.js';
import { NODE_ENV } from '../config/localVars.js';
if (NODE_ENV !== 'test') setLogging(false);

/**
 * Create mock response using MSW HttpResponse
 */
export function createMockResponse(data: any, status: number = 200, headers?: Record<string, string>): HttpResponse<any> {
  return HttpResponse.json(data, { 
    status, 
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

/**
 * Create error response using MSW HttpResponse
 */
export function createErrorResponse(message: string, status: number = 400): HttpResponse<any> {
  return HttpResponse.json(
    { error: message }, 
    { status }
  );
}

/**
 * Main HTTP client mock factory
 */
export function createMockHttpClient(config: MockHttpClientConfig = {}): MockHttpClient {
  console.log(`Creating mock HTTP client with strategy: ${config.strategy || 'legacy-axios'}`);
  
  const mockData: Record<string, any> = {};
  const baseUrl = config.baseUrl || '';
  
  // Mock axios-like interface
  return {
    async get(url: string): Promise<any> {
      const fullUrl = baseUrl + url;
      return mockData[fullUrl] || { data: null, status: 404 };
    },
    
    async post(url: string, data?: any): Promise<any> {
      const fullUrl = baseUrl + url;
      return mockData[fullUrl] || { data: null, status: 404 };
    },
    
    async put(url: string, data?: any): Promise<any> {
      const fullUrl = baseUrl + url;
      return mockData[fullUrl] || { data: null, status: 404 };
    },
    
    async delete(url: string): Promise<any> {
      const fullUrl = baseUrl + url;
      return mockData[fullUrl] || { data: null, status: 404 };
    }
  };
}

/**
 * Create a user-configurable mock axios instance
 */
export function createUserConfigurableMock(presetData: Record<string, any> = {}): UserMockAxios {
  console.log(`Creating user-configurable mock with preset data`);
  
  const mockData: Record<string, any> = { ...presetData };
  
  return {
    __set(data: Record<string, any>): void {
      Object.assign(mockData, data);
    },
    
    async get(url: string): Promise<any> {
      return mockData[url] || { data: null };
    },
    
    async post(url: string, data?: any): Promise<any> {
      return mockData[url] || { data: null };
    },
    
    async put(url: string, data?: any): Promise<any> {
      return mockData[url] || { data: null };
    },
    
    async delete(url: string): Promise<any> {
      return mockData[url] || { data: null };
    }
  };
}

/**
 * Create a simple mock HTTP client for basic usage
 */
export function createSimpleMockClient(defaultData: any = {}): MockHttpClient {
  console.log(`Creating simple mock client`);
  
  return {
    async get(): Promise<any> {
      return { data: defaultData, status: 200 };
    },
    
    async post(): Promise<any> {
      return { data: defaultData, status: 200 };
    },
    
    async put(): Promise<any> {
      return { data: defaultData, status: 200 };
    },
    
    async delete(): Promise<any> {
      return { data: defaultData, status: 200 };
    }
  };
}

/**
 * Create a mock server with custom response patterns
 */
export function createCustomMockServer(responsePatterns: Array<{
  method: string;
  url: string | RegExp;
  response: MockResponse;
}>): { server: any; cleanup: () => void } {
  const handlers = responsePatterns.map(pattern => {
    const method = pattern.method.toLowerCase();
    
    if (method === 'get') {
      return http.get(
        pattern.url,
        () => HttpResponse.json(pattern.response.data || {}, { status: pattern.response.status })
      );
    } else if (method === 'post') {
      return http.post(
        pattern.url,
        () => HttpResponse.json(pattern.response.data || {}, { status: pattern.response.status })
      );
    } else if (method === 'put') {
      return http.put(
        pattern.url,
        () => HttpResponse.json(pattern.response.data || {}, { status: pattern.response.status })
      );
    } else if (method === 'delete') {
      return http.delete(
        pattern.url,
        () => HttpResponse.json(pattern.response.data || {}, { status: pattern.response.status })
      );
    }
    
    return null;
  }).filter(Boolean) as any[];

  const server = setupServer(...handlers);
  
  return {
    server,
    cleanup: () => server.close()
  };
}

// Export factory interface for backward compatibility
export const httpClientMockFactory = {
  create: createMockHttpClient,
  createUserMock: createUserConfigurableMock,
  createSimple: createSimpleMockClient,
  createCustomServer: createCustomMockServer,
  
  // Utility functions
  createMockResponse,
  createErrorResponse,
};

// Export default factory for easier importing
export default httpClientMockFactory;