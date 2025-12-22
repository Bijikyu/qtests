/**
 * Testing Configuration
 * 
 * This module provides configuration for testing settings
 * including timeouts, retry attempts, and memory thresholds.
 */

// ==================== TESTING CONSTANTS ====================
export const defaultTestTimeout = 5000;
export const defaultRetryAttempts = 3;
export const defaultRetryDelay = 1000;
export const maxConcurrentTests = 10;
export const testMemoryThreshold = 100 * 1024 * 1024; // 100MB

// ==================== JEST CONFIGURATION ====================
export const jestTestTimeout = 30000;
export const jestVerbose = process.env.JEST_VERBOSE || 'false';
export const jestCoverage = process.env.JEST_COVERAGE || 'false';
export const jestCache = process.env.JEST_CACHE || 'true';
export const jestPassWithNoTests = 'true';

// ==================== INTEGRATION TESTING CONSTANTS ====================
export const integrationTestTimeout = 60000;
export const integrationTestRetryAttempts = 5;
export const integrationTestRetryDelay = 5000;
export const integrationTestCleanupDelay = 1000;

// ==================== PERFORMANCE TESTING CONSTANTS ====================
export const performanceTestDuration = 30000;
export const performanceTestSamples = 1000;
export const performanceTestThreshold = 100; // ms