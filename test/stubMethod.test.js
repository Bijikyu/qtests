require('../setup'); // enable stub resolution for tests

const assert = require('assert'); // node assert module for test checks
const stubMethod = require('../utils/stubMethod'); // utility under test

function runTests() { // main test runner
  console.log(`runTests is running`); // log start
  try { // begin test try block
    const obj = { greet: (name) => `Hello, ${name}` }; // object with method to stub

    const restore = stubMethod(obj, 'greet', () => 'Hi'); // replace method with stub
    assert.strictEqual(typeof restore, 'function'); // ensure restore is function
    assert.strictEqual(obj.greet('World'), 'Hi'); // verify stubbed behavior

    restore(); // restore original method
    assert.strictEqual(obj.greet('World'), 'Hello, World'); // check restored behavior

    const nonConfig = {}; // object for non-configurable property test
    Object.defineProperty(nonConfig, 'foo', { // define read-only property
      get: () => 'bar', // original getter
      set: () => { throw new Error('fail'); }, // setter throws on assignment
      configurable: false // property cannot be reconfigured
    });

    assert.throws(() => { // expect error to propagate
      stubMethod(nonConfig, 'foo', () => {}); // attempt to stub non-configurable
    }, /fail/); // check error message

    console.log(`runTests is returning true`); // log final success
    return true; // return success indicator
  } catch (error) {
    console.error('Test failure', error); // log failure details
    return false; // indicate failure occurred
  }
}

if (require.main === module) { // run tests when file executed directly
  const success = runTests(); // execute test runner
  if (!success) process.exit(1); // exit with code 1 on failure
}

module.exports = runTests; // export for potential external runners
