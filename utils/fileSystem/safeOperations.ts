/**
 * File System Utilities
 * Provides safe file system operations with consistent error handling
 */

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Safe file read operation with existence check and error handling
 * @param filePath - Path to file to read
 * @param encoding - File encoding (default: 'utf8')
 * @returns File content or null if file doesn't exist
 */
export async function safeReadFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string | null> {
  try {
    // Check if file exists
    await fs.access(filePath);
    
    // Read file content
    const content = await fs.readFile(filePath, encoding);
    return content;
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return null; // File doesn't exist
    }
    throw error; // Re-throw other errors
  }
}

/**
 * Safe file write operation with directory creation and error handling
 * @param filePath - Path to file to write
 * @param content - Content to write
 * @param encoding - File encoding (default: 'utf8')
 * @returns True if successful
 */
export async function safeWriteFile(filePath: string, content: string, encoding: BufferEncoding = 'utf8'): Promise<boolean> {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, content, encoding);
    return true;
  } catch (error) {
    console.error(`Failed to write file ${filePath}:`, error);
    return false;
  }
}

/**
 * Safe file deletion with existence check and error handling
 * @param filePath - Path to file to delete
 * @returns True if deleted or didn't exist, false on error
 */
export async function safeDeleteFile(filePath: string): Promise<boolean> {
  try {
    // Check if file exists
    await fs.access(filePath);
    
    // Delete file
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return true; // File doesn't exist - consider this success
    }
    console.error(`Failed to delete file ${filePath}:`, error);
    return false;
  }
}

/**
 * Safe directory deletion with existence check and error handling
 * @param dirPath - Path to directory to delete
 * @param recursive - Whether to delete recursively (default: false)
 * @returns True if deleted or didn't exist, false on error
 */
export async function safeDeleteDirectory(dirPath: string, recursive: boolean = false): Promise<boolean> {
  try {
    // Check if directory exists
    await fs.access(dirPath);
    
    // Delete directory
    if (recursive) {
      await fs.rm(dirPath, { recursive: true, force: true });
    } else {
      await fs.rmdir(dirPath);
    }
    return true;
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return true; // Directory doesn't exist - consider this success
    }
    console.error(`Failed to delete directory ${dirPath}:`, error);
    return false;
  }
}

/**
 * Safe path existence check with error handling
 * @param filePath - Path to check
 * @returns True if exists, false otherwise
 */
export async function safePathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return false;
    }
    throw error; // Re-throw other errors
  }
}