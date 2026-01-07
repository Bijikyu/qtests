/**
 * HTTP Response Mock Utilities
 * Provides factory functions for creating consistent mock HTTP responses
 */

export interface MockResponseOptions {
  status?: number;
  headers?: Record<string, string>;
  data?: any;
  body?: any;
  error?: string;
  message?: string;
}

/**
 * Creates a standardized mock HTTP response
 * @param options - Response configuration options
 * @returns Mock response object
 */
export function createMockResponse(options: MockResponseOptions = {}) {
  const {
    status = 200,
    headers = { 'content-type': 'application/json' },
    data = null,
    body = null,
    error = null,
    message = 'Success'
  } = options;

  return {
    status,
    headers,
    data: data || body,
    message,
    error
  };
}

/**
 * Creates a JSON mock response with proper content-type
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @param message - Optional response message
 * @returns Mock response with JSON content-type
 */
export function createJsonResponse(data: any, status: number = 200, message?: string) {
  return createMockResponse({
    status,
    data,
    message: message || (status >= 400 ? 'Error' : 'Success'),
    headers: { 'content-type': 'application/json' }
  });
}

/**
 * Creates an error mock response
 * @param message - Error message
 * @param status - HTTP status code (default: 500)
 * @param error - Optional error code/type
 * @returns Mock error response
 */
export function createErrorResponse(message: string, status: number = 500, error?: string) {
  return createMockResponse({
    status,
    message,
    error: error || 'INTERNAL_ERROR'
  });
}

/**
 * Creates a success mock response
 * @param data - Response data
 * @param message - Optional success message
 * @returns Mock success response
 */
export function createSuccessResponse(data: any, message?: string) {
  return createJsonResponse(data, 200, message || 'Success');
}

/**
 * Creates a not found mock response
 * @param message - Optional not found message
 * @returns Mock 404 response
 */
export function createNotFoundResponse(message?: string) {
  return createErrorResponse(message || 'Resource not found', 404, 'NOT_FOUND');
}

/**
 * Creates a bad request mock response
 * @param message - Optional bad request message
 * @returns Mock 400 response
 */
export function createBadRequestResponse(message?: string) {
  return createErrorResponse(message || 'Bad request', 400, 'BAD_REQUEST');
}