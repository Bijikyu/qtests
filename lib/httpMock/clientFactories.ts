/**
 * HTTP Client Factory Functions
 * Responsible for creating different types of mock HTTP clients
 */

import { MockHttpClient, MockHttpClientConfig, UserMockAxios } from './mockTypes.js';
import { LegacyAxiosMock } from './legacyAxiosImplementation.js';
import { UserConfigurableAxiosMock } from './userConfigurableAxiosMock.js';
import { ModernMSWMock } from './modernMSWMock.js';
import { AdvancedMSWMock, createAdvancedMSWMock, createModernUserConfigurableMock } from './advancedMSWMock.js';
import qerrors from 'qerrors';

/**
 * Main HTTP client mock factory
 * Provides unified interface for creating different types of mock HTTP clients
 */
export function createMockHttpClient(config: MockHttpClientConfig = {}): MockHttpClient {
  // Default to MSW for superior security and performance
  const strategy = config.strategy || 'msw-modern';
  
  console.log(`Creating mock HTTP client with strategy: ${strategy}`);
  
  try {
    // Factory pattern allows choosing appropriate mock implementation based on use case
    // MSW is now the preferred strategy for security and performance benefits
    switch (strategy) {
      case 'msw-modern':
      default:
        // Modern MSW implementation with service worker interception
        // Preferred for comprehensive browser environment simulation and security
        // Eliminates request stubbing attack surface
        return new ModernMSWMock(config);
      
      case 'legacy-axios':
        // Legacy implementation for backward compatibility
        // Deprecated: use MSW for new implementations
        console.warn('Legacy axios mock strategy is deprecated. Consider using MSW (msw-modern) strategy instead.');
        return new LegacyAxiosMock(config);
      
      case 'simple-axios':
        // Legacy implementation without error simulation
        // Deprecated: use MSW with appropriate configuration instead
        console.warn('Simple axios mock strategy is deprecated. Consider using MSW (msw-modern) strategy instead.');
        return new LegacyAxiosMock({ ...config, simulateErrors: false });
      
      case 'user-configurable':
        // Allows runtime configuration of mock responses
        // Now uses MSW-based implementation for better security
        console.log('Creating MSW-based user-configurable mock');
        return createAdvancedMSWMock(config);
    }
  } catch (error: any) {
    qerrors(error, 'clientFactories.createMockHttpClient: factory creation failed', {
      strategy,
      hasConfig: Object.keys(config).length > 0,
      configKeys: Object.keys(config)
    });
    throw error;
  }
}

/**
 * Create a user-configurable mock axios instance using MSW
 * Now uses modern MSW-based implementation for superior security and performance
 * Allows setting custom responses per URL with __set method
 */
export function createUserConfigurableMock(presetData: Record<string, any> = {}): UserMockAxios {
  console.log(`Creating MSW-based user-configurable mock with preset data`);
  
  try {
    // User-configurable mocks allow runtime response modification
    // This is useful for tests that need to simulate changing API behavior
    // Now uses MSW for better security and performance
    const config: MockHttpClientConfig = {
      presetData, // Pre-configure responses for common URLs
      strategy: 'user-configurable'
    };
    
    return createAdvancedMSWMock(config);
  } catch (error: any) {
    qerrors(error, 'clientFactories.createUserConfigurableMock: MSW user-configurable mock creation failed', {
      presetDataKeys: Object.keys(presetData),
      presetDataSize: JSON.stringify(presetData).length
    });
    throw error;
  }
}

/**
 * Create a simple mock HTTP client for basic usage
 * DEPRECATED: Use MSW-based mocks for better security and performance
 * Provides default behavior without error simulation
 */
export function createSimpleMockClient(defaultData: any = {}): MockHttpClient {
  console.warn('createSimpleMockClient is deprecated. Use createMockHttpClient with MSW strategy instead.');
  console.log(`Creating simple mock client`);
  
  try {
    // Simple mock client provides predictable behavior without error simulation
    // Ideal for unit tests that focus on business logic rather than error handling
    // Note: MSW provides better security and performance characteristics
    const config: MockHttpClientConfig = {
      defaultResponse: defaultData, // Default response for all requests
      strategy: 'msw-modern' // Use MSW for better security
    };
    
    return createMockHttpClient(config);
  } catch (error: any) {
    qerrors(error, 'clientFactories.createSimpleMockClient: simple mock client creation failed', {
      hasDefaultData: defaultData !== null && defaultData !== undefined,
      defaultDataType: typeof defaultData
    });
    throw error;
  }
}