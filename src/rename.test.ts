// Lightweight unit test for rename.js - TypeScript ES module

describe('rename.js basic exports', () => {
  test('module loads without errors', async () => {
    // TypeScript ES module dynamic import
    const module = await import('./rename.js');
    expect(module).toBeDefined();
    expect(typeof module).toBe('object');
    // Check for expected exports
    expect(module.newName).toBeDefined();
  });
});
