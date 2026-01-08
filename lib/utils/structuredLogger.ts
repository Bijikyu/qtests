/**
 * Structured Logging System
 * 
 * Replaces console statements with configurable, leveled logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  error?: Error;
  module?: string;
}

export interface StructuredLoggerOptions {
  level: LogLevel;
  includeTimestamp: boolean;
  includeModule: boolean;
  colorOutput: boolean;
  maxLogSize: number;
}

class StructuredLogger {
  private options: StructuredLoggerOptions;
  private logs: LogEntry[] = [];
  private moduleColors = {
    DEBUG: '\x1b[36m',    // Cyan
    INFO: '\x1b[32m',     // Green
    WARN: '\x1b[33m',     // Yellow
    ERROR: '\x1b[31m',     // Red
    SILENT: '\x1b[0m'     // Default
  };
  private resetColor = '\x1b[0m';

  constructor(options: Partial<StructuredLoggerOptions> = {}) {
    this.options = {
      level: LogLevel.INFO,
      includeTimestamp: true,
      includeModule: true,
      colorOutput: true,
      maxLogSize: 1000,
      ...options
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.options.level;
  }

  private formatMessage(entry: LogEntry): string {
    const parts: string[] = [];
    
    if (this.options.includeTimestamp) {
      const timestamp = new Date(entry.timestamp).toISOString();
      parts.push(`[${timestamp}]`);
    }

    const levelName = LogLevel[entry.level] as keyof typeof LogLevel;
    if (this.options.colorOutput) {
      const color = this.moduleColors[levelName] || '\x1b[0m';
      parts.push(`${color}[${levelName}]${this.resetColor}`);
    } else {
      parts.push(`[${levelName}]`);
    }

    if (this.options.includeModule && entry.module) {
      parts.push(`(${entry.module})`);
    }

    parts.push(entry.message);

    if (entry.context && Object.keys(entry.context).length > 0) {
      parts.push(JSON.stringify(entry.context));
    }

    if (entry.error) {
      parts.push(`Error: ${entry.error.message}`);
      if (entry.error.stack) {
        parts.push(`Stack: ${entry.error.stack}`);
      }
    }

    return parts.join(' ');
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, any>, error?: Error, module?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      error,
      module
    };

    // Add to memory buffer
    this.logs.push(entry);
    
    // Trim buffer if it exceeds max size
    if (this.logs.length > this.options.maxLogSize) {
      this.logs = this.logs.slice(-this.options.maxLogSize);
    }

    // Output to console
    const formattedMessage = this.formatMessage(entry);
    
    switch (level) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        console.log(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>, module?: string): void {
    this.addLog(LogLevel.DEBUG, message, context, undefined, module);
  }

  info(message: string, context?: Record<string, any>, module?: string): void {
    this.addLog(LogLevel.INFO, message, context, undefined, module);
  }

  warn(message: string, context?: Record<string, any>, module?: string): void {
    this.addLog(LogLevel.WARN, message, context, undefined, module);
  }

  error(message: string, error?: Error, context?: Record<string, any>, module?: string): void {
    this.addLog(LogLevel.ERROR, message, context, error, module);
  }

  // Configuration methods
  setLevel(level: LogLevel): void {
    this.options.level = level;
  }

  getLevel(): LogLevel {
    return this.options.level;
  }

  setColorOutput(enabled: boolean): void {
    this.options.colorOutput = enabled;
  }

  // Query methods
  getLogs(level?: LogLevel, module?: string, limit?: number): LogEntry[] {
    let filteredLogs = this.logs;

    if (level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level >= level);
    }

    if (module !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.module === module);
    }

    if (limit !== undefined) {
      filteredLogs = filteredLogs.slice(-limit);
    }

    return filteredLogs;
  }

  clearLogs(): void {
    this.logs = [];
  }

  getStats(): { total: number; byLevel: Record<string, number>; byModule: Record<string, number> } {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      byModule: {} as Record<string, number>
    };

    for (const log of this.logs) {
      const levelName = LogLevel[log.level] as keyof typeof LogLevel;
      stats.byLevel[levelName] = (stats.byLevel[levelName] || 0) + 1;
      
      if (log.module) {
        stats.byModule[log.module] = (stats.byModule[log.module] || 0) + 1;
      }
    }

    return stats;
  }
}

// Global logger instance
export const logger = new StructuredLogger();

// Environment-based configuration
if (process.env.QTESTS_SILENT === '1' || process.env.QTESTS_SILENT === 'true') {
  logger.setLevel(LogLevel.SILENT);
} else if (process.env.NODE_ENV === 'development') {
  logger.setLevel(LogLevel.DEBUG);
} else if (process.env.NODE_ENV === 'production') {
  logger.setLevel(LogLevel.WARN);
}

// Convenience exports
export const log = {
  debug: (message: string, context?: Record<string, any>, module?: string) => 
    logger.debug(message, context, module),
  info: (message: string, context?: Record<string, any>, module?: string) => 
    logger.info(message, context, module),
  warn: (message: string, context?: Record<string, any>, module?: string) => 
    logger.warn(message, context, module),
  error: (message: string, error?: Error, context?: Record<string, any>, module?: string) => 
    logger.error(message, error, context, module),
  
  // Configuration
  setLevel: (level: LogLevel) => logger.setLevel(level),
  setColorOutput: (enabled: boolean) => logger.setColorOutput(enabled),
  getLogs: (level?: LogLevel, module?: string, limit?: number) => logger.getLogs(level, module, limit),
  clearLogs: () => logger.clearLogs(),
  getStats: () => logger.getStats()
};