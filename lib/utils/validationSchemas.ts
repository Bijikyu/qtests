/**
 * Shared Validation Schema Patterns
 * 
 * Provides common validation schemas and patterns to reduce duplication
 * across the qtests codebase. Centralizes validation rules,
 * sanitization functions, and schema composition utilities.
 */

import { z } from 'zod';
import { sanitizeString } from '../validation/htmlSanitization.js';
import { handleValidationError } from './errorHandling.js';

// Basic validation schemas
export const basicSchemas = {
  safeString: z.string().transform(sanitizeString),
  safeNumber: z.number(),
  safeBoolean: z.boolean(),
  safeArray: z.array(z.any()),
  safeObject: z.object({}).passthrough(),
  
  // String length variations
  shortString: z.string().max(500).transform(sanitizeString),
  mediumString: z.string().max(5000).transform(sanitizeString),
  longString: z.string().max(50000).transform(sanitizeString),
  
  // Specialized string types
  identifier: z.string().regex(/^[a-zA-Z0-9_-]+$/).transform(sanitizeString),
  email: z.string().email().transform(sanitizeString),
  url: z.string().url().transform(sanitizeString),
  path: z.string().regex(/^[a-zA-Z0-9\/_\-\.]+$/).transform(sanitizeString),
  json: z.string().transform(sanitizeString).refine(
    (str) => {
      try {
        JSON.parse(str);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid JSON format' }
  ),
  
  // Numeric types
  port: z.number().int().min(0).max(65535),
  percentage: z.number().min(0).max(100),
  positiveInt: z.number().int().min(0),
  nonNegativeInt: z.number().int().min(0),
  
  // Time-related
  timestamp: z.number().int().min(0),
  duration: z.number().int().min(0),
  timeout: z.number().int().min(1000), // at least 1 second
  rateLimit: z.number().int().min(1).max(10000),
  
  // Memory-related
  memorySize: z.number().int().min(0), // in bytes
  memoryMB: z.number().min(0), // in megabytes
  
  // Security-related
  securityLevel: z.enum(['low', 'medium', 'high', 'critical']),
  eventType: z.string().regex(/^[a-z_]+$/),
  moduleName: z.string().regex(/^[a-zA-Z0-9@/._-]+$/).transform(sanitizeString)
};

// Composite schemas for common objects
export const objectSchemas = {
  // API response schemas
  apiResponse: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    timestamp: z.number().optional(),
    requestId: z.string().optional()
  }),
  
  // Pagination schemas
  pagination: z.object({
    page: basicSchemas.positiveInt.default(1),
    limit: basicSchemas.positiveInt.max(100).default(10),
    total: basicSchemas.positiveInt.optional(),
    hasNext: z.boolean().optional()
  }),
  
  // Search schemas
  searchQuery: z.object({
    query: basicSchemas.mediumString.optional(),
    filters: z.record(z.any()).optional(),
    sort: z.record(z.string()).optional(),
    page: basicSchemas.positiveInt.default(1),
    limit: basicSchemas.positiveInt.max(100).default(10)
  }),
  
  // Memory snapshot schema
  memorySnapshot: z.object({
    timestamp: basicSchemas.timestamp,
    heapUsed: basicSchemas.memoryMB,
    heapTotal: basicSchemas.memoryMB,
    rss: basicSchemas.memoryMB,
    external: basicSchemas.memoryMB
  }),
  
  // Security event schema
  securityEvent: z.object({
    id: basicSchemas.identifier,
    timestamp: basicSchemas.timestamp,
    type: basicSchemas.eventType,
    severity: basicSchemas.securityLevel,
    source: basicSchemas.identifier,
    details: z.record(z.any()),
    blocked: z.boolean(),
    remediation: basicSchemas.mediumString
  }),
  
  // Configuration schemas
  serverConfig: z.object({
    port: basicSchemas.port.default(3000),
    host: basicSchemas.identifier.default('localhost'),
    timeout: basicSchemas.timeout.default(30000),
    cors: z.boolean().default(true),
    https: z.boolean().default(false)
  }),
  
  // Test configuration schemas
  testConfig: z.object({
    testName: basicSchemas.identifier,
    timeout: basicSchemas.timeout.default(5000),
    retries: basicSchemas.positiveInt.default(0),
    parallel: z.boolean().default(false),
    verbose: z.boolean().default(false)
  }),
  
  // Validation configuration schemas
  validationConfig: z.object({
    maxStringLength: basicSchemas.positiveInt.default(10000),
    maxArrayLength: basicSchemas.positiveInt.default(1000),
    maxObjectDepth: basicSchemas.positiveInt.default(10),
    sanitizeInput: z.boolean().default(true),
    strictMode: z.boolean().default(false)
  })
};

// Security-focused validation schemas
export const securitySchemas = {
  // Input validation for security
  safeInput: z.string()
    .max(10000)
    .transform(sanitizeString)
    .refine((val) => !val.includes('<script'), { 
      message: 'Script tags not allowed' 
    })
    .refine((val) => !val.includes('javascript:'), { 
      message: 'JavaScript URLs not allowed' 
    })
    .refine((val) => !val.match(/\.\.[\/\\]/), { 
      message: 'Path traversal not allowed' 
    }),
  
  // Module ID validation
  moduleId: z.string()
    .regex(/^[a-zA-Z0-9@/._-]+$/)
    .max(255)
    .refine((val) => !val.match(/[.;\\&|`$(){}\[\]]/), {
      message: 'Module ID contains unsafe characters'
    })
    .transform(sanitizeString),
  
  // File path validation
  filePath: z.string()
    .regex(/^[a-zA-Z0-9\/_\-\.]+$/)
    .max(4096)
    .refine((val) => !val.match(/\.\.[\/\\]/), {
      message: 'Path traversal not allowed'
    })
    .refine((val) => !val.includes('\0'), {
      message: 'Null bytes not allowed'
    })
    .transform(sanitizeString),
  
  // Command validation
  command: z.string()
    .regex(/^[a-zA-Z0-9_-]+$/)
    .refine((val) => ['npm', 'node', 'jest', 'git', 'tsc', 'rm', 'mkdir', 'cp', 'mv'].includes(val), {
      message: 'Command not in allowlist'
    }),
  
  // Environment variable validation
  envVar: z.string()
    .regex(/^[A-Z_][A-Z0-9_]*$/)
    .max(255)
    .transform(sanitizeString),
  
  // JSON content validation
  jsonContent: z.string()
    .max(1024 * 1024) // 1MB
    .transform(sanitizeString)
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        if (parsed && typeof parsed === 'object') {
          return !(parsed.hasOwnProperty('__proto__') ||
                   parsed.hasOwnProperty('constructor') ||
                   parsed.hasOwnProperty('prototype'));
        }
        return true;
      } catch {
        return false;
      }
    }, {
      message: 'Invalid JSON or prototype pollution detected'
    })
};

// Utility functions for schema composition
export const schemaUtils = {
  /**
   * Create a schema with optional fields made optional
   */
  optionalize: (schema: z.ZodObject<any>) => schema.partial(),
  
  /**
   * Create a schema with required fields
   */
  require: (schema: z.ZodObject<any>) => schema,
  
  /**
   * Merge multiple schemas
   */
  merge: (base: z.ZodObject<any>, extension: z.ZodObject<any>) => base.merge(extension),
  
  /**
   * Add validation rules to an existing schema
   */
  withValidation: (schema: z.ZodTypeAny, rules: Array<{
    refine: (val: any) => boolean;
    message: string;
  }>) => {
    let result = schema;
    rules.forEach(rule => {
      result = result.refine(rule.refine, { message: rule.message });
    });
    return result;
  },
  
  /**
   * Create a schema with default transformation
   */
  withTransform: (schema: z.ZodTypeAny, transform: (val: any) => any) => schema.transform(transform),
  
  /**
   * Add custom error messages to a schema
   */
  withErrors: (schema: z.ZodTypeAny, errors: Record<string, string>) => {
    let result = schema;
    Object.entries(errors).forEach(([path, message]) => {
      result = result.refine(() => true, { 
        message,
        path: path.split('.')
      });
    });
    return result;
  }
};

// Validation helper functions
export const validationHelpers = {
  /**
   * Validate data with comprehensive error handling
   */
  validateWithErrors: <T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context: string = 'validation'
  ): { success: boolean; data?: T; errors?: string[] } => {
    try {
      const result = schema.safeParse(data);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        const errors = result.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        
        handleValidationError(new Error(errors.join('; ')), context, data);
        return { success: false, errors };
      }
    } catch (error) {
      handleValidationError(error, context, data);
      return { 
        success: false, 
        errors: [`Validation failed: ${error instanceof Error ? error.message : String(error)}`] 
      };
    }
  },
  
  /**
   * Validate async data
   */
  validateAsync: async <T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context: string = 'async_validation'
  ): Promise<{ success: boolean; data?: T; errors?: string[] }> => {
    try {
      // Handle potentially async transforms
      const result = await schema.safeParseAsync(data);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        const errors = result.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        
        handleValidationError(new Error(errors.join('; ')), context, data);
        return { success: false, errors };
      }
    } catch (error) {
      handleValidationError(error, context, data);
      return { 
        success: false, 
        errors: [`Async validation failed: ${error instanceof Error ? error.message : String(error)}`] 
      };
    }
  },
  
  /**
   * Create validation middleware
   */
  createValidator: <T>(
    schema: z.ZodSchema<T>,
    context: string = 'middleware_validation'
  ) => (data: unknown): T => {
    const result = validationHelpers.validateWithErrors(schema, data, context);
    
    if (!result.success) {
      throw new Error(`Validation failed: ${result.errors?.join(', ')}`);
    }
    
    return result.data!;
  }
};

// Re-export Zod for convenience
export { z };

// Export all schemas as a combined object for easy access
export const schemas = {
  basic: basicSchemas,
  objects: objectSchemas,
  security: securitySchemas,
  utils: schemaUtils,
  helpers: validationHelpers
};