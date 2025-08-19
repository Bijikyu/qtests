// Ultra-lightweight mockAxios test - no complex operations
describe('mockAxios functionality', () => {
  test('mockAxios exports basic functionality', () => {
    const mockAxios = require('../utils/mockAxios');
    expect(mockAxios).toBeDefined();
    expect(typeof mockAxios).toBe('object');
  });
  
  test('createMockAxios creates axios-like object', () => {
    const { createMockAxios } = require('../utils/mockAxios');
    const mock = createMockAxios();
    expect(typeof mock.get).toBe('function');
    expect(typeof mock.post).toBe('function');
  });
});