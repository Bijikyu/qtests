/**
 * Streaming String Validator
 * Main validation class for streaming data validation
 */

import { z } from 'zod';
import { sanitizeString } from './htmlSanitization.js';
import qerrors from 'qerrors';

export interface ValidationConfig {
  maxStringLength?: number;
  maxQueryStringLength?: number;
  dangerousPatterns?: RegExp[];
}

export interface ValidationResult {
  isValid: boolean;
  sanitized?: any;
  error?: string;
  processingTime?: number;
}

export class StreamingStringValidator {
  private config: ValidationConfig;
  private maxStringLength: number;
  
  // Performance optimization: schema cache for repeated validations
  private schemaCache = new Map<number, any>();
  private readonly maxCacheSize = 100;
  
  // Performance optimization: compiled regex patterns
  private readonly dangerousPatternCache = new Map<string, RegExp>();

  constructor(config: ValidationConfig = {}) {
    this.config = { ...config };
    this.maxStringLength = config.maxStringLength ?? 50000;
  }

  async validateString(input: string, maxLength?: number): Promise<string> {
    try {
      const actualMaxLength = maxLength ?? this.maxStringLength;
      
      // Fast path: skip validation if input is clearly within limits
      if (input.length <= actualMaxLength && !this.hasDangerousPatternsFast(input)) {
        return input;
      }
      
      // Use cached schema for performance
      let schema = this.schemaCache.get(actualMaxLength);
      if (!schema) {
        schema = z.string().max(actualMaxLength).transform(sanitizeString);
        
        // Manage cache size
        if (this.schemaCache.size >= this.maxCacheSize) {
          const firstKey = this.schemaCache.keys().next().value;
          if (firstKey) {
            this.schemaCache.delete(firstKey);
          }
        }
        this.schemaCache.set(actualMaxLength, schema);
      }
      
      const result = schema.safeParse(input);
      
      if (result.success) {
        return result.data;
      } else {
        qerrors(new Error(result.error?.message || 'String validation failed'), 'streamingValidator.validateString: validation failed', {
          inputLength: input.length,
          actualMaxLength,
          errorMessage: result.error?.message
        });
        console.warn(`Validation failed: ${result.error?.message}`);
        return sanitizeString(input).substring(0, actualMaxLength);
      }
    } catch (error) {
      qerrors(error as Error, 'streamingValidator.validateString: unexpected error', {
        inputLength: input.length,
        maxLength: maxLength || this.maxStringLength
      });
      return sanitizeString(input).substring(0, maxLength || this.maxStringLength);
    }
  }

  /**
   * Fast dangerous pattern detection without full regex compilation
   */
  private hasDangerousPatternsFast(input: string): boolean {
    // Quick check for common dangerous patterns using string methods
    const dangerousStarts = ['<script', 'javascript:', 'vbscript:', 'data:', 'onload=', 'onerror='];
    const lowerInput = input.toLowerCase();
    
    return dangerousStarts.some(start => lowerInput.includes(start));
  }

  async validateObject(obj: any, depth = 0, maxDepth = 10): Promise<any> {
    try {
      if (depth > maxDepth) {
        const depthError = new Error('Maximum object depth exceeded');
        qerrors(depthError, 'streamingValidator.validateObject: depth exceeded', {
          currentDepth: depth,
          maxDepth,
          objType: typeof obj
        });
        throw depthError;
      }
      if (obj === null || obj === undefined) return obj;
      if (typeof obj === 'string') return this.validateString(obj);
      
      if (Array.isArray(obj)) {
        const validatedArray = [];
        for (const item of obj) {
          validatedArray.push(await this.validateObject(item, depth + 1, maxDepth));
        }
        return validatedArray;
      }

      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        const validatedObj: Record<string, any> = {};
        for (const [key, value] of Object.entries(obj)) {
          const validatedKey = await this.validateString(key, 100);
          validatedObj[validatedKey] = await this.validateObject(value, depth + 1, maxDepth);
        }
        return validatedObj;
      }

      return obj;
    } catch (error) {
      qerrors(error as Error, 'streamingValidator.validateObject: validation failed', {
        currentDepth: depth,
        maxDepth,
        objType: typeof obj,
        isArray: Array.isArray(obj)
      });
      throw error;
    }
  }

  hasDangerousPatterns(input: string): boolean {
    const { hasDangerousPatterns } = require('./htmlSanitization.js');
    return hasDangerousPatterns(input);
  }

  getConfig(): ValidationConfig {
    return { ...this.config };
  }
}

export const defaultValidator = new StreamingStringValidator();
export const strictValidator = new StreamingStringValidator({
  maxStringLength: 10000,
  maxQueryStringLength: 200
});
export const relaxedValidator = new StreamingStringValidator({
  maxStringLength: 100000,
  maxQueryStringLength: 1000
});

export function createStreamingValidator(config: ValidationConfig = {}): StreamingStringValidator {
  return new StreamingStringValidator(config);
}

export default StreamingStringValidator;