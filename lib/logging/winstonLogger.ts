/**
 * Winston Logging Implementation
 * Simplified wrapper around winston for better maintainability
 */

import winston from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';

const NODE_ENV = process.env.NODE_ENV || 'development';

export interface WinstonConfig {
  level?: string;
  format?: winston.Logform.Format;
  transports?: winston.transport[];
  handleExceptions?: boolean;
  exitOnError?: boolean;
  silent?: boolean;
}

/**
 * Winston Logger Manager
 */
export class WinstonLoggerManager {
  private logger: winston.Logger;

  constructor(config: WinstonConfig = {}) {
    this.logger = winston.createLogger();
    this.setupLogger(config);
  }

  private setupLogger(config: WinstonConfig): void {
    const finalConfig: WinstonConfig = {
      level: NODE_ENV === 'production' ? 'warn' : 'info',
      handleExceptions: false,
      exitOnError: false,
      silent: false,
      ...config
    };

    this.logger = winston.createLogger(finalConfig);
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  verbose(message: string, meta?: any): void {
    this.logger.verbose(message, meta);
  }

  silly(message: string, meta?: any): void {
    this.logger.silly(message, meta);
  }

  child(defaultMeta: any): WinstonLoggerManager {
    const childConfig = {
      defaultMeta,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf((info: any) => {
          return JSON.stringify({ ...defaultMeta, ...info });
        })
      )
    };

    return new WinstonLoggerManager(childConfig);
  }

  getWinstonLogger(): winston.Logger {
    return this.logger;
  }
}

/**
 * Default logger instance
 */
export const defaultLogger = new WinstonLoggerManager();

/**
 * Legacy compatibility functions
 */
export function logInfo(message: string, meta?: any): void {
  defaultLogger.info(message, meta);
}

export function logError(message: string, meta?: any): void {
  defaultLogger.error(message, meta);
}

export function logWarning(message: string, meta?: any): void {
  defaultLogger.warn(message, meta);
}

export function logDebug(message: string, meta?: any): void {
  defaultLogger.debug(message, meta);
}

export function createLabeledLogger(label: string): WinstonLoggerManager {
  return defaultLogger.child({ label });
}

// Export winston for direct usage
export { winston, winstonDailyRotateFile };

export default WinstonLoggerManager;