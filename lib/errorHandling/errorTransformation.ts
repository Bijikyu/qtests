/**
 * Error Transformation Utilities
 * Functions for transforming and structuring errors
 */

import {
  TransformedError,
  StructuredError
} from './errorTypes.js';

export const transformMongoError = (error: any): TransformedError => {
  const transformed = new Error(`Transformed: ${error}`) as TransformedError;
  transformed.originalError = error instanceof Error ? error : new Error(String(error));
  transformed.transformedAt = new Date();
  return transformed;
};

export const createStructuredError = (
  message: string,
  code?: string,
  context?: Record<string, any>
): StructuredError => {
  const error = new Error(message) as StructuredError;
  error.code = code;
  error.context = context;
  error.timestamp = new Date();
  return error;
};