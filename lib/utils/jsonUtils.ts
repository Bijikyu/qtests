/**
 * JSON Operation Caching Utilities
 * Provides optimized JSON operations with caching and size limits
 */

/**
 * JSON operation cache with WeakMap for automatic garbage collection
 */
class JSONCache {
  private cache = new WeakMap<object, string>();
  private maxSize = 10000; // Maximum cache entries
  private size = 0;

  /**
   * Get cached JSON string
   * @param obj - Object to get cached string for
   * @returns Cached JSON string or undefined
   */
  get(obj: object): string | undefined {
    return this.cache.get(obj);
  }

  /**
   * Set cached JSON string
   * @param obj - Object to cache
   * @param jsonString - JSON string to cache
   */
  set(obj: object, jsonString: string): void {
    if (this.size >= this.maxSize) {
      // WeakMap automatically handles cleanup, so we don't need manual eviction
      // The size limit is more of a guideline for usage patterns
      return;
    }
    
    this.cache.set(obj, jsonString);
    this.size++;
  }

  /**
   * Clear cache (Note: WeakMap doesn't have clear method)
   */
  clear(): void {
    // Create new WeakMap to effectively clear
    this.cache = new WeakMap();
    this.size = 0;
  }
}

// Global JSON cache instance
const jsonCache = new JSONCache();

/**
 * Safe JSON parsing with error handling and size limits
 * @param jsonString - JSON string to parse
 * @param maxSize - Maximum string size in bytes (default: 10MB)
 * @param fallback - Fallback value if parsing fails (default: null)
 * @returns Parsed object or fallback value
 */
export function safeJSONParse<T = any>(
  jsonString: string,
  maxSize: number = 10 * 1024 * 1024,
  fallback: T | null = null
): T | null {
  if (!jsonString || typeof jsonString !== 'string') {
    return fallback;
  }

  // Check size limit
  if (jsonString.length > maxSize) {
    console.warn(`JSON string too large: ${jsonString.length} bytes (max: ${maxSize})`);
    return fallback;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parse failed:', error instanceof Error ? error.message : error);
    return fallback;
  }
}

/**
 * Safe JSON stringify with error handling and size limits
 * @param obj - Object to stringify
 * @param maxSize - Maximum string size in bytes (default: 10MB)
 * @param fallback - Fallback value if stringifying fails (default: '{}')
 * @returns JSON string or fallback value
 */
export function safeJSONStringify(
  obj: any,
  maxSize: number = 10 * 1024 * 1024,
  fallback: string = '{}'
): string {
  if (obj === undefined || obj === null) {
    return fallback;
  }

  try {
    const jsonString = JSON.stringify(obj);
    
    // Check size limit
    if (jsonString.length > maxSize) {
      console.warn(`JSON string too large: ${jsonString.length} bytes (max: ${maxSize})`);
      return fallback;
    }
    
    return jsonString;
  } catch (error) {
    console.warn('JSON stringify failed:', error instanceof Error ? error.message : error);
    return fallback;
  }
}

/**
 * Cached JSON stringification for frequently serialized objects
 * @param obj - Object to stringify
 * @param maxSize - Maximum string size in bytes (default: 10MB)
 * @returns JSON string
 */
export function cachedJSONStringify(
  obj: any,
  maxSize: number = 10 * 1024 * 1024
): string {
  if (obj === undefined || obj === null) {
    return '{}';
  }

  // Check cache first for objects
  if (typeof obj === 'object' && obj !== null) {
    const cached = jsonCache.get(obj);
    if (cached) {
      return cached;
    }
  }

  try {
    const jsonString = JSON.stringify(obj);
    
    // Check size limit
    if (jsonString.length > maxSize) {
      console.warn(`JSON string too large: ${jsonString.length} bytes (max: ${maxSize})`);
      return '{}';
    }
    
    // Cache the result for objects
    if (typeof obj === 'object' && obj !== null) {
      jsonCache.set(obj, jsonString);
    }
    
    return jsonString;
  } catch (error) {
    console.warn('JSON stringify failed:', error instanceof Error ? error.message : error);
    return '{}';
  }
}

/**
 * Truncate JSON string to specified length
 * @param jsonString - JSON string to truncate
 * @param maxLength - Maximum length (default: 500)
 * @returns Truncated JSON string
 */
export function truncateJSON(jsonString: string, maxLength: number = 500): string {
  if (!jsonString || jsonString.length <= maxLength) {
    return jsonString;
  }

  // Try to truncate at a safe JSON boundary
  let truncated = jsonString.substring(0, maxLength);
  
  // Remove trailing incomplete JSON structures
  truncated = truncated.replace(/[,\[\{]\s*$/, '');
  
  // Add ellipsis and close brackets
  const openBraces = (truncated.match(/\{/g) || []).length;
  const closeBraces = (truncated.match(/\}/g) || []).length;
  const openBrackets = (truncated.match(/\[/g) || []).length;
  const closeBrackets = (truncated.match(/\]/g) || []).length;
  
  // Add missing closing brackets/braces
  const missingBraces = openBraces - closeBraces;
  const missingBrackets = openBrackets - closeBrackets;
  
  truncated += '...';
  truncated += '}'.repeat(Math.max(0, missingBraces));
  truncated += ']'.repeat(Math.max(0, missingBrackets));
  
  return truncated;
}

/**
 * Deep clone object using JSON with size limits
 * @param obj - Object to clone
 * @param maxSize - Maximum JSON string size (default: 10MB)
 * @returns Cloned object or null if failed
 */
export function safeJSONClone<T = any>(
  obj: any,
  maxSize: number = 10 * 1024 * 1024
): T | null {
  try {
    const jsonString = JSON.stringify(obj);
    if (jsonString.length > maxSize) {
      console.warn(`Object too large for cloning: ${jsonString.length} bytes (max: ${maxSize})`);
      return null;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON clone failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Compare two objects using JSON with error handling
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns True if objects are equal, false otherwise
 */
export function safeJSONEquals(obj1: any, obj2: any): boolean {
  try {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  } catch (error) {
    console.warn('JSON comparison failed:', error instanceof Error ? error.message : error);
    return obj1 === obj2; // Fallback to reference equality
  }
}

/**
 * Extract specific fields from large JSON object
 * @param obj - Source object
 * @param fields - Array of field names to extract
 * @returns Object with only specified fields
 */
export function extractJSONFields(obj: any, fields: string[]): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result: any = {};
  
  for (const field of fields) {
    if (field in obj) {
      result[field] = obj[field];
    }
  }
  
  return result;
}

/**
 * Validate JSON structure against expected schema
 * @param jsonString - JSON string to validate
 * @param schema - Simple schema definition
 * @returns Validation result
 */
export function validateJSONStructure(
  jsonString: string,
  schema: {
    required?: string[];
    optional?: string[];
    maxSize?: number;
  }
): {
  valid: boolean;
  errors: string[];
  data?: any;
} {
  const errors: string[] = [];
  const { required = [], optional = [], maxSize = 10 * 1024 * 1024 } = schema;

  // Check size
  if (jsonString.length > maxSize) {
    errors.push(`JSON too large: ${jsonString.length} bytes (max: ${maxSize})`);
    return { valid: false, errors };
  }

  // Parse JSON
  let data: any;
  try {
    data = JSON.parse(jsonString);
  } catch (error) {
    errors.push(`Invalid JSON: ${error instanceof Error ? error.message : error}`);
    return { valid: false, errors };
  }

  // Check required fields
  if (typeof data === 'object' && data !== null) {
    for (const field of required) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Check for unexpected fields
    const allowedFields = [...required, ...optional];
    for (const field in data) {
      if (!allowedFields.includes(field)) {
        errors.push(`Unexpected field: ${field}`);
      }
    }
  } else if (required.length > 0) {
    errors.push('JSON must be an object with required fields');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : undefined
  };
}

// Export default with all utilities
export default {
  safeJSONParse,
  safeJSONStringify,
  cachedJSONStringify,
  truncateJSON,
  safeJSONClone,
  safeJSONEquals,
  extractJSONFields,
  validateJSONStructure
};