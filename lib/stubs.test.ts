// Lightweight unit test for stubs.ts - TypeScript ES module

describe('stubs.ts basic exports', () => {
  test('module loads without errors', async () => {
    // TypeScript ES module dynamic import
    const module = await import('./stubs.ts');
    expect(module).toBeDefined();
    expect(typeof module).toBe('object');
    // Check for expected exports
    expect(module.default).toBeDefined();
  });
});
