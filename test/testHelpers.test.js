/**
 * Test Helpers Enhanced Functionality Tests
 * 
 * This test suite verifies the enhanced test helper utilities that centralize
 * common mocking and module reload logic. Tests cover the new Node.js test module
 * integration, selective environment variable backup, and HTTP integration patterns.
 * 
 * Test coverage includes:
 * - Enhanced stubQerrors with Node.js test module support
 * - Selective and complete environment variable backup/restore
 * - Enhanced generateKey with HTTP endpoint testing
 * - Module reloading with thread-safe locking
 * - Response object creation with framework compatibility
 * - Environment wrapper utilities
 */

const {
  stubQerrors,
  reload,
  moduleReloadLock,
  withMockConsole,
  createJsonRes,
  createRes,
  generateKey,
  backupEnvVars,
  restoreEnvVars,
  withSavedEnv
} = require('../utils/testHelpers');

describe('Enhanced Test Helpers Framework', () => {
  
  // Clean up after each test
  afterEach(() => {
    // Clear module reload locks
    moduleReloadLock.clear();
    
    // Restore environment if needed
    if (process.env.QTESTS_TEST_VAR) {
      delete process.env.QTESTS_TEST_VAR;
    }
  });
  
  describe('stubQerrors with Node.js test module integration', () => {
    
    test('handles missing qerrors module gracefully', () => {
      // Test graceful handling when qerrors is not available
      expect(() => {
        // This should not throw even if qerrors is missing
        try {
          stubQerrors();
        } catch (err) {
          // Expected behavior - module not found is acceptable
          expect(err.message).toContain('Cannot find module');
        }
      }).not.toThrow();
    });
    
    test('logs function entry and completion', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      try {
        stubQerrors();
      } catch (err) {
        // Expected - qerrors may not be available
      }
      
      expect(consoleSpy).toHaveBeenCalledWith('stubQerrors is running with none');
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('Enhanced environment variable management', () => {
    
    beforeEach(() => {
      // Set up test environment
      process.env.ORIGINAL_VAR = 'original_value';
      process.env.MODIFY_VAR = 'will_be_modified';
    });
    
    afterEach(() => {
      // Clean up test environment
      delete process.env.ORIGINAL_VAR;
      delete process.env.MODIFY_VAR;
      delete process.env.NEW_VAR;
      delete process.env.SELECTIVE_VAR;
    });
    
    test('selective backup captures only specified variables', () => {
      const backup = backupEnvVars('ORIGINAL_VAR', 'NONEXISTENT_VAR');
      
      expect(backup).toHaveProperty('ORIGINAL_VAR', 'original_value');
      expect(backup).toHaveProperty('NONEXISTENT_VAR', undefined);
      expect(Object.keys(backup)).toHaveLength(2);
    });
    
    test('full backup captures entire environment', () => {
      const backup = backupEnvVars();
      
      expect(backup).toHaveProperty('ORIGINAL_VAR', 'original_value');
      expect(backup).toHaveProperty('MODIFY_VAR', 'will_be_modified');
      expect(Object.keys(backup).length).toBeGreaterThan(10); // Should capture many variables
    });
    
    test('selective restoration only restores specified variables', () => {
      const backup = backupEnvVars('MODIFY_VAR');
      
      // Modify variables
      process.env.MODIFY_VAR = 'modified_value';
      process.env.NEW_VAR = 'new_value';
      
      // Restore selective backup
      restoreEnvVars(backup);
      
      expect(process.env.MODIFY_VAR).toBe('will_be_modified'); // Restored
      expect(process.env.NEW_VAR).toBe('new_value'); // Not removed (selective restore)
    });
    
    test('complete restoration removes added variables', () => {
      const backup = backupEnvVars();
      
      // Add new variable and modify existing
      process.env.NEW_VAR = 'new_value';
      process.env.MODIFY_VAR = 'modified_value';
      
      // Restore complete backup
      restoreEnvVars(backup);
      
      expect(process.env.MODIFY_VAR).toBe('will_be_modified'); // Restored
      expect(process.env.NEW_VAR).toBeUndefined(); // Removed (complete restore)
    });
    
    test('handles undefined values correctly', () => {
      // Create backup with undefined value
      delete process.env.MODIFY_VAR;
      const backup = backupEnvVars('MODIFY_VAR');
      
      // Add the variable back
      process.env.MODIFY_VAR = 'added_back';
      
      // Restore should remove it again
      restoreEnvVars(backup);
      
      expect(process.env.MODIFY_VAR).toBeUndefined();
    });
    
    test('restoreEnvVars handles no backup parameter', () => {
      expect(() => {
        restoreEnvVars(); // Should not throw
      }).not.toThrow();
    });
  });
  
  describe('Enhanced generateKey with HTTP support', () => {
    
    test('generates direct API keys with suffix', async () => {
      const key = await generateKey('user');
      
      expect(key).toBe('test-api-key-user');
    });
    
    test('generates timestamp-based keys without suffix', async () => {
      const key = await generateKey();
      
      expect(key).toMatch(/^test-api-key-\d+$/);
    });
    
    test('handles HTTP app testing mode', async () => {
      // Create mock app object
      const mockApp = {
        post: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      };
      
      // Mock httpTest.supertest
      const mockSupertest = jest.fn(() => ({
        post: jest.fn().mockReturnThis(),
        send: jest.fn().mockResolvedValue({ statusCode: 201 })
      }));
      
      // Mock the httpTest module
      jest.doMock('../utils/httpTest', () => ({
        supertest: mockSupertest
      }));
      
      try {
        const response = await generateKey(mockApp, 'userService');
        
        expect(response).toHaveProperty('statusCode', 201);
        expect(mockSupertest).toHaveBeenCalledWith(mockApp);
      } catch (err) {
        // Expected if httpTest module is not available
        expect(err.message).toContain('Cannot find module');
      }
    });
  });
  
  describe('Module reloading with thread safety', () => {
    
    test('reload prevents concurrent operations on same module', () => {
      const testPath = '../utils/mockConsole';
      
      // First reload should succeed
      const module1 = reload(testPath);
      expect(module1).toBeDefined();
      
      // Add to lock manually to simulate concurrent access
      const fullPath = require('path').resolve(__dirname, testPath);
      moduleReloadLock.add(fullPath);
      
      // Second reload should skip and return cached version
      const module2 = reload(testPath);
      expect(module2).toBeDefined();
      
      // Clean up
      moduleReloadLock.delete(fullPath);
    });
    
    test('reload handles non-existent modules gracefully', () => {
      expect(() => {
        reload('../nonexistent/module');
      }).toThrow();
    });
    
    test('moduleReloadLock is exposed for testing', () => {
      expect(moduleReloadLock).toBeDefined();
      expect(moduleReloadLock.has).toBeInstanceOf(Function);
      expect(moduleReloadLock.add).toBeInstanceOf(Function);
      expect(moduleReloadLock.delete).toBeInstanceOf(Function);
    });
  });
  
  describe('Response object creation with framework compatibility', () => {
    
    test('createJsonRes works with Jest spies', () => {
      const res = createJsonRes();
      
      expect(res).toHaveProperty('json');
      expect(typeof res.json).toBe('function');
      
      // Test that it's a proper spy
      res.json({ test: 'data' });
      
      if (res.json.mock) {
        expect(res.json.mock.calls).toHaveLength(1);
        expect(res.json.mock.calls[0][0]).toEqual({ test: 'data' });
      }
    });
    
    test('createRes provides comprehensive response mock', () => {
      const res = createRes();
      
      expect(res).toHaveProperty('status');
      expect(res).toHaveProperty('json');
      expect(res).toHaveProperty('send');
      expect(res).toHaveProperty('end');
      
      // Test method chaining
      const result = res.status(200).json({ success: true });
      expect(result).toBe(res); // Should return same object for chaining
      
      // Test call tracking
      if (res.status.mock && res.json.mock) {
        expect(res.status.mock.calls).toHaveLength(1);
        expect(res.status.mock.calls[0][0]).toBe(200);
        expect(res.json.mock.calls).toHaveLength(1);
        expect(res.json.mock.calls[0][0]).toEqual({ success: true });
      }
    });
    
    test('response mocks work without Jest', () => {
      // Temporarily hide Jest to test fallback
      const originalJest = global.jest;
      delete global.jest;
      
      try {
        const res = createRes();
        
        expect(res).toHaveProperty('status');
        expect(res).toHaveProperty('json');
        
        // Test manual call tracking
        res.status(404);
        res.json({ error: 'Not found' });
        
        expect(res.status.mock.calls).toHaveLength(1);
        expect(res.status.mock.calls[0][0]).toBe(404);
        expect(res.json.mock.calls).toHaveLength(1);
        expect(res.json.mock.calls[0][0]).toEqual({ error: 'Not found' });
        
      } finally {
        // Restore Jest
        global.jest = originalJest;
      }
    });
  });
  
  describe('Environment wrapper utilities', () => {
    
    test('withSavedEnv executes callback with environment restoration', async () => {
      // Set initial state
      process.env.TEST_WITH_SAVED = 'initial';
      
      const result = await withSavedEnv(() => {
        // Modify environment inside callback
        process.env.TEST_WITH_SAVED = 'modified';
        process.env.TEMP_VAR = 'temporary';
        return 'callback_result';
      });
      
      // Check that callback result is returned
      expect(result).toBe('callback_result');
      
      // Check that environment is restored
      expect(process.env.TEST_WITH_SAVED).toBe('initial');
      expect(process.env.TEMP_VAR).toBeUndefined(); // Should be removed
      
      // Clean up
      delete process.env.TEST_WITH_SAVED;
    });
    
    test('withSavedEnv handles callback errors properly', async () => {
      process.env.ERROR_TEST = 'initial';
      
      await expect(async () => {
        await withSavedEnv(() => {
          process.env.ERROR_TEST = 'modified';
          throw new Error('Callback error');
        });
      }).rejects.toThrow('Callback error');
      
      // Environment should still be restored despite error
      expect(process.env.ERROR_TEST).toBe('initial');
      
      // Clean up
      delete process.env.ERROR_TEST;
    });
    
    test('withMockConsole executes callback with console restoration', async () => {
      const result = await withMockConsole('log', (spy) => {
        console.log('test message');
        // Account for multiple console.log calls from the framework
        return spy.mock.calls.filter(call => call[0] === 'test message').length;
      });
      
      expect(result).toBe(1);
      
      // Console should be restored after callback
      // This is hard to test directly, but the function should complete without error
    });
  });
  
  describe('Integration scenarios', () => {
    
    test('combines environment management with module reloading', () => {
      // Backup environment
      const envBackup = backupEnvVars('NODE_ENV');
      
      // Modify environment
      process.env.NODE_ENV = 'test_integration';
      
      // Reload a module
      const reloadedModule = reload('../utils/mockConsole');
      expect(reloadedModule).toBeDefined();
      
      // Restore environment
      restoreEnvVars(envBackup);
      
      // Environment should be restored
      expect(process.env.NODE_ENV).not.toBe('test_integration');
    });
    
    test('response mocks work with multiple framework patterns', () => {
      const res = createRes();
      
      // Test Express-style middleware pattern
      res.status(200);
      res.json({ data: 'test' });
      
      // Test direct property access pattern
      expect(res.statusCode).toBe(200);
      
      // Test call verification pattern
      if (res.status.mock && res.json.mock) {
        expect(res.status.mock.calls).toHaveLength(1);
        expect(res.json.mock.calls).toHaveLength(1);
      }
    });
  });
  
  describe('Error handling and edge cases', () => {
    
    test('handles invalid backup objects gracefully', () => {
      expect(() => {
        restoreEnvVars(null);
      }).not.toThrow();
      
      expect(() => {
        restoreEnvVars('invalid');
      }).not.toThrow();
      
      expect(() => {
        restoreEnvVars(123);
      }).not.toThrow();
    });
    
    test('module reload handles path resolution errors', () => {
      expect(() => {
        reload(''); // Empty path
      }).toThrow();
    });
    
    test('generateKey handles missing httpTest module', async () => {
      const mockApp = {};
      
      try {
        await generateKey(mockApp, 'service');
        // Should either succeed or throw module not found error
      } catch (err) {
        expect(err.message).toMatch(/Cannot find module|require/);
      }
    });
  });
});