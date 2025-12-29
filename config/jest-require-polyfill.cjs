/**
 * Jest Require Polyfill for ESM Tests
 * 
 * Purpose: Ensure a global `require` exists for ES Module test files that need
 * to use CommonJS require() calls. This is essential for mixed module systems.
 * 
 * Problem Solved:
 * ESM test files don't have access to require() by default, but many testing
 * utilities and legacy modules still use CommonJS require() syntax.
 * 
 * Execution Context:
 * - Executed by Jest via `setupFiles` configuration
 * - Runs BEFORE test files are evaluated
 * - Provides require() availability in ESM context
 * 
 * Fallback Strategy:
 * 1. Try to create require() relative to project root (preferred)
 * 2. Fallback to createRequire() from this file's location
 * 3. Silent failure to avoid breaking test startup
 */

try {
  if (typeof global.require === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createRequire } = require('module');
    let req;
    try {
      // Prefer resolving relative to project root for consistent module resolution
      req = createRequire(process.cwd() + '/package.json');
    } catch {
      // Fallback to this file's location if project root approach fails
      req = createRequire(__filename);
    }
    Object.defineProperty(global, 'require', {
      value: req,
      writable: false,      // Prevent accidental reassignment
      configurable: true,   // Allow Jest to modify if needed
      enumerable: false,     // Hide from enumeration
    });
  }
} catch {
  // Silent failure - require polyfill is nice-to-have, not essential
}

