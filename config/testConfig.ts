import './init.js';
import { getEnvVar } from '../utils/helpers/envManager.js';

export const defaultTestTimeout = 5000;
export const defaultRetryAttempts = 3;
export const defaultRetryDelay = 1000;
export const maxConcurrentTests = 10;
export const testMemoryThreshold = 100 * 1024 * 1024;

export const jestTestTimeout = 10000;
export const jestVerbose = getEnvVar('JEST_VERBOSE', 'false');
export const jestCoverage = getEnvVar('JEST_COVERAGE', 'false');
export const jestCache = getEnvVar('JEST_CACHE', 'true');
export const jestPassWithNoTests = 'true';

export const integrationTestTimeout = 60000;
export const integrationTestRetryAttempts = 5;
export const integrationTestRetryDelay = 5000;
export const integrationTestCleanupDelay = 1000;

export const performanceTestDuration = 30000;
export const performanceTestSamples = 1000;
export const performanceTestThreshold = 100;
