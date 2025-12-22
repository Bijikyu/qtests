/**
 * Simple Error Logging
 * Basic error logging functionality
 */

import { StructuredError } from './errorTypes.js';

export const logError = (error: Error | StructuredError, context?: string): void => {
  console.error(`[${context || 'ERROR'}] ${error.message}`);
};