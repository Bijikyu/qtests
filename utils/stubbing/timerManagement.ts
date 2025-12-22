/**
 * Timer Management Functions
 * 
 * This module provides fake timers and clock functionality
 * for time-dependent tests.
 */

import * as sinon from 'sinon';
import { withErrorLogging } from '../../lib/errorHandling/index.js';
export { SinonFakeTimers } from './types.js';

/**
 * Create fake timers for time-dependent tests
 * 
 * @param data - Input data containing config
 * @returns Result object containing timers instance
 */
export function createFakeTimers(data: {config?: any}): {timers: sinon.SinonFakeTimers} {
  const timers = withErrorLogging(() => data.config ? sinon.useFakeTimers(data.config) : sinon.useFakeTimers(), 'createFakeTimers');
  
  return {
    timers
  };
}

/**
 * Create a fake clock for precise time control
 * 
 * @param data - Input data containing now
 * @returns Result object containing clock instance
 */
export function createFakeClock(data: {now?: number}): {clock: sinon.SinonFakeTimers} {
  const clock = withErrorLogging(() => sinon.useFakeTimers({ 
    now: data.now, 
    toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] 
  }), 'createFakeClock');
  
  return {
    clock
  };
}

/**
 * Restore all fake timers
 * 
 * @param data - Empty input object for pattern consistency
 * @returns Result object indicating success
 */
export function restoreTimers(): {success: boolean} {
  const clock = sinon.clock;
  if (clock) {
    clock.restore();
  }
  
  return {
    success: true
  };
}