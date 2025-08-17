// Temporary failing test - run with ./runner to see DEBUG_TESTS.md generation
// Use Node.js assert instead of Jest/Mocha syntax for compatibility

const assert = require('assert');

console.log('Running temp failing test...');

// Test 1: Always fails - wrong math
try {
  const result = 2 + 2;
  assert.strictEqual(result, 5, 'Expected 2+2 to equal 5 (this will always fail)');
  console.log('✓ Math test passed');
} catch (error) {
  console.error('✗ Math test failed:', error.message);
  process.exit(1);
}

// Test 2: Always fails - undefined property
try {
  const obj = { name: 'test' };
  assert.strictEqual(obj.age, 25, 'Expected obj.age to be 25 (but it is undefined)');
  console.log('✓ Object test passed');
} catch (error) {
  console.error('✗ Object test failed:', error.message);
  process.exit(1);
}

console.log('All tests passed (this should never print)');