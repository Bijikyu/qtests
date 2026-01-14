/**
 * Winston Logging Library Stub for Testing - Complete API Compliance
 * 
 * This module provides a complete, API-compliant replacement for the winston
 * logging library. When tests require('winston') after @bijikyu/qtests/setup, they
 * get this stub instead of real winston, preventing log output during test
 * execution while maintaining full winston API compatibility.
 */

// Simplified types to avoid winston dependency conflicts
interface LogEntry {
  level: string;
  message: string;
  [key: string]: any;
}

interface LoggerOptions {
  level?: string;
  levels?: Record<string, number>;
  format?: any;
  transports?: any[];
  exitOnError?: boolean;
  silent?: boolean;
  defaultMeta?: any;
  handleExceptions?: boolean;
  handleRejections?: boolean;
}

interface LoggerStub {
  error(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  info(message: string, ...meta: any[]): void;
  http(message: string, ...meta: any[]): void;
  verbose(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
  silly(message: string, ...meta: any[]): void;
  log(level: string, message: string, ...meta: any[]): void;
  profile(id?: string, meta?: any): LoggerStub;
  startTimer(): TimerStub;
  child(defaultMeta: any): LoggerStub;
  add(transport: any): LoggerStub;
  remove(transport: any): LoggerStub;
  clear(): LoggerStub;
  close(): void;
  query(options?: any, callback?: (err: Error, results: any) => void): any;
  stream(options?: any): any;
}

interface TimerStub {
  done(message?: string, meta?: any): void;
}

interface TransportStub {
  name: string;
  level?: string;
  silent?: boolean;
  handleExceptions?: boolean;
  log?(info: LogEntry, callback?: (error?: Error) => void): void;
  close?(): void;
}

interface FormatStub {
  transform(info: LogEntry, options?: any): LogEntry;
}

interface WinstonStub {
  createLogger(options?: LoggerOptions): LoggerStub;
  format: {
    colorize(options?: any): FormatStub;
    combine(...formats: FormatStub[]): FormatStub;
    label(options?: any): FormatStub;
    timestamp(options?: any): FormatStub;
    printf(templateFunction: (info: LogEntry) => string): FormatStub;
    json(options?: any): FormatStub;
    simple(): FormatStub;
    splat(): FormatStub;
    padLevels(): FormatStub;
    metadata(fillEmpty?: any): FormatStub;
  };
  transports: {
    Console(options?: any): TransportStub;
    File(options?: any): TransportStub;
    Http(options?: any): TransportStub;
    Stream(options?: any): TransportStub;
  };
  addColors(colors: Record<string, string>): void;
  level: string;
  loggers: {
    add(id: string, options?: LoggerOptions): LoggerStub;
    get(id: string): LoggerStub;
    close(id?: string): void;
    has(id: string): boolean;
  };
  exceptions: {
    handle(exceptions: any[]): any;
    unhandle(): void;
    getHandlers(): any[];
    logger?: LoggerStub;
  };
  rejectionHandler?: {
    handle(rejections: any[]): any;
    unhandle(): void;
    getHandlers(): any[];
    logger?: LoggerStub;
  };
}

// Default log levels matching winston
const defaultLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// Default colors
const defaultColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'white',
  silly: 'gray'
};

// Shared no-op function
const noop = (): void => {};

// Timer implementation
class MockTimer implements TimerStub {
  private startTime: number;
  private message?: string;
  private meta?: any;

  constructor(message?: string, meta?: any) {
    this.startTime = Date.now();
    this.message = message;
    this.meta = meta;
  }

  done(message?: string, meta?: any): void {
    const duration = Date.now() - this.startTime;
    const finalMessage = message || this.message || 'Duration';
    const finalMeta = { ...this.meta, ...meta, duration };
    
    // In a real implementation, this would log the timer
    // For testing, we keep it silent
    noop();
  }
}

// Format implementations
class MockFormat implements FormatStub {
  transform(info: LogEntry): LogEntry {
    return info;
  }
}

class MockColorizeFormat extends MockFormat {
  transform(info: LogEntry): LogEntry {
    // In real implementation, this would add colors
    return info;
  }
}

class MockCombineFormat extends MockFormat {
  constructor(private formats: FormatStub[]) {
    super();
  }

  transform(info: LogEntry): LogEntry {
    return this.formats.reduce((acc, format) => format.transform(acc), info);
  }
}

class MockLabelFormat extends MockFormat {
  constructor(private options: any) {
    super();
  }

  transform(info: LogEntry): LogEntry {
    return {
      ...info,
      label: this.options.label || this.options.message || 'default'
    };
  }
}

class MockTimestampFormat extends MockFormat {
  constructor(private options: any = {}) {
    super();
  }

  transform(info: LogEntry): LogEntry {
    const format = this.options.format || 'YYYY-MM-DD HH:mm:ss';
    return {
      ...info,
      timestamp: new Date().toISOString()
    };
  }
}

class MockPrintfFormat extends MockFormat {
  constructor(private templateFunction: (info: LogEntry) => string) {
    super();
  }

  transform(info: LogEntry): LogEntry {
    return {
      ...info,
      message: this.templateFunction(info)
    };
  }
}

class MockJsonFormat extends MockFormat {
  constructor(private options: any = {}) {
    super();
  }

  transform(info: LogEntry): LogEntry {
    return {
      ...info,
      message: JSON.stringify(info)
    };
  }
}

class MockSimpleFormat extends MockFormat {
  transform(info: LogEntry): LogEntry {
    return {
      ...info,
      message: `${info.level}: ${info.message}`
    };
  }
}

// Transport implementations
class MockConsoleTransport implements TransportStub {
  name = 'console';
  level?: string;
  silent = false;
  handleExceptions = false;

  constructor(private options: any = {}) {
    this.level = options.level || 'info';
    this.silent = options.silent || false;
    this.handleExceptions = options.handleExceptions || false;
  }

  log(info: LogEntry): void {
    // Silent during tests
    noop();
  }

  close(): void {
    noop();
  }
}

class MockFileTransport implements TransportStub {
  name = 'file';
  level?: string;
  silent = false;
  handleExceptions = false;

  constructor(private options: any = {}) {
    this.level = options.level || 'info';
    this.silent = options.silent || false;
    this.handleExceptions = options.handleExceptions || false;
  }

  log(info: LogEntry): void {
    // Silent during tests
    noop();
  }

  close(): void {
    noop();
  }
}

class MockHttpTransport implements TransportStub {
  name = 'http';
  level?: string;
  silent = false;
  handleExceptions = false;

  constructor(private options: any = {}) {
    this.level = options.level || 'info';
    this.silent = options.silent || false;
    this.handleExceptions = options.handleExceptions || false;
  }

  log(info: LogEntry): void {
    // Silent during tests
    noop();
  }

  close(): void {
    noop();
  }
}

class MockStreamTransport implements TransportStub {
  name = 'stream';
  level?: string;
  silent = false;
  handleExceptions = false;

  constructor(private options: any = {}) {
    this.level = options.level || 'info';
    this.silent = options.silent || false;
    this.handleExceptions = options.handleExceptions || false;
  }

  log(info: LogEntry): void {
    // Silent during tests
    noop();
  }

  close(): void {
    noop();
  }
}

// Logger implementation
class MockLogger implements LoggerStub {
  private transports: TransportStub[] = [];
  private defaultMeta: any = {};

  constructor(private options: LoggerOptions = {}) {
    this.defaultMeta = options.defaultMeta || {};
  }

  error(message: string, ...meta: any[]): void {
    this.log('error', message, ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    this.log('warn', message, ...meta);
  }

  info(message: string, ...meta: any[]): void {
    this.log('info', message, ...meta);
  }

  http(message: string, ...meta: any[]): void {
    this.log('http', message, ...meta);
  }

  verbose(message: string, ...meta: any[]): void {
    this.log('verbose', message, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    this.log('debug', message, ...meta);
  }

  silly(message: string, ...meta: any[]): void {
    this.log('silly', message, ...meta);
  }

  log(level: string, message: string, ...meta: any[]): void {
    // Silent during tests - just store the log info
    const logEntry: LogEntry = {
      level,
      message,
      ...this.defaultMeta,
      ...meta
    };

    // Process through transports (silent during tests)
    this.transports.forEach(transport => {
      if (transport.log) {
        transport.log(logEntry);
      }
    });
  }

  profile(id?: string, meta?: any): LoggerStub {
    // Start or complete profiling
    return this;
  }

  startTimer(): TimerStub {
    return new MockTimer();
  }

  child(defaultMeta: any): LoggerStub {
    const childLogger = new MockLogger({ ...this.options });
    (childLogger as any).defaultMeta = { ...this.defaultMeta, ...defaultMeta };
    return childLogger;
  }

  add(transport: TransportStub): LoggerStub {
    this.transports.push(transport);
    return this;
  }

  remove(transport: TransportStub): LoggerStub {
    const index = this.transports.indexOf(transport);
    if (index > -1) {
      this.transports.splice(index, 1);
    }
    return this;
  }

  clear(): LoggerStub {
    this.transports = [];
    return this;
  }

  close(): void {
    this.transports.forEach(transport => {
      if (transport.close) {
        transport.close();
      }
    });
    this.transports = [];
  }

  query(options?: any, callback?: (err: Error, results: any) => void): any {
    // Return empty results for testing
    const results = { file: [] };
    if (callback) {
      callback(null as any, results);
    }
    return Promise.resolve(results);
  }

  stream(options?: any): any {
    // Return mock stream
    return {
      on: noop,
      pipe: noop,
      resume: noop,
      pause: noop
    };
  }
}

// Logger container implementation
class MockLoggers {
  private loggers = new Map<string, LoggerStub>();

  add(id: string, options?: LoggerOptions): LoggerStub {
    const logger = new MockLogger(options);
    this.loggers.set(id, logger);
    return logger;
  }

  get(id: string): LoggerStub {
    if (!this.loggers.has(id)) {
      this.loggers.set(id, new MockLogger());
    }
    return this.loggers.get(id)!;
  }

  close(id?: string): void {
    if (id) {
      const logger = this.loggers.get(id);
      if (logger) {
        logger.close();
        this.loggers.delete(id);
      }
    } else {
      this.loggers.forEach(logger => logger.close());
      this.loggers.clear();
    }
  }

  has(id: string): boolean {
    return this.loggers.has(id);
  }
}

// Main winston stub implementation
const winstonStub: WinstonStub = {
  /**
   * Creates a logger instance
   */
  createLogger(options?: LoggerOptions): LoggerStub {
    return new MockLogger(options);
  },

  /**
   * Winston format utilities
   */
  format: {
    colorize: (options?: any) => new MockColorizeFormat(),
    combine: (...formats: FormatStub[]) => new MockCombineFormat(formats),
    label: (options?: any) => new MockLabelFormat(options),
    timestamp: (options?: any) => new MockTimestampFormat(options),
    printf: (templateFunction: (info: LogEntry) => string) => new MockPrintfFormat(templateFunction),
    json: (options?: any) => new MockJsonFormat(options),
    simple: () => new MockSimpleFormat(),
    splat: () => new MockFormat(),
    padLevels: () => new MockFormat(),
    metadata: (fillEmpty?: any) => new MockFormat()
  },

  /**
   * Winston transport constructors
   */
  transports: {
    Console: (options?: any) => new MockConsoleTransport(options),
    File: (options?: any) => new MockFileTransport(options),
    Http: (options?: any) => new MockHttpTransport(options),
    Stream: (options?: any) => new MockStreamTransport(options)
  },

  /**
   * Color configuration
   */
  addColors: (colors: Record<string, string>): void => {
    // Silent during tests
    noop();
  },

  /**
   * Default log level
   */
  level: 'info',

  /**
   * Logger container
   */
  loggers: new MockLoggers(),

  /**
   * Exception handler
   */
  exceptions: {
    handle: (exceptions: any[]): any => {
      // Silent during tests
      return { catch: noop };
    },
    unhandle: noop,
    getHandlers: () => []
  },

  /**
   * Rejection handler (optional)
   */
  rejectionHandler: {
    handle: (rejections: any[]): any => {
      // Silent during tests
      return { catch: noop };
    },
    unhandle: noop,
    getHandlers: () => []
  }
};

// Export winston stub using ES module syntax
export default winstonStub;

// Also export individual components for advanced usage
export { 
  MockLogger, 
  MockConsoleTransport, 
  MockFileTransport, 
  MockTimer,
  defaultLevels,
  defaultColors
};
export type { 
  LoggerStub, 
  TransportStub, 
  FormatStub, 
  LogEntry, 
  LoggerOptions,
  TimerStub
};