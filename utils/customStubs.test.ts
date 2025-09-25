// Validate layered custom stubs on top of qtests setup
import '../setup.js'; // activate core stub resolution first (axios, winston)

import {
  registerModuleStub,
  unregisterModuleStub,
  listModuleStubs,
  clearAllModuleStubs
} from './customStubs.js';

describe('customStubs layered loader', () => {
  afterEach(() => {
    // Keep tests isolated – we only clear our in‑memory registry
    clearAllModuleStubs();
  });

  test('serves custom stub for non‑existent module', () => {
    // Register a stub for a module that is not installed
    registerModuleStub('external-service-client', {
      ping: () => 'pong',
      get: async () => ({ ok: true })
    });

    const client = require('external-service-client');
    expect(typeof client.ping).toBe('function');
    expect(client.ping()).toBe('pong');
  });

  test('unregister removes stub and require fails afterwards', () => {
    registerModuleStub('feature-x', { fn: () => 42 });
    expect(require('feature-x').fn()).toBe(42);

    unregisterModuleStub('feature-x');

    // Now requiring should fail because the module is not installed
    expect(() => require('feature-x')).toThrow();
  });

  test('listModuleStubs reflects registrations', () => {
    registerModuleStub('a', {});
    registerModuleStub('b', {});
    const ids = listModuleStubs().sort();
    expect(ids).toEqual(['a', 'b']);
  });

  test('does not interfere with built‑in axios/winston stubs', () => {
    // These should still resolve using core setup stub registry
    expect(() => require('axios')).not.toThrow();
    expect(() => require('winston')).not.toThrow();
  });
});

