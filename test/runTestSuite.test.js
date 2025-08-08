/**
 * Test Suite for runTestSuite functionality
 * 
 * Tests the lightweight test runner functions including runTestSuite,
 * runTestSuites, and createAssertions helper functions.
 */

const { runTestSuite, runTestSuites, createAssertions } = require('../utils/runTestSuite');

describe('runTestSuite', () => {
  // Capture console output for testing
  let consoleOutput = [];
  const originalLog = console.log;
  
  beforeEach(() => {
    consoleOutput = [];
    console.log = (...args) => {
      consoleOutput.push(args.join(' '));
    };
  });
  
  afterEach(() => {
    console.log = originalLog;
  });

  test('runs successful tests and reports correctly', () => {
    const testFunctions = [
      ['test 1', () => { /* passes */ }],
      ['test 2', () => { /* passes */ }],
      ['test 3', () => { /* passes */ }]
    ];

    const results = runTestSuite('Success Suite', testFunctions);

    expect(results.passed).toBe(3);
    expect(results.failed).toBe(0);
    expect(results.failures).toEqual([]);
    
    // Check console output contains expected elements
    const output = consoleOutput.join('\n');
    expect(output).toContain('🔧 Running: Success Suite');
    expect(output).toContain('▶ test 1');
    expect(output).toContain('✅ PASS');
    expect(output).toContain('Summary: 3 passed, 0 failed');
  });

  test('handles failing tests and reports errors', () => {
    const testFunctions = [
      ['passing test', () => { /* passes */ }],
      ['failing test', () => { throw new Error('Test error'); }],
      ['another passing test', () => { /* passes */ }]
    ];

    const results = runTestSuite('Mixed Suite', testFunctions);

    expect(results.passed).toBe(2);
    expect(results.failed).toBe(1);
    expect(results.failures).toHaveLength(1);
    expect(results.failures[0].test).toBe('failing test');
    expect(results.failures[0].error).toBe('Test error');
    
    // Check console output contains error information
    const output = consoleOutput.join('\n');
    expect(output).toContain('❌ FAIL: Test error');
    expect(output).toContain('Summary: 2 passed, 1 failed');
    expect(output).toContain('Failures:');
  });

  test('handles all failing tests', () => {
    const testFunctions = [
      ['fail 1', () => { throw new Error('Error 1'); }],
      ['fail 2', () => { throw new Error('Error 2'); }]
    ];

    const results = runTestSuite('Failure Suite', testFunctions);

    expect(results.passed).toBe(0);
    expect(results.failed).toBe(2);
    expect(results.failures).toHaveLength(2);
    
    const output = consoleOutput.join('\n');
    expect(output).toContain('Summary: 0 passed, 2 failed');
  });

  test('handles empty test suite', () => {
    const results = runTestSuite('Empty Suite', []);

    expect(results.passed).toBe(0);
    expect(results.failed).toBe(0);
    expect(results.failures).toEqual([]);
    
    const output = consoleOutput.join('\n');
    expect(output).toContain('Summary: 0 passed, 0 failed');
  });
});

describe('runTestSuites', () => {
  let consoleOutput = [];
  const originalLog = console.log;
  
  beforeEach(() => {
    consoleOutput = [];
    console.log = (...args) => {
      consoleOutput.push(args.join(' '));
    };
  });
  
  afterEach(() => {
    console.log = originalLog;
  });

  test('runs multiple test suites and provides overall summary', () => {
    const suites = [
      {
        name: 'Math Tests',
        tests: [
          ['addition', () => { if (2 + 2 !== 4) throw new Error('Math broken'); }],
          ['subtraction', () => { if (5 - 3 !== 2) throw new Error('Math broken'); }]
        ]
      },
      {
        name: 'String Tests',
        tests: [
          ['concatenation', () => { if ('a' + 'b' !== 'ab') throw new Error('String broken'); }]
        ]
      }
    ];

    const results = runTestSuites(suites);

    expect(results.passed).toBe(3);
    expect(results.failed).toBe(0);
    expect(results.failures).toEqual([]);
    expect(results.success).toBe(true);
    
    const output = consoleOutput.join('\n');
    expect(output).toContain('🧪 Running Test Suites');
    expect(output).toContain('🔧 Running: Math Tests');
    expect(output).toContain('🔧 Running: String Tests');
    expect(output).toContain('🏁 Overall Results: 3 passed, 0 failed');
    expect(output).toContain('🎉 All tests passed!');
  });

  test('handles mixed success and failure across suites', () => {
    const suites = [
      {
        name: 'Passing Suite',
        tests: [
          ['pass 1', () => { /* passes */ }],
          ['pass 2', () => { /* passes */ }]
        ]
      },
      {
        name: 'Failing Suite',
        tests: [
          ['fail 1', () => { throw new Error('Failed test'); }],
          ['pass 3', () => { /* passes */ }]
        ]
      }
    ];

    const results = runTestSuites(suites);

    expect(results.passed).toBe(3);
    expect(results.failed).toBe(1);
    expect(results.failures).toHaveLength(1);
    expect(results.success).toBe(false);
    
    const output = consoleOutput.join('\n');
    expect(output).toContain('🏁 Overall Results: 3 passed, 1 failed');
    expect(output).toContain('📋 All Failures (1):');
  });
});

describe('createAssertions', () => {
  let assert;

  beforeEach(() => {
    assert = createAssertions();
  });

  describe('equal', () => {
    test('passes when values are equal', () => {
      expect(() => assert.equal(5, 5)).not.toThrow();
      expect(() => assert.equal('test', 'test')).not.toThrow();
      expect(() => assert.equal(true, true)).not.toThrow();
    });

    test('throws when values are not equal', () => {
      expect(() => assert.equal(5, 6)).toThrow('Values should be equal. Expected: 6, Actual: 5');
      expect(() => assert.equal('a', 'b', 'Custom message')).toThrow('Custom message. Expected: b, Actual: a');
    });
  });

  describe('notEqual', () => {
    test('passes when values are not equal', () => {
      expect(() => assert.notEqual(5, 6)).not.toThrow();
      expect(() => assert.notEqual('a', 'b')).not.toThrow();
    });

    test('throws when values are equal', () => {
      expect(() => assert.notEqual(5, 5)).toThrow('Values should not be equal. Both values are: 5');
    });
  });

  describe('truthy', () => {
    test('passes for truthy values', () => {
      expect(() => assert.truthy(true)).not.toThrow();
      expect(() => assert.truthy(1)).not.toThrow();
      expect(() => assert.truthy('string')).not.toThrow();
      expect(() => assert.truthy({})).not.toThrow();
    });

    test('throws for falsy values', () => {
      expect(() => assert.truthy(false)).toThrow('Value should be truthy. Got: false');
      expect(() => assert.truthy(0)).toThrow('Value should be truthy. Got: 0');
      expect(() => assert.truthy('')).toThrow('Value should be truthy. Got: ');
    });
  });

  describe('falsy', () => {
    test('passes for falsy values', () => {
      expect(() => assert.falsy(false)).not.toThrow();
      expect(() => assert.falsy(0)).not.toThrow();
      expect(() => assert.falsy('')).not.toThrow();
      expect(() => assert.falsy(null)).not.toThrow();
    });

    test('throws for truthy values', () => {
      expect(() => assert.falsy(true)).toThrow('Value should be falsy. Got: true');
      expect(() => assert.falsy(1)).toThrow('Value should be falsy. Got: 1');
    });
  });

  describe('throws', () => {
    test('passes when function throws', () => {
      expect(() => assert.throws(() => { throw new Error('Test error'); })).not.toThrow();
    });

    test('throws when function does not throw', () => {
      expect(() => assert.throws(() => { /* does nothing */ })).toThrow('Function should throw an error. No error was thrown.');
    });
  });

  describe('doesNotThrow', () => {
    test('passes when function does not throw', () => {
      expect(() => assert.doesNotThrow(() => { /* does nothing */ })).not.toThrow();
    });

    test('throws when function throws', () => {
      expect(() => assert.doesNotThrow(() => { throw new Error('Test error'); })).toThrow('Function should not throw an error. Error thrown: Test error');
    });
  });

  describe('contains', () => {
    test('passes when array contains value', () => {
      expect(() => assert.contains([1, 2, 3], 2)).not.toThrow();
      expect(() => assert.contains(['a', 'b', 'c'], 'b')).not.toThrow();
    });

    test('throws when array does not contain value', () => {
      expect(() => assert.contains([1, 2, 3], 4)).toThrow('Array should contain value. Array: [1, 2, 3], Value: 4');
    });

    test('throws when input is not an array', () => {
      expect(() => assert.contains('not array', 'x')).toThrow('Array should contain value. Expected array, got: string');
    });
  });

  describe('hasProperty', () => {
    test('passes when object has property', () => {
      expect(() => assert.hasProperty({ a: 1, b: 2 }, 'a')).not.toThrow();
      expect(() => assert.hasProperty({ x: 'test' }, 'x')).not.toThrow();
    });

    test('throws when object does not have property', () => {
      expect(() => assert.hasProperty({ a: 1 }, 'b')).toThrow('Object should have property. Object keys: [a], Property: b');
    });

    test('throws when input is not an object', () => {
      expect(() => assert.hasProperty('not object', 'prop')).toThrow('Object should have property. Expected object, got: string');
      expect(() => assert.hasProperty(null, 'prop')).toThrow('Object should have property. Expected object, got: object');
    });
  });
});

describe('Integration with qtests utilities', () => {
  test('works with other qtests functions', () => {
    const { stubMethod } = require('../index');
    
    const obj = { method: () => 'original' };
    const restore = stubMethod(obj, 'method', () => 'stubbed');
    
    const assert = createAssertions();
    
    const results = runTestSuite('Integration Test', [
      ['stub works', () => {
        assert.equal(obj.method(), 'stubbed', 'Method should be stubbed');
      }],
      ['restore works', () => {
        restore();
        assert.equal(obj.method(), 'original', 'Method should be restored');
      }]
    ]);
    
    expect(results.passed).toBe(2);
    expect(results.failed).toBe(0);
  });
});