/**
 * Legacy Logging Decorators - Refactored for SRP
 * 
 * This file now serves as a compatibility layer that re-exports
 * the modular logging functionality while maintaining backward compatibility.
 * 
 * The actual implementation has been split into:
 * - logging/decoratorTypes.ts - Type definitions and default options
 * - logging/decorators.ts - Core decorator implementations
 * - logging/functionWrappers.ts - Function wrapper utilities
 * - logging/loggingUtils.ts - Additional utilities and helper functions
 */

// Import modular logging components
import {
  LoggingOptions,
  DEFAULT_OPTIONS,
  LogClass,
  LogMethod,
  Log,
  LogErrors,
  LogEntry,
  LogPerformance,
  withLogging,
  logFunction
} from './logging/index.js';

// Re-export types for backward compatibility
export type { LoggingOptions };

// Re-export core functionality
export {
  DEFAULT_OPTIONS,
  LogClass,
  LogMethod,
  Log,
  LogErrors,
  LogEntry,
  LogPerformance,
  withLogging,
  logFunction,
};

