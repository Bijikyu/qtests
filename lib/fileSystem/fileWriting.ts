/**
 * File System Writing Utilities
 * Handles safe file writing operations
 */

import { safeExists, safeExistsAsync } from './fileExistence.js';
import qerrors from 'qerrors';

/**
 * Ensures a directory exists, creating it if necessary (async version)
 * @param dirPath - Directory path to ensure
 * @returns true if directory exists or was created, false otherwise
 */
export async function ensureDir(dirPath: string): Promise<boolean> {
  try {
    const fs = await import('fs');
    if (!await safeExistsAsync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
    return true;
  } catch (error: any) {
    qerrors(error, 'fileWriting.ensureDir: creating directory', { dirPath });
    return false;
  }
}

/**
 * Ensures a directory exists, creating it if necessary (sync version - use only in initialization)
 * @param dirPath - Directory path to ensure
 * @returns true if directory exists or was created, false otherwise
 */
export function ensureDirSync(dirPath: string): boolean {
  try {
    if (!safeExists(dirPath)) {
      const fs = require('fs');
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error: any) {
    qerrors(error, 'fileWriting.ensureDirSync: creating directory', { dirPath });
    return false;
  }
}

/**
 * Safely writes a file with directory creation (async version)
 * @param filePath - Path to write
 * @param content - Content to write
 * @param encoding - File encoding (default: utf8)
 * @returns true if successful, false otherwise
 */
export async function safeWriteFile(filePath: string, content: string | Buffer, encoding: BufferEncoding = 'utf8'): Promise<boolean> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!await safeExistsAsync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    
    await fs.promises.writeFile(filePath, content, encoding);
    return true;
  } catch (error: any) {
    qerrors(error, 'fileWriting.safeWriteFile: writing file', { filePath, encoding, contentType: typeof content });
    return false;
  }
}

/**
 * Safely writes a file with directory creation (sync version - use only in initialization)
 * @param filePath - Path to write
 * @param content - Content to write
 * @param encoding - File encoding (default: utf8)
 * @returns true if successful, false otherwise
 */
export function safeWriteFileSync(filePath: string, content: string | Buffer, encoding: BufferEncoding = 'utf8'): boolean {
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
    qerrors(error, 'fileWriting.safeWriteFileSync: writing file', { filePath, encoding, contentType: typeof content });
    return false;
  }
}