/**
 * Winston Logging Library Stub for Testing - TypeScript Implementation
 *
 * This module provides a complete no-op replacement for the winston logging
 * library. When tests require('winston') after qtests/setup, they get this
 * stub instead of real winston, preventing log output during test execution.
 */
const noop = () => { }; // shared no-op function for all stub methods
const winstonStub = {
    /**
     * Creates a no-op logger instance
     */
    createLogger: () => ({
        error: noop, // Silent - no error output during tests
        warn: noop, // Silent - no warning output during tests
        info: noop, // Silent - no info output during tests
        debug: noop, // Silent - no debug output during tests
        verbose: noop, // Silent - no verbose output during tests
        silly: noop // Silent - no silly output during tests
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
        get: () => ({
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
