/**
 * Security Headers and Policies Configuration
 * 
 * Provides security headers configuration, Content Security Policy (CSP)
 * setup, and CORS security configurations for web-facing
 * components of qtests testing framework.
 */

import qerrors from 'qerrors';

/**
 * Security headers configuration
 */
export interface SecurityHeaders {
  'Content-Security-Policy'?: string;
  'X-Content-Type-Options'?: string;
  'X-Frame-Options'?: string;
  'X-XSS-Protection'?: string;
  'Strict-Transport-Security'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
  'Cross-Origin-Embedder-Policy'?: string;
  'Cross-Origin-Opener-Policy'?: string;
  'Cross-Origin-Resource-Policy'?: string;
}

/**
 * CSP (Content Security Policy) configuration
 */
export interface CSPConfig {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'connect-src'?: string[];
  'font-src'?: string[];
  'object-src'?: string[];
  'media-src'?: string[];
  'frame-src'?: string[];
  'child-src'?: string[];
  'worker-src'?: string[];
  'manifest-src'?: string[];
  'base-uri'?: string[];
  'form-action'?: string[];
  'frame-ancestors'?: string[];
  'navigate-to'?: string[];
  'report-uri'?: string;
  'report-to'?: string;
}

/**
 * CORS configuration
 */
export interface CORSConfig {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  optionsSuccessStatus?: number;
  preflightContinue?: boolean;
}

/**
 * Security policy manager
 */
export class SecurityPolicyManager {
  private readonly defaultSecurityHeaders: SecurityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  };

  private readonly defaultCSP: CSPConfig = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"], // Allow inline scripts for testing environments
    'style-src': ["'self'", "'unsafe-inline'"], // Allow inline styles for testing environments
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': ["'self'"],
    'font-src': ["'self'", 'data:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"]
  };

  private readonly defaultCORS: CORSConfig = {
    origin: false, // Default to no CORS
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false,
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 204
  };

  /**
   * Generate security headers object
   */
  generateSecurityHeaders(config?: Partial<SecurityHeaders>): SecurityHeaders {
    const headers = { ...this.defaultSecurityHeaders, ...config };

    // Add CSP if not provided
    if (!headers['Content-Security-Policy']) {
      headers['Content-Security-Policy'] = this.generateCSP();
    }

    // Add HSTS for HTTPS environments
    if (process.env.NODE_ENV === 'production' && process.env.HTTPS === 'true') {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    return headers;
  }

  /**
   * Generate Content Security Policy string
   */
  generateCSP(config?: Partial<CSPConfig>): string {
    const csp = { ...this.defaultCSP, ...config };
    
    return Object.entries(csp)
      .filter(([_, value]) => value !== undefined)
      .map(([directive, values]) => {
        if (directive === 'report-uri' || directive === 'report-to') {
          return `${directive} ${values}`;
        }
        return `${directive} ${(values as string[]).join(' ')}`;
      })
      .join('; ');
  }

  /**
   * Generate CORS configuration
   */
  generateCORSConfig(config?: Partial<CORSConfig>): CORSConfig {
    return { ...this.defaultCORS, ...config };
  }

  /**
   * Validate security headers configuration
   */
  validateSecurityHeaders(headers: SecurityHeaders): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for required headers in production
    if (process.env.NODE_ENV === 'production') {
      const requiredHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection'];
      for (const header of requiredHeaders) {
        if (!headers[header as keyof SecurityHeaders]) {
          errors.push(`Missing required security header: ${header}`);
        }
      }
    }

    // Validate CSP format
    if (headers['Content-Security-Policy']) {
      const csp = headers['Content-Security-Policy'];
      if (typeof csp !== 'string' || csp.length === 0) {
        errors.push('Content-Security-Policy must be a non-empty string');
      }
    }

    // Validate HSTS
    if (headers['Strict-Transport-Security']) {
      const hsts = headers['Strict-Transport-Security'];
      if (typeof hsts !== 'string' || !hsts.includes('max-age=')) {
        errors.push('Strict-Transport-Security must include max-age directive');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate CSP configuration
   */
  validateCSP(csp: CSPConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Ensure at least default-src is defined
    if (!csp['default-src'] && !csp['script-src'] && !csp['style-src']) {
      errors.push('CSP must define at least default-src, script-src, or style-src');
    }

    // Check for unsafe eval in production
    if (process.env.NODE_ENV === 'production') {
      const scriptSrc = csp['script-src'] || [];
      if (scriptSrc.includes("'unsafe-eval'")) {
        errors.push('unsafe-eval should not be used in production');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get security headers for Express middleware
   */
  getExpressSecurityHeaders(config?: Partial<SecurityHeaders>): Record<string, string> {
    const headers = this.generateSecurityHeaders(config);
    
    return Object.entries(headers).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  /**
   * Get CORS middleware configuration
   */
  getExpressCORSConfig(config?: Partial<CORSConfig>): CORSConfig {
    return this.generateCORSConfig(config);
  }

  /**
   * Generate security policy report
   */
  generateSecurityReport(): string {
    const headers = this.generateSecurityHeaders();
    const validation = this.validateSecurityHeaders(headers);

    const report = [
      '# Security Policy Report',
      `Generated: ${new Date().toISOString()}`,
      `Environment: ${process.env.NODE_ENV || 'development'}`,
      '',
      '## Security Headers',
      ...Object.entries(headers).map(([header, value]) => `- ${header}: ${value}`),
      '',
      '## Validation Status',
      validation.valid ? '✅ All security headers are valid' : '❌ Security header validation failed',
      ...validation.errors.map(error => `- ${error}`),
      '',
      '## Recommendations',
      this.getSecurityRecommendations(),
      '',
      '--- End of Report ---'
    ];

    return report.join('\n');
  }

  /**
   * Get security recommendations based on current configuration
   */
  private getSecurityRecommendations(): string[] {
    const recommendations: string[] = [];

    // HTTPS recommendation
    if (process.env.NODE_ENV === 'production' && process.env.HTTPS !== 'true') {
      recommendations.push('Enable HTTPS in production and set Strict-Transport-Security header');
    }

    // CSP recommendations
    if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
      recommendations.push('Consider tightening CSP for production environment');
    }

    // CORS recommendations
    const cors = this.generateCORSConfig();
    if (cors.origin === true || (Array.isArray(cors.origin) && cors.origin.includes('*'))) {
      recommendations.push('Restrict CORS origins in production');
    }

    return recommendations;
  }

  /**
   * Apply security headers to HTTP response
   */
  applySecurityHeaders(response: any, config?: Partial<SecurityHeaders>): void {
    try {
      const headers = this.generateSecurityHeaders(config);
      
      Object.entries(headers).forEach(([header, value]) => {
        if (value) {
          response.setHeader(header, value);
        }
      });
    } catch (error) {
      qerrors(
        error instanceof Error ? error : new Error('Failed to apply security headers'),
        'qtests.security.headers',
        { config }
      );
    }
  }

  /**
   * Apply CORS headers to HTTP response
   */
  applyCORSHeaders(response: any, request: any, config?: Partial<CORSConfig>): void {
    try {
      const cors = this.generateCORSConfig(config);
      
      // Set origin
      if (cors.origin) {
        const origin = request.headers.origin;
        if (typeof cors.origin === 'boolean') {
          response.setHeader('Access-Control-Allow-Origin', cors.origin ? '*' : 'false');
        } else if (Array.isArray(cors.origin)) {
          if (origin && cors.origin.includes(origin)) {
            response.setHeader('Access-Control-Allow-Origin', origin);
          }
        } else {
          response.setHeader('Access-Control-Allow-Origin', cors.origin);
        }
      }

      // Set other CORS headers
      if (cors.methods) {
        response.setHeader('Access-Control-Allow-Methods', cors.methods.join(', '));
      }
      
      if (cors.allowedHeaders) {
        response.setHeader('Access-Control-Allow-Headers', cors.allowedHeaders.join(', '));
      }
      
      if (cors.credentials) {
        response.setHeader('Access-Control-Allow-Credentials', 'true');
      }
      
      if (cors.maxAge) {
        response.setHeader('Access-Control-Max-Age', cors.maxAge.toString());
      }

    } catch (error) {
      qerrors(
        error instanceof Error ? error : new Error('Failed to apply CORS headers'),
        'qtests.security.cors',
        { config }
      );
    }
  }
}

// Global security policy manager instance
export const securityPolicyManager = new SecurityPolicyManager();

/**
 * Convenience function to get security headers
 */
export function getSecurityHeaders(config?: Partial<SecurityHeaders>): SecurityHeaders {
  return securityPolicyManager.generateSecurityHeaders(config);
}

/**
 * Convenience function to get CSP
 */
export function getCSP(config?: Partial<CSPConfig>): string {
  return securityPolicyManager.generateCSP(config);
}

/**
 * Convenience function to get CORS config
 */
export function getCORSConfig(config?: Partial<CORSConfig>): CORSConfig {
  return securityPolicyManager.generateCORSConfig(config);
}