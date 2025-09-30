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

  register(name: string, factory: MockFactory): void {
    const key = String(name).trim();
    if (!key) return;
    this.map.set(key, { factory });
    this.evictRequireCache(key);
  }

  has(name: string): boolean {
    return this.map.has(name);
  }

  get(name: string): any {
    const entry = this.map.get(name);
    if (!entry) return undefined;
    if (typeof entry.instance === 'undefined') {
      try { entry.instance = entry.factory(); }
      catch { entry.instance = {}; }
    }
    return entry.instance;
  }

  list(): string[] { return Array.from(this.map.keys()); }

  installRequireHook(): void {
    if (this.installed) return;
    this.installed = true;
    const anyModule = Module as any;
    if (typeof anyModule._load !== 'function') return;
    this._origLoad = anyModule._load;
    const self = this;
    anyModule._load = function(id: string, parent: any, isMain?: boolean) {
      if (self.has(id)) {
        return self.get(id);
      }
      try { return self._origLoad.call(this, id, parent, isMain); }
      catch (err) { throw err; }
    };
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
    try { return require('../stubs/axios.ts').default; } catch {}
    try { return require('../stubs/axios.js').default; } catch {}
    return {};
  });
  // winston: provide no-op logger surface with format/transports
  mockRegistry.register('winston', () => {
    try { return require('../stubs/winston.ts').default; } catch {}
    try { return require('../stubs/winston.js').default; } catch {}
    return { createLogger: () => ({ error() {}, warn() {}, info() {}, debug() {}, verbose() {}, silly() {} }), format: {}, transports: {} };
  });
  // mongoose: if projects still import it in unit tests, hand back a tiny proxy
  mockRegistry.register('mongoose', () => {
    // Prefer local manual mock if present in client repo via Jest mapping; otherwise a safe object
    try { return require('../../__mocks__/mongoose.js'); } catch {}
    return { model: () => ({}) };
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

