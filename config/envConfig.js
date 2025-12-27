/**
 * Node Environment Variables Configuration
 * 
 * This module provides configuration for Node.js environment variables
 * and basic runtime settings used throughout the qtests module.
 */

// Production-ready fallback error handling to avoid qerrors dependency issues
const qerrorsFallback = (error, message, context) => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    message: message || error.message,
    stack: error.stack,
    context: context || {}
  };
  
  console.error('[QERRORS]', JSON.stringify(errorInfo, null, 2));
  
  throw error;
};

// ==================== NODE ENVIRONMENT VARIABLES ====================
export const nodeEnv = (() => {
  try {
    return process.env.NODE_ENV || 'development';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.nodeEnv: reading NODE_ENV');
    return 'development';
  }
})();

export const testMode = (() => {
  try {
    return process.env.TEST_MODE || 'false';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.testMode: reading TEST_MODE');
    return 'false';
  }
})();

export const debugMode = (() => {
  try {
    return process.env.DEBUG_MODE || 'false';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.debugMode: reading DEBUG_MODE');
    return 'false';
  }
})();

// ==================== RUNTIME CONFIGURATION ====================
export const runtimeNodeVersion = (() => {
  try {
    return process.version;
  } catch (error) {
    qerrorsFallback(error, 'envConfig.runtimeNodeVersion: reading process.version');
    return 'unknown';
  }
})();

export const runtimePlatform = (() => {
  try {
    return process.platform;
  } catch (error) {
    qerrorsFallback(error, 'envConfig.runtimePlatform: reading process.platform');
    return 'unknown';
  }
})();

export const runtimeArch = (() => {
  try {
    return process.arch;
  } catch (error) {
    qerrorsFallback(error, 'envConfig.runtimeArch: reading process.arch');
    return 'unknown';
  }
})();

// ==================== DEVELOPMENT CONSTANTS ====================
export const devHotReload = (() => {
  try {
    return process.env.DEV_HOT_RELOAD || 'false';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.devHotReload: reading DEV_HOT_RELOAD');
    return 'false';
  }
})();

export const devSourceMaps = (() => {
  try {
    return process.env.DEV_SOURCE_MAPS || 'true';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.devSourceMaps: reading DEV_SOURCE_MAPS');
    return 'true';
  }
})();

export const devVerboseLogging = (() => {
  try {
    return process.env.DEV_VERBOSE_LOGGING || 'false';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.devVerboseLogging: reading DEV_VERBOSE_LOGGING');
    return 'false';
  }
})();

// ==================== EXPERIMENTAL FEATURES ====================
export const experimentalFeatures = (() => {
  try {
    return process.env.EXPERIMENTAL_FEATURES || 'false';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.experimentalFeatures: reading EXPERIMENTAL_FEATURES');
    return 'false';
  }
})();

export const experimentalParallelExecution = (() => {
  try {
    return process.env.EXPERIMENTAL_PARALLEL || 'false';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.experimentalParallelExecution: reading EXPERIMENTAL_PARALLEL');
    return 'false';
  }
})();

export const experimentalAdvancedMocking = (() => {
  try {
    return process.env.EXPERIMENTAL_MOCKING || 'false';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.experimentalAdvancedMocking: reading EXPERIMENTAL_MOCKING');
    return 'false';
  }
})();

// ==================== LEGACY COMPATIBILITY CONSTANTS ====================
// REMOVE? These constants are kept for backward compatibility but may be removed in future versions
export const legacyMode = (() => {
  try {
    return process.env.LEGACY_MODE || 'false';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.legacyMode: reading LEGACY_MODE');
    return 'false';
  }
})();

export const legacyWarnings = (() => {
  try {
    return process.env.LEGACY_WARNINGS || 'true';
  } catch (error) {
    qerrorsFallback(error, 'envConfig.legacyWarnings: reading LEGACY_WARNINGS');
    return 'true';
  }
})();