/**
 * Environment Configuration using dotenv
 * 
 * This module provides streamlined environment configuration using dotenv
 * for industry-standard environment variable management.
 */

import { config } from 'dotenv';

// Load environment variables from .env file
config();

// ==================== NODE ENVIRONMENT VARIABLES ====================
export const nodeEnv = process.env.NODE_ENV || 'development';
export const testMode = process.env.TEST_MODE || 'false';
export const debugMode = process.env.DEBUG_MODE || 'false';

// ==================== RUNTIME CONFIGURATION ====================
export const runtimeNodeVersion = process.version || 'unknown';
export const runtimePlatform = process.platform || 'unknown';
export const runtimeArch = process.arch || 'unknown';

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