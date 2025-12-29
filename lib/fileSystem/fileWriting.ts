/**
 * File System Writing Utilities
 * Handles safe file writing operations
 */

import { safeExists } from './fileExistence.js';
import qerrors from 'qerrors';

/**
 * Ensures a directory exists, creating it if necessary
 * @param dirPath - Directory path to ensure
 * @returns true if directory exists or was created, false otherwise
 */
export function ensureDir(dirPath: string): boolean {
  try {
    if (!safeExists(dirPath)) {
      const fs = require('fs');
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error: any) {
    qerrors(error, 'fileWriting.ensureDir: creating directory', { dirPath });
    return false;
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
    const fs = require('fs');
    const path = require('path');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!safeExists(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, encoding);
    return true;
  } catch (error: any) {
    qerrors(error, 'fileWriting.safeWriteFile: writing file', { filePath, encoding, contentType: typeof content });
    return false;
  }
}