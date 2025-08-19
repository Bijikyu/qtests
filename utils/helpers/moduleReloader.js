/**
 * Module Reloading Utility
 * 
 * This module provides functionality for reloading modules from Node.js cache
 * for isolated testing scenarios. It focuses solely on module cache management.
 */

const path = require('path');

// Thread-safe module reloading lock to prevent race conditions
const moduleReloadLock = new Set();

/**
 * Reload a module from cache for isolated testing
 * 
 * This function clears a module from Node.js require cache and reloads it,
 * enabling tests to verify module loading behavior and ensure fresh module
 * state between tests.
 * 
 * @param {string} relPath - Relative path to module that should be reloaded
 * @returns {Object} The freshly loaded module object
 * @throws {Error} If module cannot be found or loaded
 */
function reload(relPath) {
  console.log(`reload is running with ${relPath}`);

  const fullPath = path.resolve(__dirname, relPath);

  if (moduleReloadLock.has(fullPath)) {
    console.log(`reload has run resulting in skip`);
    return require(fullPath);
  }

  try {
    moduleReloadLock.add(fullPath);
    delete require.cache[require.resolve(fullPath)];
    const mod = require(fullPath);
    moduleReloadLock.delete(fullPath);
    console.log(`reload is returning module`);
    return mod;
  } catch (err) {
    moduleReloadLock.delete(fullPath);
    console.log(`reload error ${err.message}`);
    throw err;
  }
}

module.exports = {
  reload
};