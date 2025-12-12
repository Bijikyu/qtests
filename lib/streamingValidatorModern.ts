/**
 * Modern Validation with Zod Integration - TypeScript Implementation
 * 
 * This module provides comprehensive input validation using Zod, a modern
 * TypeScript-first validation library. It combines Zod's powerful schema
 * validation with the project's existing streaming capabilities for optimal
 * performance and security.
 * 
 * Design philosophy:
 * - TypeScript-first approach with automatic type inference
 * - Schema composition and reusability
 * - Performance-optimized validation with streaming support
 * - Comprehensive error handling and reporting
 * - Security-focused validation patterns
 * 
 * Key benefits over custom validation:
 * 1. Type Safety - Automatic TypeScript type generation from schemas
 * 2. Schema Reusability - Composable validation patterns
 * 3. Performance - Optimized validation algorithms
 * 4. Error Details - Rich error messages with path information
 * 5. Community Support - Extensive plugin ecosystem
 * 
 * Migration from custom validation:
 * - Better TypeScript integration
 * - More expressive validation rules
 * - Improved error reporting
 * - Industry-standard validation patterns
 */

import { z, ZodSchema, ZodError } from 'zod';

// Import logging control utility for consistent framework behavior
import { setLogging } from './logUtils.js';
if (process.env.NODE_ENV !== 'test') setLogging(false);

/**
 * Validation configuration interface
 */
export interface ValidationConfig {
  maxChunkSize: number;
  maxStringLength: number;
  maxQueryStringLength: number;
  maxConcurrentChunks: number;
  dangerousPatterns: RegExp[];
  enableStreaming: boolean;
}

/**
 * Enhanced validation result with Zod integration
 */
export interface ValidationResult {
  isValid: boolean;
  data?: any;
  sanitized?: any;
  error?: string;
  errors?: Array<{
    path: string[];
    message: string;
  }>;
  processingTime: number;
  schema?: ZodSchema;
}

/**
 * Default validation configuration
 */
export const defaultValidationConfig: ValidationConfig = {
  maxChunkSize: 1024 * 1024, // 1MB chunks
  maxStringLength: 10 * 1024 * 1024, // 10MB total
  maxQueryStringLength: 2048, // 2KB for query strings
  maxConcurrentChunks: 4,
  dangerousPatterns: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // XSS script tags
    /javascript:/gi, // JavaScript protocol
    /on\w+\s*=/gi, // Event handlers
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, // Iframe injection
  ],
  enableStreaming: true,
};

/**
 * Create a Zod schema for string validation with security patterns
 */
export function createSecureStringSchema(config: ValidationConfig = defaultValidationConfig): ZodSchema<string> {
  return z.string()
    .max(config.maxStringLength, `String exceeds maximum length of ${config.maxStringLength}`)
    .refine(
      (str) => !config.dangerousPatterns.some(pattern => pattern.test(str)),
      {
        message: 'String contains potentially dangerous content',
      }
    );
}

/**
 * Create a Zod schema for query string validation
 */
export function createQueryStringSchema(config: ValidationConfig = defaultValidationConfig): ZodSchema<string> {
  return z.string()
    .max(config.maxQueryStringLength, `Query string exceeds maximum length of ${config.maxQueryStringLength}`)
    .refine(
      (str) => !config.dangerousPatterns.some(pattern => pattern.test(str)),
      {
        message: 'Query string contains potentially dangerous content',
      }
    );
}

/**
 * Create a Zod schema for object validation with nested security
 */
export function createSecureObjectSchema<T extends z.ZodRawShape>(
  shape: T,
  config: ValidationConfig = defaultValidationConfig
): ZodSchema<z.infer<z.ZodObject<T>>> {
  // Apply security validation to all string fields
  const secureShape: Record<string, ZodSchema> = {};
  
  for (const [key, schema] of Object.entries(shape)) {
    if (schema instanceof z.ZodString) {
      secureShape[key] = schema
        .max(config.maxStringLength, `Field ${key} exceeds maximum length`)
        .refine(
          (str) => !config.dangerousPatterns.some(pattern => pattern.test(str)),
          {
            message: `Field ${key} contains potentially dangerous content`,
          }
        );
    } else {
      secureShape[key] = schema;
    }
  }
  
  return z.object(secureShape as T);
}

/**
 * Validate data using Zod schema with streaming support for large strings
 */
export async function validateWithZod<T>(
  data: unknown,
  schema: ZodSchema<T>,
  config: ValidationConfig = defaultValidationConfig
): Promise<ValidationResult> {
  const startTime = Date.now();
  
  try {
    // Handle streaming validation for large strings
    if (config.enableStreaming && typeof data === 'string' && data.length > config.maxChunkSize) {
      return await validateStreamingString(data, schema, config, startTime);
    }
    
    // Standard Zod validation
    const result = schema.parse(data);
    
    return {
      isValid: true,
      data: result,
      processingTime: Date.now() - startTime,
      schema,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        isValid: false,
        error: 'Validation failed',
        errors: error.errors.map(err => ({
          path: err.path.map(p => String(p)),
          message: err.message,
        })),
        processingTime: Date.now() - startTime,
        schema,
      };
    }
    
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
      processingTime: Date.now() - startTime,
      schema,
    };
  }
}

/**
 * Streaming validation for large strings
 */
async function validateStreamingString<T>(
  data: string,
  schema: ZodSchema<T>,
  config: ValidationConfig,
  startTime: number
): Promise<ValidationResult> {
  const chunks: string[] = [];
  const chunkSize = config.maxChunkSize;
  
  // Split string into chunks
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  
  // Validate chunks in parallel
  const chunkPromises = chunks.map(async (chunk, index) => {
    try {
      await schema.parse(chunk);
      return { valid: true, index };
    } catch (error) {
      return { valid: false, index, error };
    }
  });
  
  // Wait for all chunks to validate
  const results = await Promise.all(chunkPromises);
  
  // Check if any chunk failed validation
  const failedChunks = results.filter(r => !r.valid);
  if (failedChunks.length > 0) {
    return {
      isValid: false,
      error: `Validation failed in chunks: ${failedChunks.map(c => c.index).join(', ')}`,
      processingTime: Date.now() - startTime,
      schema,
    };
  }
  
  // Reconstruct and validate the full string
  try {
    const result = schema.parse(data);
    return {
      isValid: true,
      data: result,
      processingTime: Date.now() - startTime,
      schema,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Streaming validation failed',
      processingTime: Date.now() - startTime,
      schema,
    };
  }
}

/**
 * Legacy streaming validator for backward compatibility
 * 
 * @deprecated Use validateWithZod instead
 */
export async function validateStreaming(
  data: string,
  config: ValidationConfig = defaultValidationConfig
): Promise<ValidationResult> {
  console.log('[DEPRECATED] Using legacy streaming validator. Consider migrating to Zod-based validation.');
  
  const startTime = Date.now();
  
  try {
    // Basic validation using the secure string schema
    const schema = createSecureStringSchema(config);
    const result = await validateWithZod(data, schema, config);
    
    return {
      ...result,
      sanitized: result.data, // Legacy compatibility
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Streaming validation failed',
      processingTime: Date.now() - startTime,
    };
  }
}

/**
 * Create a validation middleware factory
 */
export function createValidationMiddleware(
  schema: ZodSchema,
  config: ValidationConfig = defaultValidationConfig
) {
  return async (data: unknown): Promise<ValidationResult> => {
    return await validateWithZod(data, schema, config);
  };
}

/**
 * Predefined common schemas
 */
export const commonSchemas = {
  email: z.string().email('Invalid email format'),
  url: z.string().url('Invalid URL format'),
  uuid: z.string().uuid('Invalid UUID format'),
  secureString: createSecureStringSchema(),
  queryString: createQueryStringSchema(),
  positiveInteger: z.number().int().positive('Must be a positive integer'),
  nonEmptyString: z.string().min(1, 'String cannot be empty'),
};

// Export the modern Zod-based implementation as default
export default {
  validateWithZod,
  createSecureStringSchema,
  createQueryStringSchema,
  createSecureObjectSchema,
  createValidationMiddleware,
  commonSchemas,
  defaultValidationConfig,
  // Legacy support
  validateStreaming,
};