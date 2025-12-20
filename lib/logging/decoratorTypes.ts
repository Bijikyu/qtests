/**
 * Logging Decorator Configuration Types
 */

export interface LoggingOptions {
  /** Whether to log function entry */
  logEntry?: boolean;
  
  /** Whether to log function exit/return value */
  logExit?: boolean;
  
  /** Whether to log function parameters */
  logArgs?: boolean;
  
  /** Whether to log return value */
  logResult?: boolean;
  
  /** Whether to log errors */
  logErrors?: boolean;
  
  /** Custom prefix for log messages */
  prefix?: string;
  
  /** Custom suffix for log messages */
  suffix?: string;
  
  /** Maximum depth for object serialization */
  maxDepth?: number;
  
  /** Whether to include timing information */
  includeTiming?: boolean;
}

export const DEFAULT_OPTIONS: Required<LoggingOptions> = {
  logEntry: true,
  logExit: true,
  logArgs: true,
  logResult: true,
  logErrors: true,
  prefix: '',
  suffix: '',
  maxDepth: 3,
  includeTiming: false,
};