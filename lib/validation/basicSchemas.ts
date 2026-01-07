/**
 * Basic Validation Schemas
 * Simple Zod schemas for common data types
 * 
 * DEPRECATED: This file maintains backward compatibility.
 * Use shared validation schemas from '../utils/validationSchemas.js' instead.
 */

// Re-export all schemas from shared utilities for backward compatibility
export {
  basicSchemas,
  objectSchemas,
  securitySchemas,
  schemaUtils,
  validationHelpers,
  schemas,
  z
} from '../utils/validationSchemas.js';