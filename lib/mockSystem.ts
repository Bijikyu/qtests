/**
 * Mock System - runtime-safe, extensible module mocking for qtests (TypeScript ESM)
 *
 * Provides a small API for registering module-level mocks and a safe require hook
 * that returns those mocks when the module id matches. It avoids path rewrites and
 * instead returns factory-produced instances directly, ensuring low overhead.
 *
 * Public API (exported via index.ts):
 *   qtests.mock.module(name: string, factory: () => any): void
 *
 * Behavior:
 * - Idempotent install: _load hook is patched once per process.
 * - Stable instances: factories are invoked at first access; instance is cached.
 * - Late activation: on registration, best-effort cache busting purges require.cache
 *   entries that obviously belong to the target module so subsequent require() returns
 *   the mock (CJS only). ESM already-imported modules cannot be replaced; optional
 *   loader hooks exist to intercept ESM early.
 */

import Module from 'module';
import path from 'path';

type MockFactory = () => any;

interface MockEntry {
  factory: MockFactory;
  instance?: any;
}

class MockRegistry {
  private map = new Map<string, MockEntry>();
  private installed = false;
  private _origLoad: any = null;
  private _installing = false;
  private _lockMap = new Map<string, Promise<any>>();

  register(name: string, factory: MockFactory): void {
    const key = String(name).trim();
    if (!key) return;
    this.map.set(key, { factory });
    this.evictRequireCache(key);
  }

  has(name: string): boolean {
    return this.map.has(name);
  }

  async get(name: string): Promise<any> {
    const entry = this.map.get(name);
    if (!entry) return undefined;
    
    // Return existing instance if already created
    if (typeof entry.instance !== 'undefined') {
      return entry.instance;
    }
    
    // Prevent concurrent factory executions with timeout to prevent deadlocks
    if (this._lockMap.has(name)) {
      const existingPromise = this._lockMap.get(name);
      if (existingPromise) {
        // Add timeout to prevent indefinite waiting with cleanup
        let timeoutId = null;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Mock factory timeout')), 5000);
        });
        
        try {
          return await Promise.race([existingPromise, timeoutPromise]);
        } catch (timeoutError) {
          // If timeout occurs, clean up and remove the lock to retry
          if (timeoutId) clearTimeout(timeoutId);
          this._lockMap.delete(name);
          console.warn(`Mock factory timeout for ${name}, falling back to empty object`);
          // Return fallback object to prevent infinite loop
          entry.instance = {};
          return entry.instance;
        }
      }
    }
    
    // Create and cache the instance
    const factoryPromise = this._executeFactory(entry, name);
    this._lockMap.set(name, factoryPromise);
    
    try {
      entry.instance = await factoryPromise;
      return entry.instance;
    } catch (error) {
      entry.instance = {};
      console.warn(`Mock factory failed for ${name}:`, error);
      return entry.instance;
    } finally {
      this._lockMap.delete(name);
    }
  }

  private async _executeFactory(entry: MockEntry, name: string): Promise<any> {
    let result;
    try {
      result = entry.factory();
      // Handle both sync and async factories
      return result instanceof Promise ? await result : result;
    } catch (error) {
      // Lock cleanup will be handled by finally block
      throw error;
    }
  }

  // Synchronous version for backward compatibility
  getSync(name: string): any {
    const entry = this.map.get(name);
    if (!entry) return undefined;
    if (typeof entry.instance === 'undefined') {
      try { 
        const result = entry.factory();
        entry.instance = result instanceof Promise ? {} : result;
        if (result instanceof Promise) {
          console.warn(`Async mock factory detected for ${name} - use async get() method`);
        }
      } catch (error) { 
        entry.instance = {}; 
        console.warn(`Sync mock factory failed for ${name}:`, error);
      }
    }
    return entry.instance;
  }

  list(): string[] { return Array.from(this.map.keys()); }

  installRequireHook(): void {
    if (this.installed || this._installing) return;
    
    this._installing = true;
    
    try {
      this.installed = true;
      const anyModule = Module as any;
      if (typeof anyModule._load !== 'function') return;
      
      this._origLoad = anyModule._load;
      const self = this;
      
      anyModule._load = function(id: string, parent: any, isMain?: boolean) {
        if (self.has(id)) {
          // Use synchronous version for require hook compatibility
          return self.getSync(id);
        }
        try { 
          return self._origLoad.call(this, id, parent, isMain); 
        } catch (err) { 
          throw err; 
        }
      };
    } finally {
      this._installing = false;
    }
  }

  private evictRequireCache(moduleName: string): void {
    // Best effort: remove cache entries that look like this package name under node_modules
    try {
      const keys = Object.keys((require as any).cache || {});
      const needle = `${path.sep}node_modules${path.sep}${moduleName}${path.sep}`;
      for (const k of keys) {
        if (k.includes(needle) || k.endsWith(`${path.sep}${moduleName}.js`) || k.endsWith(`${path.sep}${moduleName}.cjs`)) {
          try { delete (require as any).cache[k]; } catch {}
        }
      }
    } catch {}
  }
}

// Singleton registry used by qtests
export const mockRegistry = new MockRegistry();

// Default stub registrations (axios, winston, mongoose)
export function registerDefaultMocks(): void {
  // axios: return a minimal truthy object compatible with typical checks
  mockRegistry.register('axios', () => {
    let axiosStub;
    try { 
      // Validate path to prevent traversal - use absolute path resolution and normalize
      const axiosPath = require.resolve('../stubs/axios.ts');
      const resolvedPath = path.normalize(path.resolve(axiosPath));
      const expectedDir = path.normalize(path.resolve(process.cwd(), 'stubs'));
      
      // More robust path validation - check for directory traversal attempts
      if (!resolvedPath.startsWith(expectedDir + path.sep) && resolvedPath !== expectedDir) {
        throw new Error('Invalid stub path - outside expected directory');
      }
      
      // Additional safety check - double-check no directory traversal after all validations
      // This is redundant with the directory check above but provides additional safety
      const relativePath = path.relative(expectedDir, resolvedPath);
      if (relativePath.startsWith('..') || relativePath.includes(path.sep + '..')) {
        throw new Error('Invalid stub path - directory traversal detected');
      }
      
      // Prevent infinite recursion - check if we're already loading this specific file
      if (resolvedPath === __filename) {
        throw new Error('Recursive stub loading detected');
      }
      
      axiosStub = require(axiosPath).default; 
    } catch (tsError) {
      // TypeScript stub failed, try JavaScript
      try { 
        const axiosJsPath = require.resolve('../stubs/axios.js');
        const resolvedPath = path.normalize(path.resolve(axiosJsPath));
        const expectedDir = path.normalize(path.resolve(process.cwd(), 'stubs'));
        
        // More robust path validation
        if (!resolvedPath.startsWith(expectedDir + path.sep) && resolvedPath !== expectedDir) {
          throw new Error('Invalid stub path - outside expected directory');
        }
        
        // Additional safety check - double-check no directory traversal after all validations
        // This is redundant with the directory check above but provides additional safety
        const relativePath = path.relative(expectedDir, resolvedPath);
        if (relativePath.startsWith('..') || relativePath.includes(path.sep + '..')) {
          throw new Error('Invalid stub path - directory traversal detected');
        }
        
        // Prevent infinite recursion
        if (resolvedPath === __filename) {
          throw new Error('Recursive stub loading detected');
        }
        
        axiosStub = require(axiosJsPath).default; 
      } catch (jsError) {
        // Both stubs failed, use fallback
        axiosStub = {};
      }
    }
    return axiosStub || {};
  });
  // winston: provide no-op logger surface with format/transports
  mockRegistry.register('winston', () => {
    let winstonStub;
    try { 
      // Validate path to prevent traversal - use proper path resolution
      const winstonPath = require.resolve('../stubs/winston.ts');
      const resolvedPath = path.resolve(winstonPath);
      const expectedDir = path.resolve(process.cwd(), 'stubs');
      if (!resolvedPath.startsWith(expectedDir + path.sep)) {
        throw new Error('Invalid stub path - outside expected directory');
      }
      winstonStub = require(winstonPath).default; 
    } catch (tsError) {
      // TypeScript stub failed, try JavaScript
      try { 
        const winstonJsPath = require.resolve('../stubs/winston.js');
        const resolvedPath = path.resolve(winstonJsPath);
        const expectedDir = path.resolve(process.cwd(), 'stubs');
        if (!resolvedPath.startsWith(expectedDir + path.sep)) {
          throw new Error('Invalid stub path - outside expected directory');
        }
        winstonStub = require(winstonJsPath).default; 
      } catch (jsError) {
        // Both stubs failed, use fallback
        winstonStub = { createLogger: () => ({ error() {}, warn() {}, info() {}, debug() {}, verbose() {}, silly() {} }), format: {}, transports: {} };
      }
    }
    return winstonStub || { createLogger: () => ({ error() {}, warn() {}, info() {}, debug() {}, verbose() {}, silly() {} }), format: {}, transports: {} };
  });
  // mongoose: if projects still import it in unit tests, hand back a tiny proxy
  mockRegistry.register('mongoose', () => {
    // Prefer local manual mock if present in client repo via Jest mapping; otherwise a safe object
    try { 
      // Validate path to prevent traversal - use proper path resolution
      const mongoosePath = require.resolve('../../__mocks__/mongoose.js');
      const resolvedPath = path.resolve(mongoosePath);
      const expectedDir = path.resolve(process.cwd(), '__mocks__');
      if (!resolvedPath.startsWith(expectedDir + path.sep)) {
        throw new Error('Invalid mock path - outside expected directory');
      }
      return require(mongoosePath); 
    } catch (error) {
      // Fall back to safe object if manual mock unavailable
      return { model: () => ({}) };
    }
  });
}

export function installMocking(): void {
  mockRegistry.installRequireHook();
}

// Public facade used by index.ts
export const mockAPI = {
  module(name: string, factory: MockFactory): void {
    mockRegistry.register(name, factory);
  }
};

