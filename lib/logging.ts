/**
 * Advanced Logging and Tracing System
 * 
 * Structured logging with distributed tracing, correlation IDs, and performance tracking.
 * Supports multiple log levels, output formats, and integration with logging services.
 */

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

export interface Transport {
  name: string;
  level: LogLevel;
  format: LogFormat;
  write(entry: LogEntry): Promise<void>;
  flush?(): Promise<void>;
  close?(): Promise<void>;
}

/**
 * Advanced structured logger with tracing capabilities
 */
export class Logger extends EventEmitter {
  private config: Required<Omit<LoggerConfig, 'level' | 'format'>> & { level: LogLevel; format: LogFormat };
  private transports: Transport[] = [];
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
      filePath: config.filePath || './logs/app.log',
      maxFileSize: config.maxFileSize || 10 * 1024 * 1024, // 10MB
      maxFiles: config.maxFiles || 5,
      enableTracing: config.enableTracing !== false,
      samplingRate: config.samplingRate || 1.0,
      metadata: config.metadata || {},
      tags: config.tags || []
    };

    this.setupDefaultTransports();
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

    this.writeToTransports(entry);
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

  // Transport management
  addTransport(transport: Transport): void {
    this.transports.push(transport);
    this.emit('transport-added', transport);
  }

  removeTransport(name: string): boolean {
    const index = this.transports.findIndex(t => t.name === name);
    if (index >= 0) {
      this.transports.splice(index, 1);
      this.emit('transport-removed', name);
      return true;
    }
    return false;
  }

  getActiveSpans(): TracingSpan[] {
    return Array.from(this.activeSpans.values());
  }

  async flush(): Promise<void> {
    const flushPromises = this.transports
      .filter(t => t.flush)
      .map(t => t.flush!());
    
    await Promise.allSettled(flushPromises);
    this.emit('flushed');
  }

  async close(): Promise<void> {
    // Finish all active spans
    for (const [spanId, span] of this.activeSpans) {
      this.finishSpan(spanId, 'timeout');
    }

    // Close all transports
    const closePromises = this.transports
      .filter(t => t.close)
      .map(t => t.close!());
    
    await Promise.allSettled(closePromises);
    
    this.removeAllListeners();
    this.emit('closed');
  }

  private setupDefaultTransports(): void {
    if (this.config.enableConsole) {
      this.addTransport(new ConsoleTransport({
        level: this.config.level,
        format: this.config.format
      }));
    }

    if (this.config.enableFile) {
      this.addTransport(new FileTransport({
        level: this.config.level,
        format: this.config.format,
        filePath: this.config.filePath,
        maxFileSize: this.config.maxFileSize,
        maxFiles: this.config.maxFiles
      }));
    }
  }

  private async writeToTransports(entry: LogEntry): Promise<void> {
    const writePromises = this.transports
      .filter(transport => entry.level >= transport.level)
      .map(transport => transport.write(entry));
    
    await Promise.allSettled(writePromises);
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
 * Console transport for logging
 */
export class ConsoleTransport implements Transport {
  name = 'console';
  level: LogLevel;
  format: LogFormat;

  constructor(config: { level: LogLevel; format: LogFormat }) {
    this.level = config.level;
    this.format = config.format;
  }

  async write(entry: LogEntry): Promise<void> {
    let message: string;
    
    if (this.format === LogFormat.JSON) {
      // Optimize: cache serialized entry to avoid duplicate serialization
      try {
        message = JSON.stringify(entry);
      } catch (error) {
        // Fallback for circular references or non-serializable data
        const safeEntry = {
          ...entry,
          metadata: entry.metadata ? '[Object]' : undefined
        };
        message = JSON.stringify(safeEntry);
      }
    } else {
      message = this.formatText(entry);
    }
    
    const logMethod = this.getLogMethod(entry.level);
    logMethod(message);
  }

  private formatText(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = LogLevel[entry.level].padEnd(5);
    
    // Optimize: avoid JSON.stringify for metadata in text format
    let metadata = '';
    if (entry.metadata) {
      try {
        metadata = ` ${JSON.stringify(entry.metadata)}`;
      } catch {
        metadata = ' [Object]';
      }
    }
    
    return `[${timestamp}] ${level} ${entry.message}${metadata}`;
  }

  private getLogMethod(level: LogLevel): (message: string) => void {
    switch (level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error;
      default:
        return console.log;
    }
  }
}

/**
 * File transport for persistent logging
 */
export class FileTransport implements Transport {
  name = 'file';
  level: LogLevel;
  format: LogFormat;
  filePath: string;
  maxFileSize: number;
  maxFiles: number;
  private currentSize = 0;
  private currentFile = 0;

  constructor(config: {
    level: LogLevel;
    format: LogFormat;
    filePath: string;
    maxFileSize: number;
    maxFiles: number;
  }) {
    this.level = config.level;
    this.format = config.format;
    this.filePath = config.filePath;
    this.maxFileSize = config.maxFileSize;
    this.maxFiles = config.maxFiles;
    
    this.initializeFile();
  }

  async write(entry: LogEntry): Promise<void> {
    let message: string;
    
    if (this.format === LogFormat.JSON) {
      // Optimize: single JSON serialization with error handling
      try {
        message = JSON.stringify(entry) + '\n';
      } catch (error) {
        // Fallback for non-serializable entries
        const safeEntry = {
          ...entry,
          metadata: entry.metadata ? '[Object]' : undefined
        };
        message = JSON.stringify(safeEntry) + '\n';
      }
    } else {
      message = this.formatText(entry) + '\n';
    }
    
    const fs = await import('fs');
    
    // Check if we need to rotate file
    if (this.currentSize + message.length > this.maxFileSize) {
      await this.rotateFile();
    }
    
    await fs.promises.appendFile(this.getCurrentFilePath(), message);
    this.currentSize += message.length;
  }

  async flush(): Promise<void> {
    // No additional flushing needed for file transport
  }

  async close(): Promise<void> {
    // No special cleanup needed
  }

  private initializeFile(): void {
    // Initialize asynchronously but don't block constructor
    this.initializeFileAsync().catch(error => {
      console.warn('Failed to initialize file transport:', error);
    });
  }

  private async initializeFileAsync(): Promise<void> {
    const fs = await import('fs');
    const path = await import('path');
    
    // Ensure directory exists
    const dir = path.dirname(this.filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    
    // Check current file size
    const currentFile = this.getCurrentFilePath();
    try {
      const stats = await fs.promises.stat(currentFile);
      this.currentSize = stats.size;
    } catch {
      this.currentSize = 0;
    }
  }

  private getCurrentFilePath(): string {
    if (this.currentFile === 0) {
      return this.filePath;
    }
    
    const path = await import('path');
    const ext = path.extname(this.filePath);
    const base = path.basename(this.filePath, ext);
    const dir = path.dirname(this.filePath);
    
    return path.join(dir, `${base}.${this.currentFile}${ext}`);
  }

  private async rotateFile(): Promise<void> {
    const fs = await import('fs');
    const path = await import('path');
    
    // Move current file to numbered version
    const currentPath = this.getCurrentFilePath();
    this.currentFile++;
    
    // Remove old files if we exceed max files
    if (this.currentFile >= this.maxFiles) {
      this.currentFile = 1;
    }
    
    // Initialize new file
    const newPath = this.getCurrentFilePath();
    this.currentSize = 0;
  }

  private formatText(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = LogLevel[entry.level].padEnd(5);
    const metadata = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';
    
    return `[${timestamp}] ${level} ${entry.message}${metadata}`;
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
  service: 'qtests',
  level: LogLevel.INFO,
  format: LogFormat.JSON,
  enableConsole: true,
  enableFile: process.env.LOG_TO_FILE === 'true',
  filePath: process.env.LOG_FILE_PATH || './logs/qtests.log'
});

export default Logger;