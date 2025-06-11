const stubMethod = require('../utils/stubMethod'); // (import module under test)

test('stubMethod replaces and restores methods', () => { // (jest test case)
  const obj = { greet: name => `Hello, ${name}` }; // (object with method to stub)
  const restore = stubMethod(obj, 'greet', () => 'Hi'); // (replace method with stub)
  const result = obj.greet('Bob'); // (call stubbed method)
  restore(); // (restore original method)
  expect(result).toBe('Hi'); // (assert stub result)
  expect(obj.greet('Bob')).toBe('Hello, Bob'); // (assert restoration works)
});

test('stubMethod throws for non-object target', () => { // verify obj validation
  expect(() => stubMethod(null, 'greet', () => {})).toThrow('expected object'); // should reject null obj
});

test('stubMethod throws when method missing', () => { // verify method existence check
  expect(() => stubMethod({}, 'missing', () => {})).toThrow('could not find'); // should reject absent method
});

test('stubMethod throws for non-function stub', () => { // verify stubFn validation
  const obj = { greet: () => 'hi' }; // sample object
  expect(() => stubMethod(obj, 'greet', 'notFn')).toThrow('must be a function'); // should reject invalid stub
});
