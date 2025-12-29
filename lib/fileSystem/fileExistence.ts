/**
 * File System Existence Checking Utilities
 * Handles safe file and directory existence checks
 */

import * as fs from 'fs';
import qerrors from 'qerrors';

/**
 * Safely checks if a file or directory exists
 * @param filePath - Path to check
 * @returns true if exists, false otherwise
 */
export function safeExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    // If existsSync throws an error (e.g., due to permissions), treat as non-existent
    // This provides graceful degradation for file system access issues
    return false;
  }
}

/**
 * Safely gets file stats
 * @param filePath - Path to check
 * @returns fs.Stats object or null if failed
 */
export function safeStats(filePath: string): fs.Stats | null {
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
 * Safely checks if path is a directory
 * @param dirPath - Path to check
 * @returns true if directory exists, false otherwise
 */
export function isDirectory(dirPath: string): boolean {
  const stats = safeStats(dirPath);
  return stats ? stats.isDirectory() : false; // Return false if stats failed (path doesn't exist)
}

/**
 * Safely checks if path is a file
 * @param filePath - Path to check
 * @returns true if file exists, false otherwise
 */
export function isFile(filePath: string): boolean {
  const stats = safeStats(filePath);
  return stats ? stats.isFile() : false; // Return false if stats failed (path doesn't exist)
}