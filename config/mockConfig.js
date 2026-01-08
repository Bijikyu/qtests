/**
 * Mocking Configuration for qtests Framework
 * 
 * This module defines default mocking behavior and configuration for the qtests
 * framework. It provides centralized control over how external dependencies are
 * mocked during testing to ensure consistent and predictable test environments.
 * 
 * Design principles:
 * - Provide sensible defaults for common mocking scenarios
 * - Allow environment-based overrides for flexibility
 * - Support both Jest and custom mocking implementations
 * - Maintain backward compatibility with existing test suites
 * 
 * Why these defaults matter:
 * - HTTP status codes: Most API tests expect successful responses (200)
 * - Response structure: Empty objects prevent undefined errors in tests
 * - Console capture: Comprehensive logging aids in debugging test failures
 * - Module stubbing: Predefined list covers most common external dependencies
 */

import './init.js';
import { getEnvVar } from '../dist/utils/helpers/envManager.js';

/**
 * Default HTTP status code for mocked responses
 * Used when axios requests are stubbed and no specific status is provided
 * Rationale: 200 (OK) represents successful HTTP responses in most test scenarios
 */
export const defaultMockStatusCode = 200;

/**
 * Default response body for mocked API calls
 * Provides a safe fallback when no specific response data is configured
 * Rationale: Empty object prevents undefined errors while being JSON-serializable
 */
export const defaultMockResponse = {};

/**
 * Default HTTP headers for mocked responses
 * Ensures consistent content type handling across mocked API calls
 * Rationale: JSON content type is most common for modern API testing
 */
export const defaultMockHeaders = { 'content-type': 'application/json' };

/**
 * Timeout duration for axios stub operations in milliseconds
 * Prevents tests from hanging when stubbed requests don't complete properly
 * Rationale: 100ms is fast enough for tests but allows for realistic async behavior
 */
export const axiosStubTimeout = 100;

/**
 * Console method levels to capture during testing
 * Defines which console methods should be intercepted and stored for inspection
 * Rationale: Comprehensive coverage ensures all important log levels are captured
 */
export const consoleMockLevels = ['log', 'warn', 'error', 'info', 'debug'];

/**
 * Environment flag to control console capture behavior
 * When true, captures all console output for test verification
 * When false, allows console output to pass through normally
 * Rationale: Provides flexibility between debugging and clean test output
 */
export const consoleCaptureAll = getEnvVar('CONSOLE_CAPTURE_ALL', 'true');

/**
 * List of modules that should be automatically stubbed during testing
 * These modules commonly cause side effects or network dependencies in tests
 * Rationale: Predefined list covers most common external dependencies that need mocking
 */
export const stubModules = ['axios', 'winston', 'redis', 'mongoose', 'pg', 'mysql', 'aws-sdk'];

/**
 * Module path mapping for automatic stub resolution
 * Maps module names to their actual import paths for proper stubbing
 * Rationale: Ensures correct module resolution even when packages have different structures
 */
export const stubModulePaths = {
    axios: 'axios',
    winston: 'winston',
    redis: 'redis',
    mongoose: 'mongoose',
    pg: 'pg',
    mysql: 'mysql',
    'aws-sdk': 'aws-sdk'
};