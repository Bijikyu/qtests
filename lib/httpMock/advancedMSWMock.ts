/**
 * MSW-based HTTP Mock Utilities
 * Modern replacement for legacy axios mocking with superior security and performance
 * 
 * DEPRECATED: Use shared httpMockFramework.js instead
 */

// Re-export advanced mock from shared framework  
export {
  MSWMock,
  createMSWMock,
  mockUtils
} from '../utils/httpMockFramework.js';

// Export legacy AdvancedMSWMock as alias for backward compatibility
export { MSWMock as AdvancedMSWMock } from '../utils/httpMockFramework.js';