/**
 * Error Handling Utilities Unit Tests
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { handleError, handleAsyncError, ErrorHandlingOptions } from '../errorHandling.js';
import qerrors from 'qerrors';

// Mock qerrors to avoid actual logging during tests
jest.mock('qerrors');
const mockQerrors = jest.mocked(qerrors);

describe('Error Handling Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleError', () => {
    it('should log error with default options', () => {
      const error = new Error('Test error');
      const context = 'test-context';

      handleError(error, context);

      expect(mockQerrors).toHaveBeenCalledWith(
        error,
        context,
        expect.objectContaining({
          errorMessage: 'Test error',
          errorType: 'Error',
          stack: expect.any(String)
        })
      );
    });

    it('should handle string errors', () => {
      const error = 'String error';
      const context = 'test-context';

      handleError(error, context);

      expect(mockQerrors).toHaveBeenCalledWith(
        error,
        context,
        expect.objectContaining({
          errorMessage: 'String error',
          errorType: 'Unknown'
        })
      );
    });

    it('should respect custom options', () => {
      const error = new Error('Test error');
      const context = 'test-context';
      const options: ErrorHandlingOptions = {
        logToConsole: false,
        includeStack: false,
        context: { additional: 'data' },
        fallbackMessage: 'Custom fallback'
      };

      handleError(error, context, options);

      expect(mockQerrors).toHaveBeenCalledWith(
        error,
        context,
        expect.objectContaining({
          errorMessage: 'Test error',
          logToConsole: false,
          includeStack: false,
          additional: 'data'
        })
      );
    });

    it('should handle null/undefined errors gracefully', () => {
      const error = null;
      const context = 'test-context';

      handleError(error, context);

      expect(mockQerrors).toHaveBeenCalledWith(
        null,
        context,
        expect.objectContaining({
          errorMessage: 'null',
          errorType: 'Unknown'
        })
      );
    });
  });

  describe('handleAsyncError', () => {
    it('should return result when promise resolves', async () => {
      const successPromise = Promise.resolve('success');
      const context = 'test-context';

      const result = await handleAsyncError(successPromise, context);

      expect(result).toBe('success');
      expect(mockQerrors).not.toHaveBeenCalled();
    });

    it('should return null when promise rejects', async () => {
      const error = new Error('Test error');
      const failedPromise = Promise.reject(error);
      const context = 'test-context';

      const result = await handleAsyncError(failedPromise, context);

      expect(result).toBeNull();
      expect(mockQerrors).toHaveBeenCalledWith(
        error,
        context,
        expect.any(Object)
      );
    });

    it('should handle custom options', async () => {
      const error = new Error('Test error');
      const failedPromise = Promise.reject(error);
      const context = 'test-context';
      const options: ErrorHandlingOptions = {
        logToConsole: false
      };

      const result = await handleAsyncError(failedPromise, context, options);

      expect(result).toBeNull();
      expect(mockQerrors).toHaveBeenCalledWith(
        error,
        context,
        expect.objectContaining({
          logToConsole: false
        })
      );
    });
  });

  describe('Context Extraction', () => {
    it('should extract error information from Error objects', () => {
      const error = new Error('Detailed error');
      error.stack = 'Error: Detailed error\n    at test.js:1:1';
      const context = 'test-context';

      handleError(error, context, { includeStack: true });

      expect(mockQerrors).toHaveBeenCalledWith(
        error,
        context,
        expect.objectContaining({
          errorMessage: 'Detailed error',
          errorType: 'Error',
          stack: 'Error: Detailed error\n    at test.js:1:1'
        })
      );
    });

    it('should handle Error objects without stack', () => {
      const error = new Error('No stack error');
      delete error.stack;
      const context = 'test-context';

      handleError(error, context, { includeStack: true });

      expect(mockQerrors).toHaveBeenCalledWith(
        error,
        context,
        expect.objectContaining({
          errorMessage: 'No stack error',
          errorType: 'Error',
          stack: undefined
        })
      );
    });
  });

  describe('Console Logging', () => {
    let consoleSpy: jest.SpiedFunction<typeof console.error>;
    let logSpy: jest.SpiedFunction<typeof console.log>;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('should log to console when enabled', () => {
      const error = new Error('Console test');
      const context = 'test-context';

      handleError(error, context, { logToConsole: true });

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('test-context:'),
        'Console test'
      );
    });

    it('should not log to console when disabled', () => {
      const error = new Error('No console test');
      const context = 'test-context';

      handleError(error, context, { logToConsole: false });

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should include stack trace when enabled', () => {
      const error = new Error('Stack test');
      error.stack = 'Error: Stack test\n    at test.js:1:1';
      const context = 'test-context';

      handleError(error, context, { logToConsole: true, includeStack: true });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('test-context:'),
        'Stack test'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Stack trace:',
        'Error: Stack test\n    at test.js:1:1'
      );
    });
  });
});