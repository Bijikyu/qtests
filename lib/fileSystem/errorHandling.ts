/**
 * File System Error Handling Utilities
 * Provides error handling wrappers for file operations
 */

/**
 * Executes a file operation with error handling
 * @param operation - File operation function
 * @param context - Context description for error logging
 * @returns operation result or null if failed
 */
export function withFileErrorHandling<T>(operation: () => T, context: string): T | null {
  try {
    return operation();
  } catch (error: any) {
    console.log(`File operation failed [${context}]: ${error.message}`);
    return null;
  }
}