/**
 * MSW-based HTTP Mock Utilities
 * Modern replacement for legacy axios mocking with superior security and performance
 * 
 * DEPRECATED: Use shared httpMockFramework.js instead
 */

import { 
  MSWMock, 
  createMSWMock, 
  mockUtils 
} from '../utils/httpMockFramework.js';

// Re-export advanced mock from shared framework  
export {
  MSWMock,
  createMSWMock,
  mockUtils
};

// Export legacy AdvancedMSWMock as alias for backward compatibility
export { MSWMock as AdvancedMSWMock };

// Export factory functions for backward compatibility
export { createMSWMock as createAdvancedMSWMock };

// Export user-configurable mock factory
export function createModernUserConfigurableMock(config: any = {}) {
  return createMSWMock({
    ...config,
    presetResponses: config.presetData ? new Map(Object.entries(config.presetData)) : undefined
  });
}