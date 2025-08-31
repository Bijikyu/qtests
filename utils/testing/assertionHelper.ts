/**
 * Assertion Helper Utilities for Common Testing Patterns - TypeScript Implementation
 * 
 * This class focuses solely on assertion logic and testing validation concerns.
 * It centralizes repetitive assertion logic with descriptive helpers.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';

// Type definitions
interface DatabaseEntity {
  _id?: any;
  id?: any;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

interface ApiResponse {
  status: number;
  body?: any;
  data?: any;
  headers?: Record<string, string>;
}

interface EmailExpectation {
  to?: string;
  subject?: string;
  body?: string;
  [key: string]: any;
}

interface AssertionOptions {
  count?: number;
  index?: number;
}

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
   */
  static assertDatabaseEntity(entity: DatabaseEntity, expectedProperties: Record<string, any> = {}): void {
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
    } catch (error: any) {
      logReturn('AssertionHelper.assertDatabaseEntity', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts API response structure and status
   */
  static assertApiResponse(response: ApiResponse, expectedStatus: number, hasData: boolean = true): void {
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
    } catch (error: any) {
      logReturn('AssertionHelper.assertApiResponse', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts email sending behavior
   */
  static assertEmailSent(expectedEmail: EmailExpectation = {}, options: AssertionOptions = {}): void {
    logStart('AssertionHelper.assertEmailSent', expectedEmail, options);
    
    try {
      // This would need to be implemented with actual email history tracking
      // For now, provide a placeholder implementation
      const emailHistory: any[] = [];
      
      const { count = 1, index = emailHistory.length - 1 } = options;
      
      if (emailHistory.length < count) {
        throw new Error(`Expected at least ${count} emails, but found ${emailHistory.length}`);
      }
      
      if (index >= emailHistory.length || index < 0) {
        throw new Error(`Email index ${index} is out of range (0-${emailHistory.length - 1})`);
      }
      
      const email = emailHistory[index];
      
      // Check expected email properties
      Object.entries(expectedEmail).forEach(([key, value]) => {
        if (email[key] !== value) {
          throw new Error(`Expected email.${key} to be ${value}, but got ${email[key]}`);
        }
      });
      
      logReturn('AssertionHelper.assertEmailSent', 'passed');
    } catch (error: any) {
      logReturn('AssertionHelper.assertEmailSent', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts array properties and content
   */
  static assertArray(array: any[], expectedLength?: number, itemValidator?: (item: any) => void): void {
    logStart('AssertionHelper.assertArray', array, expectedLength);
    
    try {
      if (!Array.isArray(array)) {
        throw new Error('Expected an array but got ' + typeof array);
      }
      
      if (expectedLength !== undefined && array.length !== expectedLength) {
        throw new Error(`Expected array length ${expectedLength}, but got ${array.length}`);
      }
      
      if (itemValidator) {
        array.forEach((item, index) => {
          try {
            itemValidator(item);
          } catch (error: any) {
            throw new Error(`Array item at index ${index} failed validation: ${error.message}`);
          }
        });
      }
      
      logReturn('AssertionHelper.assertArray', 'passed');
    } catch (error: any) {
      logReturn('AssertionHelper.assertArray', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts object has required properties
   */
  static assertObjectStructure(obj: any, requiredProps: string[], optionalProps: string[] = []): void {
    logStart('AssertionHelper.assertObjectStructure', obj, requiredProps, optionalProps);
    
    try {
      if (!obj || typeof obj !== 'object') {
        throw new Error('Expected an object but got ' + typeof obj);
      }
      
      // Check required properties
      for (const prop of requiredProps) {
        if (!(prop in obj)) {
          throw new Error(`Required property '${prop}' is missing`);
        }
      }
      
      // Check for unexpected properties
      const allowedProps = new Set([...requiredProps, ...optionalProps]);
      for (const prop of Object.keys(obj)) {
        if (!allowedProps.has(prop)) {
          throw new Error(`Unexpected property '${prop}' found`);
        }
      }
      
      logReturn('AssertionHelper.assertObjectStructure', 'passed');
    } catch (error: any) {
      logReturn('AssertionHelper.assertObjectStructure', `failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts timing constraints
   */
  static assertTimingConstraint(actualDuration: number, maxDuration: number, operation: string = 'operation'): void {
    logStart('AssertionHelper.assertTimingConstraint', actualDuration, maxDuration, operation);
    
    try {
      if (actualDuration > maxDuration) {
        throw new Error(
          `${operation} took ${actualDuration.toFixed(2)}ms, exceeding limit of ${maxDuration}ms`
        );
      }
      
      logReturn('AssertionHelper.assertTimingConstraint', `passed in ${actualDuration.toFixed(2)}ms`);
    } catch (error: any) {
      logReturn('AssertionHelper.assertTimingConstraint', `failed: ${error.message}`);
      throw error;
    }
  }
}

// Export AssertionHelper using ES module syntax
export { AssertionHelper };