import { z, ZodSchema, ZodError } from 'zod';
import { setLogging } from './logUtils.js';
process.env.NODE_ENV !== 'test' && setLogging(false);

export interface ValidationConfig {
  maxChunkSize: number;
  maxStringLength: number;
  maxQueryStringLength: number;
  maxConcurrentChunks: number;
  dangerousPatterns: RegExp[];
  enableStreaming: boolean;
}

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

export const defaultValidationConfig: ValidationConfig = {
  maxChunkSize: 1024 * 1024,
  maxStringLength: 10 * 1024 * 1024,
  maxQueryStringLength: 2048,
  maxConcurrentChunks: 4,
  dangerousPatterns: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  ],
  enableStreaming: true,
};

export function createSecureStringSchema(config: ValidationConfig = defaultValidationConfig): ZodSchema<string> {
  return z.string()
    .max(config.maxStringLength, `String exceeds maximum length of ${config.maxStringLength}`)
    .refine(
      (str) => !config.dangerousPatterns.some(pattern => pattern.test(str)),
      { message: 'String contains potentially dangerous content' }
    );
}

export function createQueryStringSchema(config: ValidationConfig = defaultValidationConfig): ZodSchema<string> {
  return z.string()
    .max(config.maxQueryStringLength, `Query string exceeds maximum length of ${config.maxQueryStringLength}`)
    .refine(
      (str) => !config.dangerousPatterns.some(pattern => pattern.test(str)),
      { message: 'Query string contains potentially dangerous content' }
    );
}

export function createSecureObjectSchema<T extends z.ZodRawShape>(
  shape: T,
  config: ValidationConfig = defaultValidationConfig
): ZodSchema<z.infer<z.ZodObject<T>>> {
  const secureShape: Record<string, ZodSchema> = {};
  
  for (const [key, schema] of Object.entries(shape)) {
    if (schema instanceof z.ZodString) {
      secureShape[key] = schema
        .max(config.maxStringLength, `Field ${key} exceeds maximum length`)
        .refine(
          (str) => !config.dangerousPatterns.some(pattern => pattern.test(str)),
          { message: `Field ${key} contains potentially dangerous content` }
        );
    } else {
      secureShape[key] = schema;
    }
  }
  
  return z.object(secureShape as T);
}

export async function validateWithZod<T>(
  data: unknown,
  schema: ZodSchema<T>,
  config: ValidationConfig = defaultValidationConfig
): Promise<ValidationResult> {
  const startTime = Date.now();
  
  try {
    if (config.enableStreaming && typeof data === 'string' && data.length > config.maxChunkSize) {
      return await validateStreamingString(data, schema, config, startTime);
    }
    
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

async function validateStreamingString<T>(
  data: string,
  schema: ZodSchema<T>,
  config: ValidationConfig,
  startTime: number
): Promise<ValidationResult> {
  const chunks: string[] = [];
  const chunkSize = config.maxChunkSize;
  
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  
  const chunkPromises = chunks.map(async (chunk, index) => {
    try {
      await schema.parse(chunk);
      return { valid: true, index };
    } catch (error) {
      return { valid: false, index, error };
    }
  });
  
  const results = await Promise.all(chunkPromises);
  const failedChunks = results.filter(r => !r.valid);
  
  if (failedChunks.length > 0) {
    return {
      isValid: false,
      error: `Validation failed in chunks: ${failedChunks.map(c => c.index).join(', ')}`,
      processingTime: Date.now() - startTime,
      schema,
    };
  }
  
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

export async function validateStreaming(
  data: string,
  config: ValidationConfig = defaultValidationConfig
): Promise<ValidationResult> {
  console.log('[DEPRECATED] Using legacy streaming validator. Consider migrating to Zod-based validation.');
  
  const startTime = Date.now();
  
  try {
    const schema = createSecureStringSchema(config);
    const result = await validateWithZod(data, schema, config);
    
    return {
      ...result,
      sanitized: result.data,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Streaming validation failed',
      processingTime: Date.now() - startTime,
    };
  }
}

export function createValidationMiddleware(
  schema: ZodSchema,
  config: ValidationConfig = defaultValidationConfig
) {
  return async (data: unknown): Promise<ValidationResult> => {
    return await validateWithZod(data, schema, config);
  };
}

export const commonSchemas = {
  email: z.string().email('Invalid email format'),
  url: z.string().url('Invalid URL format'),
  uuid: z.string().uuid('Invalid UUID format'),
  secureString: createSecureStringSchema(),
  queryString: createQueryStringSchema(),
  positiveInteger: z.number().int().positive('Must be a positive integer'),
  nonEmptyString: z.string().min(1, 'String cannot be empty'),
};

export default {
  validateWithZod,
  createSecureStringSchema,
  createQueryStringSchema,
  createSecureObjectSchema,
  createValidationMiddleware,
  commonSchemas,
  defaultValidationConfig,
  validateStreaming,
};