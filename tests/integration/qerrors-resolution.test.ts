import 'qtests/setup'; // Ensure qtests hooks are in place before any module resolution for stubs
import { describe, expect, it } from '@jest/globals';

describe('qerrors module resolution', () => {
  it('loads qerrors and exposes a callable default export', async () => {
    const mod = await import('qerrors');
    // qerrors is CJS: dynamic ESM import wraps module.exports as .default,
    // and module.exports itself has a .default property holding the function.
    const qerrors = (mod as any).default?.default || (mod as any).default || mod;

    expect(typeof qerrors).toBe('function');
  });

  it('loads qerrors core module via subpath', async () => {
    const coreModule = await import('qerrors/lib/qerrors.js');
    expect(coreModule).toBeDefined();
  });
});
