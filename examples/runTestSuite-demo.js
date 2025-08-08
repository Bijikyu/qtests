/**
 * runTestSuite Demo
 * 
 * This example demonstrates how to use the runTestSuite functionality
 * for lightweight testing scenarios where Jest might be overkill.
 */

const { runTestSuite, runTestSuites, createAssertions } = require('../index');

console.log('🧪 runTestSuite Demo\n');

// Example 1: Basic test suite with manual assertions
console.log('--- Example 1: Basic Test Suite ---');

const basicTests = [
  ['addition works', () => {
    const result = 2 + 2;
    if (result !== 4) {
      throw new Error(`Expected 4, got ${result}`);
    }
  }],
  
  ['string concatenation works', () => {
    const result = 'hello' + ' ' + 'world';
    if (result !== 'hello world') {
      throw new Error(`Expected 'hello world', got '${result}'`);
    }
  }],
  
  ['array includes works', () => {
    const arr = [1, 2, 3];
    if (!arr.includes(2)) {
      throw new Error('Array should include 2');
    }
  }]
];

runTestSuite('Basic Math and String Tests', basicTests);

// Example 2: Using assertion helpers
console.log('\n--- Example 2: Using Assertion Helpers ---');

const assert = createAssertions();

const assertionTests = [
  ['equality assertions', () => {
    assert.equal(5 * 5, 25, 'Multiplication should work');
    assert.notEqual(10, 11, 'Different numbers should not be equal');
  }],
  
  ['truthiness assertions', () => {
    assert.truthy('non-empty string', 'Strings should be truthy');
    assert.falsy('', 'Empty string should be falsy');
    assert.falsy(0, 'Zero should be falsy');
  }],
  
  ['array and object assertions', () => {
    assert.contains(['apple', 'banana', 'cherry'], 'banana', 'Fruit array should contain banana');
    assert.hasProperty({ name: 'John', age: 30 }, 'name', 'Person should have name property');
  }],
  
  ['error handling assertions', () => {
    assert.throws(() => {
      throw new Error('Expected error');
    }, 'Function should throw error');
    
    assert.doesNotThrow(() => {
      return 'success';
    }, 'Function should not throw');
  }]
];

runTestSuite('Assertion Helper Tests', assertionTests);

// Example 3: Testing custom functions
console.log('\n--- Example 3: Testing Custom Functions ---');

// Sample functions to test
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

function formatCurrency(amount, currency = 'USD') {
  return `${currency} ${amount.toFixed(2)}`;
}

const customFunctionTests = [
  ['fibonacci sequence', () => {
    assert.equal(fibonacci(0), 0, 'fib(0) should be 0');
    assert.equal(fibonacci(1), 1, 'fib(1) should be 1');
    assert.equal(fibonacci(5), 5, 'fib(5) should be 5');
    assert.equal(fibonacci(10), 55, 'fib(10) should be 55');
  }],
  
  ['palindrome detection', () => {
    assert.truthy(isPalindrome('racecar'), 'racecar should be palindrome');
    assert.truthy(isPalindrome('A man a plan a canal Panama'), 'Complex palindrome should work');
    assert.falsy(isPalindrome('hello'), 'hello should not be palindrome');
  }],
  
  ['currency formatting', () => {
    assert.equal(formatCurrency(10.5), 'USD 10.50', 'Default currency should be USD');
    assert.equal(formatCurrency(25.99, 'EUR'), 'EUR 25.99', 'Custom currency should work');
    assert.equal(formatCurrency(100), 'USD 100.00', 'Whole numbers should show decimals');
  }]
];

runTestSuite('Custom Function Tests', customFunctionTests);

// Example 4: Multiple test suites
console.log('\n--- Example 4: Multiple Test Suites ---');

const multipleSuites = [
  {
    name: 'Data Structure Tests',
    tests: [
      ['array methods', () => {
        const arr = [1, 2, 3];
        assert.equal(arr.length, 3, 'Array should have 3 elements');
        assert.contains(arr, 2, 'Array should contain 2');
        assert.equal(arr.join('-'), '1-2-3', 'Join should work');
      }],
      ['object methods', () => {
        const obj = { a: 1, b: 2 };
        assert.hasProperty(obj, 'a', 'Object should have property a');
        assert.equal(Object.keys(obj).length, 2, 'Object should have 2 keys');
      }]
    ]
  },
  {
    name: 'Error Handling Tests',
    tests: [
      ['division by zero', () => {
        const divide = (a, b) => {
          if (b === 0) throw new Error('Division by zero');
          return a / b;
        };
        
        assert.equal(divide(10, 2), 5, 'Normal division should work');
        assert.throws(() => divide(10, 0), 'Division by zero should throw');
      }],
      ['null checks', () => {
        const safeProp = (obj, prop) => {
          if (!obj) throw new Error('Object is null');
          return obj[prop];
        };
        
        assert.throws(() => safeProp(null, 'prop'), 'Null object should throw');
        assert.equal(safeProp({ x: 5 }, 'x'), 5, 'Valid object should work');
      }]
    ]
  }
];

const overallResults = runTestSuites(multipleSuites);

// Example 5: Integration with qtests utilities
console.log('\n--- Example 5: Integration with qtests ---');

const { stubMethod, mockConsole } = require('../index');

// Sample object to test
const apiClient = {
  fetchUser: (id) => {
    // This would normally make an HTTP request
    return { id, name: 'Real User', email: 'real@example.com' };
  },
  
  logMessage: (msg) => {
    console.log(`API: ${msg}`);
    return `Logged: ${msg}`;
  }
};

const integrationTests = [
  ['stub method works', () => {
    const restore = stubMethod(apiClient, 'fetchUser', (id) => {
      return { id, name: 'Test User', email: 'test@example.com' };
    });
    
    const user = apiClient.fetchUser(123);
    assert.equal(user.name, 'Test User', 'Stubbed method should return test data');
    assert.equal(user.email, 'test@example.com', 'Stubbed method should return test email');
    
    restore();
    
    const realUser = apiClient.fetchUser(123);
    assert.equal(realUser.name, 'Real User', 'Restored method should return real data');
  }],
  
  ['mock console works', () => {
    const mockLog = mockConsole();
    
    const result = apiClient.logMessage('test message');
    
    // Check that console was captured (exact implementation depends on mockConsole)
    assert.equal(result, 'Logged: test message', 'Method should still work normally');
    
    mockLog.restore();
  }]
];

runTestSuite('qtests Integration Tests', integrationTests);

console.log('\n✅ Demo completed! The runTestSuite functionality provides:');
console.log('  • Simple test execution with pass/fail tracking');
console.log('  • Formatted console output with visual indicators');
console.log('  • Built-in assertion helpers for common test patterns');
console.log('  • Integration with other qtests utilities');
console.log('  • Zero dependencies beyond Node.js built-ins');
console.log('\n💡 Perfect for quick testing, prototyping, or simple test scenarios!');

// Show summary
if (overallResults.success) {
  console.log('\n🎉 All demo tests passed successfully!');
} else {
  console.log(`\n⚠️  Some tests failed: ${overallResults.failed} failures out of ${overallResults.passed + overallResults.failed} total tests`);
}