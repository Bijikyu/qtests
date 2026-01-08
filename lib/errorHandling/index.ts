/**
 * Error Handling Module Index - Refactored for SRP
 * 
 * This file now serves as a compatibility layer that re-exports
 * the modular error handling functionality while maintaining backward compatibility.
 * 
 * The actual implementation has been split into:
 * - errorHandling/errorTypes.ts - Type definitions
 * - errorHandling/placeholderWrappers.ts - Placeholder implementations
 * - Existing files: errorLogging.js, fallbackHandlers.js, errorWrappers.js
 */

// Re-export all error handling utilities from existing files
export {
  withErrorLogging,
  safeExecute,
  withAsyncErrorLogging,
  safeAsyncExecute
} from './errorLogging.js';

export {
  withFallback,
  withAsyncFallback
} from './fallbackHandlers.js';

export {
  wrapWithErrorLogging,
  wrapWithSafeExecute
} from './errorWrappers.js';

// Re-export types and wrapper implementations from new modular files
export * from './errorTypes.js';
export * from './basicWrappers.js';
export * from './advancedWrappers.js';

import {
  createAsyncErrorWrapper,
  createSyncErrorWrapper,
  createRouteErrorWrapper,
  transformMongoError,
  createDatabaseErrorWrapper,
  createApiErrorWrapper,
  createFileErrorWrapper,
  createBatchErrorWrapper,
  createTimeoutErrorWrapper,
  createStructuredError,
  logError
} from './placeholderWrappers.js';

// Export consolidated error handling object with safe error handling
export const errorHandling = {
  createAsyncErrorWrapper,
  createSyncErrorWrapper,
  createRouteErrorWrapper,
  transformMongoError,
  createDatabaseErrorWrapper,
  createApiErrorWrapper,
  createFileErrorWrapper,
  createBatchErrorWrapper,
  createTimeoutErrorWrapper,
  createStructuredError,
  logError
};
