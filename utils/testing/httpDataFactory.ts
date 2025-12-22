/**
 * HTTP Data Factory Functions
 * 
 * This module provides factory functions for creating
 * HTTP request and response test data.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';

/**
 * Creates test HTTP request data
 */
export function createHttpRequest(overrides: any = {}): any {
  logStart('DataFactory.createHttpRequest', overrides);
  
  const id = Date.now();
  const request = {
    method: 'GET',
    url: `/api/test/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'qtests-test-agent'
    },
    body: null,
    timestamp: new Date(),
    ...overrides
  };
  
  logReturn('DataFactory.createHttpRequest', request);
  return request;
}

/**
 * Creates test HTTP response data
 */
export function createHttpResponse(overrides: any = {}): any {
  logStart('DataFactory.createHttpResponse', overrides);
  
  const response = {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json',
      'X-Test-Response': 'true'
    },
    data: { success: true, message: 'Test response' },
    timestamp: new Date(),
    ...overrides
  };
  
  logReturn('DataFactory.createHttpResponse', response);
  return response;
}