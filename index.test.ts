// Lightweight unit test for index.ts - no complex module loading
// Import statically to avoid async import after teardown in ESM/Jest
import * as mod from './index.js';

describe('index.ts basic exports', () => {
  test('module exports exist', () => {
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});
