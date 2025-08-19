// Lightweight moduleSystemIntegration test - no complex operations
describe('moduleSystemIntegration basic tests', () => {
  test('TestGenerator module loads without errors', () => {
    expect(() => require('../lib/testGenerator')).not.toThrow();
    const { TestGenerator } = require('../lib/testGenerator');
    expect(TestGenerator).toBeDefined();
  });
});