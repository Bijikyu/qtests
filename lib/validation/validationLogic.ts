import { z, ZodError } from 'zod';
import { ValidationConfig, ValidationResult, ZodSchema } from './validationTypes.js';
import { validateStreamingString } from './streamingValidationLogic.js';
import qerrors from '../qerrorsFallback.js';

// Circuit breaker state management using module-scoped Map
const circuitBreakerState = new Map<string, { count: number; lastFailure: number }>();

function getCircuitBreakerState(key: string) {
  return circuitBreakerState.get(key) || { count: 0, lastFailure: 0 };
}

function incrementCircuitBreakerFailure(key: string) {
  const current = getCircuitBreakerState(key);
  circuitBreakerState.set(key, {
    count: current.count + 1,
    lastFailure: Date.now()
  });
}

function resetCircuitBreaker(key: string) {
  circuitBreakerState.delete(key);
}

export async function validateWithZod<T>(
  data: unknown,
  schema: ZodSchema<T>,
  config: ValidationConfig
): Promise<ValidationResult> {
  const startTime = Date.now();
  
  // Add timeout protection for validation operations
  const timeoutMs = config.timeout || 30000; // 30 second default timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Validation timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  const validationPromise = (async () => {
    try {
      // Add circuit breaker pattern for streaming validation
      if (config.enableStreaming && typeof data === 'string' && data.length > config.maxChunkSize) {
        const streamingFailureKey = `streaming_validation_failure_${schema.constructor.name}`;
        const circuitState = getCircuitBreakerState(streamingFailureKey);
        
        // Reset circuit breaker after cooldown period (5 minutes)
        const now = Date.now();
        if (now - circuitState.lastFailure > 300000) {
          resetCircuitBreaker(streamingFailureKey);
        }
        
        // Check if streaming validation has failed too many times recently
        if (circuitState.count > 3) {
          qerrors(new Error('Circuit breaker activated'), 'validationLogic.validateWithZod: streaming circuit breaker', {
            dataType: typeof data,
            dataLength: data.length,
            maxChunkSize: config.maxChunkSize,
            failureCount: circuitState.count,
            schemaType: schema.constructor.name
          });
          
          // Fall back to non-streaming validation
          const result = schema.parse(data);
          return {
            isValid: true,
            data: result,
            processingTime: Date.now() - startTime,
            schema,
          };
        }

        try {
          return await validateStreamingString(data, schema, config, startTime);
        } catch (streamingError) {
          // Increment failure counter for circuit breaker
          incrementCircuitBreakerFailure(streamingFailureKey);
          
          qerrors(streamingError as Error, 'validationLogic.validateWithZod: streaming validation failed', {
            dataType: typeof data,
            dataLength: data.length,
            maxChunkSize: config.maxChunkSize,
            failureCount: circuitState.count + 1,
            schemaType: schema.constructor.name,
            errorMessage: streamingError instanceof Error ? streamingError.message : String(streamingError)
          });
           
          // Fall back to non-streaming validation
          const result = schema.parse(data);
          return {
            isValid: true,
            data: result,
            processingTime: Date.now() - startTime,
            schema,
          };
        }
      }
      
      const result = schema.parse(data);
      
      // Reset circuit breaker on successful validation
      if (config.enableStreaming && typeof data === 'string') {
        const streamingFailureKey = `streaming_validation_failure_${schema.constructor.name}`;
        resetCircuitBreaker(streamingFailureKey);
      }
      
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
      
      qerrors(error as Error, 'validationLogic.validateWithZod: validation failed', {
        dataType: typeof data,
        hasSchema: !!schema,
        configKeys: Object.keys(config),
        processingTime: Date.now() - startTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown validation error',
        errorType: error instanceof Error ? error.constructor.name : 'unknown',
        dataSize: typeof data === 'string' ? data.length : typeof data === 'object' && data !== null ? Object.keys(data).length : 'unknown'
      });
      
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown validation error',
        processingTime: Date.now() - startTime,
        schema,
      };
    }
  })();

  try {
    return await Promise.race([validationPromise, timeoutPromise]);
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      return {
        isValid: false,
        error: `Validation timeout after ${timeoutMs}ms`,
        processingTime: Date.now() - startTime,
        schema,
      };
    }
    throw error;
  }
}

export function createValidationMiddleware(
  schema: ZodSchema,
  config: ValidationConfig
) {
  return async (data: unknown): Promise<ValidationResult> => {
    const startTime = Date.now();
    try {
      return await validateWithZod(data, schema, config);
    } catch (error: any) {
      qerrors(error as Error, 'validationLogic.createValidationMiddleware: middleware validation failed', {
        dataType: typeof data,
        hasSchema: !!schema,
        configKeys: Object.keys(config),
        errorMessage: error.message,
        errorType: error.constructor.name
      });
      
      return {
        isValid: false,
        error: error.message,
        processingTime: Date.now() - startTime,
        schema,
      };
    }
  };
}