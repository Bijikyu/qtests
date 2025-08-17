// Temporary failing test - run with ./runner to see DEBUG_TESTS.md generation
// Jest-compatible format

describe('Temporary Failing Tests', () => {
  test('should fail - wrong math calculation', () => {
    const result = 2 + 2;
    expect(result).toBe(5); // This will always fail because 2+2 = 4, not 5
  });

  test('should fail - undefined property access', () => {
    const obj = { name: 'test' };
    expect(obj.age).toBe(25); // This will fail because obj.age is undefined
  });

  test('should fail - array length mismatch', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(10); // This will fail because array has 3 items, not 10
  });
});