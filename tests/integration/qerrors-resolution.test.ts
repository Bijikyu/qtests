import 'qtests/setup'; // Ensure qtests hooks are in place before any module resolution for stubs
import { describe, expect, it } from '@jest/globals';

describe('qerrors module resolution', () => {
  it('loads qerrors and exposes a callable default export', async () => {
    const mod = await import('qerrors');
    const qerrors = (mod as any).default || mod;

    expect(typeof qerrors).toBe('function');
  });

  it('loads qerrors core module via subpath', async () => {
    const coreModule = await import('qerrors/lib/qerrors.js');
    expect(coreModule).toBeDefined();
  });
});
