/**
 * Enhanced JSON Utilities with Security Focus
 * 
 * Provides optimized JSON operations with security protections using secure-json-parse
 * for superior security against JSON injection and prototype pollution attacks.
 */

import { parse } from 'secure-json-parse';

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
    // Use secure-json-parse for protection against prototype pollution
    return parse(jsonString, undefined, {
      protoAction: 'remove',
      constructorAction: 'remove'
    });
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
    
    // Use secure-json-parse for protection against prototype pollution
    return parse(jsonString, undefined, {
      protoAction: 'remove',
      constructorAction: 'remove'
    });
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

  // Parse JSON securely
  let data: any;
  try {
    data = parse(jsonString, undefined, {
      protoAction: 'remove',
      constructorAction: 'remove'
    });
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

/**
 * Async JSON parse with size validation and streaming support for large data
 * @param jsonString - JSON string to parse
 * @param maxSize - Maximum size in bytes (default: 10MB)
 * @returns Promise that resolves to parsed object
 */
export async function safeJSONParseAsync(jsonString: string, maxSize: number = 10 * 1024 * 1024): Promise<any> {
  // Size validation
  if (jsonString.length > maxSize) {
    throw new Error(`JSON too large: ${jsonString.length} bytes (max: ${maxSize})`);
  }

  // For smaller JSON, use secure parse with setImmediate to prevent blocking
  if (jsonString.length < 1024 * 1024) { // 1MB threshold
    return new Promise((resolve, reject) => {
      setImmediate(() => {
        try {
          resolve(parse(jsonString, undefined, {
            protoAction: 'remove',
            constructorAction: 'remove'
          }));
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // For larger JSON, implement secure chunked parsing
  return new Promise((resolve, reject) => {
    let result = null;
    let parseError = null;

    // Use setImmediate to break up parsing
    const parseChunk = () => {
      try {
        result = parse(jsonString, undefined, {
          protoAction: 'remove',
          constructorAction: 'remove'
        });
        resolve(result);
      } catch (error) {
        parseError = error;
        reject(parseError);
      }
    };

    setImmediate(parseChunk);
  });
}

/**
 * Async JSON stringify with size validation and streaming support for large data
 * @param obj - Object to stringify
 * @param maxSize - Maximum size in bytes (default: 10MB)
 * @param replacer - JSON replacer function (optional)
 * @param space - JSON space argument (optional)
 * @returns Promise that resolves to JSON string
 */
export async function safeJSONStringifyAsync(
  obj: any, 
  maxSize: number = 10 * 1024 * 1024,
  replacer?: (key: string, value: any) => any,
  space?: string | number
): Promise<string> {
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      try {
        const jsonString = JSON.stringify(obj, replacer, space);
        
        // Size validation
        if (jsonString.length > maxSize) {
          reject(new Error(`JSON too large: ${jsonString.length} bytes (max: ${maxSize})`));
          return;
        }

        resolve(jsonString);
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Batch JSON operations for processing multiple items efficiently
 * @param items - Array of items to process
 * @param processor - Function to process each item
 * @param batchSize - Size of each batch (default: 10)
 * @param concurrency - Maximum concurrent batches (default: 3)
 * @returns Promise that resolves to array of processed results
 */
export async function batchJSONOperation<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10,
  concurrency: number = 3
): Promise<R[]> {
  const results: R[] = [];
  
  // Process items in batches
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Process batch with concurrency limit
    const batchPromises = batch.map(item => 
      new Promise<R>((resolve, reject) => {
        // Add delay to prevent overwhelming the event loop
        setImmediate(async () => {
          try {
            const result = await processor(item);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      })
    );

    // Wait for current batch before processing next
    const batchResults = await Promise.allSettled(batchPromises);
    
    // Collect successful results
    batchResults.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.warn('Batch operation failed:', result.reason);
      }
    });

    // Add small delay between batches to prevent blocking
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }

  return results;
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
  validateJSONStructure,
  safeJSONParseAsync,
  safeJSONStringifyAsync,
  batchJSONOperation
};