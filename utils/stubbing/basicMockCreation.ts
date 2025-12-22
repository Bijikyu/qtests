/**
 * Basic Mock Creation Functions
 * 
 * This module provides fundamental mock and fake object creation
 * capabilities for testing.
 */

import * as sinon from 'sinon';
import { withErrorLogging } from '../../lib/errorHandling/index.js';
import { StubFunction } from './types.js';

/**
 * Create a mock object from a template
 * 
 * @param data - Input data containing template
 * @returns Result object containing mock instance
 */
export function createMock<T extends object>(data: {template?: Partial<T>}): {mock: sinon.SinonMock} {
  const mock = withErrorLogging(() => sinon.mock(data.template || {}), 'createMock');
  
  return {
    mock
  };
}

/**
 * Create a fake object with predefined methods
 * 
 * @param data - Input data containing methods
 * @returns Result object containing fake instance
 */
export function createFake(data: {methods?: Record<string, StubFunction>}): {fake: any} {
  const fake = withErrorLogging(() => {
    const fakeObj: any = {};
    const methods = data.methods || {};
    
    for (const [methodName, methodFn] of Object.entries(methods)) {
      fakeObj[methodName] = sinon.fake(methodFn);
    }
    
    return fakeObj;
  }, 'createFake');
  
  return {
    fake
  };
}