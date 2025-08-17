// qtests dogfooding - using qtests to test itself instead of Jest
const stubMethod = require('../utils/stubMethod');
const { runTestSuite, createAssertions } = require('../utils/runTestSuite');

const assert = createAssertions();

// Convert Jest tests to qtests format
const tests = [
  ['stubMethod replaces and restores methods', () => {
    const obj = { greet: name => `Hello, ${name}` };
    const restore = stubMethod(obj, 'greet', () => 'Hi');
    const result = obj.greet('Bob');
    restore();
    assert.equal(result, 'Hi', 'Stub should return stubbed value');
    assert.equal(obj.greet('Bob'), 'Hello, Bob', 'Original method should be restored');
  }],

  ['stubMethod throws for non-object target', () => {
    assert.throws(
      () => stubMethod(null, 'greet', () => {}),
      'Should throw for null target'
    );
  }],

  ['stubMethod throws when method missing', () => {
    assert.throws(
      () => stubMethod({}, 'missing', () => {}),
      'Should throw for missing method'
    );
  }],

  ['stubMethod throws for non-function stub', () => {
    const obj = { greet: () => 'hi' };
    assert.throws(
      () => stubMethod(obj, 'greet', 'notFn'),
      'Should throw for non-function stub'
    );
  }],

  ['stubMethod handles inherited methods', () => {
    const proto = { greet: () => 'proto' };
    const obj = Object.create(proto);
    const restore = stubMethod(obj, 'greet', () => 'stub');
    assert.equal(obj.greet(), 'stub', 'Stub should work on inherited method');
    restore();
    assert.falsy(
      Object.prototype.hasOwnProperty.call(obj, 'greet'),
      'Own property should be removed after restore'
    );
    assert.equal(obj.greet(), 'proto', 'Inherited method should be available again');
  }]
];

// Run tests using qtests instead of Jest
if (require.main === module) {
  const results = runTestSuite('stubMethod', tests);
  process.exit(results.failed > 0 ? 1 : 0);
}
