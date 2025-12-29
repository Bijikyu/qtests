/**
 * HTTP Client Factory Functions
 * Responsible for creating different types of mock HTTP clients
 */

import { MockHttpClient, MockHttpClientConfig, UserMockAxios } from './mockTypes.js';
import { LegacyAxiosMock } from './legacyAxiosImplementation.js';
import { UserConfigurableAxiosMock } from './userConfigurableAxiosMock.js';
import { ModernMSWMock } from './modernMSWMock.js';
import qerrors from 'qerrors';

/**
 * Main HTTP client mock factory
 * Provides unified interface for creating different types of mock HTTP clients
 */
export function createMockHttpClient(config: MockHttpClientConfig = {}): MockHttpClient {
  const strategy = config.strategy || 'legacy-axios'; // Default to legacy for maximum compatibility
  
  console.log(`Creating mock HTTP client with strategy: ${strategy}`);
  
  try {
    // Factory pattern allows choosing appropriate mock implementation based on use case
    // Each strategy has different trade-offs between features and compatibility
    switch (strategy) {
      case 'msw-modern':
        // Modern MSW implementation with service worker interception
        // Best for comprehensive browser environment simulation
        return new ModernMSWMock(config);
      
      case 'simple-axios':
        // Legacy implementation without error simulation
        // Suitable for basic testing scenarios where deterministic behavior is needed
        return new LegacyAxiosMock({ ...config, simulateErrors: false });
      
      case 'user-configurable':
        // Allows runtime configuration of mock responses
        // Ideal for tests that need to change behavior during execution
        return new UserConfigurableAxiosMock(config);
      
      case 'legacy-axios':
      default:
        // Default legacy implementation with full feature set
        // Provides maximum compatibility with existing axios usage patterns
        return new LegacyAxiosMock(config);
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
 * Create a user-configurable mock axios instance
 * Allows setting custom responses per URL with __set method
 */
export function createUserConfigurableMock(presetData: Record<string, any> = {}): UserMockAxios {
  console.log(`Creating user-configurable mock with preset data`);
  
  try {
    // User-configurable mocks allow runtime response modification
    // This is useful for tests that need to simulate changing API behavior
    const config: MockHttpClientConfig = {
      presetData, // Pre-configure responses for common URLs
      strategy: 'user-configurable'
    };
    
    return new UserConfigurableAxiosMock(config);
  } catch (error: any) {
    qerrors(error, 'clientFactories.createUserConfigurableMock: user-configurable mock creation failed', {
      presetDataKeys: Object.keys(presetData),
      presetDataSize: JSON.stringify(presetData).length
    });
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
    // Simple mock client provides predictable behavior without error simulation
    // Ideal for unit tests that focus on business logic rather than error handling
    const config: MockHttpClientConfig = {
      defaultResponse: defaultData, // Default response for all requests
      strategy: 'simple-axios' // Legacy strategy without error simulation
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