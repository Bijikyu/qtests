/**
 * String Utilities for qtests Framework
 * 
 * This module provides string manipulation and formatting utilities commonly
 * needed throughout the qtests framework. These utilities focus on safe
 * string handling, truncation for display purposes, and JSON serialization
 * with proper error handling.
 * 
 * Key use cases:
 * - Truncating long strings for logging and display
 * - Safe string handling with null/undefined protection
 * - JSON stringification with fallback handling
 * - Display formatting for test output and debugging
 * 
 * Design principles:
 * - Safe handling of null/undefined inputs
 * - Consistent error handling and fallbacks
 * - Performance optimization for common operations
 * - Clear, descriptive function names
 */

/**
 * Truncates a string and adds ellipsis if needed
 * 
 * This is the core string truncation function that handles the basic
 * logic of cutting a string to a specified length and adding an ellipsis
 * if the original string exceeds that length.
 * 
 * Algorithm:
 * 1. Check if string is null/undefined or already within limit
 * 2. Calculate truncation point (maxLength - ellipsis.length)
 * 3. Extract substring and append ellipsis
 * 
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation (must be >= ellipsis length)
 * @param ellipsis - Ellipsis string to use (default: '...')
 * @returns Truncated string with ellipsis if original was too long
 * 
 * @example
 * truncateString('Hello world', 8); // Returns 'Hello...'
 * truncateString('Short', 10); // Returns 'Short' (no truncation)
 */
export function truncateString(str: string, maxLength: number, ellipsis: string = '...'): string {
  // Early return for null/undefined or strings already within limit
  if (!str || str.length <= maxLength) {
    return str;
  }
  
  // Calculate truncation point and return truncated string with ellipsis
  return str.substring(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Truncates a string safely (handles null/undefined)
 * 
 * This function provides null/undefined safety for string truncation,
 * returning an empty string for null/undefined inputs instead of throwing
 * errors. This is particularly useful when dealing with optional string
 * fields or API responses that may contain null values.
 * 
 * @param str - String to truncate (can be null/undefined)
 * @param maxLength - Maximum length for truncation
 * @param ellipsis - Ellipsis string to use (default: '...')
 * @returns Truncated string or empty string if input was null/undefined
 * 
 * @example
 * truncateStringSafe(null, 10); // Returns ''
 * truncateStringSafe('Hello world', 8); // Returns 'Hello...'
 */
export function truncateStringSafe(str: string | null | undefined, maxLength: number, ellipsis: string = '...'): string {
  // Return empty string for null/undefined inputs
  if (!str) {
    return '';
  }
  
  // Delegate to the main truncation function
  return truncateString(str, maxLength, ellipsis);
}

/**
 * Truncates a string for display purposes (adds ellipsis only if string exceeds limit)
 * 
 * This function is specifically designed for UI display scenarios where
 * consistent truncation behavior is needed. It uses a standard ellipsis
 * and provides a simple interface for common display use cases.
 * 
 * @param str - String to truncate for display
 * @param maxLength - Maximum length for display (including ellipsis)
 * @returns String formatted for display with ellipsis if needed
 * 
 * @example
 * truncateForDisplay('Very long text that needs truncation', 20);
 * // Returns 'Very long text tha...'
 */
export function truncateForDisplay(str: string, maxLength: number): string {
  return truncateString(str, maxLength, '...');
}

/**
 * Truncates a JSON string safely for logging
 * 
 * This function handles JSON stringification with proper error handling
 * and fallback mechanisms. It's particularly useful for logging complex
 * objects where JSON.stringify might fail due to circular references
 * or unsupported data types.
 * 
 * Error handling strategy:
 * 1. Attempt normal JSON.stringify
 * 2. If it fails, fall back to String(obj)
 * 3. Apply truncation to the result
 * 
 * @param obj - Object to stringify and truncate for logging
 * @param maxLength - Maximum string length for log output
 * @returns Truncated JSON string or string representation
 * 
 * @example
 * truncateJsonString({ user: 'John', data: [1, 2, 3] }, 50);
 * // Returns '{"user":"John","data":[1,2,3]}' (if within limit)
 */
export function truncateJsonString(obj: any, maxLength: number): string {
  try {
    // Attempt to stringify the object normally
    const jsonStr = JSON.stringify(obj);
    return truncateString(jsonStr, maxLength, '...');
  } catch {
    // Fallback: convert to string if JSON.stringify fails
    // This handles circular references and unsupported types
    return truncateString(String(obj), maxLength, '...');
  }
}