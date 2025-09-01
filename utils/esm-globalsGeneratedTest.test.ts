// Lightweight unit test for esm-globals.ts - TypeScript ES module

describe('esm-globals.ts basic exports', () => {
  test('module loads without errors', async () => {
    // TypeScript ES module dynamic import
    const module = await import('./esm-globals.ts');
    expect(module).toBeDefined();
    expect(typeof module).toBe('object');
    // Check for expected exports
    expect(module.__filename).toBeDefined();
    expect(module.__dirname).toBeDefined();
    expect(module.getModuleFilename).toBeDefined();
  });
});
