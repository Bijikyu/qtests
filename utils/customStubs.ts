/**
 * Custom Module Stubs - Layered Loader Hook (TypeScript, ESM)
 * 
 * Purpose:
 * Many teams need to stub niche third‑party modules beyond the built‑ins (axios, winston)
 * without editing qtests core. This module adds a safe, additive hook on top of qtests
 * setup so tests can register ad‑hoc module stubs programmatically.
 * 
 * Design:
 * - Does NOT modify qtests core setup.js implementation
 * - Patches Module._load a second time to return in‑memory exports for known ids
 * - Works even for modules that aren’t installed (useful for service SDKs)
 * - Honors QTESTS_SILENT to avoid noisy logs in CI
 * - Safe to import multiple times; patch is idempotent
 * 
 * Usage:
 *   import '../setup.js'            // ALWAYS first
 *   import { registerModuleStub } from './customStubs.js'
 *   registerModuleStub('some-sdk', { call: () => 'ok' })
 *   const sdk = require('some-sdk') // returns the stub above
 * 
 * Caveats:
 * - Must run BEFORE requiring the target module
 * - If the real module was already loaded, unregister + require cache tricks are risky;
 *   prefer clean order: setup -> register -> require.
 */

import Module from 'module';
import { QTESTS_SILENT } from '../config/localVars.js';

// Respect CI silence toggle to reduce noise
const qtestsSilent = String(QTESTS_SILENT || '').toLowerCase();
const shouldLog = !(qtestsSilent === '1' || qtestsSilent === 'true');

// Internal in‑memory registry of ad‑hoc stubs
// Key: module id (e.g., 'uuid') -> value: either exports object or factory function returning exports
type StubValue = any | (() => any);
const CUSTOM_STUBS: Record<string, StubValue> = Object.create(null);

// Track whether we've already layered our patch to avoid double wrapping
let isPatched = false;

/**
 * Patch Node's loader once to inject custom stubs.
 * This wraps the current Module._load (which may already be patched by qtests setup).
 */
function patchLoaderOnce(): void {
  if (isPatched) {
    return; // idempotent
  }

  // Capture whatever loader is currently active (qtests core already patched it in setup.ts)
  const previousLoad = (Module as any)._load;

  // Module ID validation to prevent supply chain attacks
  function validateModuleId(id: string): boolean {
    if (typeof id !== 'string' || !id.trim()) {
      return false;
    }
    
    // Reject dangerous patterns
    const dangerousPatterns = [
      /\.\./,  // Directory traversal
      /^\//,   // Absolute paths
      /[<>]/,  // HTML injection
      /[|&;$`]/, // Command injection
      /^(data|javascript|vbscript):/i, // Protocol injection
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(id)) {
        console.error(`qtests: Dangerous module ID pattern detected: ${id}`);
        return false;
      }
    }
    
    // Allow only typical module identifier patterns
    const validPattern = /^[a-zA-Z0-9@/._-]+$/;
    return validPattern.test(id);
  }

  (Module as any)._load = function(id: string, parent: any, isMain?: boolean): any {
    // Validate module ID before processing
    if (!validateModuleId(id)) {
      throw new Error(`qtests: Invalid or dangerous module ID: ${id}`);
    }
    
    // If a custom stub is registered, return its exports without touching disk
    if (Object.prototype.hasOwnProperty.call(CUSTOM_STUBS, id)) {
      const value = CUSTOM_STUBS[id];
      try {
        const exportsObj = typeof value === 'function' ? (value as Function)() : value;
        if (shouldLog) {
          console.log(`qtests: custom stub served for ${id}`);
        }
        return exportsObj;
      } catch (err: any) {
        // If the factory throws, surface a clear error
        const msg = err && err.message ? err.message : String(err);
        console.log(`qtests: custom stub factory for ${id} threw: ${msg}`);
        throw err;
      }
    }

    // Delegate to the previous loader (this preserves core axios/winston stubbing)
    return previousLoad.call(this, id, parent, isMain);
  };

  isPatched = true;
  if (shouldLog) {
    console.log('qtests: Custom stubs loader installed');
  }
}

/**
 * Register a custom module stub.
 * Must be called BEFORE requiring the target module in tests.
 *
 * @param moduleId - The exact module id used in require/import (e.g., 'uuid')
 * @param stub - Either an exports object or a zero‑arg factory returning exports
 */
function registerModuleStub(moduleId: string, stub: StubValue): void {
  if (typeof moduleId !== 'string' || moduleId.length === 0) {
    throw new Error('registerModuleStub: moduleId must be a non‑empty string');
  }
  if (stub === null || stub === undefined) {
    throw new Error('registerModuleStub: stub must be provided');
  }
  CUSTOM_STUBS[moduleId] = stub;
  patchLoaderOnce();
  if (shouldLog) {
    console.log(`qtests: custom stub registered for ${moduleId}`);
  }
}

/**
 * Remove a previously registered custom stub.
 * Does not alter require cache for safety (tests should control load order).
 *
 * @param moduleId - The module id to unregister
 */
function unregisterModuleStub(moduleId: string): void {
  if (typeof moduleId !== 'string' || moduleId.length === 0) {
    throw new Error('unregisterModuleStub: moduleId must be a non‑empty string');
  }
  delete CUSTOM_STUBS[moduleId];
  // Hint to Jest to drop module registry so subsequent require() re-evaluates
  try {
    const g: any = globalThis as any;
    if (g.jest && typeof g.jest.resetModules === 'function') {
      g.jest.resetModules();
    }
  } catch {}
  if (shouldLog) {
    console.log(`qtests: custom stub unregistered for ${moduleId}`);
  }
}

/**
 * List all currently registered custom stubs (ids only).
 * Useful for debugging and assertions in tests.
 */
function listModuleStubs(): string[] {
  return Object.keys(CUSTOM_STUBS);
}

/**
 * Clear all custom stubs. Safe helper for afterEach blocks.
 * Does not clear Node's module cache – that is an explicit choice left to tests.
 */
function clearAllModuleStubs(): void {
  for (const key of Object.keys(CUSTOM_STUBS)) {
    delete CUSTOM_STUBS[key];
  }
  if (shouldLog) {
    console.log('qtests: all custom stubs cleared');
  }
}

// Export API at bottom per policy
export {
  registerModuleStub,
  unregisterModuleStub,
  listModuleStubs,
  clearAllModuleStubs
};

/**
 * Resolve a registered stub without triggering Node resolution.
 * Returns the concrete exports object if present, otherwise undefined.
 */
export function resolveModuleStub(moduleId: string): any | undefined {
  if (!Object.prototype.hasOwnProperty.call(CUSTOM_STUBS, moduleId)) return undefined;
  const value = CUSTOM_STUBS[moduleId];
  try {
    return typeof value === 'function' ? (value as Function)() : value;
  } catch (err) {
    return undefined;
  }
}

// Expose a global resolver for environments where CJS interop is needed (e.g., Jest proxies)
try {
  const g: any = globalThis as any;
  if (!g.__QTESTS_RESOLVE_CUSTOM_STUB) {
    g.__QTESTS_RESOLVE_CUSTOM_STUB = (id: string) => resolveModuleStub(id);
  }
} catch {}
