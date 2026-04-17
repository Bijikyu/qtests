/**
 * ESM Globals - CommonJS-like Globals for ES Modules
 * 
 * This module provides CommonJS-like __filename and __dirname functionality
 * for ES modules, with special handling for Jest test environments.
 * 
 * Problem Solved:
 * ES modules don't have access to __filename and __dirname globals that
 * are available in CommonJS. This module provides safe alternatives that
 * work in both production and test environments.
 * 
 * Jest Compatibility:
 * - Avoids top-level import.meta usage; uses guarded import.meta access in a try/catch
 * - Provides fallback paths for Jest environment detection
 * - Avoids top-level import.meta usage that can cause Jest failures
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { NODE_ENV } from '../config/localVars.js';

// Detect if we're running in Jest environment
const isJestEnvironment = typeof jest !== 'undefined' || NODE_ENV === 'test';

/**
 * Get the current module's filename (ESM equivalent of __filename)
 * Uses guarded import.meta access to avoid Jest/static-analysis pitfalls
 * @returns Absolute path to the current module file
 */
export function getThisFilename() {
  if (isJestEnvironment) {
    // In Jest, provide a reasonable fallback path
    return path.resolve(process.cwd(), 'utils/esm-globals.ts');
  }
  // Use (0, eval) to hide import.meta from Jest's/CJS static parser —
  // same pattern as moduleReloader.ts. Caught if running in a CJS context.
  try {
    const metaUrl = (0, eval)('import.meta.url');
    if (metaUrl) {
      return fileURLToPath(metaUrl);
    }
  } catch (error) {
    // Fallback if import.meta is not available (CJS environment)
  }
  // Final fallback to current working directory
  return path.resolve(process.cwd(), 'utils/esm-globals.ts');
}

/**
 * Get the current module's directory (ESM equivalent of __dirname)
 * @returns Absolute path to the current module's directory
 */
export function getThisDirname() {
  return dirname(getThisFilename());
}

// Legacy exports for backward compatibility - use functions to avoid immediate evaluation
export function __filename() { return getThisFilename(); }
export function __dirname() { return getThisDirname(); }

/**
 * Get filename for a specific module using its import.meta.url
 * @param importMetaUrl - The import.meta.url from the calling module
 * @returns Absolute path to the specified module file
 */
export function getModuleFilename(importMetaUrl: string) {
  if (isJestEnvironment) {
    // In Jest, return a reasonable fallback for module resolution
    return path.resolve(process.cwd(), 'mock-module.ts');
  }
  return fileURLToPath(importMetaUrl);
}

/**
 * Get directory for a specific module using its import.meta.url
 * @param importMetaUrl - The import.meta.url from the calling module
 * @returns Absolute path to the specified module's directory
 */
export function getModuleDirname(importMetaUrl: string) {
  if (isJestEnvironment) {
    // In Jest, return current working directory as safe fallback
    return process.cwd();
  }
  try {
    return dirname(fileURLToPath(importMetaUrl));
  } catch (error) {
    // Fallback if there's any issue with the URL resolution
    return process.cwd();
  }
}
