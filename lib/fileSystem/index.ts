// Re-export file system reading utilities
export * from './readingUtils.js';

// Re-export file system writing utilities
export * from './writingUtils.js';

// Re-export file system management utilities
export * from './managementUtils.js';

// Import functions for default export
import {
  safeExists,
  safeReadFile,
  safeWriteFile,
  ensureDir,
  safeDelete,
  safeStats,
  isDirectory,
  isFile,
  withFileErrorHandling
} from './readingUtils.js';

import { ensureDir as ensureDirFromWriting } from './writingUtils.js';
import { safeDelete as safeDeleteFromManagement, withFileErrorHandling as withFileErrorHandlingFromManagement } from './managementUtils.js';

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