/** Testing Configuration using Jest built-in settings */
import './init.js';
import { getEnvVar } from '../dist/utils/helpers/envManager.js';

// Basic Test Configuration
export const defaultTestTimeout = 5000;
export const defaultRetryAttempts = 3;
export const defaultRetryDelay = 1000;
export const maxConcurrentTests = 10;
export const testMemoryThreshold = 100 * 1024 * 1024;

// Jest Configuration
export const jestVerbose = getEnvVar('JEST_VERBOSE', 'false');
export const jestCoverage = getEnvVar('JEST_COVERAGE', 'false');
export const jestCache = getEnvVar('JEST_CACHE', 'true');
export const jestPassWithNoTests = 'true';

// Integration Test Configuration
export const integrationTestTimeout = 60000;
export const integrationTestRetryAttempts = 5;
export const integrationTestRetryDelay = 5000;
export const integrationTestCleanupDelay = 1000;

// Performance Test Configuration
export const performanceTestDuration = 30000;
export const performanceTestSamples = 1000;
export const performanceTestThreshold = 100;