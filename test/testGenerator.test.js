// Lightweight TestGenerator test - no complex operations
describe('TestGenerator basic tests', () => {
  test('TestGenerator module loads without errors', () => {
    expect(() => require('../lib/testGenerator')).not.toThrow();
    const testGenModule = require('../lib/testGenerator');
    expect(testGenModule).toBeDefined();
  });
});