/**
 * File System Error Handling Utilities
 * Provides error handling wrappers for file operations
 */

import qerrors from '../qerrorsFallback.js';

/**
 * Executes a file operation with error handling
 * @param operation - File operation function
 * @param context - Context description for error logging
 * @returns operation result or null if failed
 */
export function withFileErrorHandling<T>(operation: () => T, context: string, additionalContext?: any): T | null {
  try {
    return operation();
  } catch (error: any) {
    // Log comprehensive error information for debugging file system issues
    // Include both standard error properties and Node.js-specific file system error details
    qerrors(error, `fileErrorHandling.withFileErrorHandling: ${context}`, {
      context,
      errorMessage: error.message,
      errorType: error.constructor?.name || 'unknown',
      errorCode: error.code,        // Node.js error code (e.g., ENOENT, EACCES)
      errno: error.errno,           // System error number
      syscall: error.syscall,       // System call that failed (e.g., 'stat', 'open')
      path: error.path,            // File path associated with the error
      ...additionalContext
    });
    return null; // Return null to allow graceful degradation
  }
}