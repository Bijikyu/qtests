/**
 * File System Writing Utilities
 * Handles safe file and directory writing operations
 */

import * as fs from 'fs';
import * as path from 'path';
import { safeExists } from './readingUtils.js';
import qerrors from 'qerrors';

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
    const dir = path.dirname(filePath);
    if (!safeExists(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    
    await fs.promises.writeFile(filePath, content, encoding);
    return true;
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    qerrors(errorObj, 'writingUtils.safeWriteFile: file write failed', { 
      filePath, 
      encoding, 
      contentType: typeof content,
      contentLength: Buffer.isBuffer(content) ? content.byteLength : content.length,
      operation: 'writeFile'
    });
    return false;
  }
}

/**
 * Synchronously writes a file with directory creation (for backward compatibility)
 * @deprecated Use async safeWriteFile for better scalability
 */
export function safeWriteFileSync(filePath: string, content: string | Buffer, encoding: BufferEncoding = 'utf8'): boolean {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!safeExists(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, encoding);
    return true;
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    qerrors(errorObj, 'writingUtils.safeWriteFileSync: file write failed', { 
      filePath, 
      encoding, 
      contentType: typeof content,
      contentLength: Buffer.isBuffer(content) ? content.byteLength : content.length,
      operation: 'writeFileSync'
    });
    return false;
  }
}

/**
 * Ensures a directory exists, creating it if necessary (async version)
 * @param dirPath - Directory path to ensure
 * @returns true if directory exists or was created, false otherwise
 */
export async function ensureDir(dirPath: string): Promise<boolean> {
  try {
    if (!safeExists(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    qerrors(errorObj, 'writingUtils.ensureDir: directory creation failed', { 
      dirPath,
      operation: 'mkdir'
    });
    return false;
  }
}

/**
 * Synchronously ensures a directory exists (for backward compatibility)
 * @deprecated Use async ensureDir for better scalability
 */
export function ensureDirSync(dirPath: string): boolean {
  try {
    if (!safeExists(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    qerrors(errorObj, 'writingUtils.ensureDirSync: directory creation failed', { 
      dirPath,
      operation: 'mkdirSync'
    });
    return false;
  }
}