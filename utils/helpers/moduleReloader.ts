/**
 * Module Reloading Utility - TypeScript Implementation
 * 
 * This module provides functionality for reloading modules from Node.js cache
 * for isolated testing scenarios. It focuses solely on module cache management.
 */

import path from 'path';
import { getModuleDirname } from '../esm-globals.js';

// For ES modules, we need to get __dirname equivalent - lazy initialization for Jest compatibility
let moduleDirname: string | undefined;
function getModuleDirnameForReloader(): string {
  if (moduleDirname === undefined) {
    try {
      // Use eval to hide import.meta from Jest's static parser
      const importMetaUrl = (0, eval)('import.meta.url');
      moduleDirname = getModuleDirname(importMetaUrl);
    } catch (error) {
      // Fallback for Jest environment
      moduleDirname = process.cwd();
    }
  }
  return moduleDirname;
}

// Thread-safe module reloading lock to prevent race conditions
const moduleReloadLock = new Set<string>();

/**
 * Reload a module from cache for isolated testing
 * 
 * This function clears a module from Node.js require cache and reloads it,
 * enabling tests to verify module loading behavior and ensure fresh module
 * state between tests.
 * 
 * Note: In ES modules, dynamic imports don't have the same caching behavior as CommonJS require.
 * This function provides a compatibility layer for testing scenarios.
 * 
 * @param relPath - Relative path to module that should be reloaded
 * @returns The freshly loaded module object
 * @throws Error if module cannot be found or loaded
 */
async function reload(relPath: string): Promise<any> {
  console.log(`reload is running with ${relPath}`);

  // Resolve relative to the utils directory (parent of helpers)
  const fullPath = path.resolve(getModuleDirnameForReloader(), '..', relPath);

  if (moduleReloadLock.has(fullPath)) {
    console.log(`reload has run resulting in skip`);
    try {
      return await import(fullPath);
    } catch (error: any) {
      console.log(`reload error during skip: ${error.message}`);
      throw error;
    }
  }

  try {
    moduleReloadLock.add(fullPath);
    
    // For ES modules, we use dynamic import with cache busting
    const cacheBuster = `?t=${Date.now()}`;
    const moduleUrl = `${fullPath}${cacheBuster}`;
    const mod = await import(moduleUrl);
    
    moduleReloadLock.delete(fullPath);
    console.log(`reload is returning module`);
    return mod;
  } catch (err: any) {
    moduleReloadLock.delete(fullPath);
    console.log(`reload error ${err.message}`);
    throw err;
  }
}

// Export module reloading utilities using ES module syntax
export {
  reload,
  moduleReloadLock
};