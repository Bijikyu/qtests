import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Detect if we're running in Jest environment
const isJestEnvironment = typeof jest !== 'undefined' || process.env.NODE_ENV === 'test';

// Export functions instead of direct variables to avoid top-level import.meta usage
export function getThisFilename() {
  if (isJestEnvironment) {
    return path.resolve(process.cwd(), 'utils/esm-globals.ts');
  }
  // Use eval to hide import.meta from Jest's static analysis
  return fileURLToPath((0, eval)('import.meta.url'));
}

export function getThisDirname() {
  return dirname(getThisFilename());
}

// Legacy exports for compatibility - use functions to avoid immediate evaluation
export function __filename() { return getThisFilename(); }
export function __dirname() { return getThisDirname(); }

export function getModuleFilename(importMetaUrl: string) {
  if (isJestEnvironment) {
    // In Jest, return a reasonable fallback
    return path.resolve(process.cwd(), 'mock-module.ts');
  }
  return fileURLToPath(importMetaUrl);
}

export function getModuleDirname(importMetaUrl: string) {
  if (isJestEnvironment) {
    // In Jest, return current working directory as fallback
    return process.cwd();
  }
  try {
    return dirname(fileURLToPath(importMetaUrl));
  } catch (error) {
    // Fallback if there's any issue with the URL
    return process.cwd();
  }
}