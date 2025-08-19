// Lightweight unit test for runTestSuite.js - no complex operations
describe('runTestSuite.js basic exports', () => {
  test('module loads without errors', () => {
    expect(() => require('../utils/runTestSuite.js')).not.toThrow();
    const mod = require('../utils/runTestSuite.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });
});