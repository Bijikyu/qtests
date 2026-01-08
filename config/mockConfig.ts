import './init.js';
import { getEnvVar } from '../utils/helpers/envManager.js';

export const defaultMockStatusCode = 200;
export const defaultMockResponse: Record<string, any> = {};
export const defaultMockHeaders = { 'content-type': 'application/json' };
export const axiosStubTimeout = 100;
export const consoleMockLevels = ['log', 'warn', 'error', 'info', 'debug'];
export const consoleCaptureAll = getEnvVar('CONSOLE_CAPTURE_ALL', 'true');
export const stubModules = ['axios', 'winston', 'redis', 'mongoose', 'pg', 'mysql', 'aws-sdk'];
export const stubModulePaths: Record<string, string> = {
  axios: 'axios',
  winston: 'winston',
  redis: 'redis',
  mongoose: 'mongoose',
  pg: 'pg',
  mysql: 'mysql',
  'aws-sdk': 'aws-sdk'
};

