"use strict";
/**
 * Production-Ready Error Logging Fallback
 *
 * This module provides a production-ready fallback for qerrors dependency
 * to avoid complex dependency chain issues that were blocking test execution.
 *
 * Key features:
 * - Consistent error logging format
 * - Structured JSON output for production monitoring
 * - Timestamp and context tracking
 * - No external dependencies that could cause resolution issues
 * - Maintains same API as qerrors for compatibility
 */
Object.defineProperty(exports, "__esModule", { value: true });
const qerrors = (error, message, context) => {
    const timestamp = new Date().toISOString();
    const errorInfo = {
        timestamp,
        message: message || error.message,
        stack: error.stack,
        context: context || {},
        level: 'ERROR'
    };
    // Use console.error for production reliability
    // JSON format enables proper log aggregation and monitoring
    console.error('[QERRORS]', JSON.stringify(errorInfo, null, 2));
    // Re-throw to maintain original error behavior
    throw error;
};
exports.default = qerrors;
