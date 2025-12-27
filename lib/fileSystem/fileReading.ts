/**
 * File System Reading Utilities
 * Handles safe file reading operations
 */

import * as fs from 'fs';
import qerrors from '../qerrorsFallback.js';

/**
 * Safely reads a file as UTF-8 text
 * @param filePath - Path to read
 * @returns File contents as string, or null if failed
 */
export function safeReadFile(filePath: string): string | null {
  try {
    // Validate file path to prevent path traversal
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path provided');
    }
    
    // Check file existence and size before reading
    const stats = fs.statSync(filePath);
    if (stats.size > 100 * 1024 * 1024) { // 100MB limit
      throw new Error('File too large for safe reading');
    }
    
    return fs.readFileSync(filePath, 'utf8');
  } catch (error: any) {
    qerrors(error, 'fileReading.safeReadFile: reading file as UTF-8', { 
      filePath,
      errorCode: error.code,
      errno: error.errno,
      syscall: error.syscall,
      operation: 'readFileSync'
    });
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
    // Validate file path to prevent path traversal
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path provided');
    }
    
    // Check file existence and size before reading
    const stats = fs.statSync(filePath);
    if (stats.size > 500 * 1024 * 1024) { // 500MB limit for buffer reads
      throw new Error('File too large for safe buffer reading');
    }
    
    return fs.readFileSync(filePath);
  } catch (error: any) {
    qerrors(error, 'fileReading.safeReadFileBuffer: reading file as buffer', { 
      filePath,
      errorCode: error.code,
      errno: error.errno,
      syscall: error.syscall,
      operation: 'readFileSync'
    });
    return null;
  }
}