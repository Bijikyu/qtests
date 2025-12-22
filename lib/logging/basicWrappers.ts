/**
 * Basic Logging Wrappers (Legacy Compatibility)
 * DEPRECATED: This file maintains backward compatibility.
 * Use the specific modules instead:
 * - coreWrapper.ts for core logging functionality
 * - convenienceWrappers.ts for specialized wrapper functions
 */

// Re-export all functions from specialized modules for backward compatibility
export {
  withLogging
} from './coreWrapper.js';

export {
  logFunction,
  logPerformance
} from './convenienceWrappers.js';