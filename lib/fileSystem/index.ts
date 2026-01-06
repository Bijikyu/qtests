// File system utilities re-export
// Re-export all file system utilities with minimal conflicts

import { 
  safeExists,
  safeStats,
  isDirectory,
  isFile
} from './fileExistence.js';

import {
  safeReadFile,
  safeReadFileBuffer
} from './fileReading.js';

import {
  safeDelete as managementSafeDelete,
  safeDeleteSync as managementSafeDeleteSync,
  ensureDir as managementEnsureDir,
  ensureDirSync as managementEnsureDirSync
} from './managementUtils.js';

import {
  withFileErrorHandling
} from './errorHandling.js';

import * as fs from 'fs-extra';

// Add safeWriteFile using fs-extra directly
export async function safeWriteFile(filePath: string, content: string | Buffer, encoding: BufferEncoding = 'utf8'): Promise<boolean> {
  try {
    await fs.ensureFile(filePath);
    await fs.writeFile(filePath, content, encoding);
    return true;
  } catch (error) {
    console.error('File write failed:', error);
    return false;
  }
}

// Resolve naming conflicts by providing prefixed versions
export const ensureDir = managementEnsureDir;
export const ensureDirSync = managementEnsureDirSync;
export const safeDelete = managementSafeDelete;
export const safeDeleteSync = managementSafeDeleteSync;

// Re-export without conflict
export {
  safeExists,
  safeStats,
  isDirectory,
  isFile,
  safeReadFile,
  safeReadFileBuffer,
  withFileErrorHandling
};

// Default export for compatibility
const fileSystemUtils = {
  safeExists,
  safeReadFile,
  safeWriteFile,
  ensureDir,
  safeDelete,
  safeDeleteSync,
  safeStats,
  isDirectory,
  isFile,
  withFileErrorHandling
};

export default fileSystemUtils;