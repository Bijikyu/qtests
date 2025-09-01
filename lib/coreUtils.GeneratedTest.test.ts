// Lightweight unit test for coreUtils.ts - TypeScript ES module

describe('coreUtils.ts basic exports', () => {
  test('module loads without errors', async () => {
    // TypeScript ES module dynamic import
    const module = await import('./coreUtils.ts');
    expect(module).toBeDefined();
    expect(typeof module).toBe('object');
    // Check for expected exports
    expect(module.stubMethod).toBeDefined();
    expect(module.mockConsole).toBeDefined();
  });
});
