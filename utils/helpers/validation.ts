/**
 * Validation Utility for qtests Framework
 * 
 * This module provides common validation patterns used across the qtests
 * framework to ensure type safety and provide clear error messages for
 * invalid inputs. It follows a consistent pattern of throwing descriptive
 * errors when validation fails.
 * 
 * Design principles:
 * - Fail fast: Validate inputs at the start of functions
 * - Clear errors: Provide descriptive error messages with parameter names
 * - Type safety: Use TypeScript types for compile-time checking
 * - Runtime validation: Ensure correct types even when called from JavaScript
 * 
 * Why validation matters:
 * - Prevents runtime errors from invalid inputs
 * - Provides clear debugging information
 * - Ensures API contracts are maintained
 * - Supports both TypeScript and JavaScript usage
 */

/**
 * Validates that a parameter is an object and not null
 * 
 * This function checks that the input is a non-null object. It specifically
 * rejects null values because typeof null === 'object' in JavaScript, which
 * can lead to unexpected behavior if not handled properly.
 * 
 * @param obj - Value to validate as object
 * @param paramName - Parameter name for error messages (used for debugging)
 * @throws Error if validation fails with descriptive message
 * 
 * @example
 * validateObject({ key: 'value' }, 'options'); // Passes
 * validateObject(null, 'options'); // Throws: Expected options to be an object but received null
 * validateObject('string', 'options'); // Throws: Expected options to be an object but received string
 */
export function validateObject(obj: any, paramName: string): void {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error(`Expected ${paramName} to be an object but received ${obj}`);
  }
}

/**
 * Validates that a parameter is an array
 * 
 * This function uses Array.isArray() which is the most reliable way to
 * check for arrays in JavaScript, as it works across different execution
 * contexts and handles typed arrays correctly.
 * 
 * @param param - Value to validate as array
 * @param paramName - Parameter name for error messages (used for debugging)
 * @throws Error if validation fails with descriptive message
 * 
 * @example
 * validateArray([1, 2, 3], 'items'); // Passes
 * validateArray('not array', 'items'); // Throws: Expected items to be an array but got string
 * validateArray({}, 'items'); // Throws: Expected items to be an array but got object
 */
export function validateArray(param: any, paramName: string): void {
  if (!Array.isArray(param)) {
    throw new Error(`Expected ${paramName} to be an array but got ${typeof param}`);
  }
}

/**
 * Validates that a parameter is a string
 * 
 * This function ensures the input is of type string. It's commonly used
 * for validating parameter names, file paths, URLs, and other string-based
 * configuration values.
 * 
 * @param param - Value to validate as string
 * @param paramName - Parameter name for error messages (used for debugging)
 * @throws Error if validation fails with descriptive message
 * 
 * @example
 * validateString('hello', 'message'); // Passes
 * validateString(123, 'message'); // Throws: Expected message to be a string but got number
 * validateString(null, 'message'); // Throws: Expected message to be a string but got object
 */
export function validateString(param: any, paramName: string): void {
  if (typeof param !== 'string') {
    throw new Error(`Expected ${paramName} to be a string but got ${typeof param}`);
  }
}

/**
 * Validates that a parameter is a function
 * 
 * This function ensures the input is callable. It's used for validating
 * callback functions, stub implementations, event handlers, and other
 * function-based parameters.
 * 
 * @param param - Value to validate as function
 * @param paramName - Parameter name for error messages (used for debugging)
 * @throws Error if validation fails with descriptive message
 * 
 * @example
 * validateFunction(() => {}, 'callback'); // Passes
 * validateFunction('not function', 'callback'); // Throws: Expected callback to be a function but got string
 * validateFunction(null, 'callback'); // Throws: Expected callback to be a function but got object
 */
export function validateFunction(param: any, paramName: string): void {
  if (typeof param !== 'function') {
    throw new Error(`Expected ${paramName} to be a function but got ${typeof param}`);
  }
}