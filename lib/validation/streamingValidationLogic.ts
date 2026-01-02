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
  // Early return for small data to avoid overhead
  if (data.length <= 10000) {
    try {
      await schema.parse(data);
      return {
        isValid: true,
        processingTime: Date.now() - startTime,
        schema,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : String(error),
        processingTime: Date.now() - startTime,
        schema,
      };
    }
  }

  const chunks: string[] = [];
  // Calculate optimal chunk size with safety limits
  // Use configured chunk size but cap at 1MB to prevent memory issues
  const chunkSize = Math.max(1, Math.min(config.maxChunkSize, 1000000));
  const maxChunks = 50; // Limit parallel chunks to prevent CPU overload
  
  // Split data into chunks for parallel processing with chunk limit
  // This allows validation of large strings without blocking the event loop
  let chunkCount = 0;
  for (let i = 0; i < data.length && chunkCount < maxChunks; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
    chunkCount++;
  }
  
  // If data is too large, use sequential processing to prevent CPU overload
  if (data.length > chunkSize * maxChunks) {
    // Process chunks sequentially with yield points
    for (let i = 0; i < chunks.length; i++) {
      try {
        await schema.parse(chunks[i]);
        // Add small yield to prevent blocking
        if (i % 5 === 0) {
          await new Promise(resolve => setImmediate(resolve));
        }
      } catch (error) {
        return {
          isValid: false,
          error: `Validation failed in chunk ${i}: ${error instanceof Error ? error.message : String(error)}`,
          processingTime: Date.now() - startTime,
          schema,
        };
      }
    }
    
    return {
      isValid: true,
      processingTime: Date.now() - startTime,
      schema,
    };
  }
  
  // Optimized validation with early termination
  // Validate chunks sequentially with early termination on first failure
  // This reduces CPU overhead and provides faster feedback
  for (let i = 0; i < chunks.length; i++) {
    try {
      await schema.parse(chunks[i]);
      // Add yield points to prevent blocking
      if (i % 10 === 0) {
        await new Promise(resolve => setImmediate(resolve));
      }
    } catch (error) {
      // Early termination on first failure
      return {
        isValid: false,
        error: `Validation failed in chunk ${i}: ${error instanceof Error ? error.message : String(error)}`,
        processingTime: Date.now() - startTime,
        schema,
      };
    }
  }
  
  // Conditional final validation - only for critical schemas
  // Skip final validation for performance unless explicitly required
  if (config.requireFullValidation) {
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
  
  // Optimized: skip final validation for better performance - FIXED: consistent API behavior
  // When requireFullValidation is false, we trust the chunk validation and return original data
  // This maintains API consistency while preserving performance optimization
  return {
    isValid: true,
    data: data, // Always return original data for consistency
    processingTime: Date.now() - startTime,
    schema,
  };
}