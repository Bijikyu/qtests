/**
 * Mocking Configuration using Jest built-in
 * 
 * This module provides mocking configuration that leverages Jest's built-in
 * mocking capabilities where possible, with only qtests-specific custom settings.
 */

// ==================== HTTP MOCKING CONSTANTS ====================
export const defaultMockStatusCode = 200;
export const defaultMockResponse = {};
export const defaultMockHeaders = { 'content-type': 'application/json' };
export const axiosStubTimeout = 100;

// Load environment variables for mock configuration
import { config } from 'dotenv';
config();

// ==================== CONSOLE MOCKING CONSTANTS ====================
// Most console mocking is now handled by Jest's built-in console mocking
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