/**
 * File System Deletion Utilities
 * Handles safe file and directory deletion operations
 */

import * as fs from 'fs';
import qerrors from 'qerrors';

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
  } catch (error) {
    qerrors(error, 'fileDeletion.safeDelete: deletion failed', { 
      targetPath, 
      recursive,
      operation: recursive ? 'rmSync' : 'unlinkSync'
    });
    return false;
  }
}