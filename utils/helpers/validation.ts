/**
 * Validation Utility
 * Provides common validation patterns used across the qtests module
 */

/**
 * Validates that a parameter is an object and not null
 * @param obj - Value to validate
 * @param paramName - Parameter name for error messages
 * @throws Error if validation fails
 */
export function validateObject(obj: any, paramName: string): void {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error(`Expected ${paramName} to be an object but received ${obj}`);
  }
}

/**
 * Validates that a parameter is an array
 * @param param - Value to validate
 * @param paramName - Parameter name for error messages
 * @throws Error if validation fails
 */
export function validateArray(param: any, paramName: string): void {
  if (!Array.isArray(param)) {
    throw new Error(`Expected ${paramName} to be an array but got ${typeof param}`);
  }
}

/**
 * Validates that a parameter is a string
 * @param param - Value to validate
 * @param paramName - Parameter name for error messages
 * @throws Error if validation fails
 */
export function validateString(param: any, paramName: string): void {
  if (typeof param !== 'string') {
    throw new Error(`Expected ${paramName} to be a string but got ${typeof param}`);
  }
}

/**
 * Validates that a parameter is a function
 * @param param - Value to validate
 * @param paramName - Parameter name for error messages
 * @throws Error if validation fails
 */
export function validateFunction(param: any, paramName: string): void {
  if (typeof param !== 'function') {
    throw new Error(`Expected ${paramName} to be a function but got ${typeof param}`);
  }
}