/**
 * File System Existence Checking Utilities using fs-extra
 * Replaced with fs-extra for better maintainability and industry-standard implementation
 * 
 * Migration Guide:
 * - safeExists() -> fs.pathExists()
 * - safeExistsAsync() -> fs.pathExists()
 * - safeStats() -> fs.stat() with error handling
 * - safeStatsAsync() -> fs.stat() with error handling
 * - isDirectory() -> fs.pathExists() + fs.stat()
 * - isFile() -> fs.pathExists() + fs.stat()
 */

import fs from 'fs-extra';
import qerrors from '../qerrorsFallback.js';

/**
 * Safely checks if a file or directory exists (sync version - DEPRECATED: use async version)
 * @param filePath - Path to check
 * @returns true if exists, false otherwise
 * @deprecated Use safeExistsAsync instead for better scalability
 */
export function safeExists(filePath: string): boolean {
  console.warn('safeExists is deprecated - use safeExistsAsync for better scalability');
  try {
    return fs.pathExistsSync(filePath);
  } catch {
    // If pathExistsSync throws an error (e.g., due to permissions), treat as non-existent
    return false;
  }
}

/**
 * Safely checks if a file or directory exists (async version)
 * @param filePath - Path to check
 * @returns true if exists, false otherwise
 */
export async function safeExistsAsync(filePath: string): Promise<boolean> {
  try {
    return await fs.pathExists(filePath);
  } catch {
    // If pathExists throws an error (e.g., due to permissions), treat as non-existent
    return false;
  }
}

/**
 * Safely gets file stats (sync version - DEPRECATED: use async version)
 * @param filePath - Path to check
 * @returns fs.Stats object or null if failed
 * @deprecated Use safeStatsAsync instead for better scalability
 */
export function safeStats(filePath: string): fs.Stats | null {
  console.warn('safeStats is deprecated - use safeStatsAsync for better scalability');
  try {
    return fs.statSync(filePath);
  } catch (error) {
    qerrors(error as Error, 'fileExistence.safeStats: getting file stats failed', { 
      filePath,
      operation: 'statSync'
    });
    return null;
  }
}

/**
 * Safely gets file stats (async version)
 * @param filePath - Path to check
 * @returns fs.Stats object or null if failed
 */
export async function safeStatsAsync(filePath: string): Promise<fs.Stats | null> {
  try {
    return await fs.stat(filePath);
  } catch (error) {
    qerrors(error as Error, 'fileExistence.safeStatsAsync: getting file stats failed', { 
      filePath,
      operation: 'stat'
    });
    return null;
  }
}

/**
 * Safely checks if path is a directory (sync version - DEPRECATED: use async version)
 * @param dirPath - Path to check
 * @returns true if directory exists, false otherwise
 * @deprecated Use isDirectoryAsync instead for better scalability
 */
export function isDirectory(dirPath: string): boolean {
  console.warn('isDirectory is deprecated - use isDirectoryAsync for better scalability');
  try {
    return fs.pathExistsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Safely checks if path is a file (sync version - DEPRECATED: use async version)
 * @param filePath - Path to check
 * @returns true if file exists, false otherwise
 * @deprecated Use isFileAsync instead for better scalability
 */
export function isFile(filePath: string): boolean {
  console.warn('isFile is deprecated - use isFileAsync for better scalability');
  try {
    return fs.pathExistsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/**
 * Safely checks if path is a directory (async version)
 * @param dirPath - Path to check
 * @returns true if directory exists, false otherwise
 */
export async function isDirectoryAsync(dirPath: string): Promise<boolean> {
  try {
    const exists = await fs.pathExists(dirPath);
    if (!exists) return false;
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Safely checks if path is a file (async version)
 * @param filePath - Path to check
 * @returns true if file exists, false otherwise
 */
export async function isFileAsync(filePath: string): Promise<boolean> {
  try {
    const exists = await fs.pathExists(filePath);
    if (!exists) return false;
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Direct access to fs-extra for advanced use cases
 * For new code, prefer using fs-extra directly
 */
export { fs };