/**
 * Environment Configuration for qtests Framework
 * 
 * This module centralizes all environment variable handling and provides
 * default values for development, testing, and production scenarios. It ensures
 * consistent behavior across different environments while allowing for
 * environment-specific customization.
 * 
 * Design philosophy:
 * - Provide sensible defaults that work out-of-the-box
 * - Use environment variables for runtime configuration
 * - Maintain backward compatibility with existing setups
 * - Support both development and production use cases
 * 
 * Environment variable naming conventions:
 * - UPPER_CASE with underscores for readability
 * - Descriptive names that clearly indicate purpose
 * - Boolean values use 'true'/'false' strings for consistency
 */

import './init.js';
import { getEnvVar } from '../dist/utils/helpers/envManager.js';

// ============================================================================
// BASIC ENVIRONMENT SETTINGS
// ============================================================================

/**
 * Current Node.js environment (development, production, test)
 * Affects logging levels, error handling, and optimization settings
 * Default: 'development' - provides verbose logging and debugging features
 */
export const nodeEnv = getEnvVar('NODE_ENV', 'development');

/**
 * Flag indicating if the application is running in test mode
 * Enables test-specific behaviors like mocking and reduced logging
 * Default: 'false' - normal application behavior
 */
export const testMode = getEnvVar('TEST_MODE', 'false');

/**
 * Flag for enabling debug mode with enhanced logging and error details
 * Useful for development and troubleshooting production issues
 * Default: 'false' - standard logging level
 */
export const debugMode = getEnvVar('DEBUG_MODE', 'false');

// ============================================================================
// RUNTIME INFORMATION
// ============================================================================

/**
 * Current Node.js version string
 * Used for compatibility checks and feature detection
 * Fallback: 'unknown' - when version cannot be determined
 */
export const runtimeNodeVersion = process.version || 'unknown';

/**
 * Current operating system platform
 * Affects file system behavior, path handling, and system-specific features
 * Fallback: 'unknown' - when platform cannot be determined
 */
export const runtimePlatform = process.platform || 'unknown';

/**
 * Current system architecture (x64, arm64, etc.)
 * Used for binary compatibility and performance optimizations
 * Fallback: 'unknown' - when architecture cannot be determined
 */
export const runtimeArch = process.arch || 'unknown';

// ============================================================================
// DEVELOPMENT CONFIGURATION
// ============================================================================

/**
 * Enable hot reload functionality during development
 * Automatically restarts the server when code changes are detected
 * Default: 'false' - hot reload disabled for stability
 */
export const devHotReload = getEnvVar('DEV_HOT_RELOAD', 'false');

/**
 * Enable source map generation for debugging
 * Provides better stack traces and debugging information
 * Default: 'true' - source maps enabled for development experience
 */
export const devSourceMaps = getEnvVar('DEV_SOURCE_MAPS', 'true');

/**
 * Enable verbose logging for development debugging
 * Outputs detailed information about internal operations
 * Default: 'false' - standard logging to reduce noise
 */
export const devVerboseLogging = getEnvVar('DEV_VERBOSE_LOGGING', 'false');

// ============================================================================
// EXPERIMENTAL FEATURES
// ============================================================================

/**
 * Master switch for experimental features
 * Allows safe testing of new functionality without affecting stability
 * Default: 'false' - experimental features disabled for production safety
 */
export const experimentalFeatures = getEnvVar('EXPERIMENTAL_FEATURES', 'false');

/**
 * Enable parallel test execution for improved performance
 * Runs multiple test files simultaneously when supported
 * Default: 'false' - sequential execution for reliability
 */
export const experimentalParallelExecution = getEnvVar('EXPERIMENTAL_PARALLEL', 'false');

/**
 * Enable advanced mocking capabilities for complex scenarios
 * Provides more sophisticated stubbing and mocking features
 * Default: 'false' - standard mocking for compatibility
 */
export const experimentalAdvancedMocking = getEnvVar('EXPERIMENTAL_MOCKING', 'false');

// ============================================================================
// LEGACY MODE CONFIGURATION
// ============================================================================

/**
 * Enable legacy mode for backward compatibility
 * Maintains older behavior patterns for existing test suites
 * Default: 'false' - modern behavior enabled
 */
export const legacyMode = getEnvVar('LEGACY_MODE', 'false');

/**
 * Enable legacy compatibility warnings
 * Notifies developers when deprecated features are being used
 * Default: 'true' - warnings enabled to encourage migration
 */
export const legacyWarnings = getEnvVar('LEGACY_WARNINGS', 'true');