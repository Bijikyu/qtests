// qtests dogfooding - using qtests to test itself instead of Jest
const stubMethod = require('../utils/stubMethod');

describe('stubMethod', () => {

  it('should replace and restore methods', () => {
    const obj = { greet: name => `Hello, ${name}` };
    const restore = stubMethod(obj, 'greet', () => 'Hi');
    const result = obj.greet('Bob');
    restore();
    expect(result).toBe('Hi');
    expect(obj.greet('Bob')).toBe('Hello, Bob');
  });

  it('should throw for non-object target', () => {
    expect(() => stubMethod(null, 'greet', () => {})).toThrow();
  });

  it('should throw when method missing', () => {
    expect(() => stubMethod({}, 'missing', () => {})).toThrow();
  });

  it('should throw for non-function stub', () => {
    const obj = { greet: () => 'hi' };
    expect(() => stubMethod(obj, 'greet', 'notFn')).toThrow();
  });

  it('should handle inherited methods', () => {
    const proto = { greet: () => 'proto' };
    const obj = Object.create(proto);
    const restore = stubMethod(obj, 'greet', () => 'stub');
    expect(obj.greet()).toBe('stub');
    restore();
    expect(Object.prototype.hasOwnProperty.call(obj, 'greet')).toBe(false);
    expect(obj.greet()).toBe('proto');
  });
});
