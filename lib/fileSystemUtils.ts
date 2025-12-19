/**
 * File System Utilities
 * Provides safe file system operations with error handling
 * Consolidates common patterns used across 20+ files in the codebase
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Safely checks if a file or directory exists
 * @param filePath - Path to check
 * @returns true if exists, false otherwise
 */
export function safeExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Safely reads a file as UTF-8 text
 * @param filePath - Path to read
 * @returns File contents as string, or null if failed
 */
export function safeReadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Safely reads a file as buffer
 * @param filePath - Path to read
 * @returns File contents as buffer, or null if failed
 */
export function safeReadFileBuffer(filePath: string): Buffer | null {
  try {
    return fs.readFileSync(filePath);
  } catch {
    return null;
  }
}

/**
 * Safely writes a file with directory creation
 * @param filePath - Path to write
 * @param content - Content to write
 * @param encoding - File encoding (default: utf8)
 * @returns true if successful, false otherwise
 */
export function safeWriteFile(filePath: string, content: string | Buffer, encoding: BufferEncoding = 'utf8'): boolean {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!safeExists(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, encoding);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensures a directory exists, creating it if necessary
 * @param dirPath - Directory path to ensure
 * @returns true if directory exists or was created, false otherwise
 */
export function ensureDir(dirPath: string): boolean {
  try {
    if (!safeExists(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely deletes a file or directory
 * @param targetPath - Path to delete
 * @param recursive - Whether to delete directories recursively (default: false)
 * @returns true if successful, false otherwise
 */
export function safeDelete(targetPath: string, recursive: boolean = false): boolean {
  try {
    if (!safeExists(targetPath)) {
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
 * Safely gets file stats
 * @param filePath - Path to check
 * @returns fs.Stats object or null if failed
 */
export function safeStats(filePath: string): fs.Stats | null {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

/**
 * Safely checks if path is a directory
 * @param dirPath - Path to check
 * @returns true if directory exists, false otherwise
 */
export function isDirectory(dirPath: string): boolean {
  const stats = safeStats(dirPath);
  return stats ? stats.isDirectory() : false;
}

/**
 * Safely checks if path is a file
 * @param filePath - Path to check
 * @returns true if file exists, false otherwise
 */
export function isFile(filePath: string): boolean {
  const stats = safeStats(filePath);
  return stats ? stats.isFile() : false;
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

// Export all utilities for easy importing
export const fileSystemUtils = {
  safeExists,
  safeReadFile,
  safeReadFileBuffer,
  safeWriteFile,
  ensureDir,
  safeDelete,
  safeStats,
  isDirectory,
  isFile,
  withFileErrorHandling
};

// Default export for compliance with architecture patterns
export default fileSystemUtils;