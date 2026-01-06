/**
 * File System Management Utilities using fs-extra
 * Enhanced with fs-extra for better maintainability and industry-standard implementation
 */

import fs from 'fs-extra';
import qerrors from '../../lib/qerrorsFallback.js';

/**
 * Safely deletes a file or directory using fs-extra
 * @param targetPath - Path to delete
 * @param recursive - Whether to delete directories recursively (default: false)
 * @returns true if successful, false otherwise
 */
export async function safeDelete(targetPath: string, recursive: boolean = false): Promise<boolean> {
  try {
    // Check if path exists first
    const exists = await fs.pathExists(targetPath);
    if (!exists) {
      return true; // Already doesn't exist
    }
    
    // Use fs-extra's remove method which handles both files and directories
    await fs.remove(targetPath);
    return true;
  } catch (error: any) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    qerrors(errorObj, 'managementUtils.safeDelete: deletion failed', { 
      targetPath, 
      recursive,
      operation: 'remove'
    });
    return false;
  }
}

/**
 * Safely deletes a file or directory (sync version - DEPRECATED: use async version)
 * @param targetPath - Path to delete
 * @param recursive - Whether to delete directories recursively (default: false)
 * @returns true if successful, false otherwise
 * @deprecated Use safeDelete instead for better scalability
 */
export function safeDeleteSync(targetPath: string, recursive: boolean = false): boolean {
  try {
    // Check if path exists first
    if (!fs.existsSync(targetPath)) {
      return true; // Already doesn't exist
    }
    
    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) {
      fs.removeSync(targetPath);
    } else {
      fs.unlinkSync(targetPath);
    }
    return true;
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    qerrors(errorObj, 'managementUtils.safeDeleteSync: deletion failed', { 
      targetPath, 
      recursive,
      operation: 'removeSync'
    });
    return false;
  }
}

/**
 * Ensures a directory exists using fs-extra
 * @param dirPath - Directory path to ensure
 * @returns true if successful, false otherwise
 */
export async function ensureDir(dirPath: string): Promise<boolean> {
  try {
    await fs.ensureDir(dirPath);
    return true;
  } catch (error: any) {
    qerrors(error, 'managementUtils.ensureDir: directory creation failed', {
      dirPath,
      operation: 'ensureDir'
    });
    return false;
  }
}

/**
 * Ensures a directory exists (sync version)
 * @param dirPath - Directory path to ensure
 * @returns true if successful, false otherwise
 */
export function ensureDirSync(dirPath: string): boolean {
  try {
    fs.ensureDirSync(dirPath);
    return true;
  } catch (error: any) {
    qerrors(error, 'managementUtils.ensureDirSync: directory creation failed', {
      dirPath,
      operation: 'ensureDirSync'
    });
    return false;
  }
}

/**
 * Moves a file or directory using fs-extra
 * @param src - Source path
 * @param dest - Destination path
 * @param options - Move options
 * @returns true if successful, false otherwise
 */
export async function safeMove(src: string, dest: string, options: {
  overwrite?: boolean;
} = {}): Promise<boolean> {
  try {
    await fs.move(src, dest, { overwrite: options.overwrite || false });
    return true;
  } catch (error: any) {
    qerrors(error, 'managementUtils.safeMove: move operation failed', {
      src,
      dest,
      overwrite: options.overwrite,
      operation: 'move'
    });
    return false;
  }
}

/**
 * Copies a file or directory using fs-extra
 * @param src - Source path
 * @param dest - Destination path
 * @param options - Copy options
 * @returns true if successful, false otherwise
 */
export async function safeCopy(src: string, dest: string, options: {
  overwrite?: boolean;
  preserveTimestamps?: boolean;
} = {}): Promise<boolean> {
  try {
    await fs.copy(src, dest, { 
      overwrite: options.overwrite || false,
      preserveTimestamps: options.preserveTimestamps !== false
    });
    return true;
  } catch (error: any) {
    qerrors(error, 'managementUtils.safeCopy: copy operation failed', {
      src,
      dest,
      overwrite: options.overwrite,
      preserveTimestamps: options.preserveTimestamps,
      operation: 'copy'
    });
    return false;
  }
}

/**
 * Executes a file operation with error handling
 * @param operation - File operation function
 * @param context - Context description for error logging
 * @returns operation result or null if failed
 */
export async function withFileErrorHandling<T>(
  operation: () => Promise<T>, 
  context: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error: any) {
    qerrors(error, `managementUtils.withFileErrorHandling: ${context} failed`, {
      context,
      operation: context,
      errorCode: error.code,
      errno: error.errno,
      syscall: error.syscall
    });
    return null;
  }
}

/**
 * Executes a file operation with error handling (sync version)
 * @param operation - File operation function
 * @param context - Context description for error logging
 * @returns operation result or null if failed
 */
export function withFileErrorHandlingSync<T>(
  operation: () => T, 
  context: string
): T | null {
  try {
    return operation();
  } catch (error: any) {
    qerrors(error, `managementUtils.withFileErrorHandlingSync: ${context} failed`, {
      context,
      operation: context,
      errorCode: error.code,
      errno: error.errno,
      syscall: error.syscall
    });
    return null;
  }
}

/**
 * Gets file statistics with error handling
 * @param filePath - Path to file
 * @returns File stats or null if failed
 */
export async function safeStats(filePath: string): Promise<{
  isFile: boolean;
  isDirectory: boolean;
  size: number;
  modified: Date;
  created?: Date;
} | null> {
  try {
    const stats = await fs.stat(filePath);
    return {
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      size: stats.size,
      modified: stats.mtime,
      created: stats.birthtime
    };
  } catch (error: any) {
    qerrors(error, 'managementUtils.safeStats: stat operation failed', {
      filePath,
      operation: 'stat'
    });
    return null;
  }
}

/**
 * Checks if a path exists using fs-extra
 * @param path - Path to check
 * @returns true if path exists, false otherwise
 */
export async function safePathExists(path: string): Promise<boolean> {
  try {
    return await fs.pathExists(path);
  } catch (error: any) {
    qerrors(error, 'managementUtils.safePathExists: pathExists check failed', {
      path,
      operation: 'pathExists'
    });
    return false;
  }
}

/**
 * Reads directory contents with error handling
 * @param dirPath - Directory path to read
 * @param options - Read options
 * @returns Array of file names or null if failed
 */
export async function safeReadDir(dirPath: string, options: {
  withFileTypes?: boolean;
} = {}): Promise<Array<{
  name: string;
  isFile: boolean;
  isDirectory: boolean;
}> | null> {
  try {
    const items = await fs.readdir(dirPath);
    
    if (!options.withFileTypes) {
      return items.map(name => ({ name, isFile: true, isDirectory: false }));
    }
    
    // Get file types for each item
    const result = [];
    for (const item of items) {
      const itemPath = `${dirPath}/${item}`;
      const stats = await safeStats(itemPath);
      if (stats) {
        result.push({
          name: item,
          isFile: stats.isFile,
          isDirectory: stats.isDirectory
        });
      }
    }
    
    return result;
  } catch (error: any) {
    qerrors(error, 'managementUtils.safeReadDir: readdir operation failed', {
      dirPath,
      operation: 'readdir'
    });
    return null;
  }
}

/**
 * Creates a temporary directory with error handling
 * @param prefix - Directory name prefix (optional)
 * @returns Temporary directory path or null if failed
 */
export async function createTempDir(prefix?: string): Promise<string | null> {
  try {
    const os = await import('os');
    const path = await import('path');
    
    const tempDir = os.tmpdir();
    const dirName = prefix ? `${prefix}-${Date.now()}` : `temp-${Date.now()}`;
    const fullPath = path.join(tempDir, dirName);
    
    await fs.ensureDir(fullPath);
    return fullPath;
  } catch (error: any) {
    qerrors(error, 'managementUtils.createTempDir: temp directory creation failed', {
      prefix,
      operation: 'createTempDir'
    });
    return null;
  }
}

/**
 * Cleans up a directory safely (removes all contents but keeps directory)
 * @param dirPath - Directory path to clean
 * @returns true if successful, false otherwise
 */
export async function cleanDirectory(dirPath: string): Promise<boolean> {
  try {
    const exists = await fs.pathExists(dirPath);
    if (!exists) {
      return true; // Directory doesn't exist
    }
    
    // Remove all contents but keep the directory
    await fs.emptyDir(dirPath);
    return true;
  } catch (error: any) {
    qerrors(error, 'managementUtils.cleanDirectory: directory cleanup failed', {
      dirPath,
      operation: 'emptyDir'
    });
    return false;
  }
}

// Export fs-extra for direct use
export { fs };

// Legacy exports for backward compatibility
export {
  safeDeleteSync as safeDeleteLegacy,
  ensureDirSync as ensureDirSyncLegacy
};

export default {
  safeDelete,
  safeDeleteSync,
  ensureDir,
  ensureDirSync,
  safeMove,
  safeCopy,
  withFileErrorHandling,
  withFileErrorHandlingSync,
  safeStats,
  safePathExists,
  safeReadDir,
  createTempDir,
  cleanDirectory,
  fs
};