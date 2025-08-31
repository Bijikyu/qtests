/**
 * Winston Logging Library Stub for Testing - TypeScript Implementation
 * 
 * This module provides a complete no-op replacement for the winston logging
 * library. When tests require('winston') after qtests/setup, they get this
 * stub instead of real winston, preventing log output during test execution.
 */

// Type definitions for winston stub
interface LoggerStub {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  verbose: (...args: any[]) => void;
  silly: (...args: any[]) => void;
}

interface WinstonStub {
  createLogger: (options?: any) => LoggerStub;
  format: {
    colorize: (...args: any[]) => any;
    combine: (...args: any[]) => any;
    label: (...args: any[]) => any;
    timestamp: (...args: any[]) => any;
    printf: (...args: any[]) => any;
    json: (...args: any[]) => any;
    simple: (...args: any[]) => any;
  };
  transports: {
    Console: new (...args: any[]) => any;
    File: new (...args: any[]) => any;
  };
  addColors: (...args: any[]) => void;
  loggers: {
    add: (...args: any[]) => void;
    get: (...args: any[]) => LoggerStub;
  };
}

const noop = () => {}; // shared no-op function for all stub methods

const winstonStub: WinstonStub = {
  /**
   * Creates a no-op logger instance
   */
  createLogger: (): LoggerStub => ({
    error: noop,   // Silent - no error output during tests
    warn: noop,    // Silent - no warning output during tests
    info: noop,    // Silent - no info output during tests
    debug: noop,   // Silent - no debug output during tests
    verbose: noop, // Silent - no verbose output during tests
    silly: noop    // Silent - no silly output during tests
  }),

  /**
   * Winston format utilities stub
   */
  format: {
    colorize: () => ({}),
    combine: () => ({}),
    label: () => ({}),
    timestamp: () => ({}),
    printf: () => ({}),
    json: () => ({}),
    simple: () => ({})
  },

  /**
   * Winston transport stubs
   */
  transports: {
    Console: class ConsoleTransportStub {
      constructor() {
        // No-op constructor
      }
    },
    File: class FileTransportStub {
      constructor() {
        // No-op constructor
      }
    }
  },

  /**
   * Color configuration stub
   */
  addColors: noop,

  /**
   * Logger container stub
   */
  loggers: {
    add: noop,
    get: (): LoggerStub => ({
      error: noop,
      warn: noop,
      info: noop,
      debug: noop,
      verbose: noop,
      silly: noop
    })
  }
};

// Export winston stub using ES module syntax
export default winstonStub;