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
  // Calculate optimal chunk size with safety limits
  // Use configured chunk size but cap at 1MB to prevent memory issues
  const chunkSize = Math.max(1, Math.min(config.maxChunkSize, 1000000));
  
  // Split data into chunks for parallel processing
  // This allows validation of large strings without blocking the event loop
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  
  // Validate chunks in parallel to improve performance
  // Each chunk is validated independently to identify problematic sections
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
  
  // If any chunks failed, report the specific chunk indices for debugging
  // This helps identify where in large strings the validation issues occur
  if (failedChunks.length > 0) {
    return {
      isValid: false,
      error: `Validation failed in chunks: ${failedChunks.map(c => c.index).join(', ')}`,
      processingTime: Date.now() - startTime,
      schema,
    };
  }
  
  // Final validation of the complete string to ensure overall consistency
  // This catches issues that might only appear when the full string is considered
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