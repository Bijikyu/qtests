// Lightweight unit test for example.ts - TypeScript ES module

describe('example.ts basic exports', () => {
  test('module loads without errors', async () => {
    // TypeScript ES module dynamic import
    const module = await import('./example.ts');
    expect(module).toBeDefined();
    expect(typeof module).toBe('object');
    // Check for expected exports
    expect(module.testFunction).toBeDefined();
  });
});
