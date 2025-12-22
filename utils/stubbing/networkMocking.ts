/**
 * Network Mocking Functions
 * 
 * This module provides fake server and XHR creation
 * capabilities for HTTP testing.
 */

import * as sinon from 'sinon';
import { withErrorLogging } from '../../lib/errorHandling/index.js';

/**
 * Create a fake server for HTTP testing
 * Note: This feature may not be available in all Sinon versions
 * 
 * @param data - Empty input object for pattern consistency
 * @returns Result object containing server instance
 */
export function createFakeServer(): {server: any} {
  const server = withErrorLogging(() => {
    if ('fakeServer' in sinon && typeof (sinon as any).fakeServer.create === 'function') {
      return (sinon as any).fakeServer.create();
    }
    throw new Error('Fake server not available in this Sinon version');
  }, 'createFakeServer');
  
  return {
    server
  };
}

/**
 * Create a fake XMLHttpRequest
 * Note: This feature may not be available in all Sinon versions
 * 
 * @param data - Empty input object for pattern consistency
 * @returns Result object containing XHR instance
 */
export function createFakeXHR(): {xhr: any} {
  const xhr = withErrorLogging(() => {
    if ('useFakeXMLHttpRequest' in sinon && typeof (sinon as any).useFakeXMLHttpRequest === 'function') {
      return (sinon as any).useFakeXMLHttpRequest();
    }
    throw new Error('Fake XHR not available in this Sinon version');
  }, 'createFakeXHR');
  
  return {
    xhr
  };
}