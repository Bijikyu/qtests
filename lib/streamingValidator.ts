/**
 * Streaming Validator (Legacy Compatibility)
 * DEPRECATED: This file maintains backward compatibility.
 * Use the specific modules instead:
 * - htmlSanitization.ts for sanitization utilities
 * - basicSchemas.ts for Zod schemas
 * - streamingValidator.ts for main validation class
 * - validationMiddleware.ts for Express middleware
 */

// Re-export all from specialized modules for backward compatibility
export {
  escapeHtml,
  hasDangerousPatterns,
  sanitizeString,
  dangerousPatterns
} from './validation/htmlSanitization.js';

import { basicSchemas, z } from './validation/basicSchemas.js';

// Re-export individual schemas from basicSchemas
export const safeString = basicSchemas.safeString;
export const safeNumber = basicSchemas.safeNumber;
export const safeBoolean = basicSchemas.safeBoolean;
export const safeArray = basicSchemas.safeArray;
export const safeObject = basicSchemas.safeObject;
export const shortString = basicSchemas.shortString;
export const mediumString = basicSchemas.mediumString;
export const longString = basicSchemas.longString;

// Re-export zod
export { z };

export {
  ValidationConfig,
  ValidationResult,
  StreamingStringValidator,
  defaultValidator,
  strictValidator,
  relaxedValidator,
  createStreamingValidator
} from './validation/streamingValidator.js';

export {
  streamingValidationMiddleware
} from './validation/validationMiddleware.js';

// Default export for compatibility
export { default } from './validation/streamingValidator.js';