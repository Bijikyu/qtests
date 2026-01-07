/**
 * String Utilities
 * Provides string manipulation and formatting utilities
 */

/**
 * Truncates a string and adds ellipsis if needed
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - Ellipsis string to use (default: '...')
 * @returns Truncated string with ellipsis if original was too long
 */
export function truncateString(str: string, maxLength: number, ellipsis: string = '...'): string {
  if (!str || str.length <= maxLength) {
    return str;
  }
  
  return str.substring(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Truncates a string safely (handles null/undefined)
 * @param str - String to truncate (can be null/undefined)
 * @param maxLength - Maximum length
 * @param ellipsis - Ellipsis string (default: '...')
 * @returns Truncated string or empty string if input was null/undefined
 */
export function truncateStringSafe(str: string | null | undefined, maxLength: number, ellipsis: string = '...'): string {
  if (!str) {
    return '';
  }
  
  return truncateString(str, maxLength, ellipsis);
}

/**
 * Truncates a string for display purposes (adds ellipsis only if string exceeds limit)
 * @param str - String to truncate
 * @param maxLength - Maximum length for display
 * @returns String for display with ellipsis if needed
 */
export function truncateForDisplay(str: string, maxLength: number): string {
  return truncateString(str, maxLength, '...');
}

/**
 * Truncates a JSON string safely for logging
 * @param obj - Object to stringify and truncate
 * @param maxLength - Maximum string length
 * @returns Truncated JSON string
 */
export function truncateJsonString(obj: any, maxLength: number): string {
  try {
    const jsonStr = JSON.stringify(obj);
    return truncateString(jsonStr, maxLength, '...');
  } catch {
    return truncateString(String(obj), maxLength, '...');
  }
}