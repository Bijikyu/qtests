/**
 * Mock Management System for Consistent API and Service Mocking
 * 
 * This class focuses solely on mock management and lifecycle concerns.
 * It provides centralized mock management that eliminates duplicate patterns.
 */

const { logStart, logReturn } = require('../../lib/logUtils');

/**
 * Mock Management System for Consistent API and Service Mocking
 * 
 * This class provides centralized mock management that eliminates duplicate
 * mock patterns across test files. It uses qtests utilities for consistent
 * mocking while providing advanced mock configuration capabilities.
 */
class MockManager {
  constructor() {
    this.mocks = new Map();
    this.restorations = new Map();
  }

  /**
   * Sets up API client mocks using qtests stubMethod utility
   * 
   * @param {Object} customResponses - Custom response configurations
   */
  setupApiClientMocks(customResponses = {}) {
    logStart('MockManager.setupApiClientMocks', customResponses);
    
    try {
      const { stubMethod } = require('../../lib/envUtils');
      
      // Default API responses
      const defaultResponses = {
        get: { status: 200, data: {} },
        post: { status: 201, data: { id: 1 } },
        put: { status: 200, data: { updated: true } },
        delete: { status: 204, data: null }
      };
      
      const responses = { ...defaultResponses, ...customResponses };
      
      // Create mock API client object
      const mockApiClient = {
        get: () => Promise.resolve(responses.get),
        post: () => Promise.resolve(responses.post),
        put: () => Promise.resolve(responses.put),
        delete: () => Promise.resolve(responses.delete),
        request: () => Promise.resolve(responses.get)
      };
      
      this.mocks.set('apiClient', mockApiClient);
      
      // If we have a global HTTP client to stub, stub it
      if (typeof global.fetch === 'function') {
        const originalFetch = global.fetch;
        global.fetch = (url, options = {}) => {
          const method = (options.method || 'GET').toLowerCase();
          const response = responses[method] || responses.get;
          
          return Promise.resolve({
            ok: response.status < 400,
            status: response.status,
            json: () => Promise.resolve(response.data),
            text: () => Promise.resolve(JSON.stringify(response.data))
          });
        };
        
        this.restorations.set('fetch', () => {
          global.fetch = originalFetch;
        });
      }
      
      logReturn('MockManager.setupApiClientMocks', 'completed');
    } catch (error) {
      logReturn('MockManager.setupApiClientMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sets up console and notification mocks using qtests utilities
   * 
   * @returns {Object} Mock console functions
   */
  setupConsoleMocks() {
    logStart('MockManager.setupConsoleMocks');
    
    try {
      const { mockConsole } = require('../mockConsole');
      
      // Use qtests mockConsole utility - mock each console method individually
      const mockLog = mockConsole('log');
      const mockError = mockConsole('error');
      const mockWarn = mockConsole('warn');
      
      // Create restore function that restores all console methods
      const restore = () => {
        if (mockLog && mockLog.mockRestore) mockLog.mockRestore();
        if (mockError && mockError.mockRestore) mockError.mockRestore();
        if (mockWarn && mockWarn.mockRestore) mockWarn.mockRestore();
      };
      
      const consoleMocks = {
        log: mockLog,
        error: mockError,
        warn: mockWarn,
        restore
      };
      
      this.mocks.set('console', consoleMocks);
      this.restorations.set('console', restore);
      
      logReturn('MockManager.setupConsoleMocks', consoleMocks);
      return consoleMocks;
    } catch (error) {
      logReturn('MockManager.setupConsoleMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sets up environment variable mocks using qtests testEnv utility
   * 
   * @param {Object} envVars - Environment variables to set
   * @returns {Function} Restoration function
   */
  setupEnvironmentMocks(envVars = {}) {
    logStart('MockManager.setupEnvironmentMocks', envVars);
    
    try {
      const { saveEnv, restoreEnv } = require('../testEnv');
      
      // Save current environment and set test values
      const savedEnv = saveEnv();
      Object.assign(process.env, envVars);
      
      this.mocks.set('environment', envVars);
      const restoreFunction = () => restoreEnv(savedEnv);
      this.restorations.set('environment', restoreFunction);
      
      logReturn('MockManager.setupEnvironmentMocks', 'completed');
      return restoreFunction;
    } catch (error) {
      logReturn('MockManager.setupEnvironmentMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sets up email mocking using qtests sendEmail utility
   * 
   * @returns {Object} Email mock utilities
   */
  setupEmailMocks() {
    logStart('MockManager.setupEmailMocks');
    
    try {
      const { sendEmail } = require('../../lib/envUtils');
      
      // Clear previous email history
      sendEmail.clearEmailHistory();
      
      const emailMocks = {
        sendEmail: sendEmail.sendEmail,
        sendEmailBatch: sendEmail.sendEmailBatch,
        getHistory: sendEmail.getEmailHistory,
        clearHistory: sendEmail.clearEmailHistory
      };
      
      this.mocks.set('email', emailMocks);
      
      logReturn('MockManager.setupEmailMocks', emailMocks);
      return emailMocks;
    } catch (error) {
      logReturn('MockManager.setupEmailMocks', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clears all mocks and restores original functionality
   */
  clearAll() {
    logStart('MockManager.clearAll');
    
    try {
      // Restore all stubbed functions
      this.restorations.forEach((restore, name) => {
        try {
          restore();
        } catch (error) {
          console.log(`Failed to restore ${name}: ${error.message}`);
        }
      });
      
      // Clear mock storage
      this.mocks.clear();
      this.restorations.clear();
      
      logReturn('MockManager.clearAll', 'completed');
    } catch (error) {
      logReturn('MockManager.clearAll', `error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets a specific mock by name for custom assertions
   * 
   * @param {string} name - Name of the mock to retrieve
   * @returns {any} Mock object or undefined if not found
   */
  getMock(name) {
    logStart('MockManager.getMock', name);
    const mock = this.mocks.get(name);
    logReturn('MockManager.getMock', mock ? 'found' : 'not found');
    return mock;
  }
}

module.exports = {
  MockManager
};