
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

import { stubMethod, spyOnMethod, createMock, createFakeTimers } from '../utils/stubMethod.js';
import { mockConsole } from '../utils/mockConsole.js';

export {
  stubMethod,
  spyOnMethod,
  createMock,
  createFakeTimers,
  mockConsole
};
