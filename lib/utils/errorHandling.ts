/**
 * Shared Error Handling Utilities
 * 
 * Provides standardized error handling patterns to reduce duplication
 * across the qtests codebase. Centralizes error logging, context
 * extraction, and common error response patterns.
 */

import qerrors from 'qerrors';

// Standard error context types
export interface ErrorContext {
  [key: string]: any;
}

export interface ErrorHandlingOptions {
  logToConsole?: boolean;
  includeStack?: boolean;
  context?: ErrorContext;
  fallbackMessage?: string;
}

/**
 * Standard error handler with consistent logging and context extraction
 */
export function handleError(
  error: any,
  context: string,
  options: ErrorHandlingOptions = {}
): void {
  const {
    logToConsole = true,
    includeStack = true,
    context: additionalContext = {},
    fallbackMessage = 'An error occurred'
  } = options;

  // Extract error information safely
  const errorInfo = {
    errorMessage: error?.message || String(error),
    errorType: error?.constructor?.name || 'Unknown',
    stack: includeStack ? error?.stack : undefined,
    ...additionalContext
  };

  // Log to qerrors for centralized error tracking
  qerrors(error, context, errorInfo);

  // Optional console logging for immediate visibility
  if (logToConsole) {
    console.error(`❌ ${context}:`, errorInfo.errorMessage);
    if (includeStack && error?.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

/**
 * Async error wrapper for consistent async error handling
 */
export function handleAsyncError<T>(
  promise: Promise<T>,
  context: string,
  options: ErrorHandlingOptions = {}
): Promise<T | null> {
  return promise.catch(error => {
    handleError(error, context, options);
    return null;
  });
}

/**
 * Memory error handler specifically for memory-related operations
 */
export function handleMemoryError(
  error: any,
  operation: string,
  additionalContext: ErrorContext = {}
): void {
  handleError(error, `memory.${operation}`, {
    logToConsole: true,
    includeStack: true,
    context: {
      operationType: 'memory',
      timestamp: Date.now(),
      ...additionalContext
    }
  });
}

/**
 * Validation error handler for input validation failures
 */
export function handleValidationError(
  error: any,
  validationType: string,
  inputData: any,
  additionalContext: ErrorContext = {}
): void {
  handleError(error, `validation.${validationType}`, {
    logToConsole: false, // Don't spam console with validation errors
    includeStack: false,
    context: {
      validationType,
      inputType: typeof inputData,
      inputSize: typeof inputData === 'string' ? inputData.length : 
                Array.isArray(inputData) ? inputData.length : 
                inputData ? Object.keys(inputData).length : 0,
      timestamp: Date.now(),
      ...additionalContext
    }
  });
}

/**
 * Security error handler for security-related events
 */
export function handleSecurityError(
  error: any,
  securityEventType: string,
  additionalContext: ErrorContext = {}
): void {
  handleError(error, `security.${securityEventType}`, {
    logToConsole: true,
    includeStack: false, // Don't expose stack in security events
    context: {
      securityEventType,
      severity: 'medium',
      timestamp: Date.now(),
      ...additionalContext
    }
  });
}

/**
 * Performance error handler for timing and performance issues
 */
export function handlePerformanceError(
  error: any,
  operation: string,
  duration: number,
  additionalContext: ErrorContext = {}
): void {
  handleError(error, `performance.${operation}`, {
    logToConsole: true,
    includeStack: true,
    context: {
      operationType: 'performance',
      duration,
      performanceThreshold: duration > 1000 ? 'slow' : 'normal',
      timestamp: Date.now(),
      ...additionalContext
    }
  });
}

/**
 * Create standardized error response objects
 */
export function createErrorResponse(
  message: string,
  code: string = 'UNKNOWN_ERROR',
  statusCode: number = 500,
  additionalData: ErrorContext = {}
): { error: string; code: string; details: ErrorContext } {
  return {
    error: message,
    code,
    details: {
      timestamp: new Date().toISOString(),
      ...additionalData
    }
  };
}

/**
 * Safe error message extraction
 */
export function getErrorMessage(error: any): string {
  if (!error) return 'Unknown error occurred';
  
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error?.message) return String(error.message);
  
  return String(error);
}

/**
 * Safe error type extraction
 */
export function getErrorType(error: any): string {
  if (!error) return 'Unknown';
  
  if (error?.constructor?.name) return error.constructor.name;
  if (error?.name) return String(error.name);
  
  return typeof error;
}

/**
 * Retry wrapper with exponential backoff and error handling
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  context: string = 'operation'
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        handleError(error, `${context}.retry.failed`, {
          context: {
            attempt: attempt + 1,
            maxRetries,
            totalWaitTime: baseDelay * Math.pow(2, maxRetries)
          }
        });
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      handleError(error, `${context}.retry.attempt`, {
        logToConsole: false,
        context: {
          attempt: attempt + 1,
          nextDelay: delay
        }
      });
    }
  }
  
  throw lastError;
}