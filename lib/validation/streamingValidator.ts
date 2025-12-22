/**
 * Streaming String Validator
 * Main validation class for streaming data validation
 */

import { z } from 'zod';
import { sanitizeString } from './htmlSanitization.js';

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

  constructor(config: ValidationConfig = {}) {
    this.config = { ...config };
    this.maxStringLength = config.maxStringLength ?? 50000;
  }

  async validateString(input: string, maxLength?: number): Promise<string> {
    const actualMaxLength = maxLength ?? this.maxStringLength;
    const schema = z.string().max(actualMaxLength).transform(sanitizeString);
    const result = schema.safeParse(input);
    
    if (result.success) {
      return result.data;
    } else {
      console.warn(`Validation failed: ${result.error?.message}`);
      return sanitizeString(input).substring(0, actualMaxLength);
    }
  }

  async validateObject(obj: any, depth = 0, maxDepth = 10): Promise<any> {
    if (depth > maxDepth) throw new Error('Maximum object depth exceeded');
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