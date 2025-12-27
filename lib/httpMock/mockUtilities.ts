/**
 * HTTP Mock Utility Functions
 */

import { AxiosResponse, MockResponse } from './mockTypes.js';
import qerrors from '../qerrorsFallback.js';

/**
 * Creates a standardized axios-compatible response object
 */
export function createAxiosStyleResponse(
  data: any = {},
  status: number = 200,
  statusText: string = 'OK'
): AxiosResponse {
  try {
    // Validate inputs
    if (status < 100 || status > 599) {
      throw new Error('Invalid HTTP status code');
    }
    if (statusText && typeof statusText !== 'string') {
      throw new Error('Status text must be a string');
    }
    
    return {
      data,
      status,
      statusText,
      headers: {},
      config: {},
      request: {}
    };
  } catch (error) {
    qerrors(error as Error, 'mockUtilities.createAxiosStyleResponse: response creation failed', {
      dataType: typeof data,
      status,
      statusText,
      errorType: error.constructor?.name || 'unknown',
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    
    // Return safe default response
    return {
      data: {},
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {},
      request: {}
    };
  }
}

/**
 * Create a mock response factory for MSW
 */
export function createMockResponse(data: any, status: number = 200): MockResponse {
  try {
    // Validate inputs
    if (status < 100 || status > 599) {
      throw new Error('Invalid HTTP status code');
    }
    
    return {
      status,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    qerrors(error as Error, 'mockUtilities.createMockResponse: mock response creation failed', {
      dataType: typeof data,
      status,
      errorType: error.constructor?.name || 'unknown',
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    
    // Return safe default response
    return {
      status: 500,
      data: { error: 'Response creation failed' },
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}

/**
 * Create an error response factory
 */
export function createErrorResponse(status: number, message: string): MockResponse {
  try {
    // Validate inputs
    if (status < 100 || status > 599) {
      throw new Error('Invalid HTTP status code');
    }
    if (!message || typeof message !== 'string') {
      throw new Error('Error message must be a non-empty string');
    }
    
    return {
      status,
      data: { error: message, status },
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    qerrors(error as Error, 'mockUtilities.createErrorResponse: error response creation failed', {
      status,
      message,
      errorType: error.constructor?.name || 'unknown',
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    
    // Return safe default error response
    return {
      status: 500,
      data: { error: 'Error response creation failed', status: 500 },
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}