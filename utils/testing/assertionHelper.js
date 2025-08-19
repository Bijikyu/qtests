/**
 * Assertion Helper Utilities for Common Testing Patterns
 * 
 * This class focuses solely on assertion logic and testing validation concerns.
 * It centralizes repetitive assertion logic with descriptive helpers.
 */

const { logStart, logReturn } = require('../../lib/logUtils');

/**
 * Assertion Helper Utilities for Common Testing Patterns
 * 
 * This class centralizes repetitive assertion logic with descriptive helpers
 * that reduce code duplication across test files while providing clear,
 * readable test assertions.
 */
class AssertionHelper {
  /**
   * Asserts that an object has standard database entity properties
   * 
   * @param {Object} entity - Entity object to validate
   * @param {Object} expectedProperties - Expected property values
   */
  static assertDatabaseEntity(entity, expectedProperties = {}) {
    logStart('AssertionHelper.assertDatabaseEntity', entity, expectedProperties);
    
    try {
      if (!entity) {
        throw new Error('Entity cannot be null or undefined');
      }
      
      // Check for database-specific properties
      if (entity._id !== undefined) {
        if (!entity._id) {
          throw new Error('Entity _id must be defined and truthy');
        }
      }
      
      if (entity.id !== undefined) {
        if (!entity.id) {
          throw new Error('Entity id must be defined and truthy');
        }
      }
      
      if (entity.createdAt !== undefined) {
        if (!(entity.createdAt instanceof Date)) {
          throw new Error('Entity createdAt must be a Date instance');
        }
      }
      
      // Check expected properties
      Object.entries(expectedProperties).forEach(([key, value]) => {
        if (entity[key] !== value) {
          throw new Error(`Expected entity.${key} to be ${value}, but got ${entity[key]}`);
        }
      });
      
      logReturn('AssertionHelper.assertDatabaseEntity', 'passed');
    } catch (error) {
      logReturn('AssertionHelper.assertDatabaseEntity', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts API response structure and status
   * 
   * @param {Object} response - API response object
   * @param {number} expectedStatus - Expected HTTP status code
   * @param {boolean} hasData - Whether response should have data
   */
  static assertApiResponse(response, expectedStatus, hasData = true) {
    logStart('AssertionHelper.assertApiResponse', response, expectedStatus, hasData);
    
    try {
      if (!response) {
        throw new Error('Response cannot be null or undefined');
      }
      
      if (response.status !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, but got ${response.status}`);
      }
      
      if (hasData) {
        if (!response.body && !response.data) {
          throw new Error('Response should have body or data property');
        }
      }
      
      if (expectedStatus >= 400) {
        const errorData = response.body || response.data || {};
        if (!errorData.error && !errorData.message) {
          throw new Error('Error responses should have error or message property');
        }
      }
      
      logReturn('AssertionHelper.assertApiResponse', 'passed');
    } catch (error) {
      logReturn('AssertionHelper.assertApiResponse', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts email sending behavior using qtests sendEmail utility
   * 
   * @param {Object} expectedEmail - Expected email properties
   * @param {Object} options - Assertion options
   */
  static assertEmailSent(expectedEmail = {}, options = {}) {
    logStart('AssertionHelper.assertEmailSent', expectedEmail, options);
    
    try {
      const { sendEmail } = require('../../lib/envUtils');
      const emailHistory = sendEmail.getEmailHistory();
      
      const { count = 1, index = emailHistory.length - 1 } = options;
      
      if (emailHistory.length < count) {
        throw new Error(`Expected at least ${count} emails, but found ${emailHistory.length}`);
      }
      
      if (index >= emailHistory.length || index < 0) {
        throw new Error(`Email index ${index} is out of range (0-${emailHistory.length - 1})`);
      }
      
      const email = emailHistory[index];
      
      if (!email.success) {
        throw new Error(`Email at index ${index} was not successful: ${email.message}`);
      }
      
      // Check expected email properties
      Object.entries(expectedEmail).forEach(([key, value]) => {
        const emailData = email.emailData || {};
        if (emailData[key] !== value) {
          throw new Error(`Expected email.${key} to be ${value}, but got ${emailData[key]}`);
        }
      });
      
      logReturn('AssertionHelper.assertEmailSent', 'passed');
    } catch (error) {
      logReturn('AssertionHelper.assertEmailSent', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts mock function call behavior
   * 
   * @param {Function} mockFunction - Mock function to assert
   * @param {Object} expectations - Call expectations
   */
  static assertMockCalled(mockFunction, expectations = {}) {
    logStart('AssertionHelper.assertMockCalled', mockFunction.name, expectations);
    
    try {
      if (!mockFunction) {
        throw new Error('Mock function cannot be null or undefined');
      }
      
      const {
        times = 1,
        calledWith = null,
        returnedWith = null
      } = expectations;
      
      // Check if mock has call tracking
      if (mockFunction.mock && mockFunction.mock.calls) {
        const callCount = mockFunction.mock.calls.length;
        
        if (callCount !== times) {
          throw new Error(`Expected ${times} calls, but got ${callCount}`);
        }
        
        if (calledWith !== null && callCount > 0) {
          const lastCall = mockFunction.mock.calls[callCount - 1];
          if (JSON.stringify(lastCall) !== JSON.stringify(calledWith)) {
            throw new Error(`Expected last call with ${JSON.stringify(calledWith)}, but got ${JSON.stringify(lastCall)}`);
          }
        }
        
        if (returnedWith !== null && mockFunction.mock.results) {
          const lastResult = mockFunction.mock.results[mockFunction.mock.results.length - 1];
          if (lastResult && lastResult.value !== returnedWith) {
            throw new Error(`Expected return value ${returnedWith}, but got ${lastResult.value}`);
          }
        }
      }
      else {
        console.log('Warning: Mock function does not support call tracking');
      }
      
      logReturn('AssertionHelper.assertMockCalled', 'passed');
    } catch (error) {
      logReturn('AssertionHelper.assertMockCalled', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts that an array contains expected elements
   * 
   * @param {Array} array - Array to check
   * @param {Array} expectedElements - Elements that should be present
   * @param {boolean} exactMatch - Whether array should contain only these elements
   */
  static assertArrayContains(array, expectedElements, exactMatch = false) {
    logStart('AssertionHelper.assertArrayContains', array, expectedElements, exactMatch);
    
    try {
      if (!Array.isArray(array)) {
        throw new Error('First argument must be an array');
      }
      
      if (!Array.isArray(expectedElements)) {
        throw new Error('Expected elements must be an array');
      }
      
      // Check if all expected elements are present
      for (const element of expectedElements) {
        if (!array.includes(element)) {
          throw new Error(`Array does not contain expected element: ${element}`);
        }
      }
      
      // Check exact match if required
      if (exactMatch) {
        if (array.length !== expectedElements.length) {
          throw new Error(`Expected array length ${expectedElements.length}, but got ${array.length}`);
        }
        
        for (const element of array) {
          if (!expectedElements.includes(element)) {
            throw new Error(`Array contains unexpected element: ${element}`);
          }
        }
      }
      
      logReturn('AssertionHelper.assertArrayContains', 'passed');
    } catch (error) {
      logReturn('AssertionHelper.assertArrayContains', `failed: ${error.message}`);
      throw error;
    }
  }
}

module.exports = {
  AssertionHelper
};