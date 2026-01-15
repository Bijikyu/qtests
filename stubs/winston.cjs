"use strict";
/**
 * Winston Logging Library Stub for Testing - Complete API Compliance
 *
 * This module provides a complete, API-compliant replacement for the winston
 * logging library. When tests require('winston') after @bijikyu/qtests/setup, they
 * get this stub instead of real winston, preventing log output during test
 * execution while maintaining full winston API compatibility.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultColors = exports.defaultLevels = exports.MockTimer = exports.MockFileTransport = exports.MockConsoleTransport = exports.MockLogger = void 0;
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
exports.defaultLevels = defaultLevels;
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
exports.defaultColors = defaultColors;
// Shared no-op function
const noop = () => { };
// Timer implementation
class MockTimer {
    constructor(message, meta) {
        this.startTime = Date.now();
        this.message = message;
        this.meta = meta;
    }
    done(message, meta) {
        const duration = Date.now() - this.startTime;
        const finalMessage = message || this.message || 'Duration';
        const finalMeta = { ...this.meta, ...meta, duration };
        // In a real implementation, this would log the timer
        // For testing, we keep it silent
        noop();
    }
}
exports.MockTimer = MockTimer;
// Format implementations
class MockFormat {
    transform(info) {
        return info;
    }
}
class MockColorizeFormat extends MockFormat {
    transform(info) {
        // In real implementation, this would add colors
        return info;
    }
}
class MockCombineFormat extends MockFormat {
    constructor(formats) {
        super();
        this.formats = formats;
    }
    transform(info) {
        return this.formats.reduce((acc, format) => format.transform(acc), info);
    }
}
class MockLabelFormat extends MockFormat {
    constructor(options) {
        super();
        this.options = options;
    }
    transform(info) {
        return {
            ...info,
            label: this.options.label || this.options.message || 'default'
        };
    }
}
class MockTimestampFormat extends MockFormat {
    constructor(options = {}) {
        super();
        this.options = options;
    }
    transform(info) {
        const format = this.options.format || 'YYYY-MM-DD HH:mm:ss';
        return {
            ...info,
            timestamp: new Date().toISOString()
        };
    }
}
class MockPrintfFormat extends MockFormat {
    constructor(templateFunction) {
        super();
        this.templateFunction = templateFunction;
    }
    transform(info) {
        return {
            ...info,
            message: this.templateFunction(info)
        };
    }
}
class MockJsonFormat extends MockFormat {
    constructor(options = {}) {
        super();
        this.options = options;
    }
    transform(info) {
        return {
            ...info,
            message: JSON.stringify(info)
        };
    }
}
class MockSimpleFormat extends MockFormat {
    transform(info) {
        return {
            ...info,
            message: `${info.level}: ${info.message}`
        };
    }
}
// Transport implementations
class MockConsoleTransport {
    constructor(options = {}) {
        this.options = options;
        this.name = 'console';
        this.silent = false;
        this.handleExceptions = false;
        this.level = options.level || 'info';
        this.silent = options.silent || false;
        this.handleExceptions = options.handleExceptions || false;
    }
    log(info) {
        // Silent during tests
        noop();
    }
    close() {
        noop();
    }
}
exports.MockConsoleTransport = MockConsoleTransport;
class MockFileTransport {
    constructor(options = {}) {
        this.options = options;
        this.name = 'file';
        this.silent = false;
        this.handleExceptions = false;
        this.level = options.level || 'info';
        this.silent = options.silent || false;
        this.handleExceptions = options.handleExceptions || false;
    }
    log(info) {
        // Silent during tests
        noop();
    }
    close() {
        noop();
    }
}
exports.MockFileTransport = MockFileTransport;
class MockHttpTransport {
    constructor(options = {}) {
        this.options = options;
        this.name = 'http';
        this.silent = false;
        this.handleExceptions = false;
        this.level = options.level || 'info';
        this.silent = options.silent || false;
        this.handleExceptions = options.handleExceptions || false;
    }
    log(info) {
        // Silent during tests
        noop();
    }
    close() {
        noop();
    }
}
class MockStreamTransport {
    constructor(options = {}) {
        this.options = options;
        this.name = 'stream';
        this.silent = false;
        this.handleExceptions = false;
        this.level = options.level || 'info';
        this.silent = options.silent || false;
        this.handleExceptions = options.handleExceptions || false;
    }
    log(info) {
        // Silent during tests
        noop();
    }
    close() {
        noop();
    }
}
// Logger implementation
class MockLogger {
    constructor(options = {}) {
        this.options = options;
        this.transports = [];
        this.defaultMeta = {};
        this.defaultMeta = options.defaultMeta || {};
    }
    error(message, ...meta) {
        this.log('error', message, ...meta);
    }
    warn(message, ...meta) {
        this.log('warn', message, ...meta);
    }
    info(message, ...meta) {
        this.log('info', message, ...meta);
    }
    http(message, ...meta) {
        this.log('http', message, ...meta);
    }
    verbose(message, ...meta) {
        this.log('verbose', message, ...meta);
    }
    debug(message, ...meta) {
        this.log('debug', message, ...meta);
    }
    silly(message, ...meta) {
        this.log('silly', message, ...meta);
    }
    log(level, message, ...meta) {
        // Silent during tests - just store the log info
        const logEntry = {
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
    profile(id, meta) {
        // Start or complete profiling
        return this;
    }
    startTimer() {
        return new MockTimer();
    }
    child(defaultMeta) {
        const childLogger = new MockLogger({ ...this.options });
        childLogger.defaultMeta = { ...this.defaultMeta, ...defaultMeta };
        return childLogger;
    }
    add(transport) {
        this.transports.push(transport);
        return this;
    }
    remove(transport) {
        const index = this.transports.indexOf(transport);
        if (index > -1) {
            this.transports.splice(index, 1);
        }
        return this;
    }
    clear() {
        this.transports = [];
        return this;
    }
    close() {
        this.transports.forEach(transport => {
            if (transport.close) {
                transport.close();
            }
        });
        this.transports = [];
    }
    query(options, callback) {
        // Return empty results for testing
        const results = { file: [] };
        if (callback) {
            callback(null, results);
        }
        return Promise.resolve(results);
    }
    stream(options) {
        // Return mock stream
        return {
            on: noop,
            pipe: noop,
            resume: noop,
            pause: noop
        };
    }
}
exports.MockLogger = MockLogger;
// Logger container implementation
class MockLoggers {
    constructor() {
        this.loggers = new Map();
    }
    add(id, options) {
        const logger = new MockLogger(options);
        this.loggers.set(id, logger);
        return logger;
    }
    get(id) {
        if (!this.loggers.has(id)) {
            this.loggers.set(id, new MockLogger());
        }
        return this.loggers.get(id);
    }
    close(id) {
        if (id) {
            const logger = this.loggers.get(id);
            if (logger) {
                logger.close();
                this.loggers.delete(id);
            }
        }
        else {
            this.loggers.forEach(logger => logger.close());
            this.loggers.clear();
        }
    }
    has(id) {
        return this.loggers.has(id);
    }
}
// Main winston stub implementation
const winstonStub = {
    /**
     * Creates a logger instance
     */
    createLogger(options) {
        return new MockLogger(options);
    },
    /**
     * Winston format utilities
     */
    format: {
        colorize: (options) => new MockColorizeFormat(),
        combine: (...formats) => new MockCombineFormat(formats),
        label: (options) => new MockLabelFormat(options),
        timestamp: (options) => new MockTimestampFormat(options),
        printf: (templateFunction) => new MockPrintfFormat(templateFunction),
        json: (options) => new MockJsonFormat(options),
        simple: () => new MockSimpleFormat(),
        splat: () => new MockFormat(),
        padLevels: () => new MockFormat(),
        metadata: (fillEmpty) => new MockFormat()
    },
    /**
     * Winston transport constructors
     */
    transports: {
        Console: MockConsoleTransport,
        File: MockFileTransport,
        Http: MockHttpTransport,
        Stream: MockStreamTransport
    },
    /**
     * Color configuration
     */
    addColors: (colors) => {
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
        handle: (exceptions) => {
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
        handle: (rejections) => {
            // Silent during tests
            return { catch: noop };
        },
        unhandle: noop,
        getHandlers: () => []
    }
};
// Export winston stub using ES module syntax
exports.default = winstonStub;
