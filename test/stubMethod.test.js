require('qtests/setup'); // (activate stubs before imports)
const stubMethod = require('../utils/stubMethod'); // (import module under test)

test('stubMethod replaces and restores methods', () => { // (jest test case)
  const obj = { greet: name => `Hello, ${name}` }; // (object with method to stub)
  const restore = stubMethod(obj, 'greet', () => 'Hi'); // (replace method with stub)
  const result = obj.greet('Bob'); // (call stubbed method)
  restore(); // (restore original method)
  expect(result).toBe('Hi'); // (assert stub result)
  expect(obj.greet('Bob')).toBe('Hello, Bob'); // (assert restoration works)
});
