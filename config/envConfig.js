/**
 * Node Environment Variables Configuration
 * 
 * This module provides configuration for Node.js environment variables
 * and basic runtime settings used throughout the qtests module.
 */

// ==================== NODE ENVIRONMENT VARIABLES ====================
export const nodeEnv = process.env.NODE_ENV || 'development';
export const testMode = process.env.TEST_MODE || 'false';
export const debugMode = process.env.DEBUG_MODE || 'false';

// ==================== RUNTIME CONFIGURATION ====================
export const runtimeNodeVersion = process.version;
export const runtimePlatform = process.platform;
export const runtimeArch = process.arch;

// ==================== DEVELOPMENT CONSTANTS ====================
export const devHotReload = process.env.DEV_HOT_RELOAD || 'false';
export const devSourceMaps = process.env.DEV_SOURCE_MAPS || 'true';
export const devVerboseLogging = process.env.DEV_VERBOSE_LOGGING || 'false';

// ==================== EXPERIMENTAL FEATURES ====================
export const experimentalFeatures = process.env.EXPERIMENTAL_FEATURES || 'false';
export const experimentalParallelExecution = process.env.EXPERIMENTAL_PARALLEL || 'false';
export const experimentalAdvancedMocking = process.env.EXPERIMENTAL_MOCKING || 'false';

// ==================== LEGACY COMPATIBILITY CONSTANTS ====================
// REMOVE? These constants are kept for backward compatibility but may be removed in future versions
export const legacyMode = process.env.LEGACY_MODE || 'false';
export const legacyWarnings = process.env.LEGACY_WARNINGS || 'true';