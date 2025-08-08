/**
 * Simple Test Suite Runner
 * 
 * Lightweight test runner for simple testing scenarios where Jest or other
 * full-featured test frameworks might be overkill. Provides basic test
 * execution with pass/fail tracking and formatted console output.
 * 
 * Features:
 * - Simple test function execution with error handling
 * - Formatted console output with visual indicators
 * - Pass/fail statistics tracking
 * - Detailed failure reporting
 * - Zero dependencies beyond Node.js built-ins
 */

/**
 * Run a test suite with multiple test functions
 * 
 * Executes an array of test functions, tracking passes and failures.
 * Each test function should throw an error if the test fails, or
 * complete successfully if the test passes.
 * 
 * @param {string} suiteName - Name of the test suite for display
 * @param {Array<[string, Function]>} testFunctions - Array of [testName, testFunction] tuples
 * @returns {Object} Test results with passed, failed counts and failure details
 * 
 * @example
 * const results = runTestSuite('Math Tests', [
 *   ['addition works', () => {
 *     if (2 + 2 !== 4) throw new Error('Math is broken');
 *   }],
 *   ['subtraction works', () => {
 *     if (5 - 3 !== 2) throw new Error('Subtraction failed');
 *   }]
 * ]);
 * console.log(`${results.passed} passed, ${results.failed} failed`);
 */
function runTestSuite(suiteName, testFunctions) {
  console.log(`\n🔧 Running: ${suiteName}`);
  console.log('-'.repeat(40));
  
  let passed = 0;
  let failed = 0;
  const failures = [];
  
  for (const [testName, testFn] of testFunctions) {
    try {
      console.log(`  ▶ ${testName}`);
      testFn();
      console.log(`    ✅ PASS`);
      passed++;
    } catch (error) {
      console.log(`    ❌ FAIL: ${error.message}`);
      failed++;
      failures.push({ test: testName, error: error.message });
    }
  }
  
  // Print summary
  console.log('-'.repeat(40));
  console.log(`Summary: ${passed} passed, ${failed} failed`);
  
  if (failures.length > 0) {
    console.log('\nFailures:');
    failures.forEach(({ test, error }) => {
      console.log(`  ❌ ${test}: ${error}`);
    });
  }
  
  return { passed, failed, failures };
}

/**
 * Run multiple test suites sequentially
 * 
 * Executes multiple test suites and provides an overall summary.
 * Useful for organizing tests into logical groups.
 * 
 * @param {Array<Object>} suites - Array of suite objects with name and tests
 * @returns {Object} Overall test results
 * 
 * @example
 * const results = runTestSuites([
 *   {
 *     name: 'Math Tests',
 *     tests: [
 *       ['addition', () => { if (2+2 !== 4) throw new Error('fail'); }]
 *     ]
 *   },
 *   {
 *     name: 'String Tests', 
 *     tests: [
 *       ['concat', () => { if ('a'+'b' !== 'ab') throw new Error('fail'); }]
 *     ]
 *   }
 * ]);
 */
function runTestSuites(suites) {
  let totalPassed = 0;
  let totalFailed = 0;
  const allFailures = [];
  
  console.log('\n🧪 Running Test Suites');
  console.log('='.repeat(50));
  
  for (const suite of suites) {
    const results = runTestSuite(suite.name, suite.tests);
    totalPassed += results.passed;
    totalFailed += results.failed;
    allFailures.push(...results.failures);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`🏁 Overall Results: ${totalPassed} passed, ${totalFailed} failed`);
  
  if (allFailures.length > 0) {
    console.log(`\n📋 All Failures (${allFailures.length}):`);
    allFailures.forEach(({ test, error }) => {
      console.log(`  ❌ ${test}: ${error}`);
    });
  } else {
    console.log('\n🎉 All tests passed!');
  }
  
  return {
    passed: totalPassed,
    failed: totalFailed,
    failures: allFailures,
    success: totalFailed === 0
  };
}

/**
 * Create a simple assertion helper for tests
 * 
 * Provides basic assertion functions that throw descriptive errors
 * when conditions aren't met. Useful for writing clear test functions.
 * 
 * @returns {Object} Assertion helper functions
 * 
 * @example
 * const assert = createAssertions();
 * 
 * runTestSuite('Example Tests', [
 *   ['equality test', () => {
 *     assert.equal(2 + 2, 4, 'Addition should work');
 *     assert.notEqual(2 + 2, 5, 'Addition should not equal 5');
 *   }]
 * ]);
 */
function createAssertions() {
  return {
    /**
     * Assert that two values are equal
     */
    equal(actual, expected, message = 'Values should be equal') {
      if (actual !== expected) {
        throw new Error(`${message}. Expected: ${expected}, Actual: ${actual}`);
      }
    },
    
    /**
     * Assert that two values are not equal
     */
    notEqual(actual, expected, message = 'Values should not be equal') {
      if (actual === expected) {
        throw new Error(`${message}. Both values are: ${actual}`);
      }
    },
    
    /**
     * Assert that a value is truthy
     */
    truthy(value, message = 'Value should be truthy') {
      if (!value) {
        throw new Error(`${message}. Got: ${value}`);
      }
    },
    
    /**
     * Assert that a value is falsy
     */
    falsy(value, message = 'Value should be falsy') {
      if (value) {
        throw new Error(`${message}. Got: ${value}`);
      }
    },
    
    /**
     * Assert that a function throws an error
     */
    throws(fn, message = 'Function should throw an error') {
      try {
        fn();
        throw new Error(`${message}. No error was thrown.`);
      } catch (error) {
        // Expected behavior - function threw an error
        if (error.message === `${message}. No error was thrown.`) {
          throw error; // Re-throw our assertion error
        }
        // Otherwise, the function threw as expected
      }
    },
    
    /**
     * Assert that a function does not throw an error
     */
    doesNotThrow(fn, message = 'Function should not throw an error') {
      try {
        fn();
      } catch (error) {
        throw new Error(`${message}. Error thrown: ${error.message}`);
      }
    },
    
    /**
     * Assert that an array contains a specific value
     */
    contains(array, value, message = 'Array should contain value') {
      if (!Array.isArray(array)) {
        throw new Error(`${message}. Expected array, got: ${typeof array}`);
      }
      if (!array.includes(value)) {
        throw new Error(`${message}. Array: [${array.join(', ')}], Value: ${value}`);
      }
    },
    
    /**
     * Assert that an object has a specific property
     */
    hasProperty(obj, property, message = 'Object should have property') {
      if (typeof obj !== 'object' || obj === null) {
        throw new Error(`${message}. Expected object, got: ${typeof obj}`);
      }
      if (!(property in obj)) {
        throw new Error(`${message}. Object keys: [${Object.keys(obj).join(', ')}], Property: ${property}`);
      }
    }
  };
}

module.exports = {
  runTestSuite,
  runTestSuites,
  createAssertions
};