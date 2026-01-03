/**
 * File System Writing Utilities
 * Replaced with fs-extra for better maintainability and industry-standard implementation
 * 
 * Migration Guide:
 * - ensureDir() -> fs.ensureDir()
 * - safeWriteFile() -> fs.outputFile()
 * - ensureDirSync() -> fs.ensureDirSync()
 * - safeWriteFileSync() -> fs.outputFileSync()
 */

import fs from 'fs-extra';
import qerrors from 'qerrors';

/**
 * Ensures a directory exists, creating it if necessary (async version)
 * @param dirPath - Directory path to ensure
 * @returns true if directory exists or was created, false otherwise
 */
export async function ensureDir(dirPath: string): Promise<boolean> {
  try {
    await fs.ensureDir(dirPath);
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
    fs.ensureDirSync(dirPath);
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
    await fs.outputFile(filePath, content, encoding);
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
    fs.outputFileSync(filePath, content, encoding);
    return true;
  } catch (error: any) {
    qerrors(error, 'fileWriting.safeWriteFileSync: writing file', { filePath, encoding, contentType: typeof content });
    return false;
  }
}

/**
 * Direct access to fs-extra for advanced use cases
 * For new code, prefer using fs-extra directly
 */
export { fs };