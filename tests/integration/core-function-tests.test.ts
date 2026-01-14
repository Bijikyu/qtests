/**
 * Core Function Tests - Testing functions with correct, wrong, and faulty inputs
 * Tests the functions that work independently without ESM configuration issues
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import sinon from 'sinon';

describe('Validation Utilities - Comprehensive Testing', () => {
  let validateObject: any, validateArray: any, validateString: any, validateFunction: any;

  beforeEach(async () => {
    const validation = await import('../../utils/helpers/validation');
    validateObject = validation.validateObject;
    validateArray = validation.validateArray;
    validateString = validation.validateString;
    validateFunction = validation.validateFunction;
  });

  describe('validateObject', () => {
    describe('correct inputs', () => {
      it('passes with plain object', () => {
        expect(() => validateObject({ key: 'value' }, 'testParam')).not.toThrow();
      });

      it('passes with empty object', () => {
        expect(() => validateObject({}, 'emptyObj')).not.toThrow();
      });

      it('passes with nested object', () => {
        expect(() => validateObject({ a: { b: { c: 1 } } }, 'nestedObj')).not.toThrow();
      });

      it('passes with array (arrays are objects in JS)', () => {
        expect(() => validateObject([1, 2, 3], 'arrayParam')).not.toThrow();
      });

      it('passes with Date object', () => {
        expect(() => validateObject(new Date(), 'dateObj')).not.toThrow();
      });

      it('passes with RegExp object', () => {
        expect(() => validateObject(/test/, 'regexObj')).not.toThrow();
      });

      it('passes with class instance', () => {
        class TestClass { value = 1; }
        expect(() => validateObject(new TestClass(), 'instance')).not.toThrow();
      });
    });

    describe('faulty inputs', () => {
      it('throws for null with clear error message', () => {
        expect(() => validateObject(null, 'nullParam')).toThrow('Expected nullParam to be an object but received null');
      });

      it('throws for undefined', () => {
        expect(() => validateObject(undefined, 'undefinedParam')).toThrow(/Expected undefinedParam to be an object/);
      });

      it('throws for string', () => {
        expect(() => validateObject('string', 'strParam')).toThrow(/Expected strParam to be an object/);
      });

      it('throws for number', () => {
        expect(() => validateObject(123, 'numParam')).toThrow(/Expected numParam to be an object/);
      });

      it('throws for boolean true', () => {
        expect(() => validateObject(true, 'boolParam')).toThrow(/Expected boolParam to be an object/);
      });

      it('throws for boolean false', () => {
        expect(() => validateObject(false, 'boolParam')).toThrow(/Expected boolParam to be an object/);
      });

      it('throws for function', () => {
        expect(() => validateObject(() => {}, 'fnParam')).toThrow(/Expected fnParam to be an object/);
      });

      it('throws for Symbol', () => {
        expect(() => validateObject(Symbol('test'), 'symParam')).toThrow(/Expected symParam to be an object/);
      });

      it('throws for NaN', () => {
        expect(() => validateObject(NaN, 'nanParam')).toThrow(/Expected nanParam to be an object/);
      });

      it('throws for Infinity', () => {
        expect(() => validateObject(Infinity, 'infParam')).toThrow(/Expected infParam to be an object/);
      });

      it('throws for BigInt', () => {
        expect(() => validateObject(BigInt(123), 'bigIntParam')).toThrow(/Expected bigIntParam to be an object/);
      });
    });

    describe('edge cases', () => {
      it('handles empty string as paramName', () => {
        expect(() => validateObject(null, '')).toThrow(/Expected  to be an object/);
      });

      it('handles special characters in paramName', () => {
        expect(() => validateObject(null, 'param-with-special_chars.123')).toThrow(/Expected param-with-special_chars.123/);
      });

      it('handles unicode in paramName', () => {
        expect(() => validateObject(null, '日本語パラメータ')).toThrow(/Expected 日本語パラメータ/);
      });
    });
  });

  describe('validateArray', () => {
    describe('correct inputs', () => {
      it('passes with number array', () => {
        expect(() => validateArray([1, 2, 3], 'numbers')).not.toThrow();
      });

      it('passes with empty array', () => {
        expect(() => validateArray([], 'emptyArray')).not.toThrow();
      });

      it('passes with string array', () => {
        expect(() => validateArray(['a', 'b', 'c'], 'strings')).not.toThrow();
      });

      it('passes with mixed array', () => {
        expect(() => validateArray([1, 'two', { three: 3 }, null], 'mixed')).not.toThrow();
      });

      it('passes with nested arrays', () => {
        expect(() => validateArray([[1, 2], [3, 4]], 'nested')).not.toThrow();
      });

      it('passes with sparse array', () => {
        const sparse = [1, , , 4];
        expect(() => validateArray(sparse, 'sparse')).not.toThrow();
      });
    });

    describe('faulty inputs', () => {
      it('throws for object', () => {
        expect(() => validateArray({}, 'objParam')).toThrow('Expected objParam to be an array but got object');
      });

      it('throws for string (even though iterable)', () => {
        expect(() => validateArray('string', 'strParam')).toThrow('Expected strParam to be an array but got string');
      });

      it('throws for null', () => {
        expect(() => validateArray(null, 'nullParam')).toThrow('Expected nullParam to be an array but got object');
      });

      it('throws for undefined', () => {
        expect(() => validateArray(undefined, 'undefinedParam')).toThrow('Expected undefinedParam to be an array but got undefined');
      });

      it('throws for number', () => {
        expect(() => validateArray(42, 'numParam')).toThrow('Expected numParam to be an array but got number');
      });

      it('throws for function', () => {
        expect(() => validateArray(() => [], 'fnParam')).toThrow('Expected fnParam to be an array but got function');
      });

      it('throws for Set (array-like but not array)', () => {
        expect(() => validateArray(new Set([1, 2, 3]), 'setParam')).toThrow('Expected setParam to be an array but got object');
      });

      it('throws for Map (array-like but not array)', () => {
        expect(() => validateArray(new Map(), 'mapParam')).toThrow('Expected mapParam to be an array but got object');
      });

      it('throws for arguments object (array-like)', () => {
        (function(...args: any[]) {
          expect(() => validateArray(arguments, 'argsParam')).toThrow('Expected argsParam to be an array but got object');
        })(1, 2, 3);
      });
    });
  });

  describe('validateString', () => {
    describe('correct inputs', () => {
      it('passes with regular string', () => {
        expect(() => validateString('hello', 'msg')).not.toThrow();
      });

      it('passes with empty string', () => {
        expect(() => validateString('', 'emptyStr')).not.toThrow();
      });

      it('passes with whitespace-only string', () => {
        expect(() => validateString('   ', 'whitespace')).not.toThrow();
      });

      it('passes with newline string', () => {
        expect(() => validateString('\n\t\r', 'newlines')).not.toThrow();
      });

      it('passes with unicode string', () => {
        expect(() => validateString('日本語🎉', 'unicode')).not.toThrow();
      });

      it('passes with very long string', () => {
        expect(() => validateString('x'.repeat(10000), 'longStr')).not.toThrow();
      });

      it('passes with string containing special chars', () => {
        expect(() => validateString('<script>alert("xss")</script>', 'specialChars')).not.toThrow();
      });
    });

    describe('faulty inputs', () => {
      it('throws for number', () => {
        expect(() => validateString(123, 'numParam')).toThrow('Expected numParam to be a string but got number');
      });

      it('throws for null', () => {
        expect(() => validateString(null, 'nullParam')).toThrow('Expected nullParam to be a string but got object');
      });

      it('throws for undefined', () => {
        expect(() => validateString(undefined, 'undefinedParam')).toThrow('Expected undefinedParam to be a string but got undefined');
      });

      it('throws for object', () => {
        expect(() => validateString({}, 'objParam')).toThrow('Expected objParam to be a string but got object');
      });

      it('throws for array', () => {
        expect(() => validateString(['a', 'b'], 'arrParam')).toThrow('Expected arrParam to be a string but got object');
      });

      it('throws for String object (boxed)', () => {
        expect(() => validateString(new String('test'), 'boxedStr')).toThrow('Expected boxedStr to be a string but got object');
      });

      it('throws for boolean', () => {
        expect(() => validateString(true, 'boolParam')).toThrow('Expected boolParam to be a string but got boolean');
      });

      it('throws for Symbol', () => {
        expect(() => validateString(Symbol('test'), 'symParam')).toThrow('Expected symParam to be a string but got symbol');
      });
    });
  });

  describe('validateFunction', () => {
    describe('correct inputs', () => {
      it('passes with arrow function', () => {
        expect(() => validateFunction(() => {}, 'arrowFn')).not.toThrow();
      });

      it('passes with named function', () => {
        expect(() => validateFunction(function namedFn() {}, 'namedFn')).not.toThrow();
      });

      it('passes with async function', () => {
        expect(() => validateFunction(async () => {}, 'asyncFn')).not.toThrow();
      });

      it('passes with generator function', () => {
        expect(() => validateFunction(function* gen() {}, 'genFn')).not.toThrow();
      });

      it('passes with class (classes are functions)', () => {
        class TestClass {}
        expect(() => validateFunction(TestClass, 'classFn')).not.toThrow();
      });

      it('passes with bound function', () => {
        const obj = { method() {} };
        expect(() => validateFunction(obj.method.bind(obj), 'boundFn')).not.toThrow();
      });

      it('passes with native function', () => {
        expect(() => validateFunction(Array.isArray, 'nativeFn')).not.toThrow();
      });
    });

    describe('faulty inputs', () => {
      it('throws for string', () => {
        expect(() => validateFunction('function() {}', 'strParam')).toThrow('Expected strParam to be a function but got string');
      });

      it('throws for null', () => {
        expect(() => validateFunction(null, 'nullParam')).toThrow('Expected nullParam to be a function but got object');
      });

      it('throws for undefined', () => {
        expect(() => validateFunction(undefined, 'undefinedParam')).toThrow('Expected undefinedParam to be a function but got undefined');
      });

      it('throws for object with call method', () => {
        const callable = { call: () => {} };
        expect(() => validateFunction(callable, 'callableObj')).toThrow('Expected callableObj to be a function but got object');
      });

      it('throws for number', () => {
        expect(() => validateFunction(42, 'numParam')).toThrow('Expected numParam to be a function but got number');
      });

      it('throws for array', () => {
        expect(() => validateFunction([() => {}], 'arrParam')).toThrow('Expected arrParam to be a function but got object');
      });
    });
  });
});

describe('stubMethod Utilities - Comprehensive Testing', () => {
  let stubMethod: any, verifyCallCount: any, verifyCalledWith: any, verifyCalledOnce: any;
  let createFakeServer: any, createFakeXHR: any, getSinonLibrary: any;

  beforeEach(async () => {
    const stubUtils = await import('../../utils/stubMethod');
    stubMethod = stubUtils.stubMethod;
    verifyCallCount = stubUtils.verifyCallCount;
    verifyCalledWith = stubUtils.verifyCalledWith;
    verifyCalledOnce = stubUtils.verifyCalledOnce;
    createFakeServer = stubUtils.createFakeServer;
    createFakeXHR = stubUtils.createFakeXHR;
    getSinonLibrary = stubUtils.getSinonLibrary;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('stubMethod', () => {
    describe('correct usage', () => {
      it('stubs method and returns original on restore', () => {
        const obj = { myMethod: () => 'original' };
        const result = stubMethod({ obj, methodName: 'myMethod', stubFn: () => 'stubbed' });
        
        expect(obj.myMethod()).toBe('stubbed');
        expect(typeof result.restore).toBe('function');
        
        result.restore();
        expect(obj.myMethod()).toBe('original');
      });

      it('stubs method with arguments', () => {
        const obj = { add: (a: number, b: number) => a + b };
        const result = stubMethod({ 
          obj, 
          methodName: 'add', 
          stubFn: (a: number, b: number) => a * b 
        });
        
        expect(obj.add(2, 3)).toBe(6);
        result.restore();
        expect(obj.add(2, 3)).toBe(5);
      });

      it('stubs async method', async () => {
        const obj = { fetchData: async () => 'real data' };
        const result = stubMethod({ 
          obj, 
          methodName: 'fetchData', 
          stubFn: async () => 'stubbed data' 
        });
        
        expect(await obj.fetchData()).toBe('stubbed data');
        result.restore();
      });

      it('handles multiple stubs on same object', () => {
        const obj = { 
          method1: () => 1, 
          method2: () => 2 
        };
        
        const stub1 = stubMethod({ obj, methodName: 'method1', stubFn: () => 10 });
        const stub2 = stubMethod({ obj, methodName: 'method2', stubFn: () => 20 });
        
        expect(obj.method1()).toBe(10);
        expect(obj.method2()).toBe(20);
        
        stub1.restore();
        stub2.restore();
      });
    });

    describe('error handling', () => {
      it('throws when obj is null', () => {
        expect(() => stubMethod({ obj: null, methodName: 'test', stubFn: () => {} }))
          .toThrow(/Expected .* to be an object/);
      });

      it('throws when obj is undefined', () => {
        expect(() => stubMethod({ obj: undefined, methodName: 'test', stubFn: () => {} }))
          .toThrow(/Expected .* to be an object/);
      });

      it('throws when obj is a primitive', () => {
        expect(() => stubMethod({ obj: 'string', methodName: 'test', stubFn: () => {} }))
          .toThrow(/Expected .* to be an object/);
      });

      it('throws when methodName is not a string', () => {
        const obj = { method: () => {} };
        expect(() => stubMethod({ obj, methodName: 123 as any, stubFn: () => {} }))
          .toThrow(/Expected .* to be a string/);
      });

      it('throws when methodName is empty string', () => {
        const obj = { method: () => {} };
        expect(() => stubMethod({ obj, methodName: '', stubFn: () => {} }))
          .toThrow(/must be a non-empty string/);
      });

      it('throws when methodName is whitespace only', () => {
        const obj = { method: () => {} };
        expect(() => stubMethod({ obj, methodName: '   ', stubFn: () => {} }))
          .toThrow(/must be a non-empty string/);
      });

      it('throws when method does not exist on object', () => {
        const obj = { existingMethod: () => {} };
        expect(() => stubMethod({ obj, methodName: 'nonExistent', stubFn: () => {} }))
          .toThrow(/could not find nonExistent on provided object/);
      });

      it('throws when property is not a function', () => {
        const obj = { notAFunction: 'value' };
        expect(() => stubMethod({ obj, methodName: 'notAFunction', stubFn: () => {} }))
          .toThrow(/exists but is not a function/);
      });

      it('throws when stubFn is not a function', () => {
        const obj = { method: () => {} };
        expect(() => stubMethod({ obj, methodName: 'method', stubFn: 'not a function' as any }))
          .toThrow(/stubFn must be a Function/);
      });
    });
  });

  describe('verifyCallCount', () => {
    it('passes when call count matches exactly', () => {
      const spy = sinon.spy();
      spy(); spy(); spy();
      expect(() => verifyCallCount(spy, 3)).not.toThrow();
    });

    it('throws when call count is lower', () => {
      const spy = sinon.spy();
      spy(); spy();
      expect(() => verifyCallCount(spy, 5)).toThrow('Expected 5 calls, but got 2');
    });

    it('throws when call count is higher', () => {
      const spy = sinon.spy();
      spy(); spy(); spy();
      expect(() => verifyCallCount(spy, 1)).toThrow('Expected 1 calls, but got 3');
    });

    it('passes for zero calls when not called', () => {
      const spy = sinon.spy();
      expect(() => verifyCallCount(spy, 0)).not.toThrow();
    });

    it('throws for zero expected but called', () => {
      const spy = sinon.spy();
      spy();
      expect(() => verifyCallCount(spy, 0)).toThrow('Expected 0 calls, but got 1');
    });
  });

  describe('verifyCalledWith', () => {
    it('passes when called with exact arguments', () => {
      const spy = sinon.spy();
      spy('arg1', 'arg2');
      expect(() => verifyCalledWith(spy, 'arg1', 'arg2')).not.toThrow();
    });

    it('throws when arguments do not match', () => {
      const spy = sinon.spy();
      spy('arg1');
      expect(() => verifyCalledWith(spy, 'different')).toThrow(/Expected call with arguments/);
    });

    it('passes with no arguments', () => {
      const spy = sinon.spy();
      spy();
      expect(() => verifyCalledWith(spy)).not.toThrow();
    });

    it('passes with complex arguments', () => {
      const spy = sinon.spy();
      const obj = { key: 'value' };
      spy(obj, [1, 2, 3], 42);
      expect(() => verifyCalledWith(spy, obj, [1, 2, 3], 42)).not.toThrow();
    });
  });

  describe('verifyCalledOnce', () => {
    it('passes when called exactly once', () => {
      const spy = sinon.spy();
      spy();
      expect(() => verifyCalledOnce(spy)).not.toThrow();
    });

    it('throws when not called', () => {
      const spy = sinon.spy();
      expect(() => verifyCalledOnce(spy)).toThrow('Expected exactly one call, but got 0');
    });

    it('throws when called twice', () => {
      const spy = sinon.spy();
      spy(); spy();
      expect(() => verifyCalledOnce(spy)).toThrow('Expected exactly one call, but got 2');
    });

    it('throws when called many times', () => {
      const spy = sinon.spy();
      for (let i = 0; i < 10; i++) spy();
      expect(() => verifyCalledOnce(spy)).toThrow('Expected exactly one call, but got 10');
    });
  });

  describe('createFakeServer', () => {
    it('creates a mock server with required properties', () => {
      const server = createFakeServer();
      expect(server).toHaveProperty('requests');
      expect(server).toHaveProperty('respondWith');
      expect(server).toHaveProperty('restore');
      expect(Array.isArray(server.requests)).toBe(true);
    });

    it('respondWith method is callable', () => {
      const server = createFakeServer();
      expect(() => server.respondWith('GET', '/api/users', { status: 200 })).not.toThrow();
    });

    it('restore method is callable', () => {
      const server = createFakeServer();
      expect(() => server.restore()).not.toThrow();
    });
  });

  describe('createFakeXHR', () => {
    it('creates a mock XHR with required methods', () => {
      const xhr = createFakeXHR();
      expect(typeof xhr.open).toBe('function');
      expect(typeof xhr.send).toBe('function');
      expect(typeof xhr.setRequestHeader).toBe('function');
    });

    it('open method works with various HTTP methods', () => {
      const xhr = createFakeXHR();
      expect(() => xhr.open('GET', '/api')).not.toThrow();
      expect(() => xhr.open('POST', '/api')).not.toThrow();
      expect(() => xhr.open('DELETE', '/api')).not.toThrow();
    });
  });

  describe('getSinonLibrary', () => {
    it('returns sinon library instance', () => {
      const sinonLib = getSinonLibrary();
      expect(sinonLib).toBeDefined();
      expect(typeof sinonLib.spy).toBe('function');
      expect(typeof sinonLib.stub).toBe('function');
    });
  });
});

describe('waitForCondition - Comprehensive Testing', () => {
  let waitForCondition: any;

  beforeEach(async () => {
    const module = await import('../../lib/waitForCondition');
    waitForCondition = module.waitForCondition;
  });

  describe('correct usage', () => {
    it('resolves immediately when condition is already true', async () => {
      await expect(waitForCondition(() => true)).resolves.toBeUndefined();
    });

    it('waits until condition becomes true', async () => {
      let counter = 0;
      const predicate = () => {
        counter++;
        return counter >= 3;
      };
      await expect(waitForCondition(predicate, { intervalMs: 10 })).resolves.toBeUndefined();
      expect(counter).toBeGreaterThanOrEqual(3);
    });

    it('works with async predicates', async () => {
      let counter = 0;
      const asyncPredicate = async () => {
        counter++;
        await new Promise(r => setTimeout(r, 5));
        return counter >= 2;
      };
      await expect(waitForCondition(asyncPredicate, { intervalMs: 10 })).resolves.toBeUndefined();
      expect(counter).toBeGreaterThanOrEqual(2);
    });

    it('uses default options when none provided', async () => {
      let called = false;
      await waitForCondition(() => {
        called = true;
        return true;
      });
      expect(called).toBe(true);
    });

    it('respects custom interval', async () => {
      const startTime = Date.now();
      let counter = 0;
      await waitForCondition(() => {
        counter++;
        return counter >= 3;
      }, { intervalMs: 50 });
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(80);
    });
  });

  describe('error handling', () => {
    it('rejects on timeout', async () => {
      await expect(waitForCondition(() => false, { timeoutMs: 100, intervalMs: 10 }))
        .rejects.toThrow(/timeout after 100ms/);
    });

    it('continues when predicate throws error', async () => {
      let counter = 0;
      const faultyPredicate = () => {
        counter++;
        if (counter < 3) throw new Error('Simulated error');
        return true;
      };
      await expect(waitForCondition(faultyPredicate, { intervalMs: 10 })).resolves.toBeUndefined();
      expect(counter).toBeGreaterThanOrEqual(3);
    });

    it('rejects when max iterations exceeded', async () => {
      await expect(waitForCondition(() => false, { timeoutMs: 150, intervalMs: 10 }))
        .rejects.toThrow();
    });
  });

  describe('edge cases', () => {
    it('handles very short timeout', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        await expect(waitForCondition(() => false, { timeoutMs: 50, intervalMs: 10 }))
          .rejects.toThrow();
      } finally {
        consoleSpy.mockRestore();
      }
    });

    it('handles predicate that returns truthy but not boolean', async () => {
      await expect(waitForCondition(() => 1 as any)).resolves.toBeUndefined();
      await expect(waitForCondition(() => 'yes' as any)).resolves.toBeUndefined();
      await expect(waitForCondition(() => ({ value: true }) as any)).resolves.toBeUndefined();
    });

    it('handles predicate with side effects', async () => {
      const sideEffects: number[] = [];
      let counter = 0;
      await waitForCondition(() => {
        counter++;
        sideEffects.push(counter);
        return counter >= 3;
      }, { intervalMs: 5 });
      expect(sideEffects).toEqual([1, 2, 3]);
    });
  });
});

describe('Error Wrappers - Comprehensive Testing', () => {
  let wrapWithErrorLogging: any, wrapWithSafeExecute: any;

  beforeEach(async () => {
    const errorWrappers = await import('../../lib/errorHandling/errorWrappers');
    wrapWithErrorLogging = errorWrappers.wrapWithErrorLogging;
    wrapWithSafeExecute = errorWrappers.wrapWithSafeExecute;
  });

  describe('wrapWithErrorLogging', () => {
    describe('correct usage', () => {
      it('executes function normally when no error', () => {
        const fn = (a: number, b: number) => a + b;
        const wrapped = wrapWithErrorLogging(fn, 'addition');
        expect(wrapped(2, 3)).toBe(5);
      });

      it('preserves function return type', () => {
        const fn = () => ({ result: 'success', count: 42 });
        const wrapped = wrapWithErrorLogging(fn, 'test');
        expect(wrapped()).toEqual({ result: 'success', count: 42 });
      });

      it('preserves all function arguments', () => {
        const fn = (x: string, y: number, z: boolean, w: object) => 
          `${x}-${y}-${z}-${JSON.stringify(w)}`;
        const wrapped = wrapWithErrorLogging(fn, 'test');
        expect(wrapped('hello', 42, true, { a: 1 })).toBe('hello-42-true-{"a":1}');
      });

      it('works with no-argument functions', () => {
        const fn = () => 'result';
        const wrapped = wrapWithErrorLogging(fn, 'noArgs');
        expect(wrapped()).toBe('result');
      });
    });

    describe('error handling', () => {
      it('logs error and rethrows', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const fn = () => { throw new Error('Test error'); };
        const wrapped = wrapWithErrorLogging(fn, 'testContext');
        
        expect(() => wrapped()).toThrow('Test error');
        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[testContext] Error: Test error'));
        
        errorSpy.mockRestore();
      });

      it('handles non-Error thrown values', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const fn = () => { throw 'string error'; };
        const wrapped = wrapWithErrorLogging(fn, 'test');
        
        expect(() => wrapped()).toThrow();
        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('string error'));
        
        errorSpy.mockRestore();
      });

      it('handles thrown objects', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const fn = () => { throw { code: 'ERR_001', message: 'Custom error' }; };
        const wrapped = wrapWithErrorLogging(fn, 'test');
        
        expect(() => wrapped()).toThrow();
        
        errorSpy.mockRestore();
      });

      it('handles thrown null', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const fn = () => { throw null; };
        const wrapped = wrapWithErrorLogging(fn, 'test');
        
        expect(() => wrapped()).toThrow();
        
        errorSpy.mockRestore();
      });
    });
  });

  describe('wrapWithSafeExecute', () => {
    describe('correct usage', () => {
      it('executes function normally when no error', () => {
        const fn = (a: number) => a * 2;
        const wrapped = wrapWithSafeExecute(fn);
        expect(wrapped(5)).toBe(10);
      });

      it('works with complex return types', () => {
        const fn = () => [1, 2, 3];
        const wrapped = wrapWithSafeExecute(fn);
        expect(wrapped()).toEqual([1, 2, 3]);
      });
    });

    describe('error handling', () => {
      it('returns null on error', () => {
        const fn = () => { throw new Error('Failure'); };
        const wrapped = wrapWithSafeExecute(fn);
        expect(wrapped()).toBeNull();
      });

      it('logs error when context provided', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const fn = () => { throw new Error('Failure'); };
        const wrapped = wrapWithSafeExecute(fn, 'myContext');
        
        wrapped();
        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[myContext] Error: Failure'));
        
        errorSpy.mockRestore();
      });

      it('does not log error when no context', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const fn = () => { throw new Error('Failure'); };
        const wrapped = wrapWithSafeExecute(fn);
        
        wrapped();
        expect(errorSpy).not.toHaveBeenCalled();
        
        errorSpy.mockRestore();
      });

      it('handles non-Error thrown values silently', () => {
        const fn = () => { throw 'string error'; };
        const wrapped = wrapWithSafeExecute(fn);
        expect(wrapped()).toBeNull();
      });
    });

    describe('edge cases', () => {
      it('distinguishes between null return and error null', () => {
        const fnReturnsNull = () => null;
        const fnThrows = () => { throw new Error('test'); };
        
        const wrappedReturnsNull = wrapWithSafeExecute(fnReturnsNull);
        const wrappedThrows = wrapWithSafeExecute(fnThrows);
        
        expect(wrappedReturnsNull()).toBeNull();
        expect(wrappedThrows()).toBeNull();
      });

      it('handles undefined return', () => {
        const fn = () => undefined;
        const wrapped = wrapWithSafeExecute(fn);
        expect(wrapped()).toBeUndefined();
      });
    });
  });
});

describe('Edge Cases and Boundary Conditions', () => {
  describe('Empty and null handling', () => {
    it('validates empty arrays correctly', async () => {
      const { validateArray } = await import('../../utils/helpers/validation');
      expect(() => validateArray([], 'emptyArr')).not.toThrow();
    });

    it('validates empty objects correctly', async () => {
      const { validateObject } = await import('../../utils/helpers/validation');
      expect(() => validateObject({}, 'emptyObj')).not.toThrow();
    });

    it('validates empty strings correctly', async () => {
      const { validateString } = await import('../../utils/helpers/validation');
      expect(() => validateString('', 'emptyStr')).not.toThrow();
    });
  });

  describe('Stress testing', () => {
    it('handles many rapid validations', async () => {
      const { validateObject } = await import('../../utils/helpers/validation');
      const startTime = Date.now();
      for (let i = 0; i < 10000; i++) {
        validateObject({ index: i }, `param${i}`);
      }
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeLessThan(1000);
    });

    it('handles many rapid stub operations', () => {
      const results: any[] = [];
      for (let i = 0; i < 100; i++) {
        const spy = sinon.spy();
        spy(`call${i}`);
        results.push(spy.firstCall.args[0]);
      }
      expect(results).toHaveLength(100);
      expect(results[0]).toBe('call0');
      expect(results[99]).toBe('call99');
    });
  });

  describe('Unicode and special characters', () => {
    it('validates unicode parameter names', async () => {
      const { validateObject } = await import('../../utils/helpers/validation');
      expect(() => validateObject(null, '日本語')).toThrow(/日本語/);
      expect(() => validateObject(null, '🎉')).toThrow(/🎉/);
    });

    it('validates strings with unicode content', async () => {
      const { validateString } = await import('../../utils/helpers/validation');
      expect(() => validateString('日本語テスト🚀', 'unicode')).not.toThrow();
    });
  });
});
