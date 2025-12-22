/**
 * Utility Functions
 * 
 * This module provides general utility functions for stubbing
 * and restoration operations.
 */

import * as sinon from 'sinon';
import { withErrorLogging } from '../../lib/errorHandling/index.js';

/**
 * Get access to the underlying Sinon library
 * 
 * @param data - Empty input object for pattern consistency
 * @returns Result object containing Sinon library instance
 */
export function getSinonLibrary(): {library: typeof sinon} {
  return {
    library: sinon
  };
}

/**
 * Restore all stubs and spies created by Sinon
 * 
 * @param data - Input data containing optional restoreObject
 * @returns Result object indicating success
 */
export function restoreAll(data: {restoreObject?: any} = {}): {success: boolean} {
  withErrorLogging(() => {
    if (data.restoreObject && 'restore' in data.restoreObject && typeof data.restoreObject.restore === 'function') {
      data.restoreObject.restore();
    } else {
      sinon.restore();
    }
  }, 'restoreAll');
  
  return {
    success: true
  };
}