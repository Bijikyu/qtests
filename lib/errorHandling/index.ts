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

// Export consolidated error handling object with safe error handling
export const errorHandling = {
  createAsyncErrorWrapper: (() => {
    try {
      const { createAsyncErrorWrapper } = require('./placeholderWrappers.js');
      return createAsyncErrorWrapper;
    } catch (error) {
      console.warn('Failed to load createAsyncErrorWrapper:', error);
      return () => {};
    }
  })(),
  createSyncErrorWrapper: (() => {
    try {
      const { createSyncErrorWrapper } = require('./placeholderWrappers.js');
      return createSyncErrorWrapper;
    } catch (error) {
      console.warn('Failed to load createSyncErrorWrapper:', error);
      return () => {};
    }
  })(),
  createRouteErrorWrapper: (() => {
    try {
      const { createRouteErrorWrapper } = require('./placeholderWrappers.js');
      return createRouteErrorWrapper;
    } catch (error) {
      console.warn('Failed to load createRouteErrorWrapper:', error);
      return () => {};
    }
  })(),
  transformMongoError: (() => {
    try {
      const { transformMongoError } = require('./placeholderWrappers.js');
      return transformMongoError;
    } catch (error) {
      console.warn('Failed to load transformMongoError:', error);
      return (error: any) => error;
    }
  })(),
  createDatabaseErrorWrapper: (() => {
    try {
      const { createDatabaseErrorWrapper } = require('./placeholderWrappers.js');
      return createDatabaseErrorWrapper;
    } catch (error) {
      console.warn('Failed to load createDatabaseErrorWrapper:', error);
      return () => {};
    }
  })(),
  createApiErrorWrapper: (() => {
    try {
      const { createApiErrorWrapper } = require('./placeholderWrappers.js');
      return createApiErrorWrapper;
    } catch (error) {
      console.warn('Failed to load createApiErrorWrapper:', error);
      return () => {};
    }
  })(),
  createFileErrorWrapper: (() => {
    try {
      const { createFileErrorWrapper } = require('./placeholderWrappers.js');
      return createFileErrorWrapper;
    } catch (error) {
      console.warn('Failed to load createFileErrorWrapper:', error);
      return () => {};
    }
  })(),
  createBatchErrorWrapper: (() => {
    try {
      const { createBatchErrorWrapper } = require('./placeholderWrappers.js');
      return createBatchErrorWrapper;
    } catch (error) {
      console.warn('Failed to load createBatchErrorWrapper:', error);
      return () => {};
    }
  })(),
  createTimeoutErrorWrapper: (() => {
    try {
      const { createTimeoutErrorWrapper } = require('./placeholderWrappers.js');
      return createTimeoutErrorWrapper;
    } catch (error) {
      console.warn('Failed to load createTimeoutErrorWrapper:', error);
      return () => {};
    }
  })(),
  createStructuredError: (() => {
    try {
      const { createStructuredError } = require('./placeholderWrappers.js');
      return createStructuredError;
    } catch (error) {
      console.warn('Failed to load createStructuredError:', error);
      return (message: string) => new Error(message);
    }
  })(),
  logError: (() => {
    try {
      const { logError } = require('./placeholderWrappers.js');
      return logError;
    } catch (error) {
      console.warn('Failed to load logError:', error);
      return (error: any) => console.error(error);
    }
  })(),
};