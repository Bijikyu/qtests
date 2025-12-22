/**
 * File System Reading Utilities
 * Handles safe file reading operations
 */

import * as fs from 'fs';

/**
 * Safely reads a file as UTF-8 text
 * @param filePath - Path to read
 * @returns File contents as string, or null if failed
 */
export function safeReadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Safely reads a file as buffer
 * @param filePath - Path to read
 * @returns File contents as buffer, or null if failed
 */
export function safeReadFileBuffer(filePath: string): Buffer | null {
  try {
    return fs.readFileSync(filePath);
  } catch {
    return null;
  }
}