import './init.js';
import { getEnvVar } from '../utils/helpers/envManager.js';

export const circuitBreakerDefaultTimeout = 60000;
export const circuitBreakerDefaultThreshold = 5;
export const circuitBreakerDefaultResetTimeout = 30000;
export const circuitBreakerFastTimeout = 10000;
export const circuitBreakerSlowTimeout = 120000;

export const rateLimitDefaultWindow = 60000;
export const rateLimitDefaultMax = 100;
export const rateLimitStrictMax = 10;
export const rateLimitLenientMax = 1000;

export const memoryCheckInterval = 5000;
export const memoryLeakThreshold = 50 * 1024 * 1024;
export const memoryCleanupThreshold = 200 * 1024 * 1024;
export const maxMemoryUsage = 500 * 1024 * 1024;

export const validationDefaultMaxLength = 1000;
export const validationDefaultMinLength = 1;
export const validationDefaultPattern = '^[\\w\\s\\-\\.@]+$';
export const validationStrictMaxLength = 100;
export const validationRelaxedMaxLength = 10000;

export const errorDefaultStatusCode = 500;
export const errorNotFoundStatusCode = 404;
export const errorBadRequestStatusCode = 400;
export const errorUnauthorizedStatusCode = 401;
export const errorForbiddenStatusCode = 403;
export const errorTimeoutStatusCode = 408;

export const logDefaultLevel = 'info';
export const logLevels = ['error', 'warn', 'info', 'debug'];
export const logMaxMessageLength = 1000;
export const logTimestampFormat = 'ISO';

export const securityDefaultTokenExpiry = 3600;
export const securityMaxTokenExpiry = 86400;
export const securityDefaultSaltLength = 32;
export const securityDefaultKeyLength = 256;

export const redisUrl = getEnvVar('REDIS_URL', '');
export const redisCloudUrl = getEnvVar('REDISCLOUD_URL', '');

