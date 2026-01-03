/**
 * Testing Configuration using Jest built-in settings
 * 
 * This module provides testing configuration that leverages Jest's built-in
 * configuration where possible, with only qtests-specific custom settings.
 */

import { config } from 'dotenv';

// Load environment variables for test configuration
config();

// ==================== QTESTS-SPECIFIC CONSTANTS ====================
// These are custom settings not available in Jest built-ins
export const defaultTestTimeout = 5000;
export const defaultRetryAttempts = 3;
export const defaultRetryDelay = 1000;
export const maxConcurrentTests = 10;
export const testMemoryThreshold = 100 * 1024 * 1024; // 100MB

// ==================== JEST BUILT-IN CONFIGURATION ====================
// Most Jest settings are now handled in jest.config.mjs
// Environment variables for Jest CLI overrides
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