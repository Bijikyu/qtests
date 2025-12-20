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

// Export consolidated error handling object
export const errorHandling = {
  createAsyncErrorWrapper: (() => {
    const { createAsyncErrorWrapper } = require('./placeholderWrappers.js');
    return createAsyncErrorWrapper;
  })(),
  createSyncErrorWrapper: (() => {
    const { createSyncErrorWrapper } = require('./placeholderWrappers.js');
    return createSyncErrorWrapper;
  })(),
  createRouteErrorWrapper: (() => {
    const { createRouteErrorWrapper } = require('./placeholderWrappers.js');
    return createRouteErrorWrapper;
  })(),
  transformMongoError: (() => {
    const { transformMongoError } = require('./placeholderWrappers.js');
    return transformMongoError;
  })(),
  createDatabaseErrorWrapper: (() => {
    const { createDatabaseErrorWrapper } = require('./placeholderWrappers.js');
    return createDatabaseErrorWrapper;
  })(),
  createApiErrorWrapper: (() => {
    const { createApiErrorWrapper } = require('./placeholderWrappers.js');
    return createApiErrorWrapper;
  })(),
  createFileErrorWrapper: (() => {
    const { createFileErrorWrapper } = require('./placeholderWrappers.js');
    return createFileErrorWrapper;
  })(),
  createBatchErrorWrapper: (() => {
    const { createBatchErrorWrapper } = require('./placeholderWrappers.js');
    return createBatchErrorWrapper;
  })(),
  createTimeoutErrorWrapper: (() => {
    const { createTimeoutErrorWrapper } = require('./placeholderWrappers.js');
    return createTimeoutErrorWrapper;
  })(),
  createStructuredError: (() => {
    const { createStructuredError } = require('./placeholderWrappers.js');
    return createStructuredError;
  })(),
  logError: (() => {
    const { logError } = require('./placeholderWrappers.js');
    return logError;
  })(),
};