/**
 * File System Writing Utilities
 * Handles safe file and directory writing operations
 */

import * as fs from 'fs';
import * as path from 'path';
import { safeExists } from './readingUtils.js';

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