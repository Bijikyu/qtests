import { z, ZodSchema } from 'zod';
import { ValidationConfig } from './validationTypes.js';

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
      (str: string) => !config.dangerousPatterns.some(pattern => pattern.test(str)),
      { message: 'String contains potentially dangerous content' }
    );
}

export function createQueryStringSchema(config: ValidationConfig = defaultValidationConfig): ZodSchema<string> {
  return z.string()
    .max(config.maxQueryStringLength, `Query string exceeds maximum length of ${config.maxQueryStringLength}`)
    .refine(
      (str: string) => !config.dangerousPatterns.some(pattern => pattern.test(str)),
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
          (str: string) => !config.dangerousPatterns.some(pattern => pattern.test(str)),
          { message: `Field ${key} contains potentially dangerous content` }
        );
    } else {
      secureShape[key] = schema;
    }
  }
  
  return z.object(secureShape as T);
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