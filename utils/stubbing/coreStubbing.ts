/**
 * Core Method Stubbing Functions
 * 
 * This module provides the fundamental method stubbing capabilities
 * using Sinon for reliable test doubles.
 */

import * as sinon from 'sinon';
import { withErrorLogging } from '../../lib/errorHandling/index.js';

export type StubRestoreFunction = () => void;
export type StubFunction = (...args: any[]) => any;

export type SinonSpy = sinon.SinonSpy;
export type SinonStub = sinon.SinonStub;
export type SinonMock = sinon.SinonMock;

/**
 * Stub a method on an object with a custom implementation
 * 
 * @param data - Input data containing object, methodName, and stubFn
 * @returns Result object containing restore function
 */
export function stubMethod(data: {obj: any, methodName: string, stubFn: StubFunction}): {restore: StubRestoreFunction} {
  const restoreFunction = withErrorLogging(() => {
    // Validate inputs
    if (typeof data.obj !== 'object' || data.obj === null) {
      throw new Error(`stubMethod expected object but received ${data.obj}`);
    }
    if (!(data.methodName in data.obj)) {
      throw new Error(`stubMethod could not find ${data.methodName} on provided object`);
    }
    if (typeof data.stubFn !== 'function') {
      throw new Error('stubMethod stubFn must be a Function');
    }

    // Create and configure stub
    const stub = sinon.stub(data.obj, data.methodName).callsFake(data.stubFn);
    
    // Return restore function
    return (): void => {
      stub.restore();
    };
  }, 'stubMethod');
  
  return {
    restore: restoreFunction
  };
}

/**
 * Create a stub method (alias for stubMethod)
 * Provides backward compatibility with stubMethodModern.ts
 * 
 * @param data - Input data containing object, methodName, and stubFn
 * @returns Result object containing restore function
 */
export const createStubMethod = (data: {obj: any, methodName: string, stubFn: Function}): {restore: () => void} => {
  return stubMethod({obj: data.obj, methodName: data.methodName, stubFn: data.stubFn as StubFunction});
};