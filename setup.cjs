'use strict';

/**
 * CommonJS setup entrypoint for qtests.
 *
 * Why this exists:
 * - The package is ESM-first ("type": "module"), but many test suites are still CommonJS.
 * - Consumers expect `require('qtests/setup')` to synchronously install the require-hook.
 *
 * Scope:
 * - This entrypoint installs ONLY the require-hook for built-in stubs (axios/winston/mongoose).
 * - ESM import interception still requires the optional loader (`qtests/loader`).
 */

const fs = require('fs');
const path = require('path');
const { Module } = require('module');

function isTruthy(v) {
  if (!v) return false;
  const s = String(v).trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes';
}

const quiet = isTruthy(process.env.QTESTS_SILENT);

function createFallbackWinston() {
  const noop = () => {};
  return {
    createLogger: () => ({
      error: noop, warn: noop, info: noop, debug: noop, verbose: noop, silly: noop, close: noop
    }),
    format: {},
    transports: {},
    addColors: noop,
    level: 'info'
  };
}

function loadCjsStub(stubsDir, fileName, fallbackValue) {
  try {
    const mod = require(path.join(stubsDir, fileName));
    return (mod && (mod.default || mod)) || fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function loadMongooseStub() {
  // If a client project provides a manual mock, prefer it.
  const candidates = [
    path.join(process.cwd(), '__mocks__', 'mongoose.js'),
    path.join(process.cwd(), '__mocks__', 'mongoose.cjs')
  ];
  for (const p of candidates) {
    try {
      if (!fs.existsSync(p)) continue;
      return require(p);
    } catch {
      // keep searching
    }
  }
  return { model: () => ({}) };
}

function installRequireHook() {
  // Idempotent install across multiple requires.
  if (globalThis.__qtests_setup_cjs_installed) return;
  globalThis.__qtests_setup_cjs_installed = true;

  const stubsDir = path.join(__dirname, 'dist', 'stubs');
  const registry = new Map();
  registry.set('axios', loadCjsStub(stubsDir, 'axios.cjs', {}));
  registry.set('winston', loadCjsStub(stubsDir, 'winston.cjs', createFallbackWinston()));
  registry.set('mongoose', loadMongooseStub());

  const anyModule = Module;
  if (typeof anyModule._load !== 'function') return;

  const origLoad = anyModule._load;
  anyModule._load = function patchedLoad(id, parent, isMain) {
    if (registry.has(id)) return registry.get(id);
    return origLoad.call(this, id, parent, isMain);
  };

  if (!quiet) {
    console.log('qtests: Global module resolution patching activated');
    console.log(`qtests: Stub registry contains: ${Array.from(registry.keys()).join(', ')}`);
  }
}

installRequireHook();

module.exports = { setupComplete: true };

