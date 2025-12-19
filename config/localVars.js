/**
 * Local Variables and Environment Configuration
 * 
 * This file serves as the single source of truth for all environment variables
 * and hardcoded constants used throughout the qtests module.
 * 
 * IMPORTANT: Do not modify, delete, or move existing values.
 * New values should be added under appropriate existing categories
 * or new categories with clear comment headers.
 */

// ==================== NODE ENVIRONMENT VARIABLES ====================
export const nodeEnv = process.env.NODE_ENV || 'development';
export const testMode = process.env.TEST_MODE || 'false';
export const debugMode = process.env.DEBUG_MODE || 'false';

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

// ==================== FILE SYSTEM PATHS ====================
export const libDirectory = './lib';
export const utilsDirectory = './utils';
export const configDirectory = './config';
export const testsDirectory = './tests';
export const stubsDirectory = './stubs';
export const distDirectory = './dist';
export const buildDirectory = './build';

// ==================== HTTP MOCKING CONSTANTS ====================
export const defaultMockStatusCode = 200;
export const defaultMockResponse = {};
export const defaultMockHeaders = { 'content-type': 'application/json' };
export const axiosStubTimeout = 100;

// ==================== CONSOLE MOCKING CONSTANTS ====================
export const consoleMockLevels = ['log', 'warn', 'error', 'info', 'debug'];
export const consoleCaptureAll = process.env.CONSOLE_CAPTURE_ALL || 'true';

// ==================== CIRCUIT BREAKER CONSTANTS ====================
export const circuitBreakerDefaultTimeout = 60000;
export const circuitBreakerDefaultThreshold = 5;
export const circuitBreakerDefaultResetTimeout = 30000;
export const circuitBreakerFastTimeout = 10000;
export const circuitBreakerSlowTimeout = 120000;

// ==================== RATE LIMITING CONSTANTS ====================
export const rateLimitDefaultWindow = 60000; // 1 minute
export const rateLimitDefaultMax = 100;
export const rateLimitStrictMax = 10;
export const rateLimitLenientMax = 1000;

// ==================== MEMORY MONITORING CONSTANTS ====================
export const memoryCheckInterval = 5000; // 5 seconds
export const memoryLeakThreshold = 50 * 1024 * 1024; // 50MB
export const memoryCleanupThreshold = 200 * 1024 * 1024; // 200MB
export const maxMemoryUsage = 500 * 1024 * 1024; // 500MB

// ==================== VALIDATION CONSTANTS ====================
export const validationDefaultMaxLength = 1000;
export const validationDefaultMinLength = 1;
export const validationDefaultPattern = '^[\\w\\s\\-\\.@]+$';
export const validationStrictMaxLength = 100;
export const validationRelaxedMaxLength = 10000;

// ==================== ERROR HANDLING CONSTANTS ====================
export const errorDefaultStatusCode = 500;
export const errorNotFoundStatusCode = 404;
export const errorBadRequestStatusCode = 400;
export const errorUnauthorizedStatusCode = 401;
export const errorForbiddenStatusCode = 403;
export const errorTimeoutStatusCode = 408;

// ==================== LOGGING CONSTANTS ====================
export const logDefaultLevel = 'info';
export const logLevels = ['error', 'warn', 'info', 'debug'];
export const logMaxMessageLength = 1000;
export const logTimestampFormat = 'ISO';

// ==================== STUB MODULES CONFIGURATION ====================
export const stubModules = [
  'axios',
  'winston',
  'redis',
  'mongoose',
  'pg',
  'mysql',
  'aws-sdk'
];

export const stubModulePaths = {
  axios: './stubs/axios',
  winston: './stubs/winston',
  redis: './stubs/redis',
  mongoose: './stubs/mongoose',
  pg: './stubs/pg',
  mysql: './stubs/mysql',
  'aws-sdk': './stubs/aws-sdk'
};

// ==================== RUNTIME CONFIGURATION ====================
export const runtimeNodeVersion = process.version;
export const runtimePlatform = process.platform;
export const runtimeArch = process.arch;

// ==================== DEVELOPMENT CONSTANTS ====================
export const devHotReload = process.env.DEV_HOT_RELOAD || 'false';
export const devSourceMaps = process.env.DEV_SOURCE_MAPS || 'true';
export const devVerboseLogging = process.env.DEV_VERBOSE_LOGGING || 'false';

// ==================== INTEGRATION TESTING CONSTANTS ====================
export const integrationTestTimeout = 60000;
export const integrationTestRetryAttempts = 5;
export const integrationTestRetryDelay = 5000;
export const integrationTestCleanupDelay = 1000;

// ==================== PERFORMANCE TESTING CONSTANTS ====================
export const performanceTestDuration = 30000;
export const performanceTestSamples = 1000;
export const performanceTestThreshold = 100; // ms

// ==================== SECURITY CONSTANTS ====================
export const securityDefaultTokenExpiry = 3600; // 1 hour
export const securityMaxTokenExpiry = 86400; // 24 hours
export const securityDefaultSaltLength = 32;
export const securityDefaultKeyLength = 256;

// ==================== LEGACY COMPATIBILITY CONSTANTS ====================
// REMOVE? These constants are kept for backward compatibility but may be removed in future versions
export const legacyMode = process.env.LEGACY_MODE || 'false';
export const legacyWarnings = process.env.LEGACY_WARNINGS || 'true';

// ==================== REDIS CONFIGURATION ====================
export const redisUrl = process.env.REDIS_URL || '';
export const redisCloudUrl = process.env.REDISCLOUD_URL || '';

// ==================== EXPERIMENTAL FEATURES ====================
export const experimentalFeatures = process.env.EXPERIMENTAL_FEATURES || 'false';
export const experimentalParallelExecution = process.env.EXPERIMENTAL_PARALLEL || 'false';
export const experimentalAdvancedMocking = process.env.EXPERIMENTAL_MOCKING || 'false';