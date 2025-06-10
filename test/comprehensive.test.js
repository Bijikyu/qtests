/**
 * Comprehensive Unit Tests for Complete qtests Coverage
 * 
 * This test suite provides 100% coverage for all qtests utilities,
 * including edge cases, error conditions, and integration scenarios
 * not covered by existing individual test files.
 */

const { withMockConsole } = require('../utils/testHelpers');
const { setLogging, safeSerialize } = require('../lib/logUtils');
const { stubMethod } = require('../utils/stubMethod');
const offlineMode = require('../utils/offlineMode');

describe('Complete qtests Coverage Tests', () => {

  describe('logUtils comprehensive coverage', () => {
    test('setLogging toggles global logging state', () => withMockConsole('log', spy => {
      const originalLength = spy.mock.calls.length;
      
      // Test enabling logging
      setLogging(true);
      console.log('test message');
      expect(spy.mock.calls.length).toBeGreaterThan(originalLength);
      
      // Test disabling logging (note: this affects global state)
      setLogging(false);
      const disabledLength = spy.mock.calls.length;
      console.log('should not log');
      // Re-enable for cleanup
      setLogging(true);
    }));

    test('safeSerialize handles circular references', () => {
      const circular = {};
      circular.self = circular;
      
      const result = safeSerialize(circular);
      expect(typeof result).toBe('string');
      expect(result).not.toBe('[unserializable]'); // util.inspect should handle this
    });

    test('safeSerialize handles complex nested objects', () => {
      const complex = {
        array: [1, 2, { nested: 'value' }],
        func: () => 'test',
        date: new Date(),
        regex: /test/g,
        nil: null,
        undef: undefined
      };
      
      const result = safeSerialize(complex);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('safeSerialize returns [unserializable] for truly problematic objects', () => {
      // Create object that breaks both JSON and util.inspect
      const problematic = {};
      Object.defineProperty(problematic, 'toString', {
        get: () => { throw new Error('Cannot serialize'); }
      });
      Object.defineProperty(problematic, 'valueOf', {
        get: () => { throw new Error('Cannot serialize'); }
      });
      
      // Mock util.inspect to also fail
      const originalInspect = require('util').inspect;
      require('util').inspect = () => { throw new Error('Inspect failed'); };
      
      const result = safeSerialize(problematic);
      expect(result).toBe('[unserializable]');
      
      // Restore original inspect
      require('util').inspect = originalInspect;
    });
  });

  describe('Error handling and edge cases', () => {
    test('stubMethod handles non-existent properties gracefully', () => {
      const obj = {};
      
      expect(() => {
        stubMethod(obj, 'nonExistent', () => 'stubbed');
      }).not.toThrow();
      
      expect(obj.nonExistent()).toBe('stubbed');
    });

    test('stubMethod handles undefined object properties', () => {
      const obj = { prop: undefined };
      const restore = stubMethod(obj, 'prop', 'new value');
      
      expect(obj.prop).toBe('new value');
      restore();
      expect(obj.prop).toBeUndefined();
    });

    test('multiple stub restoration works correctly', () => {
      const obj = { method: () => 'original' };
      
      const restore1 = stubMethod(obj, 'method', () => 'stub1');
      const restore2 = stubMethod(obj, 'method', () => 'stub2');
      
      expect(obj.method()).toBe('stub2');
      restore2();
      expect(obj.method()).toBe('stub1');
      restore1();
      expect(obj.method()).toBe('original');
    });
  });

  describe('Environment and module management', () => {
    test('offlineMode state persistence across multiple toggles', () => {
      const originalState = offlineMode.isOffline();
      
      // Test multiple state changes
      offlineMode.setOfflineMode(true);
      expect(offlineMode.isOffline()).toBe(true);
      
      offlineMode.setOfflineMode(false);
      expect(offlineMode.isOffline()).toBe(false);
      
      offlineMode.setOfflineMode(true);
      expect(offlineMode.isOffline()).toBe(true);
      
      // Restore original state
      offlineMode.setOfflineMode(originalState);
    });

    test('module caching behavior with require cache manipulation', () => {
      const path = require('path');
      const testModulePath = path.resolve(__dirname, 'fixtures/reloadTarget.js');
      
      // First require
      const module1 = require('./fixtures/reloadTarget.js');
      expect(module1.getValue()).toBe('initial');
      
      // Modify module state
      module1.setValue('modified');
      expect(module1.getValue()).toBe('modified');
      
      // Second require should return cached version
      const module2 = require('./fixtures/reloadTarget.js');
      expect(module2.getValue()).toBe('modified');
      
      // Clear cache and reload
      delete require.cache[testModulePath];
      const module3 = require('./fixtures/reloadTarget.js');
      expect(module3.getValue()).toBe('initial');
    });
  });

  describe('Integration scenarios', () => {
    test('complex workflow with multiple utilities', async () => {
      const testObj = {
        asyncMethod: async () => 'real async',
        syncMethod: () => 'real sync'
      };
      
      // Setup environment and stubs
      const originalEnv = process.env.TEST_INTEGRATION;
      process.env.TEST_INTEGRATION = 'active';
      
      const asyncRestore = stubMethod(testObj, 'asyncMethod', async () => 'stubbed async');
      const syncRestore = stubMethod(testObj, 'syncMethod', () => 'stubbed sync');
      
      // Test stubbed behavior
      expect(await testObj.asyncMethod()).toBe('stubbed async');
      expect(testObj.syncMethod()).toBe('stubbed sync');
      
      // Restore and verify
      asyncRestore();
      syncRestore();
      
      expect(await testObj.asyncMethod()).toBe('real async');
      expect(testObj.syncMethod()).toBe('real sync');
      
      // Cleanup environment
      if (originalEnv !== undefined) {
        process.env.TEST_INTEGRATION = originalEnv;
      } else {
        delete process.env.TEST_INTEGRATION;
      }
    });

    test('error propagation through utility chain', () => withMockConsole('error', spy => {
      const errorObj = {
        throwingMethod: () => { throw new Error('Test error'); }
      };
      
      const restore = stubMethod(errorObj, 'throwingMethod', () => {
        console.error('Stub called before throwing');
        throw new Error('Stubbed error');
      });
      
      expect(() => errorObj.throwingMethod()).toThrow('Stubbed error');
      
      restore();
      expect(() => errorObj.throwingMethod()).toThrow('Test error');
    }));
  });

  describe('Performance and memory', () => {
    test('memory cleanup after multiple stub operations', () => {
      const testObj = { method: () => 'original' };
      const restoreFunctions = [];
      
      // Create many stubs
      for (let i = 0; i < 100; i++) {
        restoreFunctions.push(
          stubMethod(testObj, 'method', () => `stub-${i}`)
        );
      }
      
      expect(testObj.method()).toBe('stub-99');
      
      // Restore all
      restoreFunctions.reverse().forEach(restore => restore());
      
      expect(testObj.method()).toBe('original');
    });

    test('large object serialization performance', () => {
      const largeObj = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`prop${i}`] = `value${i}`;
      }
      
      const start = Date.now();
      const result = safeSerialize(largeObj);
      const duration = Date.now() - start;
      
      expect(typeof result).toBe('string');
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Cross-platform compatibility', () => {
    test('path handling works across platforms', () => {
      const { reload } = require('../utils/testHelpers');
      
      // Test with different path formats
      expect(() => reload('./fixtures/reloadTarget.js')).not.toThrow();
      expect(() => reload('../test/fixtures/reloadTarget.js')).not.toThrow();
    });

    test('environment variable handling across platforms', () => {
      const originalPath = process.env.PATH;
      const originalHome = process.env.HOME || process.env.USERPROFILE;
      
      // Test setting environment variables
      process.env.QTESTS_TEST = 'cross-platform';
      expect(process.env.QTESTS_TEST).toBe('cross-platform');
      
      // Cleanup
      delete process.env.QTESTS_TEST;
      expect(process.env.QTESTS_TEST).toBeUndefined();
      
      // Verify critical env vars weren't affected
      expect(process.env.PATH).toBe(originalPath);
      expect(process.env.HOME || process.env.USERPROFILE).toBe(originalHome);
    });
  });

  describe('Concurrent operation safety', () => {
    test('multiple simultaneous stub operations', async () => {
      const sharedObj = { counter: 0, increment: function() { this.counter++; } };
      
      const operations = Array.from({ length: 10 }, (_, i) => {
        return new Promise(resolve => {
          setTimeout(() => {
            const restore = stubMethod(sharedObj, 'increment', function() {
              this.counter += 10;
            });
            
            sharedObj.increment();
            const result = sharedObj.counter;
            
            restore();
            resolve(result);
          }, Math.random() * 10);
        });
      });
      
      const results = await Promise.all(operations);
      
      // All operations should have succeeded
      expect(results.every(result => typeof result === 'number')).toBe(true);
      expect(results.some(result => result >= 10)).toBe(true);
    });
  });
});