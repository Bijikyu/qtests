/**
 * Security Utilities and Helpers
 *
 * Collection of utility functions and helpers for security
 * operations across the qtests framework. Provides common
 * security patterns, validation helpers, and integration utilities.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { securityMonitor, SecurityEventType, SecuritySeverity } from './SecurityMonitor.js';
import { securityValidator } from './SecurityValidator.js';
/**
 * Security utility class with common operations
 */
export class SecurityUtils {
    /**
     * Generate secure random token
     */
    static generateSecureToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }
    /**
     * Generate secure hash of data
     */
    static generateSecureHash(data, algorithm = 'sha256') {
        return crypto.createHash(algorithm).update(data).digest('hex');
    }
    /**
     * Validate and sanitize file path securely
     */
    static validateFilePath(filePath, allowedDirs = []) {
        try {
            // Basic validation
            if (!filePath || typeof filePath !== 'string') {
                return { valid: false, error: 'Invalid file path' };
            }
            // Check for path traversal attempts
            const normalizedPath = path.normalize(filePath);
            if (normalizedPath.includes('..') || normalizedPath.includes('\0')) {
                securityMonitor.logEvent({
                    type: SecurityEventType.PATH_TRAVERSAL_ATTEMPT,
                    severity: SecuritySeverity.HIGH,
                    source: 'security_utils',
                    details: { originalPath: filePath, normalizedPath },
                    blocked: true,
                    remediation: 'Path traversal attempt detected and blocked'
                });
                return { valid: false, error: 'Path traversal detected' };
            }
            // Check if path is within allowed directories
            if (allowedDirs.length > 0) {
                const resolvedPath = path.resolve(normalizedPath);
                const isAllowed = allowedDirs.some(allowedDir => resolvedPath.startsWith(path.resolve(allowedDir)));
                if (!isAllowed) {
                    return { valid: false, error: 'Path not in allowed directories' };
                }
            }
            return { valid: true, safePath: normalizedPath };
        }
        catch (error) {
            return { valid: false, error: `Path validation error: ${String(error)}` };
        }
    }
    /**
     * Secure file deletion with validation
     */
    static secureDelete(filePath, allowedDirs = []) {
        return new Promise((resolve) => {
            const validation = this.validateFilePath(filePath, allowedDirs);
            if (!validation.valid) {
                resolve({ success: false, error: validation.error });
                return;
            }
            const safePath = validation.safePath;
            // Additional safety checks
            if (safePath === '/' || safePath.includes(process.cwd())) {
                resolve({ success: false, error: 'Unsafe deletion path' });
                return;
            }
            fs.unlink(safePath, (error) => {
                if (error) {
                    resolve({ success: false, error: `Deletion failed: ${String(error)}` });
                }
                else {
                    resolve({ success: true });
                }
            });
        });
    }
    /**
     * Validate JSON with security context
     */
    static validateJSON(jsonString, context = 'unknown') {
        try {
            const data = JSON.parse(jsonString);
            // Security validations
            if (data && typeof data === 'object') {
                // Check for prototype pollution
                if (data.hasOwnProperty('__proto__') ||
                    data.hasOwnProperty('constructor') ||
                    data.hasOwnProperty('prototype')) {
                    securityMonitor.logEvent({
                        type: SecurityEventType.JSON_INJECTION_ATTEMPT,
                        severity: SecuritySeverity.HIGH,
                        source: 'security_utils',
                        details: { context, data: JSON.stringify(data) },
                        blocked: true,
                        remediation: 'Prototype pollution attempt detected in JSON'
                    });
                    return { valid: false, error: 'Prototype pollution detected' };
                }
                // Check for dangerous nested objects
                const dangerousKeys = this.scanForDangerousKeys(data);
                if (dangerousKeys.length > 0) {
                    return { valid: false, error: `Dangerous keys detected: ${dangerousKeys.join(', ')}` };
                }
            }
            return { valid: true, data };
        }
        catch (error) {
            return { valid: false, error: `JSON parsing error: ${String(error)}` };
        }
    }
    /**
     * Scan object for dangerous keys
     */
    static scanForDangerousKeys(obj, depth = 0, maxDepth = 10) {
        if (depth > maxDepth)
            return [];
        const dangerousKeys = [];
        const suspiciousPatterns = [
            '__proto__', 'constructor', 'prototype',
            'eval', 'function', 'script',
            'innerHTML', 'outerHTML', 'document',
            'window', 'global', 'process'
        ];
        for (const [key, value] of Object.entries(obj)) {
            if (suspiciousPatterns.some(pattern => key.toLowerCase().includes(pattern.toLowerCase()))) {
                dangerousKeys.push(key);
            }
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                dangerousKeys.push(...this.scanForDangerousKeys(value, depth + 1, maxDepth));
            }
        }
        return [...new Set(dangerousKeys)]; // Remove duplicates
    }
    /**
     * Generate secure temporary filename
     */
    static generateSecureTempFilename(prefix = 'qtests', extension = '.tmp') {
        const timestamp = Date.now();
        const random = this.generateSecureToken(8);
        return `${prefix}_${timestamp}_${random}${extension}`;
    }
    /**
     * Check if string contains suspicious patterns
     */
    static containsSuspiciousPatterns(input) {
        const suspiciousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /on\w+\s*=/gi,
            /expression\s*\(/gi,
            /@import/gi,
            /binding\s*:/gi,
            /\$\{\{.*\}\}/g, // Template injection
            /__proto__/gi,
            /constructor/gi,
            /prototype/gi
        ];
        const foundPatterns = [];
        let suspicious = false;
        for (const pattern of suspiciousPatterns) {
            if (pattern.test(input)) {
                foundPatterns.push(pattern.source);
                suspicious = true;
            }
        }
        return { suspicious, patterns: foundPatterns };
    }
    /**
     * Create secure error response
     */
    static createSecureErrorResponse(message, code = 'SECURITY_ERROR') {
        const errorId = this.generateSecureToken(8);
        securityMonitor.logEvent({
            type: SecurityEventType.UNAUTHORIZED_ACCESS,
            severity: SecuritySeverity.MEDIUM,
            source: 'security_utils',
            details: { message, code, errorId },
            blocked: false,
            remediation: 'Security error response generated'
        });
        return {
            success: false,
            error: {
                code,
                message: 'Security validation failed',
                timestamp: new Date().toISOString(),
                requestId: errorId
            }
        };
    }
    /**
     * Rate limiting helper with exponential backoff
     */
    static createRateLimiter(options) {
        const attempts = new Map();
        return {
            checkLimit: (identifier) => {
                const now = Date.now();
                const record = attempts.get(identifier) || { count: 0, lastAttempt: 0 };
                // Check if currently blocked
                if (record.blockedUntil && now < record.blockedUntil) {
                    return {
                        allowed: false,
                        retryAfter: record.blockedUntil - now,
                        reason: 'Rate limit active'
                    };
                }
                // Reset window if expired
                if (now - record.lastAttempt > options.windowMs) {
                    record.count = 0;
                }
                // Check limit
                if (record.count >= options.maxRequests) {
                    let backoffTime = options.backoffMs || 1000;
                    // Exponential backoff
                    const backoffMultiplier = Math.min(record.count - options.maxRequests + 1, 10);
                    backoffTime = Math.min(backoffTime * Math.pow(2, backoffMultiplier), options.maxBackoffMs || 60000);
                    record.blockedUntil = now + backoffTime;
                    attempts.set(identifier, record);
                    securityMonitor.logEvent({
                        type: SecurityEventType.RATE_LIMIT_EXCEEDED,
                        severity: SecuritySeverity.MEDIUM,
                        source: 'security_utils',
                        details: { identifier, count: record.count, backoffTime },
                        blocked: true,
                        remediation: `Rate limit exceeded. Retry after ${backoffTime}ms`
                    });
                    return {
                        allowed: false,
                        retryAfter: backoffTime,
                        reason: 'Rate limit exceeded'
                    };
                }
                // Increment count and update
                record.count++;
                record.lastAttempt = now;
                record.blockedUntil = undefined;
                attempts.set(identifier, record);
                return { allowed: true };
            },
            reset: (identifier) => {
                attempts.delete(identifier);
            }
        };
    }
    /**
     * Secure environment variable getter
     */
    static getSecureEnvVar(key) {
        // Validate key format
        if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
            securityMonitor.logEvent({
                type: SecurityEventType.ENVIRONMENT_POLLUTION_ATTEMPT,
                severity: SecuritySeverity.MEDIUM,
                source: 'security_utils',
                details: { key },
                blocked: true,
                remediation: 'Invalid environment variable key format'
            });
            return undefined;
        }
        const value = process.env[key];
        // Validate value if present
        if (value !== undefined) {
            const validation = securityValidator.validateEnvironmentVariable(key);
            if (!validation.valid) {
                securityMonitor.logEvent({
                    type: SecurityEventType.ENVIRONMENT_POLLUTION_ATTEMPT,
                    severity: SecuritySeverity.MEDIUM,
                    source: 'security_utils',
                    details: { key, value: value.substring(0, 100) },
                    blocked: true,
                    remediation: 'Environment variable validation failed'
                });
                return undefined;
            }
        }
        return value;
    }
    /**
     * Create secure response headers
     */
    static createSecureHeaders(additionalHeaders = {}) {
        const baseHeaders = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
        };
        return { ...baseHeaders, ...additionalHeaders };
    }
    /**
     * Validate API key format
     */
    static validateApiKey(apiKey, pattern) {
        if (!apiKey || typeof apiKey !== 'string') {
            return { valid: false, error: 'API key is required and must be a string' };
        }
        // Length validation
        if (apiKey.length < 8) {
            return { valid: false, error: 'API key too short (minimum 8 characters)' };
        }
        if (apiKey.length > 512) {
            return { valid: false, error: 'API key too long (maximum 512 characters)' };
        }
        // Pattern validation if provided
        if (pattern && !pattern.test(apiKey)) {
            return { valid: false, error: 'API key does not match required pattern' };
        }
        // Check for common weak patterns
        const weakPatterns = [
            /^(.)\1+$/, // Repeated characters
            /^(test|demo|example|sample)/i, // Test/demo keys
            /^(123|password|admin|user)/i // Common weak keys
        ];
        for (const weakPattern of weakPatterns) {
            if (weakPattern.test(apiKey)) {
                securityMonitor.logEvent({
                    type: SecurityEventType.UNAUTHORIZED_ACCESS,
                    severity: SecuritySeverity.LOW,
                    source: 'security_utils',
                    details: { apiKey: apiKey.substring(0, 8) + '...' },
                    blocked: false,
                    remediation: 'Weak API key pattern detected'
                });
                return { valid: false, error: 'API key appears to be weak or for testing' };
            }
        }
        return { valid: true };
    }
    /**
     * Security audit helper
     */
    static createSecurityAudit() {
        const timestamp = new Date().toISOString();
        // System information (sanitized)
        const systemInfo = {
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
            memory: process.memoryUsage(),
            uptime: process.uptime()
        };
        // Security status from monitor
        const securityMetrics = securityMonitor.getSecurityMetrics();
        const securityStatus = {
            totalEvents: securityMetrics.totalEvents,
            activeRateLimits: securityMetrics.rateLimitStats.activeLimits,
            blockedRequests: securityMetrics.rateLimitStats.blockedRequests,
            recentVulnerabilities: securityMetrics.recentEvents.filter(event => event.severity === 'high' || event.severity === 'critical').length
        };
        // Generate recommendations
        const recommendations = [];
        if (securityStatus.totalEvents > 100) {
            recommendations.push('Consider implementing automated security incident response');
        }
        if (securityStatus.activeRateLimits > 10) {
            recommendations.push('High rate limit activity detected - investigate potential attacks');
        }
        if (securityStatus.recentVulnerabilities > 5) {
            recommendations.push('Multiple recent vulnerabilities - immediate security review required');
        }
        return {
            timestamp,
            systemInfo,
            securityStatus,
            recommendations
        };
    }
}
// Convenience exports
export const generateSecureToken = (length) => SecurityUtils.generateSecureToken(length);
export const generateSecureHash = (data, algorithm) => SecurityUtils.generateSecureHash(data, algorithm);
export const validateFilePath = (filePath, allowedDirs) => SecurityUtils.validateFilePath(filePath, allowedDirs);
export const secureDelete = (filePath, allowedDirs) => SecurityUtils.secureDelete(filePath, allowedDirs);
export const validateJSON = (jsonString, context) => SecurityUtils.validateJSON(jsonString, context);
export const containsSuspiciousPatterns = (input) => SecurityUtils.containsSuspiciousPatterns(input);
export const createSecureErrorResponse = (message, code) => SecurityUtils.createSecureErrorResponse(message, code);
export const createRateLimiter = (options) => SecurityUtils.createRateLimiter(options);
export const getSecureEnvVar = (key) => SecurityUtils.getSecureEnvVar(key);
export const createSecureHeaders = (headers) => SecurityUtils.createSecureHeaders(headers);
export const validateApiKey = (apiKey, pattern) => SecurityUtils.validateApiKey(apiKey, pattern);
export const createSecurityAudit = () => SecurityUtils.createSecurityAudit();
