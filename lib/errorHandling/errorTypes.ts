/**
 * Error Handling Type Definitions
 */

export type AsyncErrorWrapperOptions = {
  timeout?: number;
  context?: string;
};

export type RouteErrorWrapperOptions = {
  context?: string;
};

export type DatabaseErrorWrapperOptions = {
  context?: string;
};

export type ApiErrorWrapperOptions = {
  context?: string;
};

export type BatchErrorWrapperOptions = {
  context?: string;
};

export type TimeoutErrorWrapperOptions = {
  timeout?: number;
  context?: string;
};

export interface TransformedError extends Error {
  originalError?: Error;
  transformedAt?: Date;
}

export interface BatchResult<T> {
  successes: T[];
  failures: Array<{error: Error, item: any}>;
}

export interface BatchProcessingResult<T> {
  results: T[];
  errors: Error[];
  processedCount: number;
}

export interface StructuredError extends Error {
  code?: string;
  context?: Record<string, any>;
  timestamp?: Date;
}