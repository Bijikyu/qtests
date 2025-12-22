/**
 * System Configuration
 * 
 * This module provides configuration for system-level settings
 * including circuit breakers, rate limiting, memory monitoring,
 * validation, error handling, logging, and security.
 */

// ==================== CIRCUIT BREAKER CONSTANTS ====================
export const circuitBreakerDefaultTimeout = 60000;
export const circuitBreakerDefaultThreshold = 5;
export const circuitBreakerDefaultResetTimeout = 30000;
export const circuitBreakerFastTimeout = 10000;
export const circuitBreakerSlowTimeout = 120000;

// ==================== RATE LIMITING CONSTANTS ====================
export const rateLimitDefaultWindow = 60000; // 1 minute
export const rateLimitDefaultMax = 100;
export const rateLimitStrictMax = 10;
export const rateLimitLenientMax = 1000;

// ==================== MEMORY MONITORING CONSTANTS ====================
export const memoryCheckInterval = 5000; // 5 seconds
export const memoryLeakThreshold = 50 * 1024 * 1024; // 50MB
export const memoryCleanupThreshold = 200 * 1024 * 1024; // 200MB
export const maxMemoryUsage = 500 * 1024 * 1024; // 500MB

// ==================== VALIDATION CONSTANTS ====================
export const validationDefaultMaxLength = 1000;
export const validationDefaultMinLength = 1;
export const validationDefaultPattern = '^[\\w\\s\\-\\.@]+$';
export const validationStrictMaxLength = 100;
export const validationRelaxedMaxLength = 10000;

// ==================== ERROR HANDLING CONSTANTS ====================
export const errorDefaultStatusCode = 500;
export const errorNotFoundStatusCode = 404;
export const errorBadRequestStatusCode = 400;
export const errorUnauthorizedStatusCode = 401;
export const errorForbiddenStatusCode = 403;
export const errorTimeoutStatusCode = 408;

// ==================== LOGGING CONSTANTS ====================
export const logDefaultLevel = 'info';
export const logLevels = ['error', 'warn', 'info', 'debug'];
export const logMaxMessageLength = 1000;
export const logTimestampFormat = 'ISO';

// ==================== SECURITY CONSTANTS ====================
export const securityDefaultTokenExpiry = 3600; // 1 hour
export const securityMaxTokenExpiry = 86400; // 24 hours
export const securityDefaultSaltLength = 32;
export const securityDefaultKeyLength = 256;

// ==================== REDIS CONFIGURATION ====================
export const redisUrl = process.env.REDIS_URL || '';
export const redisCloudUrl = process.env.REDISCLOUD_URL || '';