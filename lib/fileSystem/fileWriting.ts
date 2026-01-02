/**
 * File System Writing Utilities
 * Handles safe file writing operations
 */

import { safeExists, safeExistsAsync } from './fileExistence.js';
import qerrors from 'qerrors';
import { promises as fsPromises } from 'fs';
import { dirname } from 'path';

/**
 * Ensures a directory exists, creating it if necessary (async version)
 * @param dirPath - Directory path to ensure
 * @returns true if directory exists or was created, false otherwise
 */
export async function ensureDir(dirPath: string): Promise<boolean> {
  try {
    if (!await safeExistsAsync(dirPath)) {
      await fsPromises.mkdir(dirPath, { recursive: true });
    }
    return true;
  } catch (error: any) {
    qerrors(error, 'fileWriting.ensureDir: creating directory', { dirPath });
    return false;
  }
}

/**
 * Ensures a directory exists, creating it if necessary (sync version - DEPRECATED: use async version)
 * @param dirPath - Directory path to ensure
 * @returns true if directory exists or was created, false otherwise
 * @deprecated Use ensureDir instead for better scalability
 */
export function ensureDirSync(dirPath: string): boolean {
  console.warn('ensureDirSync is deprecated - use ensureDir for better scalability');
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
    // Ensure directory exists
    const dir = dirname(filePath);
    if (!await safeExistsAsync(dir)) {
      await fsPromises.mkdir(dir, { recursive: true });
    }
    
    await fsPromises.writeFile(filePath, content, encoding);
    return true;
  } catch (error: any) {
    qerrors(error, 'fileWriting.safeWriteFile: writing file', { filePath, encoding, contentType: typeof content });
    return false;
  }
}

/**
 * Safely writes a file with directory creation (sync version - DEPRECATED: use async version)
 * @param filePath - Path to write
 * @param content - Content to write
 * @param encoding - File encoding (default: utf8)
 * @returns true if successful, false otherwise
 * @deprecated Use safeWriteFile instead for better scalability
 */
export function safeWriteFileSync(filePath: string, content: string | Buffer, encoding: BufferEncoding = 'utf8'): boolean {
  console.warn('safeWriteFileSync is deprecated - use safeWriteFile for better scalability');
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