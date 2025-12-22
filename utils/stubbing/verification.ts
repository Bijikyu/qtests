/**
 * Verification Helper Functions
 * 
 * This module provides verification utilities for testing
 * to check method call patterns and counts.
 */

import type { SinonSpy, SinonStub } from 'sinon';

/**
 * Verify that a method was called a specific number of times
 * 
 * @param data - Input data containing spy and count
 * @returns Result object containing verification result
 */
export function verifyCallCount(data: {spy: sinon.SinonSpy | sinon.SinonStub, count: number}): {matches: boolean} {
  return {
    matches: data.spy.callCount === data.count
  };
}

/**
 * Verify that a method was called with specific arguments
 * 
 * @param data - Input data containing spy and args
 * @returns Result object containing verification result
 */
export function verifyCalledWith(data: {spy: sinon.SinonSpy | sinon.SinonStub, args: any[]}): {matches: boolean} {
  return {
    matches: data.spy.calledWith(...data.args)
  };
}

/**
 * Verify that a method was called once
 * 
 * @param data - Input data containing spy
 * @returns Result object containing verification result
 */
export function verifyCalledOnce(data: {spy: sinon.SinonSpy | sinon.SinonStub}): {matches: boolean} {
  return {
    matches: data.spy.calledOnce
  };
}