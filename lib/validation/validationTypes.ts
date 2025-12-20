import { z, ZodSchema, ZodError } from 'zod';

export interface ValidationConfig {
  maxChunkSize: number;
  maxStringLength: number;
  maxQueryStringLength: number;
  maxConcurrentChunks: number;
  dangerousPatterns: RegExp[];
  enableStreaming: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  data?: any;
  sanitized?: any;
  error?: string;
  errors?: Array<{
    path: string[];
    message: string;
  }>;
  processingTime: number;
  schema?: ZodSchema;
}

export type { ZodSchema, ZodError };