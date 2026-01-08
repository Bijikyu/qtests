/**
 * Qtests Framework Configuration
 * 
 * This module defines environment variables and configuration options specific
 * to the qtests testing framework, controlling test execution behavior,
 * debugging output, and runner settings.
 */

import { getEnvVar } from '../utils/helpers/envManager.js';

// Test execution and output control
export const qtestsSilent = getEnvVar('QTESTS_SILENT', 'false'); // Suppress non-essential setup logs in CI
export const qtestsInband = getEnvVar('QTESTS_INBAND', 'false'); // Run tests in the same process (in-band mode)
export const qtestsFileWorkers = getEnvVar('QTESTS_FILE_WORKERS', 'false'); // Use separate workers for each test file

// Test execution performance and concurrency
export const qtestsConcurrency = getEnvVar('QTESTS_CONCURRENCY', '4'); // Maximum number of concurrent test files
export const qtestsPattern = getEnvVar('QTESTS_PATTERN', ''); // Pattern to filter test files (glob pattern)

// Test runner behavior and fallbacks
export const qtestsApiFallback = getEnvVar('QTESTS_API_FALLBACK', 'true'); // Enable API fallback when direct execution fails

// Debug and error reporting configuration
export const qtestsSuppressDebug = getEnvVar('QTESTS_SUPPRESS_DEBUG', 'false'); // Suppress debug output creation
export const qtestsNoDebugFile = getEnvVar('QTESTS_NO_DEBUG_FILE', 'false'); // Disable creation of debug files
export const qtestsDebugFile = getEnvVar('QTESTS_DEBUG_FILE', 'DEBUG_TESTS.md'); // Name of debug file to create on failures