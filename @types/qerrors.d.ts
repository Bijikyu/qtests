// Type definitions for qerrors external package
declare module 'qerrors' {
  export default function qerrors(error: Error, message?: string, context?: any): never;
  
  // Additional exports for advanced error handling
  export function qerror(error: Error, message?: string, context?: any): void;
  export function qwarn(error: Error, message?: string, context?: any): void;
  export function qinfo(message: string, context?: any): void;
  
  // Simple error creation utilities
  export function createError(message: string, code?: string): Error & { code?: string };
  export function createTypedError(error: Error, message?: string, context?: any): Error & { code?: string };
  export function createStandardError(error: Error, message?: string): Error & { code?: string };
}