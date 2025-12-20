/**
 * Legacy Streaming Validator
 * Provides backward compatibility for streaming validation
 */

import { ValidationConfig, ValidationResult } from './validationTypes.js';

export async function validateStreaming(
  data: string,
  config: ValidationConfig
): Promise<ValidationResult> {
  console.log('[DEPRECATED] Using legacy streaming validator. Consider migrating to Zod-based validation.');
  
  const startTime = Date.now();
  
  try {
    const { createSecureStringSchema } = await import('./validationSchemas.js');
    const schema = createSecureStringSchema(config);
    const { validateWithZod } = await import('./validationLogic.js');
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