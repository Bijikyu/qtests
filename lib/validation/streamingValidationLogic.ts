/**
 * Streaming Validation Logic
 * Handles validation of large data in chunks
 */

import { ZodSchema } from 'zod';
import { ValidationConfig, ValidationResult } from './validationTypes.js';

export async function validateStreamingString<T>(
  data: string,
  schema: ZodSchema<T>,
  config: ValidationConfig,
  startTime: number
): Promise<ValidationResult> {
  const chunks: string[] = [];
  const chunkSize = Math.max(1, Math.min(config.maxChunkSize, 1000000)); // Cap at 1MB for safety
  
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