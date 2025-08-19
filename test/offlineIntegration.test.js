// Lightweight offlineIntegration test - no complex operations
describe('offlineIntegration basic tests', () => {
  test('offlineMode module loads without errors', () => {
    expect(() => require('../utils/offlineMode.js')).not.toThrow();
    const mod = require('../utils/offlineMode.js');
    expect(mod).toBeDefined();
  });
});