/**
 * Method Spying Functions
 * 
 * This module provides spying capabilities to track method calls
 * without replacing functionality.
 */

import * as sinon from 'sinon';
import { withErrorLogging } from '../../lib/errorHandling/index.js';

/**
 * Create a spy on a method to track calls without replacing functionality
 * 
 * @param data - Input data containing object and methodName
 * @returns Result object containing spy instance
 */
export function spyOnMethod(data: {obj: any, methodName: string}): {spy: sinon.SinonSpy} {
  const spy = withErrorLogging(() => sinon.spy(data.obj, data.methodName), 'spyOnMethod');
  
  return {
    spy
  };
}

/**
 * Create a spy on a function without modifying the original
 * 
 * @param data - Input data containing function to spy on
 * @returns Result object containing spy instance
 */
export function spyOnFunction<T extends (...args: any[]) => any>(data: {fn: T}): {spy: sinon.SinonSpy} {
  const spy = withErrorLogging(() => sinon.spy(data.fn), 'spyOnFunction');
  
  return {
    spy
  };
}