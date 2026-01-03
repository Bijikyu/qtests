/**
 * File System Deletion Utilities using fs-extra
 * Replaced with fs-extra for better maintainability and industry-standard implementation
 * 
 * Migration Guide:
 * - safeDelete() -> fs.remove() with additional safety checks
 * - Use fs-extra directly for advanced use cases
 */

import fs from 'fs-extra';
import path from 'path';
import qerrors from '../qerrorsFallback.js';

/**
 * Safely deletes a file or directory using fs-extra
 * @param targetPath - Path to delete
 * @param recursive - Whether to delete directories recursively (default: false)
 * @returns true if successful, false otherwise
 */
export async function safeDelete(targetPath: string, recursive: boolean = false): Promise<boolean> {
  try {
    // Validate target path to prevent injection or invalid operations
    if (!targetPath || typeof targetPath !== 'string') {
      throw new Error('Invalid target path provided');
    }
    
    // Prevent accidental deletion of critical system directories
    const criticalPaths = ['/etc', '/usr', '/bin', '/sbin', '/boot', '/root', '/home'];
    if (criticalPaths.some(critical => targetPath.startsWith(critical))) {
      throw new Error('Deletion of critical system paths is not allowed');
    }
    
    // Check if path exists before attempting deletion
    const exists = await fs.pathExists(targetPath);
    if (!exists) {
      return true; // Already doesn't exist - consider this a success
    }
    
    const stats = await fs.stat(targetPath);
    
    // Additional safety checks for directories
    if (stats.isDirectory()) {
      // Check if directory is empty when not recursive
      if (!recursive) {
        const contents = await fs.readdir(targetPath);
        if (contents.length > 0) {
          throw new Error('Directory is not empty and recursive deletion is not enabled');
        }
      }
      
      // Check directory size to prevent accidental large deletions
      if (recursive) {
        const dirSize = await getDirectorySize(targetPath);
        if (dirSize > 1024 * 1024 * 1024) { // 1GB limit for safe deletion
          throw new Error('Directory too large for safe deletion');
        }
      }
    } else {
      // Check file size before deletion to prevent accidental loss of large files
      if (stats.size > 1024 * 1024 * 1024) { // 1GB limit for files
        throw new Error('File too large for safe deletion');
      }
    }
    
    // Use fs-extra's remove function which handles both files and directories
    if (recursive) {
      await fs.remove(targetPath);
    } else {
      // For non-recursive deletion, use appropriate method based on type
      if (stats.isDirectory()) {
        await fs.rmdir(targetPath);
      } else {
        await fs.unlink(targetPath);
      }
    }
    
    return true;
  } catch (error: any) {
    // Log detailed error information for debugging deletion failures
    qerrors(error, 'fileDeletion.safeDelete: deletion failed', { 
      targetPath, 
      recursive,
      operation: recursive ? 'remove' : 'rmdirOrUnlink',
      errorCode: error.code,
      errno: error.errno,
      syscall: error.syscall
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
  console.warn('safeDeleteSync is deprecated - use safeDelete for better scalability');
  try {
    // Validate target path to prevent injection or invalid operations
    if (!targetPath || typeof targetPath !== 'string') {
      throw new Error('Invalid target path provided');
    }
    
    // Prevent accidental deletion of critical system directories
    const criticalPaths = ['/etc', '/usr', '/bin', '/sbin', '/boot', '/root', '/home'];
    if (criticalPaths.some(critical => targetPath.startsWith(critical))) {
      throw new Error('Deletion of critical system paths is not allowed');
    }
    
    if (!fs.pathExistsSync(targetPath)) {
      return true; // Already doesn't exist - consider this a success
    }
    
    const stats = fs.statSync(targetPath);
    
    // Additional safety checks for directories
    if (stats.isDirectory()) {
      // Check if directory is empty when not recursive
      if (!recursive) {
        const contents = fs.readdirSync(targetPath);
        if (contents.length > 0) {
          throw new Error('Directory is not empty and recursive deletion is not enabled');
        }
      }
      
      // Check directory size to prevent accidental large deletions
      if (recursive) {
        const dirSize = getDirectorySizeSync(targetPath);
        if (dirSize > 1024 * 1024 * 1024) { // 1GB limit for safe deletion
          throw new Error('Directory too large for safe deletion');
        }
      }
    } else {
      // Check file size before deletion to prevent accidental loss of large files
      if (stats.size > 1024 * 1024 * 1024) { // 1GB limit for files
        throw new Error('File too large for safe deletion');
      }
    }
    
    // Use fs-extra's removeSync function which handles both files and directories
    if (recursive) {
      fs.removeSync(targetPath);
    } else {
      // For non-recursive deletion, use appropriate method based on type
      if (stats.isDirectory()) {
        fs.rmdirSync(targetPath);
      } else {
        fs.unlinkSync(targetPath);
      }
    }
    
    return true;
  } catch (error: any) {
    // Log detailed error information for debugging deletion failures
    qerrors(error, 'fileDeletion.safeDeleteSync: deletion failed', { 
      targetPath, 
      recursive,
      operation: recursive ? 'removeSync' : 'rmdirOrUnlinkSync',
      errorCode: error.code,
      errno: error.errno,
      syscall: error.syscall
    });
    return false;
  }
}

/**
 * Helper function to calculate directory size asynchronously
 * @param dirPath - Directory path to calculate size for
 * @returns Total size in bytes
 */
async function getDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0;
  const items = await fs.readdir(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const itemStats = await fs.stat(itemPath);
    
    if (itemStats.isDirectory()) {
      totalSize += await getDirectorySize(itemPath); // Recurse into subdirectories
    } else {
      totalSize += itemStats.size; // Add file size
    }
  }
  
  return totalSize;
}

/**
 * Helper function to calculate directory size synchronously
 * @param dirPath - Directory path to calculate size for
 * @returns Total size in bytes
 */
function getDirectorySizeSync(dirPath: string): number {
  let totalSize = 0;
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const itemStats = fs.statSync(itemPath);
    
    if (itemStats.isDirectory()) {
      totalSize += getDirectorySizeSync(itemPath); // Recurse into subdirectories
    } else {
      totalSize += itemStats.size; // Add file size
    }
  }
  
  return totalSize;
}

/**
 * Direct access to fs-extra for advanced use cases
 * For new code, prefer using fs-extra directly
 */
export { fs };