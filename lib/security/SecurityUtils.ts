/**
 * Security Utilities and Helpers
 * 
 * Collection of security utility functions and helpers
 * for qtests security framework.
 */

import crypto from 'crypto';

/**
 * Security utilities class
 */
export class SecurityUtils {
  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate secure hash of data
   */
  static generateSecureHash(data: string, algorithm: string = 'sha256'): string {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  /**
   * Generate secure hash (direct function)
   */
  static generateSecureHashDirect(data: string, algorithm: string = 'sha256'): string {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  /**
   * Validate and sanitize file path securely
   */
  static validateFilePath(filePath: string, allowedDirs: string[] = []): { valid: boolean; safePath?: string; error?: string } {
    try {
      if (!filePath || typeof filePath !== 'string') {
        return { valid: false, error: 'Invalid file path' };
      }

      // Check for path traversal attempts
      const normalizedPath = filePath.replace(/[/\\\\]+/g, '/');
      if (normalizedPath.includes('..') || normalizedPath.includes('\0')) {
        return { valid: false, error: 'Path traversal detected' };
      }

      // Check if path is within allowed directories
      if (allowedDirs.length > 0) {
        const resolvedPath = require('path').resolve(normalizedPath);
        const isAllowed = allowedDirs.some(allowedDir => 
          resolvedPath.startsWith(require('path').resolve(allowedDir))
        );
        
        if (!isAllowed) {
          return { valid: false, error: 'Path not in allowed directories' };
        }
      }

      return { valid: true, safePath: normalizedPath };
    } catch (error) {
      return { valid: false, error: `Path validation error: ${String(error)}` };
    }
  }

  /**
   * Validate JSON with security context
   */
  static validateJSON(jsonString: string, context: string = 'unknown'): { valid: boolean; data?: any; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      
      // Check for prototype pollution
      if (data && typeof data === 'object') {
        if (data.hasOwnProperty('__proto__') || 
            data.hasOwnProperty('constructor') || 
            data.hasOwnProperty('prototype')) {
          return { valid: false, error: 'Prototype pollution detected' };
        }
      }

      return { valid: true, data };
    } catch (error) {
      return { valid: false, error: `JSON parsing error: ${String(error)}` };
    }
  }

  /**
   * Check if string contains suspicious patterns
   */
  static containsSuspiciousPatterns(input: string): { suspicious: boolean; patterns: RegExp[] } {
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
      /prototype/gi,
      /innerHTML/gi,
      /outerHTML/gi,
      /document/gi,
      /window/gi,
      /global/gi,
      /process/gi
    ];

    const foundPatterns: RegExp[] = [];
    let suspicious = false;
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(input)) {
        foundPatterns.push(pattern);
        suspicious = true;
      }
    }

    return { suspicious, patterns: foundPatterns };
  }

  /**
   * Create secure error response
   */
  static createSecureErrorResponse(message: string, code: string = 'SECURITY_ERROR'): {
    success: false;
    error: {
      code: string;
      message: string;
      timestamp: string;
      requestId?: string;
    };
  } {
    return {
      success: false,
      error: {
        code,
        message,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Rate limiting helper with exponential backoff
   */
  static createRateLimiter(options: {
    windowMs: number;
    maxRequests: number;
    backoffMs?: number;
    maxBackoffMs?: number;
  }) {
    const attempts = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>();
    
    return {
      checkLimit: (identifier: string): { allowed: boolean; retryAfter?: number; reason?: string } => {
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
          record.lastAttempt = now;
          record.blockedUntil = undefined;
        }

        // Check limit
        if (record.count >= options.maxRequests) {
          let backoffTime = options.backoffMs || 1000;
          
          // Exponential backoff
          const backoffMultiplier = Math.min(record.count - options.maxRequests + 1, 10);
          backoffTime = Math.min(backoffTime * Math.pow(2, backoffMultiplier), options.maxBackoffMs || 60000);
          
          record.blockedUntil = now + backoffTime;
          attempts.set(identifier, record);

          return { 
            allowed: false, 
            retryAfter: backoffTime, 
            reason: 'Rate limit exceeded' 
          };
        }

        // Increment count and update
        record.count++;
        record.lastAttempt = now;
        attempts.set(identifier, record);

        return { allowed: true };
      },

      reset: (identifier: string) => {
        attempts.delete(identifier);
      }
    };
  }

  /**
   * Get secure environment variable
   */
  static getSecureEnvVar(key: string): string | undefined {
    if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
      return undefined;
    }

    const value = process.env[key];
    
    if (value !== undefined) {
      const validation = SecurityUtils.validateEnvironmentVariable(key);
      if (!validation.valid) {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Validate environment variable
   */
  static validateEnvironmentVariable(key: string): { valid: boolean; error?: string } {
    if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
      return { valid: false, error: 'Invalid environment variable key format' };
    }

    return { valid: true };
  }

  /**
   * Validate API key format
   */
  static validateApiKey(apiKey: string, pattern?: RegExp): { valid: boolean; error?: string } {
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
      /^(123|password|admin|user)/i  // Common weak keys
    ];

    for (const weakPattern of weakPatterns) {
      if (weakPattern.test(apiKey)) {
        return { valid: false, error: 'API key appears to be weak or for testing' };
      }
    }

    return { valid: true };
  }

  /**
   * Create secure response headers
   */
  static createSecureHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
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
   * Delete file securely
   */
  static secureDelete(filePath: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const validation = SecurityUtils.validateFilePath(filePath);
      
      if (!validation.valid) {
        resolve({ success: false, error: validation.error });
        return;
      }

      const safePath = validation.safePath!;
      
      if (safePath === '/' || safePath.includes(process.cwd())) {
        resolve({ success: false, error: 'Unsafe deletion path' });
        return;
      }

      require('fs').unlink(safePath, (error: any) => {
        if (error) {
          resolve({ success: false, error: `Deletion failed: ${String(error)}` });
        } else {
          resolve({ success: true });
        }
      });
    });
  }

  /**
   * Create security audit log
   */
  static createSecurityAudit(event: {
    type: string;
    severity: string;
    source: string;
    details: any;
    blocked: boolean;
    remediation: string;
  }): {
    id: string;
    timestamp: string;
    event: any;
  } {
    return {
      id: crypto.randomBytes(16).toString('hex'),
      timestamp: new Date().toISOString(),
      event
    };
  }
}

// Export all utilities
export const generateSecureToken = SecurityUtils.generateSecureToken;
export const generateSecureHash = SecurityUtils.generateSecureHash;
export const generateSecureHashDirect = SecurityUtils.generateSecureHashDirect;
export const validateFilePath = SecurityUtils.validateFilePath;
export const secureDelete = SecurityUtils.secureDelete;
export const validateJSON = SecurityUtils.validateJSON;
export const containsSuspiciousPatterns = SecurityUtils.containsSuspiciousPatterns;
export const createSecureErrorResponse = SecurityUtils.createSecureErrorResponse;
export const createRateLimiter = SecurityUtils.createRateLimiter;
export const getSecureEnvVar = SecurityUtils.getSecureEnvVar;
export const validateEnvironmentVariable = SecurityUtils.validateEnvironmentVariable;
export const validateApiKey = SecurityUtils.validateApiKey;
export const createSecureHeaders = SecurityUtils.createSecureHeaders;
export const createSecurityAudit = SecurityUtils.createSecurityAudit;