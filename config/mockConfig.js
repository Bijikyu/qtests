/**
 * Mocking Configuration
 * 
 * This module provides configuration for mocking settings
 * including HTTP mocking, console mocking, and stub modules.
 */

// ==================== HTTP MOCKING CONSTANTS ====================
export const defaultMockStatusCode = 200;
export const defaultMockResponse = {};
export const defaultMockHeaders = { 'content-type': 'application/json' };
export const axiosStubTimeout = 100;

// ==================== CONSOLE MOCKING CONSTANTS ====================
export const consoleMockLevels = ['log', 'warn', 'error', 'info', 'debug'];
export const consoleCaptureAll = process.env.CONSOLE_CAPTURE_ALL || 'true';

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