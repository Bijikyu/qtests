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

export {
  safeString,
  safeNumber,
  safeBoolean,
  safeArray,
  safeObject,
  shortString,
  mediumString,
  longString,
  z
} from './validation/basicSchemas.js';

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