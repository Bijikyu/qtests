/**
 * Array Processing Utilities
 * Provides utilities for processing arrays with validation and error collection
 */

import { validateArray } from './validation.js';

export interface ArrayProcessingResult<T> {
  successes: T[];
  failures: Array<{ item: T; error: string; index: number }>;
  totalCount: number;
  successCount: number;
  failureCount: number;
}

/**
 * Processes an array with validation, collecting successes and failures
 * @param items - Array of items to process
 * @param validator - Validation function for each item
 * @param options - Processing options
 * @returns Processing result with successes and failures
 */
export function processArrayWithValidation<T>(
  items: T[],
  validator: (item: T, index: number) => { valid: boolean; error?: string },
  options: { stopOnFirstError?: boolean; maxConcurrency?: number } = {}
): ArrayProcessingResult<T> {
  validateArray(items, 'items');
  
  const successes: T[] = [];
  const failures: Array<{ item: T; error: string; index: number }> = [];
  
  items.forEach((item, index) => {
    try {
      const result = validator(item, index);
      
      if (result.valid) {
        successes.push(item);
      } else {
        failures.push({
          item,
          error: result.error || 'Validation failed',
          index
        });
        
        if (options.stopOnFirstError) {
          return;
        }
      }
    } catch (error) {
      failures.push({
        item,
        error: error instanceof Error ? error.message : String(error),
        index
      });
      
      if (options.stopOnFirstError) {
        return;
      }
    }
  });
  
  return {
    successes,
    failures,
    totalCount: items.length,
    successCount: successes.length,
    failureCount: failures.length
  };
}

/**
 * Processes array items asynchronously with validation
 * @param items - Array of items to process
 * @param asyncValidator - Async validation function
 * @param options - Processing options
 * @returns Promise with processing result
 */
export async function processArrayWithValidationAsync<T>(
  items: T[],
  asyncValidator: (item: T, index: number) => Promise<{ valid: boolean; error?: string }>,
  options: { stopOnFirstError?: boolean; maxConcurrency?: number } = {}
): Promise<ArrayProcessingResult<T>> {
  validateArray(items, 'items');
  
  const successes: T[] = [];
  const failures: Array<{ item: T; error: string; index: number }> = [];
  
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    
    try {
      const result = await asyncValidator(item, index);
      
      if (result.valid) {
        successes.push(item);
      } else {
        failures.push({
          item,
          error: result.error || 'Validation failed',
          index
        });
        
        if (options.stopOnFirstError) {
          break;
        }
      }
    } catch (error) {
      failures.push({
        item,
        error: error instanceof Error ? error.message : String(error),
        index
      });
      
      if (options.stopOnFirstError) {
        break;
      }
    }
  }
  
  return {
    successes,
    failures,
    totalCount: items.length,
    successCount: successes.length,
    failureCount: failures.length
  };
}