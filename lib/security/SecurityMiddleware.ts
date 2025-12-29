/**
 * Security Middleware for Express Applications
 * 
 * Provides ready-to-use security middleware for Express.js applications
 * integrating with qtests security framework. Handles security headers,
 * input validation, rate limiting, and request monitoring.
 */

import type { Request, Response, NextFunction } from 'express';
import { securityMonitor, SecurityEventType, SecuritySeverity } from '../security/SecurityMonitor.js';
import { securityValidator } from '../security/SecurityValidator.js';
import { securityPolicyManager } from '../security/SecurityPolicyManager.js';
import { SecurityUtils } from '../security/SecurityUtils.js';

/**
 * Security middleware options
 */
export interface SecurityMiddlewareOptions {
  enableRateLimit?: boolean;
  enableInputValidation?: boolean;
  enableSecurityHeaders?: boolean;
  enableRequestLogging?: boolean;
  rateLimitOptions?: {
    windowMs?: number;
    maxRequests?: number;
    keyGenerator?: (req: Request) => string;
  };
  validationOptions?: {
    body?: boolean;
    query?: boolean;
    params?: boolean;
    headers?: boolean;
    customRules?: any;
  };
  securityHeaders?: Record<string, string>;
}

/**
 * Request log data interface
 */
interface RequestLogData {
  method: string;
  url: string;
  ip: string | undefined;
  userAgent: string | undefined;
  contentType: string | undefined;
  timestamp: string;
  bodySize: number;
  hasSuspiciousPatterns?: boolean;
  suspiciousPatterns?: string[];
}

/**
 * Security middleware class
 */
export class SecurityMiddleware {
  private options: Required<SecurityMiddlewareOptions>;

  constructor(options: SecurityMiddlewareOptions = {}) {
    this.options = {
      enableRateLimit: true,
      enableInputValidation: true,
      enableSecurityHeaders: true,
      enableRequestLogging: true,
      rateLimitOptions: {
        windowMs: 60000, // 1 minute
        maxRequests: 100,
        keyGenerator: (req) => req.ip || 'unknown'
      },
      validationOptions: {
        body: true,
        query: true,
        params: true,
        headers: false // Headers often contain system data that might be flagged
      },
      securityHeaders: {},
      ...options
    };
  }

  /**
   * Main security middleware
   */
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // Apply security headers first
        if (this.options.enableSecurityHeaders) {
          this.applySecurityHeaders(req, res);
        }

        // Rate limiting check
        if (this.options.enableRateLimit) {
          const rateLimitResult = this.checkRateLimit(req);
          if (!rateLimitResult.allowed) {
            this.sendRateLimitResponse(res, rateLimitResult);
            return;
          }
        }

        // Input validation
        if (this.options.enableInputValidation) {
          const validationResult = this.validateRequest(req);
          if (!validationResult.valid) {
            this.sendValidationErrorResponse(res, validationResult);
            return;
          }
        }

        // Request logging
        if (this.options.enableRequestLogging) {
          this.logRequest(req);
        }

        next();
      } catch (error) {
        console.error('Security middleware error:', error);
        this.sendErrorResponse(res, 'Internal security error');
      }
    };
  }

  /**
   * Apply security headers to response
   */
  private applySecurityHeaders(req: Request, res: Response): void {
    const headers = securityPolicyManager.generateSecurityHeaders(this.options.securityHeaders);
    
    Object.entries(headers).forEach(([key, value]) => {
      if (value) {
        res.setHeader(key, value);
      }
    });
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(req: Request): { allowed: boolean; retryAfter?: number; reason?: string } {
    const identifier = this.options.rateLimitOptions.keyGenerator!(req);
    
    return securityMonitor.checkRateLimit(identifier, {
      windowMs: this.options.rateLimitOptions.windowMs,
      maxRequests: this.options.rateLimitOptions.maxRequests
    });
  }

  /**
   * Validate request data
   */
  private validateRequest(req: Request): { valid: boolean; errors: string[]; sanitized?: any } {
    const errors: string[] = [];
    let sanitized: any = {};

    try {
      // Validate body
      if (this.options.validationOptions.body && req.body) {
        if (typeof req.body === 'string') {
          const bodyResult = securityValidator.validateJSON(req.body);
          if (!bodyResult.valid) {
            errors.push(`Body validation: ${bodyResult.errors.join(', ')}`);
          } else {
            sanitized.body = bodyResult.sanitized;
          }
        } else if (typeof req.body === 'object') {
          const bodyString = JSON.stringify(req.body);
          const bodyResult = securityValidator.validateJSON(bodyString);
          if (!bodyResult.valid) {
            errors.push(`Body JSON validation: ${bodyResult.errors.join(', ')}`);
          } else {
            sanitized.body = bodyResult.sanitized;
          }
        }
      }

      // Validate query parameters
      if (this.options.validationOptions.query && req.query) {
        for (const [key, value] of Object.entries(req.query)) {
          if (typeof value === 'string') {
            const queryResult = securityValidator.validate(value, 'query_param');
            if (!queryResult.valid) {
              errors.push(`Query param '${key}': ${queryResult.errors.join(', ')}`);
            } else {
              if (!sanitized.query) sanitized.query = {};
              sanitized.query[key] = queryResult.sanitized;
            }
          }
        }
      }

      // Validate path parameters
      if (this.options.validationOptions.params && req.params) {
        for (const [key, value] of Object.entries(req.params)) {
          if (typeof value === 'string') {
            const paramResult = securityValidator.validate(value, 'path_param');
            if (!paramResult.valid) {
              errors.push(`Path param '${key}': ${paramResult.errors.join(', ')}`);
            } else {
              if (!sanitized.params) sanitized.params = {};
              sanitized.params[key] = paramResult.sanitized;
            }
          }
        }
      }

      // Apply sanitized data to request
      if (Object.keys(sanitized).length > 0) {
        if (sanitized.body) req.body = sanitized.body;
        if (sanitized.query) req.query = { ...req.query, ...sanitized.query };
        if (sanitized.params) req.params = { ...req.params, ...sanitized.params };
      }

    } catch (error) {
      errors.push(`Request validation error: ${String(error)}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized: Object.keys(sanitized).length > 0 ? sanitized : undefined
    };
  }

  /**
   * Log security-relevant request information
   */
  private logRequest(req: Request): void {
    const logData: RequestLogData = {
      method: req.method,
      url: req.url || '',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      contentType: req.get('Content-Type'),
      timestamp: new Date().toISOString(),
      bodySize: req.body ? JSON.stringify(req.body).length : 0
    };

    // Check for suspicious patterns
    if (req.url) {
      const suspiciousCheck = SecurityUtils.containsSuspiciousPatterns(req.url);
      if (suspiciousCheck.suspicious) {
        logData.suspiciousPatterns = suspiciousCheck.patterns?.map(p => String(p || '')).filter(Boolean);
      }
    }

    // Log the request
    console.log('Security request log:', JSON.stringify(logData));
  }

  /**
   * Send rate limit response
   */
  private sendRateLimitResponse(res: Response, rateLimitResult: any): void {
    const response = SecurityUtils.createSecureErrorResponse(
      'Rate limit exceeded. Please try again later.',
      'RATE_LIMIT_EXCEEDED'
    );

    if (rateLimitResult.retryAfter) {
      res.setHeader('Retry-After', Math.ceil(rateLimitResult.retryAfter / 1000).toString());
    }

    res.status(429).json(response);
  }

  /**
   * Send validation error response
   */
  private sendValidationErrorResponse(res: Response, validationResult: any): void {
    const response = SecurityUtils.createSecureErrorResponse(
      `Invalid request data: ${validationResult.errors.join('; ')}`,
      'VALIDATION_ERROR'
    );

    res.status(400).json(response);
  }

  /**
   * Send generic security error response
   */
  private sendErrorResponse(res: Response, message: string): void {
    const response = SecurityUtils.createSecureErrorResponse(message);
    res.status(500).json(response);
  }

  /**
   * Create security audit middleware
   */
  static auditMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Log request start
      const startTime = Date.now();
      
      // Capture original res.json
      const originalJson = res.json;
      
      // Override res.json to log response
      res.json = function(data: any) {
        const duration = Date.now() - startTime;
        const logData = {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
          responseSize: JSON.stringify(data).length,
          timestamp: new Date().toISOString()
        };

        console.log('Security audit log:', JSON.stringify(logData));
        
        // Call original json method
        return originalJson.call(this, data);
      };
      
      next();
    };
  }

  /**
   * Create API key validation middleware
   */
  static apiKeyMiddleware(options: {
    headerName?: string;
    queryParam?: string;
    validator?: (apiKey: string) => boolean;
  }) {
    return (req: Request, res: Response, next: NextFunction) => {
      const headerName = options.headerName || 'X-API-Key';
      const queryParam = options.queryParam || 'api_key';
      
      let apiKey = req.get(headerName);
      
      if (!apiKey && queryParam) {
        apiKey = req.query[queryParam] as string;
      }

      if (!apiKey) {
        const response = SecurityUtils.createSecureErrorResponse(
          'API key required',
          'API_KEY_MISSING'
        );
        return res.status(401).json(response);
      }

      // Validate API key
      let validationResult;
      if (options.validator) {
        validationResult = { valid: options.validator(apiKey) };
      } else {
        validationResult = { valid: apiKey.length >= 8 };
      }

      if (!validationResult.valid) {
        securityMonitor.logEvent({
          type: SecurityEventType.UNAUTHORIZED_ACCESS,
          severity: SecuritySeverity.MEDIUM,
          source: 'api_key_middleware',
          details: { headerName, apiKey: apiKey.substring(0, 8) + '...' },
          blocked: true,
          remediation: 'Invalid API key provided'
        });

        const response = SecurityUtils.createSecureErrorResponse(
          'Invalid API key',
          'API_KEY_INVALID'
        );
        return res.status(401).json(response);
      }

      // Store API key for downstream use
      (req as any).apiKey = apiKey;
      next();
    };
  }

  /**
   * Create IP filtering middleware
   */
  static ipFilterMiddleware(options: {
    allowedIPs: string[];
    blockList?: string[];
    message?: string;
  }) {
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip;
      
      if (!ip) {
        next();
        return;
      }

      // Check blocklist first
      if (options.blockList && options.blockList.includes(ip)) {
        securityMonitor.logEvent({
          type: SecurityEventType.UNAUTHORIZED_ACCESS,
          severity: SecuritySeverity.HIGH,
          source: 'ip_filter_middleware',
          details: { blockedIP: ip },
          blocked: true,
          remediation: 'Blocked IP attempted access'
        });

        const response = SecurityUtils.createSecureErrorResponse(
          options.message || 'Access denied',
          'IP_BLOCKED'
        );
        return res.status(403).json(response);
      }

      // Check allowlist
      if (options.allowedIPs.length > 0 && !options.allowedIPs.includes(ip)) {
        securityMonitor.logEvent({
          type: SecurityEventType.UNAUTHORIZED_ACCESS,
          severity: SecuritySeverity.MEDIUM,
          source: 'ip_filter_middleware',
          details: { deniedIP: ip },
          blocked: true,
          remediation: 'IP not in allowlist'
        });

        const response = SecurityUtils.createSecureErrorResponse(
          options.message || 'Access denied',
          'IP_NOT_ALLOWED'
        );
        return res.status(403).json(response);
      }

      next();
    };
  }

  /**
   * Create CORS security middleware
   */
  static corsMiddleware(options: {
    origin?: string | string[];
    methods?: string[];
    allowedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  } = {}) {
    return (req: Request, res: Response, next: NextFunction) => {
      const corsConfig = securityPolicyManager.generateCORSConfig(options);
      securityPolicyManager.applyCORSHeaders(res, req, corsConfig);
      next();
    };
  }
}

/**
 * Convenience function to create basic security middleware
 */
export function createSecurityMiddleware(options?: SecurityMiddlewareOptions) {
  const middleware = new SecurityMiddleware(options);
  return middleware.middleware();
}

/**
 * Convenience function to create audit middleware
 */
export const auditMiddleware = SecurityMiddleware.auditMiddleware;

/**
 * Convenience function to create API key middleware
 */
export const apiKeyMiddleware = SecurityMiddleware.apiKeyMiddleware;

/**
 * Convenience function to create IP filter middleware
 */
export const ipFilterMiddleware = SecurityMiddleware.ipFilterMiddleware;

/**
 * Convenience function to create CORS middleware
 */
export const corsMiddleware = SecurityMiddleware.corsMiddleware;