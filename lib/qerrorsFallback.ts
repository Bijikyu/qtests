/**
 * Production-Ready Error Logging Fallback
 * 
 * This module provides a production-ready fallback for qerrors dependency
 * to avoid complex dependency chain issues that were blocking test execution.
 * 
 * Key features:
 * - Consistent error logging format
 * - Structured JSON output for production monitoring
 * - Timestamp and context tracking
 * - No external dependencies that could cause resolution issues
 * - Maintains same API as qerrors for compatibility
 */

const qerrors = (error: Error, message?: string, context?: any) => {
  const isTestEnv = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;
  if (!isTestEnv) {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      message: message || error.message,
      stack: error.stack,
      context: context || {},
      level: 'ERROR'
    };
    console.error('[QERRORS]', JSON.stringify(errorInfo, null, 2));
  }
};

export default qerrors;