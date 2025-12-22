/**
 * Qtests Configuration
 * 
 * This module provides configuration for qtests-specific settings
 * including test execution, debugging, and runner options.
 */

// ==================== QTESTS CONFIGURATION ====================
export const qtestsSilent = process.env.QTESTS_SILENT || 'false';
export const qtestsInband = process.env.QTESTS_INBAND || 'false';
export const qtestsFileWorkers = process.env.QTESTS_FILE_WORKERS || 'false';
export const qtestsConcurrency = process.env.QTESTS_CONCURRENCY || '4';
export const qtestsPattern = process.env.QTESTS_PATTERN || '';
export const qtestsApiFallback = process.env.QTESTS_API_FALLBACK || 'true';
export const qtestsSuppressDebug = process.env.QTESTS_SUPPRESS_DEBUG || 'false';
export const qtestsNoDebugFile = process.env.QTESTS_NO_DEBUG_FILE || 'false';
export const qtestsDebugFile = process.env.QTESTS_DEBUG_FILE || 'DEBUG_TESTS.md';