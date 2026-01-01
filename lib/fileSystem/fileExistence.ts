/**
 * File System Existence Checking Utilities
 * Handles safe file and directory existence checks
 */

import * as fs from 'fs';
import qerrors from 'qerrors';

/**
 * Safely checks if a file or directory exists (sync version - DEPRECATED: use async version)
 * @param filePath - Path to check
 * @returns true if exists, false otherwise
 * @deprecated Use safeExistsAsync instead for better scalability
 */
export function safeExists(filePath: string): boolean {
  console.warn('safeExists is deprecated - use safeExistsAsync for better scalability');
  try {
    return fs.existsSync(filePath);
  } catch {
    // If existsSync throws an error (e.g., due to permissions), treat as non-existent
    // This provides graceful degradation for file system access issues
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
    await fs.promises.access(filePath);
    return true;
  } catch {
    // If access throws an error (e.g., due to permissions or non-existence), treat as non-existent
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
    return await fs.promises.stat(filePath);
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
  const stats = safeStats(dirPath);
  return stats ? stats.isDirectory() : false; // Return false if stats failed (path doesn't exist)
}

/**
 * Safely checks if path is a file (sync version - DEPRECATED: use async version)
 * @param filePath - Path to check
 * @returns true if file exists, false otherwise
 * @deprecated Use isFileAsync instead for better scalability
 */
export function isFile(filePath: string): boolean {
  console.warn('isFile is deprecated - use isFileAsync for better scalability');
  const stats = safeStats(filePath);
  return stats ? stats.isFile() : false; // Return false if stats failed (path doesn't exist)
}

/**
 * Safely checks if path is a directory (async version)
 * @param dirPath - Path to check
 * @returns true if directory exists, false otherwise
 */
export async function isDirectoryAsync(dirPath: string): Promise<boolean> {
  const stats = await safeStatsAsync(dirPath);
  return stats ? stats.isDirectory() : false; // Return false if stats failed (path doesn't exist)
}

/**
 * Safely checks if path is a file (async version)
 * @param filePath - Path to check
 * @returns true if file exists, false otherwise
 */
export async function isFileAsync(filePath: string): Promise<boolean> {
  const stats = await safeStatsAsync(filePath);
  return stats ? stats.isFile() : false; // Return false if stats failed (path doesn't exist)
}