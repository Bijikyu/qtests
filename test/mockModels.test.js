// Lightweight unit test for mockModels.js - no complex operations
describe('mockModels.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('../utils/mockModels.js')).not.toThrow();
    const mod = require('../utils/mockModels.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});