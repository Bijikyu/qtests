/**
 * HTTP Mock Utility Functions
 */

import { AxiosResponse, MockResponse } from './mockTypes.js';

/**
 * Creates a standardized axios-compatible response object
 */
export function createAxiosStyleResponse(
  data: any = {},
  status: number = 200,
  statusText: string = 'OK'
): AxiosResponse {
  return {
    data,
    status,
    statusText,
    headers: {},
    config: {},
    request: {}
  };
}

/**
 * Create a mock response factory for MSW
 */
export function createMockResponse(data: any, status: number = 200): MockResponse {
  return {
    status,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

/**
 * Create an error response factory
 */
export function createErrorResponse(status: number, message: string): MockResponse {
  return {
    status,
    data: { error: message, status },
    headers: {
      'Content-Type': 'application/json',
    },
  };
}