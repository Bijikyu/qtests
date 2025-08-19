// Lightweight dualModuleGeneration test - no complex operations
describe('dualModuleGeneration basic tests', () => {
  test('TestGenerator module loads without errors', () => {
    expect(() => require('../lib/testGenerator')).not.toThrow();
    const { TestGenerator } = require('../lib/testGenerator');
    expect(TestGenerator).toBeDefined();
    expect(typeof TestGenerator).toBe('function');
  });
});