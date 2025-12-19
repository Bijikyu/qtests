/**
 * Centralized Logging Utilities
 * Eliminates repeated import patterns across the codebase
 * Provides unified logging interface with multiple strategies
 */

// ==================== LOGGING INTERFACES ====================

/**
 * Logging strategy types
 */
export type LoggingStrategy = 'console' | 'winston' | 'silent' | 'memory';

/**
 * Log level enumeration
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

/**
 * Log entry interface
 */
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  strategy?: LoggingStrategy;
  level?: LogLevel;
  enableConsole?: boolean;
  enableFile?: boolean;
  enableMemory?: boolean;
  maxMemoryEntries?: number;
  context?: Record<string, any>;
}

/**
 * Performance timing interface
 */
export interface PerformanceTimerData {
  start: number;
  end?: number;
  duration?: number;
}

// ==================== LOGGING IMPLEMENTATIONS ====================

/**
 * Memory-based logger for testing
 */
class MemoryLogger {
  private entries: LogEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries: number = 1000) {
    this.maxEntries = maxEntries;
  }

  log(entry: LogEntry): void {
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }

  getEntriesByLevel(level: LogLevel): LogEntry[] {
    return this.entries.filter(entry => entry.level === level);
  }
}

/**
 * Unified logger implementation
 */
class UnifiedLogger {
  private strategy: LoggingStrategy;
  private level: LogLevel;
  private context: Record<string, any>;
  private memoryLogger: MemoryLogger;
  private enabled: boolean;

  constructor(config: LoggerConfig = {}) {
    this.strategy = config.strategy || 'console';
    this.level = config.level || LogLevel.INFO;
    this.context = config.context || {};
    this.memoryLogger = new MemoryLogger(config.maxMemoryEntries);
    this.enabled = true;
  }

  /**
   * Set logging level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Add context to all log entries
   */
  addContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Create a log entry
   */
  private createLogEntry(level: LogLevel, message: string, error?: Error): LogEntry {
    return {
      timestamp: new Date(),
      level,
      message,
      context: { ...this.context },
      error
    };
  }

  /**
   * Log a message at the specified level
   */
  private log(level: LogLevel, message: string, error?: Error): void {
    if (!this.enabled || level < this.level) {
      return;
    }

    const entry = this.createLogEntry(level, message, error);
    
    // Store in memory logger
    this.memoryLogger.log(entry);

    // Output based on strategy
    switch (this.strategy) {
      case 'console':
        this.logToConsole(entry);
        break;
      case 'silent':
        // No output
        break;
      case 'memory':
        // Already stored in memory logger
        break;
      default:
        this.logToConsole(entry);
    }
  }

  /**
   * Log to console
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const contextStr = Object.keys(entry.context || {}).length > 0 
      ? ` ${JSON.stringify(entry.context)}` 
      : '';
    
    const message = `[${timestamp}] ${levelName}: ${entry.message}${contextStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message);
        if (entry.error) {
          console.error(entry.error);
        }
        break;
      default:
        console.log(message);
    }
  }

  /**
   * Public logging methods
   */
  debug(message: string, context?: Record<string, any>): void {
    if (context) {
      this.addContext(context);
    }
    this.log(LogLevel.DEBUG, message);
  }

  info(message: string, context?: Record<string, any>): void {
    if (context) {
      this.addContext(context);
    }
    this.log(LogLevel.INFO, message);
  }

  warn(message: string, context?: Record<string, any>): void {
    if (context) {
      this.addContext(context);
    }
    this.log(LogLevel.WARN, message);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (context) {
      this.addContext(context);
    }
    this.log(LogLevel.ERROR, message, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    if (context) {
      this.addContext(context);
    }
    this.log(LogLevel.FATAL, message, error);
  }

  /**
   * Get memory log entries
   */
  getLogEntries(): LogEntry[] {
    return this.memoryLogger.getEntries();
  }

  /**
   * Clear memory logs
   */
  clearLogs(): void {
    this.memoryLogger.clear();
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.memoryLogger.getEntriesByLevel(level);
  }
}

// ==================== PERFORMANCE TIMING ====================

/**
 * Performance timer utility
 */
class PerformanceTimer {
  private timers: Map<string, PerformanceTimerData> = new Map();

  /**
   * Start a timer
   */
  start(name: string): void {
    const timer: PerformanceTimerData = {
      start: Date.now()
    };
    this.timers.set(name, timer);
  }

  /**
   * End a timer and return duration
   */
  end(name: string): number | null {
    const timer = this.timers.get(name);
    if (!timer) {
      return null;
    }

    timer.end = Date.now();
    timer.duration = timer.end - timer.start;
    
    return timer.duration;
  }

  /**
   * Get timer duration without ending it
   */
  getDuration(name: string): number | null {
    const timer = this.timers.get(name);
    if (!timer) {
      return null;
    }

    const current = Date.now();
    return current - timer.start;
  }

  /**
   * Remove a timer
   */
  remove(name: string): void {
    this.timers.delete(name);
  }

  /**
   * Clear all timers
   */
  clear(): void {
    this.timers.clear();
  }
}

// ==================== LOGGING DECORATORS ====================

/**
 * Create a logging decorator for methods
 */
export function createLoggingDecorator(logger: UnifiedLogger, performanceTimer: PerformanceTimer) {
  return function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const className = target.constructor.name;
      const methodName = propertyKey;
      const timerName = `${className}.${methodName}`;

      logger.debug(`Starting ${methodName}`, { className, args });
      performanceTimer.start(timerName);

      try {
        const result = originalMethod.apply(this, args);
        
        if (result instanceof Promise) {
          return result
            .then((res) => {
              const duration = performanceTimer.end(timerName);
              logger.info(`Completed ${methodName}`, { className, duration });
              return res;
            })
            .catch((error) => {
              const duration = performanceTimer.end(timerName);
              logger.error(`Failed ${methodName}`, error, { className, duration });
              throw error;
            });
        } else {
          const duration = performanceTimer.end(timerName);
          logger.info(`Completed ${methodName}`, { className, duration });
          return result;
        }
      } catch (error) {
        const duration = performanceTimer.end(timerName);
        logger.error(`Failed ${methodName}`, error as Error, { className, duration });
        throw error;
      }
    };

    return descriptor;
  };
}

// ==================== FACTORY FUNCTIONS ====================

/**
 * Create a unified logger instance
 */
export function createLogger(config: LoggerConfig = {}): UnifiedLogger {
  return new UnifiedLogger(config);
}

/**
 * Create a logger for testing (silent by default)
 */
export function createTestLogger(config: LoggerConfig = {}): UnifiedLogger {
  return new UnifiedLogger({
    strategy: 'memory',
    level: LogLevel.DEBUG,
    enableConsole: false,
    ...config
  });
}

/**
 * Create a logger for development
 */
export function createDevelopmentLogger(config: LoggerConfig = {}): UnifiedLogger {
  return new UnifiedLogger({
    strategy: 'console',
    level: LogLevel.DEBUG,
    enableConsole: true,
    ...config
  });
}

/**
 * Create a logger for production
 */
export function createProductionLogger(config: LoggerConfig = {}): UnifiedLogger {
  return new UnifiedLogger({
    strategy: 'console',
    level: LogLevel.WARN,
    enableConsole: true,
    ...config
  });
}

// ==================== GLOBAL LOGGER INSTANCE ====================

/**
 * Global logger instance for convenience
 */
const globalLogger = createLogger({
  strategy: 'console', // Default to console, specific modules can override as needed
  level: LogLevel.INFO
});

// Add performance timing to global logger
const performanceTimer = new PerformanceTimer();
const loggerWithTiming = globalLogger as UnifiedLogger & {
  startTimer: (name: string) => void;
  endTimer: (name: string) => number | null;
  getTimerDuration: (name: string) => number | null;
};
loggerWithTiming.startTimer = (name: string) => performanceTimer.start(name);
loggerWithTiming.endTimer = (name: string) => performanceTimer.end(name);
loggerWithTiming.getTimerDuration = (name: string) => performanceTimer.getDuration(name);

// ==================== CONVENIENCE EXPORTS ====================

/**
 * Export common logging functions for backward compatibility
 */
export const logStart = (message: string, context?: Record<string, any>) => {
  globalLogger.debug(message, context);
  if (context) {
    loggerWithTiming.startTimer(context.timerName || 'default');
  }
};

export const logReturn = (message: string, context?: Record<string, any>) => {
  globalLogger.info(message, context);
  if (context) {
    loggerWithTiming.endTimer(context.timerName || 'default');
  }
};

export const logError = (message: string, error?: Error, context?: Record<string, any>) => {
  globalLogger.error(message, error, context);
};

export const logInfo = (message: string, context?: Record<string, any>) => {
  globalLogger.info(message, context);
};

export const logDebug = (message: string, context?: Record<string, any>) => {
  globalLogger.debug(message, context);
};

export const logWarn = (message: string, context?: Record<string, any>) => {
  globalLogger.warn(message, context);
};

/**
 * Export logging control utility
 */
export function setLogging(enabled: boolean): void {
  globalLogger.setEnabled(enabled);
}

/**
 * Export logging level control
 */
export function setLogLevel(level: LogLevel): void {
  globalLogger.setLevel(level);
}

// ==================== UNIFIED EXPORTS ====================

/**
 * Centralized logging utilities interface
 */
export const centralizedLogging = {
  // Factory functions
  create: createLogger,
  createTest: createTestLogger,
  createDevelopment: createDevelopmentLogger,
  createProduction: createProductionLogger,
  
  // Convenience functions
  logStart,
  logReturn,
  logError,
  logInfo,
  logDebug,
  logWarn,
  
  // Control functions
  setLogging,
  setLogLevel,
  
  // Utilities
  createDecorator: (logger: UnifiedLogger) => createLoggingDecorator(logger, performanceTimer),
  
  // Global logger access
  global: loggerWithTiming,
  
  // Constants
  levels: LogLevel,
  strategies: {
    CONSOLE: 'console',
    WINSTON: 'winston',
    SILENT: 'silent',
    MEMORY: 'memory'
  } as const
};

// Default export
export default centralizedLogging;