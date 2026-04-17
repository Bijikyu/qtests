/**
 * Legacy Unified HTTP Mock - Refactored for SRP
 * 
 * This file now serves as a compatibility layer that re-exports
 * the modular HTTP mocking functionality while maintaining backward compatibility.
 * 
 * The actual implementation has been split into:
 * - httpMock/mockTypes.ts - Type definitions
 * - httpMock/mockUtilities.ts - Utility functions
 * - httpMock/legacyAxiosMock.ts - Legacy axios mock implementations
 * - httpMock/modernMSWMock.ts - MSW-based modern mock implementation
 * - httpMock/mockFactories.ts - Factory functions for creating mocks
 */

// Import logging control utility for consistent framework behavior
import { setLogging } from './logUtils.js';
import { NODE_ENV } from '../config/localVars.js';

// Set logging based on environment using localVars pattern
if (NODE_ENV !== 'test') {
  setLogging(false);
}

// Import modular HTTP mock components
import {
  MockStrategy,
  MockResponse,
  AxiosResponse,
  RequestMatcher,
  MockHttpClientConfig,
  MockHttpClient,
  UserMockAxios
} from './httpMock/index.js';

import {
  createMockHttpClient,
  createUserConfigurableMock,
  createSimpleMockClient
} from './httpMock/index.js';

import {
  createCustomMockServer
} from './httpMock/index.js';

import {
  createMockResponse as createMockResponseUtil,
  createErrorResponse
} from './httpMock/index.js';

// Re-export types for backward compatibility
export type {
  MockStrategy,
  MockResponse,
  AxiosResponse,
  RequestMatcher,
  MockHttpClientConfig,
  MockHttpClient,
  UserMockAxios
};

// Re-export core functionality
export {
  createMockHttpClient,
  createUserConfigurableMock,
  createSimpleMockClient,
  createCustomMockServer,
  createMockResponseUtil as createMockResponse,
  createErrorResponse,
};

// Legacy compatibility exports
export function createAxiosMock(presetData: any = {}) {
  console.log('[DEPRECATED] Using legacy axios mock. Consider migrating to createMockHttpClient.');
  const j = (globalThis as any).jest;
  const makeMock = (resolvedValue: any) => {
    if (j && typeof j.fn === 'function') return j.fn().mockResolvedValue(resolvedValue);
    const fn: any = (..._args: any[]) => Promise.resolve(resolvedValue);
    fn.mock = { calls: [] };
    fn.mockResolvedValue = (v: any) => { fn._v = v; return fn; };
    return fn;
  };
  const makeUtil = () => {
    if (j && typeof j.fn === 'function') return j.fn();
    const fn: any = (..._args: any[]) => {};
    fn.mock = { calls: [] };
    return fn;
  };
  const mockAxios = {
    get: makeMock({ data: presetData }),
    post: makeMock({ data: presetData }),
    put: makeMock({ data: presetData }),
    delete: makeMock({ data: presetData }),
    patch: makeMock({ data: presetData }),
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: makeUtil(), eject: makeUtil() },
      response: { use: makeUtil(), eject: makeUtil() },
    },
  };
  return mockAxios;
}

// Unified export object
export const unifiedHttpMock = {
  // Main factory functions
  create: createMockHttpClient,
  createUserMock: createUserConfigurableMock,
  createSimple: createSimpleMockClient,
  createCustomServer: createCustomMockServer,
  
  // Utility functions
  createMockResponse: createMockResponseUtil,
  createErrorResponse,
  
  // Legacy compatibility
  createAxiosMock,
  
  // Strategy constants
  strategies: {
    LEGACY_AXIOS: 'legacy-axios',
    MSW_MODERN: 'msw-modern',
    SIMPLE_AXIOS: 'simple-axios',
    USER_CONFIGURABLE: 'user-configurable'
  } as const
};

// Default export for easy importing
export default unifiedHttpMock;