// Re-export file system reading utilities
export * from './readingUtils.js';

// Re-export file system writing utilities
export * from './writingUtils.js';

// Re-export file system management utilities
export * from './managementUtils.js';

// Import functions for default export using the updated module structure
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
  ensureDir,
  safeWriteFile
} from './fileWriting.js';

import {
  safeDelete
} from './fileDeletion.js';

import {
  withFileErrorHandling
} from './errorHandling.js';

// Default export for compatibility
const fileSystemUtils = {
  safeExists,
  safeReadFile,
  safeWriteFile,
  ensureDir,
  safeDelete,
  safeStats,
  isDirectory,
  isFile,
  withFileErrorHandling
};

export default fileSystemUtils;

// Also export individual functions for compatibility
export {
  safeExists,
  safeReadFile,
  safeWriteFile,
  ensureDir,
  safeDelete,
  safeStats,
  isDirectory,
  isFile,
  withFileErrorHandling
};