
/**
 * Core Testing Utilities
 * 
 * This module provides the fundamental testing utilities that form the backbone
 * of the qtests framework. These utilities are used across different testing
 * scenarios and provide basic functionality for method stubbing and console mocking.
 * 
 * Design philosophy:
 * - Simple, focused utilities that do one thing well
 * - Minimal dependencies to avoid circular imports
 * - Framework-agnostic implementations
 * - Consistent API patterns across utilities
 * 
 * Architecture rationale:
 * This module serves as the foundation layer because:
 * 1. These utilities have no dependencies on other qtests modules
 * 2. They provide primitive operations that other modules build upon
 * 3. Keeping them separate prevents circular dependency issues
 * 4. They can be used independently without importing the full qtests suite
 */

// Import the enhanced stubMethod utility using Sinon.js
// Now uses industry-standard Sinon.js for superior mocking capabilities
// Provides spies, mocks, fake timers, and rich assertions
// Maintains backward compatibility while adding powerful new features
import { stubMethod, spyOnMethod, createMock, createFakeTimers } from '../utils/stubMethod.js';

// Import mockConsole from its dedicated utility module
// Maintaining the original import approach for stability
import { mockConsole } from '../utils/mockConsole.js';

/**
 * Export core testing utilities
 * 
 * These are the most commonly used utilities in the qtests framework.
 * Enhanced with industry-standard Sinon.js capabilities while maintaining compatibility.
 * 
 * Enhanced Features:
 * - Superior mocking with spies, mocks, and fake timers
 * - Rich assertion capabilities through sinon-chai
 * - Better error handling and debugging support
 * - Industry-standard implementation recognized by developers
 * 
 * Export strategy:
 * - Comprehensive export for backward compatibility
 * - New advanced utilities available for migration to full Sinon API
 * - Consistent naming with enhanced functionality
 */
// Export core testing utilities using ES module syntax
// Enhanced exports provide both backward compatibility and advanced capabilities
export {
  stubMethod,           // Method replacement utility (Sinon-powered)
  spyOnMethod,          // Spy on methods without replacing (NEW)
  createMock,            // Complete object mocking (NEW)
  createFakeTimers,      // Time-based testing utilities (NEW)
  mockConsole            // Console output capture utility
};
