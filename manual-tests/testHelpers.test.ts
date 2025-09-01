// Simplified test helpers tests to prevent hanging in parallel execution
import { createJsonRes, createRes, generateKey } from '../utils/testHelpers.js';

describe('Test Helpers Basic Tests', () => {
  // Simplified response mock tests
  test('createJsonRes works correctly', () => {
    const res = createJsonRes();
    expect(res).toHaveProperty('json');
    expect(typeof res.json).toBe('function');
  });
  
  test('createRes provides response mock', () => {
    const res = createRes();
    expect(res).toHaveProperty('status');
    expect(res).toHaveProperty('json');
    expect(res).toHaveProperty('send');
    expect(res).toHaveProperty('end');
  });

  test('generateKey works with basic parameters', async () => {
    const key = await generateKey('user');
    expect(key).toBe('test-api-key-user');
  });
});