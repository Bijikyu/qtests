/**
 * File System Management Utilities
 * Handles file system deletion and error handling
 */

import * as fs from 'fs';

/**
 * Safely deletes a file or directory
 * @param targetPath - Path to delete
 * @param recursive - Whether to delete directories recursively (default: false)
 * @returns true if successful, false otherwise
 */
export function safeDelete(targetPath: string, recursive: boolean = false): boolean {
  try {
    if (!fs.existsSync(targetPath)) {
      return true; // Already doesn't exist
    }
    
    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) {
      fs.rmSync(targetPath, { recursive, force: true });
    } else {
      fs.unlinkSync(targetPath);
    }
    return true;
  } catch {
    return false;
  }
}

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