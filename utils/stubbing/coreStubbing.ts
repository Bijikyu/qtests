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
    if (typeof data.methodName !== 'string' || !data.methodName.trim()) {
      throw new Error(`stubMethod methodName must be a non-empty string, received ${data.methodName}`);
    }
    if (!(data.methodName in data.obj)) {
      throw new Error(`stubMethod could not find ${data.methodName} on provided object`);
    }
    if (typeof data.obj[data.methodName] !== 'function') {
      throw new Error(`stubMethod ${data.methodName} exists but is not a function on provided object`);
    }
    
    // Check if property is configurable before attempting to stub
    const descriptor = Object.getOwnPropertyDescriptor(data.obj, data.methodName);
    if (!descriptor) {
      throw new Error(`stubMethod cannot find property descriptor for ${data.methodName}`);
    }
    
    // Validate descriptor has required properties
    if (typeof descriptor !== 'object' || descriptor === null) {
      throw new Error(`stubMethod invalid property descriptor for ${data.methodName}`);
    }
    
    // For data properties, check both configurable and writable
    if (descriptor.value !== undefined) {
      if (!descriptor.configurable || !descriptor.writable) {
        throw new Error(`stubMethod cannot stub non-configurable or non-writable property ${data.methodName}`);
      }
    } else if (!descriptor.configurable) {
      // For accessor properties, only check configurable
      throw new Error(`stubMethod cannot stub non-configurable property ${data.methodName}`);
    }
    if (typeof data.stubFn !== 'function') {
      throw new Error('stubMethod stubFn must be a Function');
    }

    // Create and configure stub
    let stub;
    try {
      stub = sinon.stub(data.obj, data.methodName).callsFake(data.stubFn);
    } catch (sinonError) {
      throw new Error(`stubMethod failed to create Sinon stub for ${data.methodName}: ${sinonError.message}`);
    }
    
    // Return restore function with error handling
    return (): void => {
      try {
        if (stub && typeof stub.restore === 'function') {
          stub.restore();
        }
      } catch (restoreError) {
        console.warn(`stubMethod: Failed to restore stub for ${data.methodName}:`, restoreError);
      }
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