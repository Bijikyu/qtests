/**
 * Enhanced Logging System with Winston Integration
 * 
 * Uses winston for industry-standard logging while maintaining
 * custom tracing and correlation features for qtests.
 */

import winston from 'winston';
import { EventEmitter } from 'events';
import { randomBytes } from 'crypto';

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5
}

export enum LogFormat {
  JSON = 'json',
  TEXT = 'text',
  STRUCTURED = 'structured'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  logger: string;
  traceId?: string;
  spanId?: string;
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  duration?: number;
  metadata?: Record<string, any>;
  tags?: string[];
  error?: {
    name: string;
    message: string;
    stack: string;
  };
  service?: string;
  version?: string;
  environment?: string;
  host?: string;
  pid?: number;
}

export interface TracingSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, string | number | boolean>;
  logs: LogEntry[];
  status: 'ok' | 'error' | 'timeout';
  error?: {
    type: string;
    message: string;
  };
  service?: string;
  resource?: string;
}

export interface LoggerConfig {
  level?: LogLevel;
  format?: LogFormat;
  service: string;
  version?: string;
  environment?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  filePath?: string;
  maxFileSize?: number;
  maxFiles?: number;
  enableTracing?: boolean;
  samplingRate?: number;
  metadata?: Record<string, any>;
  tags?: string[];
}

/**
 * Enhanced logger with winston backend and custom tracing
 */
export class Logger extends EventEmitter {
  private winston!: winston.Logger;
  private config: Required<Omit<LoggerConfig, 'level' | 'format'>> & { level: LogLevel; format: LogFormat };
  private activeSpans = new Map<string, TracingSpan>();
  private correlationContext = new Map<string, string>();

  constructor(config: LoggerConfig) {
    super();
    
    this.config = {
      level: config.level ?? LogLevel.INFO,
      format: config.format ?? LogFormat.JSON,
      service: config.service,
      version: config.version || process.env.npm_package_version || 'unknown',
      environment: config.environment || process.env.NODE_ENV || 'development',
      enableConsole: config.enableConsole !== false,
      enableFile: config.enableFile || false,
      filePath: config.filePath || './logs/qtests.log',
      maxFileSize: config.maxFileSize || 10 * 1024 * 1024, // 10MB
      maxFiles: config.maxFiles || 5,
      enableTracing: config.enableTracing !== false,
      samplingRate: config.samplingRate || 1.0,
      metadata: config.metadata || {},
      tags: config.tags || []
    };

    this.setupWinston();
  }

  trace(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.TRACE, message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    const errorInfo = error ? {
      name: error.name,
      message: error.message,
      stack: error.stack || ''
    } : undefined;

    this.log(LogLevel.ERROR, message, { ...metadata, error: errorInfo });
  }

  fatal(message: string, error?: Error, metadata?: Record<string, any>): void {
    const errorInfo = error ? {
      name: error.name,
      message: error.message,
      stack: error.stack || ''
    } : undefined;

    this.log(LogLevel.FATAL, message, { ...metadata, error: errorInfo });
  }

  log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      logger: this.config.service,
      traceId: this.getCorrelationId('traceId'),
      spanId: this.getCorrelationId('spanId'),
      correlationId: this.getCorrelationId('correlationId'),
      metadata: { ...this.config.metadata, ...metadata },
      tags: this.config.tags,
      service: this.config.service,
      version: this.config.version,
      environment: this.config.environment,
      host: this.getHostInfo(),
      pid: process.pid
    };

    this.writeToWinston(entry);
    this.emit('log', entry);
  }

  // Tracing methods
  startSpan(operationName: string, parentSpanId?: string): TracingSpan {
    if (!this.config.enableTracing) {
      return this.createMockSpan(operationName);
    }

    const traceId = this.getCorrelationId('traceId') || this.generateTraceId();
    const spanId = this.generateSpanId();

    const span: TracingSpan = {
      traceId,
      spanId,
      parentSpanId,
      operationName,
      startTime: Date.now(),
      tags: {},
      logs: [],
      status: 'ok',
      service: this.config.service
    };

    // Store active span
    this.activeSpans.set(spanId, span);
    
    // Update correlation context
    this.setCorrelationId('traceId', traceId);
    this.setCorrelationId('spanId', spanId);

    this.emit('span-started', span);
    return span;
  }

  finishSpan(spanId: string, status: 'ok' | 'error' | 'timeout' = 'ok', error?: Error): void {
    if (!this.config.enableTracing) {
      return;
    }

    const span = this.activeSpans.get(spanId);
    if (!span) {
      return;
    }

    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;
    span.status = status;

    if (error) {
      span.error = {
        type: error.constructor.name,
        message: error.message
      };
    }

    this.activeSpans.delete(spanId);
    
    // Remove from correlation context
    this.correlationContext.delete('spanId');

    this.emit('span-finished', span);
  }

  withSpan<T>(operationName: string, fn: (span: TracingSpan) => T): T {
    const span = this.startSpan(operationName);
    
    try {
      const result = fn(span);
      this.finishSpan(span.spanId, 'ok');
      return result;
    } catch (error) {
      this.finishSpan(span.spanId, 'error', error as Error);
      throw error;
    }
  }

  async withSpanAsync<T>(operationName: string, fn: (span: TracingSpan) => Promise<T>): Promise<T> {
    const span = this.startSpan(operationName);
    
    try {
      const result = await fn(span);
      this.finishSpan(span.spanId, 'ok');
      return result;
    } catch (error) {
      this.finishSpan(span.spanId, 'error', error as Error);
      throw error;
    }
  }

  addTag(spanId: string, key: string, value: string | number | boolean): void {
    const span = this.activeSpans.get(spanId);
    if (span) {
      span.tags[key] = value;
    }
  }

  addLog(spanId: string, level: LogLevel, message: string): void {
    const span = this.activeSpans.get(spanId);
    if (span) {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        logger: this.config.service,
        traceId: span.traceId,
        spanId: span.spanId
      };
      
      span.logs.push(logEntry);
    }
  }

  // Correlation context methods
  setCorrelationId(key: string, value: string): void {
    this.correlationContext.set(key, value);
  }

  getCorrelationId(key: string): string | undefined {
    return this.correlationContext.get(key);
  }

  clearCorrelationContext(): void {
    this.correlationContext.clear();
  }

  // Winston transport management
  addTransport(transport: winston.transport): void {
    this.winston.add(transport);
    this.emit('transport-added', transport);
  }

  removeTransport(transport: winston.transport): void {
    this.winston.remove(transport);
    this.emit('transport-removed', transport);
  }

  getActiveSpans(): TracingSpan[] {
    return Array.from(this.activeSpans.values());
  }

  async flush(): Promise<void> {
    // Winston doesn't have explicit flush, but we can emit event
    this.emit('flushed');
  }

  async close(): Promise<void> {
    // Finish all active spans
    for (const [spanId, span] of this.activeSpans) {
      this.finishSpan(spanId, 'timeout');
    }

    // Close winston
    this.winston.close();
    this.removeAllListeners();
    this.emit('closed');
  }

  private setupWinston(): void {
    const transports: winston.transport[] = [];

    if (this.config.enableConsole) {
      const consoleFormat = this.config.format === LogFormat.JSON 
        ? winston.format.json()
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
            })
          );

      transports.push(
        new winston.transports.Console({
          level: this.getWinstonLevel(this.config.level),
          format: consoleFormat
        })
      );
    }

    if (this.config.enableFile) {
      const fileFormat = this.config.format === LogFormat.JSON
        ? winston.format.json()
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
            })
          );

      transports.push(
        new winston.transports.File({
          filename: this.config.filePath,
          level: this.getWinstonLevel(this.config.level),
          format: fileFormat,
          maxsize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles
        })
      );
    }

    this.winston = winston.createLogger({
      level: this.getWinstonLevel(this.config.level),
      transports,
      defaultMeta: {
        service: this.config.service,
        version: this.config.version,
        environment: this.config.environment,
        host: this.getHostInfo(),
        pid: process.pid
      }
    });
  }

  private writeToWinston(entry: LogEntry): void {
    const logData: any = {
      timestamp: entry.timestamp,
      message: entry.message,
      level: this.getWinstonLevel(entry.level),
      traceId: entry.traceId,
      spanId: entry.spanId,
      correlationId: entry.correlationId,
      userId: entry.userId,
      sessionId: entry.sessionId,
      requestId: entry.requestId,
      duration: entry.duration,
      metadata: entry.metadata,
      tags: entry.tags,
      service: entry.service,
      version: entry.version,
      environment: entry.environment,
      host: entry.host,
      pid: entry.pid
    };

    if (entry.error) {
      logData.error = entry.error;
    }

    this.winston.log(logData.level, logData.message, logData);
  }

  private getWinstonLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.TRACE: return 'silly';
      case LogLevel.DEBUG: return 'debug';
      case LogLevel.INFO: return 'info';
      case LogLevel.WARN: return 'warn';
      case LogLevel.ERROR: return 'error';
      case LogLevel.FATAL: return 'error';
      default: return 'info';
    }
  }

  private generateTraceId(): string {
    return randomBytes(16).toString('hex');
  }

  private generateSpanId(): string {
    return randomBytes(8).toString('hex');
  }

  private getHostInfo(): string {
    return process.env.HOSTNAME || require('os').hostname() || 'unknown';
  }

  private createMockSpan(operationName: string): TracingSpan {
    const now = Date.now();
    return {
      traceId: this.generateTraceId(),
      spanId: this.generateSpanId(),
      operationName,
      startTime: now,
      endTime: now,
      duration: 0,
      tags: {},
      logs: [],
      status: 'ok',
      service: this.config.service
    };
  }
}

/**
 * Logger factory and manager
 */
export class LoggerFactory {
  private static loggers = new Map<string, Logger>();
  private static defaultConfig?: Partial<LoggerConfig>;

  static setDefaultConfig(config: Partial<LoggerConfig>): void {
    this.defaultConfig = config;
  }

  static getLogger(name: string, config?: LoggerConfig): Logger {
    const key = `${name}:${JSON.stringify(config || {})}`;
    
    if (!this.loggers.has(key)) {
      const loggerConfig = { ...this.defaultConfig, service: name, ...config };
      const logger = new Logger(loggerConfig);
      this.loggers.set(key, logger);
    }
    
    return this.loggers.get(key)!;
  }

  static async shutdownAll(): Promise<void> {
    const shutdownPromises = Array.from(this.loggers.values()).map(logger => logger.close());
    await Promise.allSettled(shutdownPromises);
    this.loggers.clear();
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger({
  service: '@bijikyu/qtests',
  level: LogLevel.INFO,
  format: LogFormat.JSON,
  enableConsole: true,
  enableFile: process.env.LOG_TO_FILE === 'true',
  filePath: process.env.LOG_FILE_PATH || './logs/qtests.log'
});

// Export winston for direct use
export { winston };

export default Logger;