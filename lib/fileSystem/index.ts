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
  ensureDir as writingEnsureDir,
  safeWriteFile as writingSafeWriteFile
} from './writingUtils.js';

import {
  safeDelete as managementSafeDelete,
  safeDeleteSync as managementSafeDeleteSync,
  ensureDir as managementEnsureDir,
  ensureDirSync as managementEnsureDirSync
} from './managementUtils.js';

import {
  withFileErrorHandling
} from './errorHandling.js';

// Resolve naming conflicts by providing prefixed versions
export const ensureDir = writingEnsureDir;
export const safeWriteFile = writingSafeWriteFile;
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