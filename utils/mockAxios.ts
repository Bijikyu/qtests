/**
 * Consolidated Mock HTTP Client Utilities
 * Provides comprehensive HTTP mocking capabilities for testing
 * Consolidates functionality from mockAxios.ts and mockAxiosModern.ts
 * Eliminates ~80% code duplication while preserving all features
 * 
 * Design philosophy:
 * - Multiple mocking strategies for different testing needs
 * - Simple factory mocks for quick test setup
 * - MSW-based mocks for realistic network interception
 * - Backward compatibility with existing test code
 * - Progressive migration path from simple to advanced mocking
 */

// Import MSW for advanced mocking capabilities
import { http } from 'msw';
import { setupServer } from 'msw/node';

// Import logging control utility for consistent framework behavior
import { setLogging } from '../lib/logUtils.js';
if (process.env.NODE_ENV !== 'test') setLogging(false);

// ==================== INTERFACE DEFINITIONS ====================

/**
 * Configuration options for simple mock axios behavior
 */
interface MockAxiosConfig {
  defaultResponse?: any;
  defaultStatus?: number;
  simulateErrors?: boolean;
}

/**
 * Axios-compatible response structure
 */
interface MockAxiosResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, any>;
  config: Record<string, any>;
  request: Record<string, any>;
}

/**
 * Mock axios interface with HTTP methods
 */
interface MockAxios {
  get(url: string, config?: any): Promise<MockAxiosResponse>;
  post(url: string, data?: any, config?: any): Promise<MockAxiosResponse>;
  put(url: string, data?: any, config?: any): Promise<MockAxiosResponse>;
  delete(url: string, config?: any): Promise<MockAxiosResponse>;
  patch(url: string, data?: any, config?: any): Promise<MockAxiosResponse>;
  request(config?: any): Promise<MockAxiosResponse>;
}

/**
 * User-configurable mock axios with response mapping
 */
interface UserMockAxios {
  (config: { url: string; [key: string]: any }): Promise<MockAxiosResponse>;
  __set: (url: string, data: any, status?: number, reject?: boolean) => void;
}

/**
 * HTTP Response interface for MSW-based mocking
 */
interface MockResponse {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  data?: any;
  delay?: number; // Response delay in milliseconds
}

/**
 * Request matcher interface for MSW handlers
 */
interface RequestMatcher {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string | RegExp;
  headers?: Record<string, string>;
  body?: any;
}

// ==================== SIMPLE MOCK AXIOS IMPLEMENTATION ====================

/**
 * Create a standardized mock response object
 * Maintains axios response structure for compatibility
 * 
 * @param data - Response data payload
 * @param status - HTTP status code
 * @returns Axios-compatible response object
 */
function createStandardMockResponse(data: any = {}, status: number = 200): MockAxiosResponse {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config: {},
    request: {}
  };
}

/**
 * Create a mock axios instance with simulated HTTP methods
 * 
 * This factory function creates an axios-compatible object that provides
 * the same interface as real axios but returns simulated responses instead
 * of making actual HTTP requests.
 * 
 * @param options - Configuration options for mock behavior
 * @returns Mock axios instance with HTTP methods
 */
export function createMockAxios(options: MockAxiosConfig = {}): MockAxios {
  console.log(`createMockAxios is running with ${JSON.stringify(options)}`);

  try {
    const {
      defaultResponse = {},
      defaultStatus = 200,
      simulateErrors = false
    } = options;

    const mockAxios: MockAxios = {
      async get(url: string, _config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.get is running with ${url}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createStandardMockResponse(defaultResponse, defaultStatus);
        console.log(`mockAxios.get is returning ${JSON.stringify(response)}`);
        return response;
      },

      async post(url: string, _data: any = {}, _config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.post is running with ${url}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createStandardMockResponse(defaultResponse, defaultStatus);
        console.log(`mockAxios.post is returning ${JSON.stringify(response)}`);
        return response;
      },

      async put(url: string, _data: any = {}, _config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.put is running with ${url}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createStandardMockResponse(defaultResponse, defaultStatus);
        console.log(`mockAxios.put is returning ${JSON.stringify(response)}`);
        return response;
      },

      async delete(url: string, _config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.delete is running with ${url}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createStandardMockResponse(defaultResponse, defaultStatus);
        console.log(`mockAxios.delete is returning ${JSON.stringify(response)}`);
        return response;
      },

      async patch(url: string, _data: any = {}, _config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.patch is running with ${url}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createStandardMockResponse(defaultResponse, defaultStatus);
        console.log(`mockAxios.patch is returning ${JSON.stringify(response)}`);
        return response;
      },

      async request(config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.request is running with ${JSON.stringify(config)}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createStandardMockResponse(defaultResponse, defaultStatus);
        console.log(`mockAxios.request is returning ${JSON.stringify(response)}`);
        return response;
      }
    };

    console.log(`createMockAxios is returning ${mockAxios}`);
    return mockAxios;

  } catch (error: any) {
    console.log(`createMockAxios error: ${error.message}`);
    throw error;
  }
}

/**
 * Creates a user-configurable mock axios with response mapping
 * 
 * @returns Mock axios with programmable responses
 */
export function createUserMockAxios(): UserMockAxios {
  console.log(`createUserMockAxios is running with none`);
  
  try {
    const responses = new Map<string, { data: any; status: number; reject: boolean }>();
    responses.set('http://a', { data: { mock: true }, status: 200, reject: false });
    
    function mockAxios(config: { url: string; [key: string]: any }): Promise<MockAxiosResponse> {
      console.log(`mockAxios is running with ${JSON.stringify(config)}`);
      
      try {
        const mock = responses.get(config.url);
        if (mock) {
          const result: MockAxiosResponse = { 
            status: mock.status, 
            data: mock.data,
            statusText: mock.status === 200 ? 'OK' : 'Error',
            headers: {},
            config: {},
            request: {}
          };
          console.log(`mockAxios is returning ${JSON.stringify(result)}`);
          if (mock.reject) return Promise.reject({ response: result });
          return Promise.resolve(result);
        }
        
        const error = { response: { status: 500, data: 'error' } };
        console.log(`mockAxios is returning ${JSON.stringify(error)}`);
        return Promise.reject(error);
      } catch (error: any) {
        console.log(`mockAxios error ${error.message}`);
        return Promise.reject(error);
      }
    }
    
    const axiosWrapper = mockAxios as UserMockAxios;
    axiosWrapper.__set = (url: string, data: any, status: number = 200, reject: boolean = false) => { 
      responses.set(url, { data, status, reject }); 
    };
    
    console.log(`createUserMockAxios is returning axiosWrapper`);
    return axiosWrapper;
  } catch (error: any) {
    console.log(`createUserMockAxios error ${error.message}`);
    throw error;
  }
}

/**
 * Create a simple mock axios instance with default configuration
 * 
 * @returns Basic mock axios instance
 */
export function createSimpleMockAxios(): MockAxios {
  console.log(`createSimpleMockAxios is running with none`);
  
  try {
    const mockAxios = createMockAxios();
    console.log(`createSimpleMockAxios is returning ${mockAxios}`);
    return mockAxios;
  } catch (error: any) {
    console.log(`createSimpleMockAxios error: ${error.message}`);
    throw error;
  }
}

// ==================== MSW-BASED MOCKING ====================

/**
 * Global mock server instance for request interception
 */
let mockServer: ReturnType<typeof setupServer> | null = null;

/**
 * Create a mock HTTP server with specified handlers using MSW
 * 
 * @param handlers - Array of request/response handlers
 * @returns Mock server instance
 */
export function createMockServer(handlers: Array<{
  request: RequestMatcher;
  response: MockResponse;
}>): ReturnType<typeof setupServer> {
  const mswHandlers = handlers.map(({ request, response }) => {
    return http[request.method](request.url, (req, res, ctx) => {
      // Apply response delay if specified
      if (response.delay) {
        return res(ctx.delay(response.delay));
      }
      
      // Set custom headers if provided
      const headers = response.headers || {};
      
      // Return the mock response
      return res(
        ctx.status(response.status || 200, response.statusText),
        ctx.json(response.data || {}),
        ...Object.entries(headers).map(([key, value]) => ctx.set(key, value))
      );
    });
  });

  return setupServer(...mswHandlers);
}

/**
 * Start the mock server to begin intercepting requests
 * 
 * @param server - Mock server instance to start
 */
export function startMockServer(server: ReturnType<typeof setupServer>): void {
  server.listen();
  mockServer = server;
}

/**
 * Stop the mock server and restore normal network behavior
 */
export function stopMockServer(): void {
  if (mockServer) {
    mockServer.close();
    mockServer = null;
  }
}

/**
 * Create a simple mock response factory
 * 
 * @param data - Response data to return
 * @param status - HTTP status code (default: 200)
 * @returns Mock response configuration
 */
export function createMockResponse(data: any, status: number = 200): MockResponse {
  return {
    status,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

/**
 * Create an error response factory
 * 
 * @param status - HTTP error status code
 * @param message - Error message
 * @returns Mock error response configuration
 */
export function createErrorResponse(status: number, message: string): MockResponse {
  return {
    status,
    data: { error: message, status },
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

// ==================== HIGH-LEVEL MOCK FACTORIES ====================

/**
 * Mock HTTP client factory with predefined responses using MSW
 * 
 * @param presetData - Default response data for all requests
 * @returns Mock HTTP client with MSW integration
 */
export function createMockHttpClient(presetData: any = {}) {
  const handlers = [
    {
      request: { method: 'GET' as const, url: '*' },
      response: createMockResponse(presetData),
    },
    {
      request: { method: 'POST' as const, url: '*' },
      response: createMockResponse(presetData),
    },
    {
      request: { method: 'PUT' as const, url: '*' },
      response: createMockResponse(presetData),
    },
    {
      request: { method: 'DELETE' as const, url: '*' },
      response: createMockResponse(presetData),
    },
    {
      request: { method: 'PATCH' as const, url: '*' },
      response: createMockResponse(presetData),
    },
  ];

  const server = createMockServer(handlers);
  startMockServer(server);

  return {
    server,
    cleanup: () => stopMockServer(),
  };
}

/**
 * Mock HTTP client with custom response patterns
 * 
 * @param responsePatterns - Array of custom response patterns
 * @returns Mock HTTP client with custom handlers
 */
export function createCustomMockHttpClient(responsePatterns: Array<{
  method: string;
  url: string | RegExp;
  response: MockResponse;
}>) {
  const handlers = responsePatterns.map(pattern => ({
    request: {
      method: pattern.method.toUpperCase() as any,
      url: pattern.url,
    },
    response: pattern.response,
  }));

  const server = createMockServer(handlers);
  startMockServer(server);

  return {
    server,
    cleanup: () => stopMockServer(),
  };
}

// ==================== LEGACY COMPATIBILITY ====================

/**
 * Legacy axios mock factory for backward compatibility
 * 
 * @deprecated Use MSW-based mocking instead
 * @param presetData - Default response data
 * @returns Mock axios instance
 */
export function createAxiosMock(presetData: any = {}) {
  console.log('[DEPRECATED] Using legacy axios mock. Consider migrating to MSW-based mocking.');
  
  const mockAxios = {
    get: jest.fn().mockResolvedValue({ data: presetData }),
    post: jest.fn().mockResolvedValue({ data: presetData }),
    put: jest.fn().mockResolvedValue({ data: presetData }),
    delete: jest.fn().mockResolvedValue({ data: presetData }),
    patch: jest.fn().mockResolvedValue({ data: presetData }),
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };
  
  return mockAxios;
}

// ==================== EXPORTS ====================

// Export all mock utilities for easy importing
export const mockHttp = {
  // Simple mocking (from mockAxios.ts)
  createMockAxios,
  createUserMockAxios,
  createSimpleMockAxios,
  
  // MSW-based mocking (from mockAxiosModern.ts)
  createMockServer,
  startMockServer,
  stopMockServer,
  createMockResponse: createMockResponse, // Renamed to avoid conflict
  createErrorResponse,
  createMockHttpClient,
  createCustomMockHttpClient,
  
  // Legacy support
  createAxiosMock,
};

// Default export includes all functionality
export default mockHttp;