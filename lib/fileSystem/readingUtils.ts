/**
 * File System Reading Utilities (Legacy Compatibility)
 * DEPRECATED: This file maintains backward compatibility.
 * Use the specific modules instead:
 * - fileExistence.ts for existence checks
 * - fileReading.ts for reading operations
 * - fileWriting.ts for writing operations
 * - fileDeletion.ts for deletion operations
 * - errorHandling.ts for error handling utilities
 */

// Re-export all functions from specialized modules for backward compatibility
export {
  safeExists,
  safeStats,
  isDirectory,
  isFile
} from './fileExistence.js';

export {
  safeReadFile,
  safeReadFileBuffer
} from './fileReading.js';

export {
  ensureDir,
  safeWriteFile
} from './fileWriting.js';

export {
  safeDelete
} from './fileDeletion.js';

export {
  withFileErrorHandling
} from './errorHandling.js';