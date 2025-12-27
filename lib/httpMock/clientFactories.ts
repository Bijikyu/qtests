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
  const strategy = config.strategy || 'legacy-axios';
  
  console.log(`Creating mock HTTP client with strategy: ${strategy}`);
  
  try {
    switch (strategy) {
      case 'msw-modern':
        return new ModernMSWMock(config);
      
      case 'simple-axios':
        return new LegacyAxiosMock({ ...config, simulateErrors: false });
      
      case 'user-configurable':
        return new UserConfigurableAxiosMock(config);
      
      case 'legacy-axios':
      default:
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
    const config: MockHttpClientConfig = {
      presetData,
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
    const config: MockHttpClientConfig = {
      defaultResponse: defaultData,
      strategy: 'simple-axios'
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