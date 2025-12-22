/**
 * Basic Error Wrappers (Legacy Compatibility)
 * DEPRECATED: This file maintains backward compatibility.
 * Use the specific modules instead:
 * - wrapperFactory.ts for wrapper creation
 * - errorTransformation.ts for error transformation
 * - simpleErrorLogging.ts for basic error logging
 */

// Re-export all functions from specialized modules for backward compatibility
export {
  createAsyncErrorWrapper,
  createSyncErrorWrapper,
  createRouteErrorWrapper
} from './wrapperFactory.js';

export {
  transformMongoError,
  createStructuredError
} from './errorTransformation.js';

export {
  logError
} from './simpleErrorLogging.js';