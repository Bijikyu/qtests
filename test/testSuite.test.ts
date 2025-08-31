// Simplified test suite tests for TypeScript ES modules
import { createAssertions } from '../utils/runTestSuite.js';

describe('Test Suite Basic Functionality', () => {
  test('createAssertions provides assertion functions', () => {
    const assert = createAssertions();
    expect(typeof assert.equal).toBe('function');
    expect(typeof assert.truthy).toBe('function');
    expect(typeof assert.falsy).toBe('function');
  });

  test('assertions work correctly', () => {
    const assert = createAssertions();
    expect(() => assert.equal(1, 1)).not.toThrow();
    expect(() => assert.truthy(true)).not.toThrow();
    expect(() => assert.falsy(false)).not.toThrow();
  });
});