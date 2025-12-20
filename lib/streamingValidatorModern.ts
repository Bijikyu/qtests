/**
 * Legacy Streaming Validator - Refactored for SRP
 * 
 * This file now serves as a compatibility layer that re-exports
 * the modular validation functionality while maintaining backward compatibility.
 * 
 * The actual implementation has been split into:
 * - validation/validationTypes.ts - Type definitions
 * - validation/validationSchemas.ts - Schema creation utilities  
 * - validation/validationLogic.ts - Core validation logic
 * - validation/streamingValidator.ts - Streaming validation functionality
 */

import { setLogging } from './logUtils.js';
import localVars from '../config/localVars.js';

// Import modular validation components
import {
  ValidationConfig,
  ValidationResult,
  ZodSchema,
  defaultValidationConfig,
  validateWithZod,
  createValidationMiddleware,
  validateStreaming,
  createSecureStringSchema,
  createQueryStringSchema,
  createSecureObjectSchema,
  commonSchemas
} from './validation/index.js';

// Set logging based on environment using localVars pattern
if ((localVars as any).nodeEnv !== 'test') {
  setLogging(false);
}

// Re-export types for backward compatibility
export type { ValidationConfig, ValidationResult, ZodSchema };

// Re-export core functionality
export {
  defaultValidationConfig,
  validateWithZod,
  createValidationMiddleware,
  validateStreaming,
  createSecureStringSchema,
  createQueryStringSchema,
  createSecureObjectSchema,
  commonSchemas,
};

// Default export for backward compatibility
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