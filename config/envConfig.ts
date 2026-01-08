import './init.js';
import { getEnvVar } from '../utils/helpers/envManager.js';

export const nodeEnv = getEnvVar('NODE_ENV', 'development');
export const testMode = getEnvVar('TEST_MODE', 'false');
export const debugMode = getEnvVar('DEBUG_MODE', 'false');

export const runtimeNodeVersion = process.version || 'unknown';
export const runtimePlatform = process.platform || 'unknown';
export const runtimeArch = process.arch || 'unknown';

export const devHotReload = getEnvVar('DEV_HOT_RELOAD', 'false');
export const devSourceMaps = getEnvVar('DEV_SOURCE_MAPS', 'true');
export const devVerboseLogging = getEnvVar('DEV_VERBOSE_LOGGING', 'false');

export const experimentalFeatures = getEnvVar('EXPERIMENTAL_FEATURES', 'false');
export const experimentalParallelExecution = getEnvVar('EXPERIMENTAL_PARALLEL', 'false');
export const experimentalAdvancedMocking = getEnvVar('EXPERIMENTAL_MOCKING', 'false');

export const legacyMode = getEnvVar('LEGACY_MODE', 'false');
export const legacyWarnings = getEnvVar('LEGACY_WARNINGS', 'true');

