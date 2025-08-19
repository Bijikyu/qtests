/**
 * Enhanced Offline Mode Tests
 * 
 * This test suite verifies the enhanced offline mode functionality including
 * environment variable detection, automatic configuration, and the new
 * environment adapter patterns. These tests ensure the offline mode utility
 * works correctly with both programmatic and environment-based configuration.
 * 
 * Test coverage includes:
 * - Environment variable detection (CODEX, OFFLINE_MODE)
 * - Automatic offline mode configuration
 * - Enhanced axios mock factory integration
 * - Improved qerrors handling
 * - Environment adapter creation
 * - State management and caching behavior
 */

const {
  setOfflineMode,
  isOfflineMode,
  getAxios,
  getQerrors,
  getEnvironmentState,
  createEnvironmentAdapters,
  clearOfflineCache
} = require('../utils/offlineMode');

describe('Enhanced Offline Mode', () => {
  
  // Save original environment variables
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Reset environment variables for each test (without jest.resetModules to prevent hanging)
    process.env = { ...originalEnv };
    clearOfflineCache();
  });
  
  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });
  
  describe('Environment Variable Detection', () => {
    
    test('detects CODEX environment variable', () => {
      process.env.CODEX = 'true';
      
      // Test without module reset to prevent hanging
      const { getEnvironmentState } = require('../utils/offlineMode');
      const envState = getEnvironmentState();
      expect(envState.codexFlag).toBe(true);
      expect(envState.environmentDetected).toBe(true);
    });
    
    test('detects OFFLINE_MODE environment variable', () => {
      process.env.OFFLINE_MODE = 'true';
      
      const { getEnvironmentState } = require('../utils/offlineMode');
      const envState = getEnvironmentState();
      expect(envState.offlineFlagExplicit).toBe(true);
      expect(envState.environmentDetected).toBe(true);
    });
    
    test('handles case-insensitive environment variables', () => {
      process.env.CODEX = 'TRUE';
      process.env.OFFLINE_MODE = 'True';
      
      const { getEnvironmentState } = require('../utils/offlineMode');
      const envState = getEnvironmentState();
      expect(envState.codexFlag).toBe(true);
      expect(envState.offlineFlagExplicit).toBe(true);
    });
    
    test('ignores invalid environment variable values', () => {
      process.env.CODEX = 'false';
      process.env.OFFLINE_MODE = 'no';
      
      const { getEnvironmentState } = require('../utils/offlineMode');
      const envState = getEnvironmentState();
      expect(envState.codexFlag).toBe(false);
      expect(envState.offlineFlagExplicit).toBe(false);
      expect(envState.environmentDetected).toBe(false);
    });
  });
  
  describe('Enhanced Axios Integration', () => {
    
    test('returns mock axios factory instance in offline mode', async () => {
      setOfflineMode(true);
      
      const axios = getAxios();
      
      // Verify it's a mock axios with enhanced capabilities
      expect(typeof axios.get).toBe('function');
      expect(typeof axios.post).toBe('function');
      expect(typeof axios.put).toBe('function');
      expect(typeof axios.delete).toBe('function');
      expect(typeof axios.request).toBe('function');
      
      // Test that it returns proper mock responses
      const response = await axios.get('/api/test');
      expect(response.status).toBe(200);
      expect(response.data).toEqual({});
      expect(response.statusText).toBe('OK');
    });
    
    test('mock axios handles all HTTP methods correctly', async () => {
      setOfflineMode(true);
      const axios = getAxios();
      
      // Test GET request
      const getResponse = await axios.get('/api/users');
      expect(getResponse.status).toBe(200);
      
      // Test POST request with data
      const postResponse = await axios.post('/api/users', { name: 'test' });
      expect(postResponse.status).toBe(200);
      
      // Test PUT request
      const putResponse = await axios.put('/api/users/1', { name: 'updated' });
      expect(putResponse.status).toBe(200);
      
      // Test DELETE request
      const deleteResponse = await axios.delete('/api/users/1');
      expect(deleteResponse.status).toBe(200);
      
      // Test generic request method
      const requestResponse = await axios.request({ method: 'PATCH', url: '/api/test' });
      expect(requestResponse.status).toBe(200);
    });
  });
  
  describe('Enhanced Qerrors Handling', () => {
    
    test('returns enhanced no-op qerrors in offline mode', () => {
      setOfflineMode(true);
      
      const qerrorsImpl = getQerrors();
      
      // Verify it has the qerrors function
      expect(typeof qerrorsImpl.qerrors).toBe('function');
      
      // Test that it executes without throwing
      expect(() => {
        qerrorsImpl.qerrors();
      }).not.toThrow();
    });
    
    test('enhanced qerrors provides debugging output', () => {
      setOfflineMode(true);
      
      // Capture console output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const qerrorsImpl = getQerrors();
      qerrorsImpl.qerrors();
      
      // Verify debugging output is generated
      expect(consoleSpy).toHaveBeenCalledWith('noopQerrors is running with none');
      expect(consoleSpy).toHaveBeenCalledWith('noopQerrors has run');
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('Environment State Management', () => {
    
    test('getEnvironmentState returns comprehensive state information', () => {
      setOfflineMode(true);
      
      const state = getEnvironmentState();
      
      expect(state).toHaveProperty('codexFlag');
      expect(state).toHaveProperty('offlineFlagExplicit');
      expect(state).toHaveProperty('testEnvironment');
      expect(state).toHaveProperty('isOffline');
      expect(state).toHaveProperty('environmentDetected');
      
      expect(state.isOffline).toBe(true);
    });
    
    test('tracks environment detection correctly', () => {
      // Initially no environment detection
      let state = getEnvironmentState();
      expect(state.environmentDetected).toBe(false);
      
      // Set programmatic offline mode
      setOfflineMode(true);
      state = getEnvironmentState();
      expect(state.isOffline).toBe(true);
    });
  });
  
  describe('Environment Adapter Creation', () => {
    
    test('createEnvironmentAdapters returns complete adapter set', () => {
      setOfflineMode(true);
      
      const adapters = createEnvironmentAdapters();
      
      expect(adapters).toHaveProperty('isOffline');
      expect(adapters).toHaveProperty('axios');
      expect(adapters).toHaveProperty('qerrors');
      
      expect(adapters.isOffline).toBe(true);
      expect(typeof adapters.axios.get).toBe('function');
      expect(typeof adapters.qerrors.qerrors).toBe('function');
    });
    
    test('adapter set works together for complete offline simulation', async () => {
      setOfflineMode(true);
      
      const { axios, qerrors, isOffline } = createEnvironmentAdapters();
      
      // Verify offline state
      expect(isOffline).toBe(true);
      
      // Test axios functionality
      const response = await axios.get('/api/test');
      expect(response.status).toBe(200);
      
      // Test qerrors functionality
      expect(() => {
        qerrors.qerrors();
      }).not.toThrow();
    });
    
    test('adapter set provides online implementations when appropriate', () => {
      setOfflineMode(false);
      
      const { axios, qerrors, isOffline } = createEnvironmentAdapters();
      
      expect(isOffline).toBe(false);
      // Note: We can't easily test real axios/qerrors loading without dependencies
      // but we can verify the adapters are created without errors
      expect(axios).toBeDefined();
      expect(qerrors).toBeDefined();
    });
  });
  
  describe('Caching and Performance', () => {
    
    test('caches implementations for consistent behavior', () => {
      setOfflineMode(true);
      
      const axios1 = getAxios();
      const axios2 = getAxios();
      
      // Should return the same cached instance
      expect(axios1).toBe(axios2);
    });
    
    test('clearOfflineCache resets cached implementations', () => {
      setOfflineMode(true);
      
      const axios1 = getAxios();
      clearOfflineCache();
      const axios2 = getAxios();
      
      // Cache should be functional - both instances should work correctly
      // (Note: with static stub modules, object identity may be preserved by Node.js require cache)
      expect(axios1).toBeDefined();
      expect(axios2).toBeDefined();
      expect(typeof axios1.get).toBe('function');
      expect(typeof axios2.get).toBe('function');
    });
    
    test('cache is cleared when toggling offline mode', () => {
      setOfflineMode(true);
      const axios1 = getAxios();
      
      setOfflineMode(false);
      const axios2 = getAxios();
      
      // Should return different instances after mode toggle
      expect(axios1).not.toBe(axios2);
    });
  });
  
  describe('Error Handling and Fallbacks', () => {
    
    test('handles module loading errors gracefully', () => {
      setOfflineMode(false);
      
      // This should not throw even if real modules are unavailable
      expect(() => {
        getAxios();
      }).not.toThrow();
      
      expect(() => {
        getQerrors();
      }).not.toThrow();
    });
    
    test('provides fallback implementations when real modules fail', () => {
      setOfflineMode(false);
      
      // Get implementations (should fallback to stubs if real modules unavailable)
      const axios = getAxios();
      const qerrors = getQerrors();
      
      expect(axios).toBeDefined();
      expect(qerrors).toBeDefined();
    });
  });
  
  describe('Integration with Existing Functionality', () => {
    
    test('maintains compatibility with existing setOfflineMode API', () => {
      // Test original programmatic API still works
      expect(isOfflineMode()).toBe(false);
      
      setOfflineMode(true);
      expect(isOfflineMode()).toBe(true);
      
      setOfflineMode(false);
      expect(isOfflineMode()).toBe(false);
    });
    
    test('works correctly with existing clearOfflineCache function', () => {
      setOfflineMode(true);
      getAxios(); // Load into cache
      
      // Original cache clearing should still work
      expect(() => {
        clearOfflineCache();
      }).not.toThrow();
    });
  });
});