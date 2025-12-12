/**
 * Modern HTTP Mocking with MSW - TypeScript Implementation
 * 
 * This module provides HTTP mocking capabilities using MSW (Mock Service Worker),
 * which offers a modern, framework-agnostic approach to API mocking. MSW intercepts
 * requests at the network level, making it compatible with any HTTP client.
 * 
 * Design philosophy:
 * - Service Worker-based request interception for maximum compatibility
 * - Framework-agnostic approach works with any HTTP client
 * - RESTful API simulation with realistic response handling
 * - Request/response matching with flexible patterns
 * 
 * Key benefits over custom axios mocking:
 * 1. Framework Agnostic - Works with fetch, axios, XMLHttpRequest, etc.
 * 2. Real Network Interception - Tests use actual HTTP client code paths
 * 3. Browser Compatibility - Same mocking works in Node.js and browsers
 * 4. Advanced Matching - URL patterns, headers, methods, body matching
 * 5. Response Streaming - Supports streaming responses and chunked data
 * 
 * Migration from custom axios mocking:
 * - More realistic testing environment
 * - Better support for complex HTTP scenarios
 * - Industry-standard solution with active maintenance
 * - Extensive plugin ecosystem for advanced use cases
 */

import { http } from 'msw';
import { setupServer } from 'msw/node';

// Import logging control utility for consistent framework behavior
import { setLogging } from '../lib/logUtils.js';
if (process.env.NODE_ENV !== 'test') setLogging(false);

/**
 * Mock HTTP server instance for request interception
 * This server intercepts all HTTP requests and provides controlled responses
 */
let mockServer: ReturnType<typeof setupServer> | null = null;

/**
 * HTTP Response interface for defining mock responses
 */
interface MockResponse {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  data?: any;
  delay?: number; // Response delay in milliseconds
}

/**
 * Request matcher interface for defining which requests to mock
 */
interface RequestMatcher {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string | RegExp;
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Create a mock HTTP server with the specified handlers
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

/**
 * Legacy axios mock factory for backward compatibility
 * 
 * @deprecated Use MSW-based mocking instead
 * @param presetData - Default response data
 * @returns Mock axios instance
 */
export function createAxiosMock(presetData: any = {}) {
  console.log('[DEPRECATED] Using legacy axios mock. Consider migrating to MSW-based mocking.');
  
  // Create a simple mock that returns preset data
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

/**
 * Mock HTTP client factory with predefined responses
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
  ];

  const server = createMockServer(handlers);
  startMockServer(server);

  return {
    server,
    // Return a cleanup function
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

// Export the modern MSW-based implementation as default
export default {
  createMockServer,
  startMockServer,
  stopMockServer,
  createMockResponse,
  createErrorResponse,
  createMockHttpClient,
  createCustomMockHttpClient,
  // Legacy support
  createAxiosMock,
};