/**
 * HTTP Client Mock Factory
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
  createCustomMockServer as unifiedCreateCustomMockServer,
  MockHttpClientConfig,
  MockHttpClient,
  UserMockAxios,
  MockResponse,
  AxiosResponse,
  createMockResponse,
  createErrorResponse,
  unifiedHttpMock
} from '../lib/unifiedHttpMock.js';

// Import logging control utility for consistent framework behavior
import { setLogging } from '../lib/logUtils.js';
import { NODE_ENV } from '../config/localVars.js';
if (NODE_ENV !== 'test') setLogging(false);

// ==================== TYPE RE-EXPORTS ====================

export type MockStrategy = 'legacy-axios' | 'msw-modern' | 'simple-axios' | 'user-configurable';
export type { MockHttpClientConfig, MockHttpClient, UserMockAxios, MockResponse, AxiosResponse };

// ==================== FACTORY FUNCTIONS (RE-EXPORTS) ====================

/**
 * Main HTTP client mock factory
 * Provides unified interface for creating different types of mock HTTP clients
 */
export function createMockHttpClient(config: MockHttpClientConfig = {}): MockHttpClient {
  console.log(`Creating mock HTTP client with strategy: ${config.strategy || 'legacy-axios'}`);
  return unifiedCreateMockHttpClient(config);
}

/**
 * Create a user-configurable mock axios instance
 * Allows setting custom responses per URL with __set method
 */
export function createUserConfigurableMock(presetData: Record<string, any> = {}): UserMockAxios {
  console.log(`Creating user-configurable mock with preset data`);
  return unifiedCreateUserConfigurableMock(presetData);
}

/**
 * Create a simple mock HTTP client for basic usage
 * Provides default behavior without error simulation
 */
export function createSimpleMockClient(defaultData: any = {}): MockHttpClient {
  console.log(`Creating simple mock client`);
  return unifiedCreateSimpleMockClient(defaultData);
}

/**
 * Create a mock server with custom response patterns
 * For advanced MSW-based mocking scenarios
 */
export function createCustomMockServer(responsePatterns: Array<{
  method: string;
  url: string | RegExp;
  response: MockResponse;
}>): { server: any; cleanup: () => void } {
  return unifiedCreateCustomMockServer(responsePatterns);
}

// ==================== EXPORTS ====================

// Export the unified factory interface for backward compatibility
export const httpClientMockFactory = {
  create: createMockHttpClient,
  createUserMock: createUserConfigurableMock,
  createSimple: createSimpleMockClient,
  createCustomServer: createCustomMockServer,
  
  // Utility functions
  createMockResponse,
  createErrorResponse,
  
  // Re-export unified mock for direct access
  unified: unifiedHttpMock
};

// Export default factory for easier importing
export default httpClientMockFactory;