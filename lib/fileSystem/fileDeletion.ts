/**
 * File System Deletion Utilities
 * Handles safe file and directory deletion operations
 */

import * as fs from 'fs';
import qerrors from '../qerrorsFallback.js';

/**
 * Safely deletes a file or directory
 * @param targetPath - Path to delete
 * @param recursive - Whether to delete directories recursively (default: false)
 * @returns true if successful, false otherwise
 */
export function safeDelete(targetPath: string, recursive: boolean = false): boolean {
  try {
    // Validate target path
    if (!targetPath || typeof targetPath !== 'string') {
      throw new Error('Invalid target path provided');
    }
    
    // Prevent deletion of critical system directories
    const criticalPaths = ['/etc', '/usr', '/bin', '/sbin', '/boot', '/root', '/home'];
    if (criticalPaths.some(critical => targetPath.startsWith(critical))) {
      throw new Error('Deletion of critical system paths is not allowed');
    }
    
    if (!fs.existsSync(targetPath)) {
      return true; // Already doesn't exist
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
        const fs = require('fs');
        const path = require('path');
        
        const getDirSize = (dirPath: string): number => {
          let totalSize = 0;
          const items = fs.readdirSync(dirPath);
          for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const itemStats = fs.statSync(itemPath);
            if (itemStats.isDirectory()) {
              totalSize += getDirSize(itemPath);
            } else {
              totalSize += itemStats.size;
            }
          }
          return totalSize;
        };
        
        const dirSize = getDirSize(targetPath);
        if (dirSize > 1024 * 1024 * 1024) { // 1GB limit
          throw new Error('Directory too large for safe deletion');
        }
      }
      
      fs.rmSync(targetPath, { recursive, force: true });
    } else {
      // Check file size before deletion
      if (stats.size > 1024 * 1024 * 1024) { // 1GB limit
        throw new Error('File too large for safe deletion');
      }
      
      fs.unlinkSync(targetPath);
    }
    return true;
  } catch (error: any) {
    qerrors(error, 'fileDeletion.safeDelete: deletion failed', { 
      targetPath, 
      recursive,
      operation: recursive ? 'rmSync' : 'unlinkSync',
      errorCode: error.code,
      errno: error.errno,
      syscall: error.syscall
    });
    return false;
  }
}