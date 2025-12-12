// Zod-based Validation Implementation
//
// This module replaces the custom streaming validator with industry-standard Zod
// Provides superior type safety, performance, and developer experience
//
// Migration Benefits:
// - Type-first validation (25k stars, 100k+ projects)
// - Superior TypeScript support and inference
// - Better performance with compiled schemas
// - Rich error messages and debugging
// - Extensive ecosystem (middleware, transforms)

import { z } from 'zod';

// XSS sanitization utility (keep this from original)
function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  return str.replace(/[&<>"']/g, char => htmlEscapes[char] || char);
}

// Dangerous patterns for XSS detection
const dangerousPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /vbscript:/gi,
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi
];

/**
 * Check if string contains dangerous XSS patterns
 */
function hasDangerousPatterns(input: string): boolean {
  for (const pattern of dangerousPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(input)) {
      return true;
    }
  }
  return false;
}

/**
 * Sanitize string for XSS protection
 */
function sanitizeString(input: string): string {
  let sanitized = input;
  
  // Remove dangerous patterns
  for (const pattern of dangerousPatterns) {
    pattern.lastIndex = 0;
    sanitized = sanitized.replace(pattern, '');
  }
  
  // Escape HTML
  return escapeHtml(sanitized);
}

// Base validation schemas with XSS protection
const safeString = z.string().transform(sanitizeString);
const safeNumber = z.number();
const safeBoolean = z.boolean();
const safeArray = z.array(z.any());
const safeObject = z.object({}).passthrough();

// Length-constrained schemas with XSS protection
const shortString = z.string().max(500).transform(sanitizeString);
const mediumString = z.string().max(5000).transform(sanitizeString);
const longString = z.string().max(50000).transform(sanitizeString);

// Create validation configuration interface for backward compatibility
export interface ValidationConfig {
  maxStringLength?: number;
  maxQueryStringLength?: number;
  dangerousPatterns?: RegExp[];
}

// Export types for backward compatibility
export interface ValidationResult {
  isValid: boolean;
  sanitized?: any;
  error?: string;
  processingTime?: number;
}

/**
 * Create a Zod-based validator with XSS protection
 */
export class StreamingStringValidator {
  private config: ValidationConfig;
  private maxStringLength: number;

  constructor(config: ValidationConfig = {}) {
    this.config = { ...config };
    this.maxStringLength = config.maxStringLength || 50000;
  }

  /**
   * Validate string with XSS protection
   */
  async validateString(input: string, maxLength?: number): Promise<string> {
    const actualMaxLength = maxLength || this.maxStringLength;
    
    // Create schema with dynamic max length
    const schema = z.string().max(actualMaxLength).transform(sanitizeString);
    const result = schema.safeParse(input);
    
    if (result.success) {
      return result.data;
    } else {
      // Log validation errors for debugging
      console.warn(`Validation failed: ${result.error?.message}`);
      // Return sanitized version even if validation fails
      return sanitizeString(input).substring(0, actualMaxLength);
    }
  }

  /**
   * Validate object recursively with XSS protection
   */
  async validateObject(obj: any, depth = 0, maxDepth = 10): Promise<any> {
    if (depth > maxDepth) {
      throw new Error('Maximum object depth exceeded');
    }

    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.validateString(obj);
    }

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

  /**
   * Check for dangerous patterns (for backward compatibility)
   */
  hasDangerousPatterns(input: string): boolean {
    return hasDangerousPatterns(input);
  }

  /**
   * Get current configuration
   */
  getConfig(): ValidationConfig {
    return { ...this.config };
  }
}

// Pre-configured validators for common use cases
export const defaultValidator = new StreamingStringValidator();
export const strictValidator = new StreamingStringValidator({
  maxStringLength: 10000,
  maxQueryStringLength: 200
});
export const relaxedValidator = new StreamingStringValidator({
  maxStringLength: 100000,
  maxQueryStringLength: 1000
});

// Export Zod schemas for custom validation
export {
  z,
  safeString,
  safeNumber,
  safeBoolean,
  safeArray,
  safeObject,
  shortString,
  mediumString,
  longString
};

// Factory function for backward compatibility
export function createStreamingValidator(config: ValidationConfig = {}): StreamingStringValidator {
  return new StreamingStringValidator(config);
}

// Export middleware function for Express compatibility
export function streamingValidationMiddleware(config: ValidationConfig = {}) {
  const validator = createStreamingValidator(config);

  return async (req: any, res: any, next: any) => {
    const startTime = Date.now();

    try {
      if (req.body && typeof req.body === 'object') {
        req.body = await validator.validateObject(req.body);
      }

      if (req.query && typeof req.query === 'object') {
        for (const [key, value] of Object.entries(req.query)) {
          if (typeof value === 'string') {
            const maxQueryLength = validator['config']?.maxQueryStringLength || 500;
            req.query[key] = await validator.validateString(value, maxQueryLength);
          }
        }
      }

      if (req.params && typeof req.params === 'object') {
        for (const [key, value] of Object.entries(req.params)) {
          if (typeof value === 'string') {
            req.params[key] = await validator.validateString(value, 200);
          }
        }
      }

      const processingTime = Date.now() - startTime;
      res.set('X-Validation-Time', `${processingTime}ms`);

      next();
    } catch (error) {
      console.error('Validation error:', error);
      res.status(400).json({
        error: 'Validation failed',
        message: error instanceof Error ? error.message : 'Invalid input'
      });
    }
  };
}

// Export the class as default for backward compatibility
export default StreamingStringValidator;