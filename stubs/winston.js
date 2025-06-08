/**
 * Winston Logging Library Stub for Testing
 * 
 * This module provides a complete no-op replacement for the winston logging
 * library. When tests require('winston') after qtests/setup, they get this
 * stub instead of real winston, preventing log output during test execution.
 * 
 * Design philosophy:
 * - Complete interface coverage: implements all commonly used winston APIs
 * - Silent operation: no console output or file writing
 * - Memory efficient: no log storage or processing
 * - Fast execution: all operations are no-ops
 * 
 * Why stub winston specifically:
 * - Extremely popular logging library in Node.js ecosystem
 * - Log output pollutes test output and makes debugging harder
 * - File logging during tests can cause permission issues
 * - Tests should focus on business logic, not logging side effects
 * 
 * Implementation strategy:
 * - Mirror winston's API structure exactly
 * - All functions are no-ops (do nothing, return nothing meaningful)
 * - Maintain object structure for property access compatibility
 * - No state storage to keep memory usage minimal
 */

const noop = () => {}; // shared no-op function for all stub methods

/**
 * Winston stub module exports
 * 
 * This object structure matches winston's main exports, providing
 * replacement implementations for the most commonly used winston APIs.
 * 
 * Structure rationale:
 * - createLogger: Main winston function for creating logger instances
 * - format: Winston's formatting utilities for log messages
 * - transports: Winston's output destinations (file, console, etc.)
 * 
 * Each section implements enough of the API to prevent errors when
 * existing code calls winston methods during testing.
 */
module.exports = {
  /**
   * Creates a no-op logger instance
   * 
   * This replaces winston.createLogger() with a function that returns
   * an object containing silent implementations of all common logging methods.
   * 
   * Why return an object with methods:
   * - Code expects to call logger.info(), logger.error(), etc.
   * - Must provide these methods to prevent "function not found" errors
   * - All methods are no-ops to eliminate log output
   * 
   * Method selection:
   * - error, warn, info: Most common logging levels
   * - Can be extended with debug, verbose, silly, etc. as needed
   * - Each method accepts any arguments but does nothing
   * 
   * @returns {Object} Logger-like object with no-op logging methods
   */
  createLogger: () => ({
    /**
     * No-op error logging
     * Replaces logger.error() calls with silent operation
     * @param {...any} args - Any logging arguments (ignored)
     */
    error: noop, // Silent - no error output during tests

    /**
     * No-op warning logging  
     * Replaces logger.warn() calls with silent operation
     * @param {...any} args - Any logging arguments (ignored)
     */
    warn: noop,  // Silent - no warning output during tests

    /**
     * No-op info logging
     * Replaces logger.info() calls with silent operation
     * @param {...any} args - Any logging arguments (ignored)
     */
    info: noop   // Silent - no info output during tests
  }),

  /**
   * Winston format utilities stub
   * 
   * Winston's format object provides utilities for formatting log messages.
   * This stub provides no-op implementations of the most commonly used
   * formatting functions to prevent errors when code configures loggers.
   * 
   * Why stub format utilities:
   * - Logger configuration often chains format calls
   * - Code like winston.format.combine(winston.format.timestamp()) is common
   * - Without stubs, these calls would throw "function not found" errors
   * - No-op implementations allow configuration code to run without effect
   */
  format: {
    /**
     * No-op format combiner
     * Replaces winston.format.combine() for chaining formatters
     * @returns {Function} No-op function
     */
    combine: noop,    // Silent - no format combination

    /**
     * No-op timestamp formatter
     * Replaces winston.format.timestamp() for adding timestamps
     * @returns {Function} No-op function  
     */
    timestamp: noop,  // Silent - no timestamp formatting

    /**
     * No-op error formatter
     * Replaces winston.format.errors() for error object formatting
     * @returns {Function} No-op function
     */
    errors: noop,     // Silent - no error formatting

    /**
     * No-op splat formatter
     * Replaces winston.format.splat() for string interpolation
     * @returns {Function} No-op function
     */
    splat: noop,      // Silent - no string interpolation

    /**
     * No-op JSON formatter
     * Replaces winston.format.json() for JSON output formatting
     * @returns {Function} No-op function
     */
    json: noop,       // Silent - no JSON formatting

    /**
     * No-op printf formatter
     * Replaces winston.format.printf() for custom formatting
     * @returns {Function} No-op function
     */
    printf: noop      // Silent - no custom formatting
  },

  /**
   * Winston transport utilities stub
   * 
   * Winston transports define where log messages go (files, console, etc.).
   * This stub provides no-op constructor functions for the most common
   * transport types to prevent errors during logger configuration.
   * 
   * Why stub transports:
   * - Logger configuration typically specifies output destinations
   * - Code like new winston.transports.File({filename: 'app.log'}) is common
   * - Without stubs, transport construction would fail
   * - No-op constructors allow configuration without creating real outputs
   */
  transports: {
    /**
     * No-op file transport constructor
     * Replaces winston.transports.File for file logging configuration
     * @param {Object} options - Transport configuration (ignored)
     */
    File: noop,    // Silent - no file transport creation

    /**
     * No-op console transport constructor  
     * Replaces winston.transports.Console for console logging configuration
     * @param {Object} options - Transport configuration (ignored)
     */
    Console: noop  // Silent - no console transport creation
  }
};

/**
 * Usage in tests:
 * 
 * After requiring 'qtests/setup', any code that does:
 *   const winston = require('winston');
 *   const logger = winston.createLogger({
 *     format: winston.format.combine(
 *       winston.format.timestamp(),
 *       winston.format.json()
 *     ),
 *     transports: [
 *       new winston.transports.File({ filename: 'app.log' })
 *     ]
 *   });
 *   logger.info('Test message');
 * 
 * Will use this stub instead, which:
 * - Creates a silent logger that outputs nothing
 * - Allows all configuration calls to succeed
 * - Prevents any file I/O or console output
 * - Maintains the same API surface as real winston
 * 
 * This enables testing of logging-dependent code without log pollution.
 */