/**
 * File System Reading Utilities
 * Handles safe file reading operations
 */

import * as fs from 'fs';
import qerrors from 'qerrors';

/**
 * Safely reads a file as UTF-8 text
 * @param filePath - Path to read
 * @returns File contents as string, or null if failed
 */
export function safeReadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    qerrors(error, 'fileReading.safeReadFile: reading file as UTF-8', { filePath });
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
  } catch (error) {
    qerrors(error, 'fileReading.safeReadFileBuffer: reading file as buffer', { filePath });
    return null;
  }
}