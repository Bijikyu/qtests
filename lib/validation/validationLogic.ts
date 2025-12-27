import { z, ZodError } from 'zod';
import { ValidationConfig, ValidationResult, ZodSchema } from './validationTypes.js';
import { validateStreamingString } from './streamingValidationLogic.js';
import qerrors from 'qerrors';

export async function validateWithZod<T>(
  data: unknown,
  schema: ZodSchema<T>,
  config: ValidationConfig
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
    
    qerrors(error, 'validationLogic.validateWithZod: validation failed', {
      dataType: typeof data,
      hasSchema: !!schema,
      configKeys: Object.keys(config),
      processingTime: Date.now() - startTime,
      errorMessage: error instanceof Error ? error.message : 'Unknown validation error',
      errorType: error instanceof Error ? error.constructor.name : 'unknown'
    });
    
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
      processingTime: Date.now() - startTime,
      schema,
    };
  }
}

export function createValidationMiddleware(
  schema: ZodSchema,
  config: ValidationConfig
) {
  return async (data: unknown): Promise<ValidationResult> => {
    try {
      return await validateWithZod(data, schema, config);
    } catch (error: any) {
      qerrors(error, 'validationLogic.createValidationMiddleware: middleware validation failed', {
        dataType: typeof data,
        hasSchema: !!schema,
        configKeys: Object.keys(config),
        errorMessage: error.message,
        errorType: error.constructor.name
      });
      
      return {
        isValid: false,
        error: error.message,
        processingTime: 0,
        schema,
      };
    }
  };
}