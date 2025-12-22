/**
 * Local Variables and Environment Configuration
 * 
 * This file serves as a unified export point for all configuration modules
 * used throughout the qtests module. It re-exports constants from focused
 * configuration modules to maintain backward compatibility.
 * 
 * IMPORTANT: Do not modify, delete, or move existing values.
 * New values should be added in the appropriate focused configuration modules.
 */

// Import JavaScript modules with proper ESM compatibility
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const envConfig = require('./envConfig.js');
const qtestsConfig = require('./qtestsConfig.js');
const testConfig = require('./testConfig.js');
const fileSystemConfig = require('./fileSystemConfig.js');
const mockConfig = require('./mockConfig.js');
const systemConfig = require('./systemConfig.js');

// Re-export from focused configuration modules for backward compatibility

// Environment and runtime configuration
export const nodeEnv = envConfig.nodeEnv;
export const testMode = envConfig.testMode;
export const debugMode = envConfig.debugMode;
export const runtimeNodeVersion = envConfig.runtimeNodeVersion;
export const runtimePlatform = envConfig.runtimePlatform;
export const runtimeArch = envConfig.runtimeArch;
export const devHotReload = envConfig.devHotReload;
export const devSourceMaps = envConfig.devSourceMaps;
export const devVerboseLogging = envConfig.devVerboseLogging;
export const experimentalFeatures = envConfig.experimentalFeatures;
export const experimentalParallelExecution = envConfig.experimentalParallelExecution;
export const experimentalAdvancedMocking = envConfig.experimentalAdvancedMocking;
export const legacyMode = envConfig.legacyMode;
export const legacyWarnings = envConfig.legacyWarnings;

// Qtests-specific configuration
export const qtestsSilent = qtestsConfig.qtestsSilent;
export const qtestsInband = qtestsConfig.qtestsInband;
export const qtestsFileWorkers = qtestsConfig.qtestsFileWorkers;
export const qtestsConcurrency = qtestsConfig.qtestsConcurrency;
export const qtestsPattern = qtestsConfig.qtestsPattern;
export const qtestsApiFallback = qtestsConfig.qtestsApiFallback;
export const qtestsSuppressDebug = qtestsConfig.qtestsSuppressDebug;
export const qtestsNoDebugFile = qtestsConfig.qtestsNoDebugFile;
export const qtestsDebugFile = qtestsConfig.qtestsDebugFile;

// Testing configuration
export const defaultTestTimeout = testConfig.defaultTestTimeout;
export const defaultRetryAttempts = testConfig.defaultRetryAttempts;
export const defaultRetryDelay = testConfig.defaultRetryDelay;
export const maxConcurrentTests = testConfig.maxConcurrentTests;
export const testMemoryThreshold = testConfig.testMemoryThreshold;
export const jestTestTimeout = testConfig.jestTestTimeout;
export const jestVerbose = testConfig.jestVerbose;
export const jestCoverage = testConfig.jestCoverage;
export const jestCache = testConfig.jestCache;
export const jestPassWithNoTests = testConfig.jestPassWithNoTests;
export const integrationTestTimeout = testConfig.integrationTestTimeout;
export const integrationTestRetryAttempts = testConfig.integrationTestRetryAttempts;
export const integrationTestRetryDelay = testConfig.integrationTestRetryDelay;
export const integrationTestCleanupDelay = testConfig.integrationTestCleanupDelay;
export const performanceTestDuration = testConfig.performanceTestDuration;
export const performanceTestSamples = testConfig.performanceTestSamples;
export const performanceTestThreshold = testConfig.performanceTestThreshold;

// File system configuration
export const libDirectory = fileSystemConfig.libDirectory;
export const utilsDirectory = fileSystemConfig.utilsDirectory;
export const configDirectory = fileSystemConfig.configDirectory;
export const testsDirectory = fileSystemConfig.testsDirectory;
export const stubsDirectory = fileSystemConfig.stubsDirectory;
export const distDirectory = fileSystemConfig.distDirectory;
export const buildDirectory = fileSystemConfig.buildDirectory;
export const maxInputLength = fileSystemConfig.maxInputLength;
export const maxFilePathLength = fileSystemConfig.maxFilePathLength;
export const allowedFileExtensions = fileSystemConfig.allowedFileExtensions;
export const blockedPatterns = fileSystemConfig.blockedPatterns;

// Mocking configuration
export const defaultMockStatusCode = mockConfig.defaultMockStatusCode;
export const defaultMockResponse = mockConfig.defaultMockResponse;
export const defaultMockHeaders = mockConfig.defaultMockHeaders;
export const axiosStubTimeout = mockConfig.axiosStubTimeout;
export const consoleMockLevels = mockConfig.consoleMockLevels;
export const consoleCaptureAll = mockConfig.consoleCaptureAll;
export const stubModules = mockConfig.stubModules;
export const stubModulePaths = mockConfig.stubModulePaths;

// System-level configuration
export const circuitBreakerDefaultTimeout = systemConfig.circuitBreakerDefaultTimeout;
export const circuitBreakerDefaultThreshold = systemConfig.circuitBreakerDefaultThreshold;
export const circuitBreakerDefaultResetTimeout = systemConfig.circuitBreakerDefaultResetTimeout;
export const circuitBreakerFastTimeout = systemConfig.circuitBreakerFastTimeout;
export const circuitBreakerSlowTimeout = systemConfig.circuitBreakerSlowTimeout;
export const rateLimitDefaultWindow = systemConfig.rateLimitDefaultWindow;
export const rateLimitDefaultMax = systemConfig.rateLimitDefaultMax;
export const rateLimitStrictMax = systemConfig.rateLimitStrictMax;
export const rateLimitLenientMax = systemConfig.rateLimitLenientMax;
export const memoryCheckInterval = systemConfig.memoryCheckInterval;
export const memoryLeakThreshold = systemConfig.memoryLeakThreshold;
export const memoryCleanupThreshold = systemConfig.memoryCleanupThreshold;
export const maxMemoryUsage = systemConfig.maxMemoryUsage;
export const validationDefaultMaxLength = systemConfig.validationDefaultMaxLength;
export const validationDefaultMinLength = systemConfig.validationDefaultMinLength;
export const validationDefaultPattern = systemConfig.validationDefaultPattern;
export const validationStrictMaxLength = systemConfig.validationStrictMaxLength;
export const validationRelaxedMaxLength = systemConfig.validationRelaxedMaxLength;
export const errorDefaultStatusCode = systemConfig.errorDefaultStatusCode;
export const errorNotFoundStatusCode = systemConfig.errorNotFoundStatusCode;
export const errorBadRequestStatusCode = systemConfig.errorBadRequestStatusCode;
export const errorUnauthorizedStatusCode = systemConfig.errorUnauthorizedStatusCode;
export const errorForbiddenStatusCode = systemConfig.errorForbiddenStatusCode;
export const errorTimeoutStatusCode = systemConfig.errorTimeoutStatusCode;
export const logDefaultLevel = systemConfig.logDefaultLevel;
export const logLevels = systemConfig.logLevels;
export const logMaxMessageLength = systemConfig.logMaxMessageLength;
export const logTimestampFormat = systemConfig.logTimestampFormat;
export const securityDefaultTokenExpiry = systemConfig.securityDefaultTokenExpiry;
export const securityMaxTokenExpiry = systemConfig.securityMaxTokenExpiry;
export const securityDefaultSaltLength = systemConfig.securityDefaultSaltLength;
export const securityDefaultKeyLength = systemConfig.securityDefaultKeyLength;
export const redisUrl = systemConfig.redisUrl;
export const redisCloudUrl = systemConfig.redisCloudUrl;

// Environment Variables and Global Constants
// ==================== ENVIRONMENT VARIABLES ====================

export const CODEX = process.env.CODEX;
export const OFFLINE_MODE = process.env.OFFLINE_MODE;
export const NODE_ENV = process.env.NODE_ENV;
export const JEST_WORKER_ID = process.env.JEST_WORKER_ID;
export const QTESTS_PARALLEL_MODE = process.env.QTESTS_PARALLEL_MODE;
export const QTESTS_SILENT = process.env.QTESTS_SILENT;
export const INIT_CWD = process.env.INIT_CWD;