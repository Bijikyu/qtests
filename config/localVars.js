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

// Re-export from focused configuration modules for backward compatibility

// Environment and runtime configuration
export {
  nodeEnv,
  testMode,
  debugMode,
  runtimeNodeVersion,
  runtimePlatform,
  runtimeArch,
  devHotReload,
  devSourceMaps,
  devVerboseLogging,
  experimentalFeatures,
  experimentalParallelExecution,
  experimentalAdvancedMocking,
  legacyMode,
  legacyWarnings
} from './envConfig.js';

// Qtests-specific configuration
export {
  qtestsSilent,
  qtestsInband,
  qtestsFileWorkers,
  qtestsConcurrency,
  qtestsPattern,
  qtestsApiFallback,
  qtestsSuppressDebug,
  qtestsNoDebugFile,
  qtestsDebugFile
} from './qtestsConfig.js';

// Testing configuration
export {
  defaultTestTimeout,
  defaultRetryAttempts,
  defaultRetryDelay,
  maxConcurrentTests,
  testMemoryThreshold,
  jestTestTimeout,
  jestVerbose,
  jestCoverage,
  jestCache,
  jestPassWithNoTests,
  integrationTestTimeout,
  integrationTestRetryAttempts,
  integrationTestRetryDelay,
  integrationTestCleanupDelay,
  performanceTestDuration,
  performanceTestSamples,
  performanceTestThreshold
} from './testConfig.js';

// File system configuration
export {
  libDirectory,
  utilsDirectory,
  configDirectory,
  testsDirectory,
  stubsDirectory,
  distDirectory,
  buildDirectory,
  maxInputLength,
  maxFilePathLength,
  allowedFileExtensions,
  blockedPatterns
} from './fileSystemConfig.js';

// Mocking configuration
export {
  defaultMockStatusCode,
  defaultMockResponse,
  defaultMockHeaders,
  axiosStubTimeout,
  consoleMockLevels,
  consoleCaptureAll,
  stubModules,
  stubModulePaths
} from './mockConfig.js';

// System-level configuration
export {
  circuitBreakerDefaultTimeout,
  circuitBreakerDefaultThreshold,
  circuitBreakerDefaultResetTimeout,
  circuitBreakerFastTimeout,
  circuitBreakerSlowTimeout,
  rateLimitDefaultWindow,
  rateLimitDefaultMax,
  rateLimitStrictMax,
  rateLimitLenientMax,
  memoryCheckInterval,
  memoryLeakThreshold,
  memoryCleanupThreshold,
  maxMemoryUsage,
  validationDefaultMaxLength,
  validationDefaultMinLength,
  validationDefaultPattern,
  validationStrictMaxLength,
  validationRelaxedMaxLength,
  errorDefaultStatusCode,
  errorNotFoundStatusCode,
  errorBadRequestStatusCode,
  errorUnauthorizedStatusCode,
  errorForbiddenStatusCode,
  errorTimeoutStatusCode,
  logDefaultLevel,
  logLevels,
  logMaxMessageLength,
  logTimestampFormat,
  securityDefaultTokenExpiry,
  securityMaxTokenExpiry,
  securityDefaultSaltLength,
  securityDefaultKeyLength,
  redisUrl,
  redisCloudUrl
} from './systemConfig.js';