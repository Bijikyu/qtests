/**
 * Error Handling Wrapper Utilities
 * 
 * This module provides common error handling patterns to reduce
 * duplicated try-catch blocks throughout the codebase.
 */

import qerrors from 'qerrors';

/**
 * Wraps an operation with standardized error handling
 * @param {Function} operation - The operation to execute
 * @param {string} context - Context description for error logging
 * @param {Object} errorContext - Additional context data for error logging
 * @returns {Function} Wrapped function with error handling
 */
export function withErrorHandling(operation, context, errorContext = {}) {
    return async (...args) => {
        try {
            return await operation(...args);
        } catch (error) {
            qerrors(error, context, { ...errorContext, args });
            throw error;
        }
    };
}

/**
 * Synchronous version of withErrorHandling
 * @param {Function} operation - The synchronous operation to execute
 * @param {string} context - Context description for error logging
 * @param {Object} errorContext - Additional context data for error logging
 * @returns {Function} Wrapped function with error handling
 */
export function withSyncErrorHandling(operation, context, errorContext = {}) {
    return (...args) => {
        try {
            return operation(...args);
        } catch (error) {
            qerrors(error, context, { ...errorContext, args });
            throw error;
        }
    };
}

/**
 * Express route error handling wrapper
 * @param {Function} handler - Express route handler
 * @param {string} context - Context description for error logging
 * @param {Object} errorContext - Additional context data for error logging
 * @returns {Function} Wrapped Express route handler
 */
export function withRouteErrorHandling(handler, context, errorContext = {}) {
    return (req, res, next) => {
        try {
            const result = handler(req, res);
            // Handle async handlers
            if (result && typeof result.catch === 'function') {
                return result.catch(error => {
                    qerrors(error, context, { 
                        ...errorContext, 
                        method: req.method, 
                        url: req.url,
                        body: req.body 
                    });
                    next(error);
                });
            }
            return result;
        } catch (error) {
            qerrors(error, context, { 
                ...errorContext, 
                method: req.method, 
                url: req.url,
                body: req.body 
            });
            next(error);
        }
    };
}