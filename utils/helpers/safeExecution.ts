/**
 * Safe Execution Utility
 * Provides safe method calling patterns with validation
 */

/**
 * Safely calls a method on an object with validation
 * Replaces the common pattern of manual method existence and type checking
 * 
 * @param obj - Object containing the method
 * @param methodName - Name of the method to call
 * @param args - Arguments to pass to the method
 * @returns True if method was called successfully, false otherwise
 */
export function safeMethodCall(obj: any, methodName: string, ...args: any[]): boolean {
  try {
    if (obj && obj[methodName] && typeof obj[methodName] === 'function') {
      obj[methodName](...args);
      return true;
    }
    return false;
  } catch (error) {
    console.warn(`Failed to safely call method ${methodName}:`, error);
    return false;
  }
}

/**
 * Safely calls a function with validation
 * @param fn - Function to call
 * @param args - Arguments to pass to the function
 * @returns True if function was called successfully, false otherwise
 */
export function safeFunctionCall(fn: any, ...args: any[]): boolean {
  try {
    if (typeof fn === 'function') {
      fn(...args);
      return true;
    }
    return false;
  } catch (error) {
    console.warn(`Failed to safely call function:`, error);
    return false;
  }
}

/**
 * Safely gets a property from an object
 * @param obj - Object to get property from
 * @param propertyName - Name of the property
 * @returns Property value or undefined
 */
export function safeGetProperty(obj: any, propertyName: string): any {
  try {
    return obj && obj[propertyName];
  } catch (error) {
    console.warn(`Failed to safely get property ${propertyName}:`, error);
    return undefined;
  }
}