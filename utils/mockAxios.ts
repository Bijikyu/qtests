/**
 * Mock Axios Utilities
 * Re-exported from unified HTTP mock implementation
 * Provides backward compatibility while eliminating code duplication
 * 
 * @deprecated Consider importing from '../lib/unifiedHttpMock' directly
 */

// Import the unified implementation
import {
  createMockHttpClient as unifiedCreateMockHttpClient,
  createUserConfigurableMock as unifiedCreateUserConfigurableMock,
  createSimpleMockClient as unifiedCreateSimpleMockClient,
  MockHttpClientConfig,
  MockHttpClient,
  UserMockAxios,
  AxiosResponse,
  MockResponse,
  createMockResponse,
  createErrorResponse
} from '../lib/unifiedHttpMock.js';

// Import logging control utility for consistent framework behavior
import { setLogging } from '../lib/logUtils.js';
if (process.env.NODE_ENV !== 'test') setLogging(false);

// ==================== TYPE DEFINITIONS ====================

// Re-export types for backward compatibility
export type MockAxiosConfig = MockHttpClientConfig;
export interface UserMockAxiosType extends UserMockAxios {}
export interface MockAxiosResponseType extends AxiosResponse {}
export interface MockResponseType extends MockResponse {}

// ==================== LEGACY COMPATIBILITY FUNCTIONS ====================

/**
 * Create a standardized mock response object
 * Maintains axios response structure for compatibility
 * 
 * @param data - Response data payload
 * @param status - HTTP status code
 * @returns Axios-compatible response object
 */
function createStandardMockResponse(data: any = {}, status: number = 200): AxiosResponse {
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
 * Create a mock axios instance with default configuration
 * 
 * @param options - Mock configuration options
 * @returns Mock axios instance with HTTP methods
 */
export function createMockAxios(options: MockAxiosConfig = {}): MockHttpClient {
  console.log(`createMockAxios is running with ${JSON.stringify(options)}`);
  
  const mockClient = unifiedCreateMockHttpClient({
    strategy: 'legacy-axios',
    ...options
  });
  
  console.log(`createMockAxios is returning mock client`);
  return mockClient;
}

/**
 * Creates a user-configurable mock axios with response mapping
 * 
 * @returns Mock axios with programmable responses
 */
export function createUserMockAxios(): UserMockAxios {
  console.log(`createUserMockAxios is running with none`);
  
  const mockClient = unifiedCreateUserConfigurableMock({
    'http://a': { data: { mock: true }, status: 200, reject: false }
  });
  
  console.log(`createUserMockAxios is returning mock client`);
  return mockClient;
}

/**
 * Create a simple mock axios instance with default configuration
 * 
 * @returns Basic mock axios instance
 */
export function createSimpleMockAxios(): MockHttpClient {
  console.log(`createSimpleMockAxios is running with none`);
  
  const mockClient = unifiedCreateSimpleMockClient();
  
  console.log(`createSimpleMockAxios is returning mock client`);
  return mockClient;
}

// ==================== MSW-BASED MOCKING (LEGACY) ====================

/**
 * Create a mock HTTP server with specified handlers using MSW
 * 
 * @param handlers - Array of request/response handlers
 * @returns Mock server instance
 */
export function createMockServer(handlers: Array<{
  request: { method: string; url: string | RegExp };
  response: MockResponse;
}>): any {
  // This would need to be imported from the unified implementation
  // For now, return a placeholder to maintain compatibility
  console.warn('createMockServer is deprecated. Use unifiedHttpMock.createCustomServer instead.');
  return { server: null, cleanup: () => {} };
}

// ==================== EXPORTS ====================

// Export all utilities for backward compatibility
export const mockAxios = {
  createMockAxios,
  createUserMockAxios,
  createSimpleMockAxios,
  createMockServer,
  createStandardMockResponse,
  createMockResponse,
  createErrorResponse
};

// Re-export unified functions for direct access
export {
  unifiedCreateMockHttpClient as createMockHttpClient,
  unifiedCreateUserConfigurableMock as createUserConfigurableMock,
  unifiedCreateSimpleMockClient as createSimpleMockClient
};

// Default export for backward compatibility
export default createMockAxios;