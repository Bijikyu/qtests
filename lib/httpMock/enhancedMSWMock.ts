/**
 * Enhanced HTTP Mock System with MSW Integration
 * 
 * Enhanced MSW-centric mocking system while maintaining qtests-specific
 * module resolution and backward compatibility.
 * 
 * DEPRECATED: Use shared httpMockFramework.js instead
 */

// Re-export enhanced mock from shared framework
export {
  MSWMock,
  createMSWMock,
  createQtestsMock,
  createGraphQLMock,
  mockUtils
} from '../utils/httpMockFramework.js';

// Export legacy EnhancedMSWMock as alias for backward compatibility
export { MSWMock as EnhancedMSWMock } from '../utils/httpMockFramework.js';