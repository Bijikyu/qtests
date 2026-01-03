/**
 * Security Headers Implementation using Helmet
 * Replaced with helmet for better maintainability and security
 * 
 * Migration Guide:
 * - Use helmet directly: import helmet from 'helmet'
 * - Apply helmet middleware to Express apps
 * - Better security through CSP, HSTS, etc.
 */

import helmet, { HelmetOptions } from 'helmet';
import qerrors from '../qerrorsFallback.js';

export interface SecurityHeadersConfig {
  enableCSP?: boolean;
  enableHSTS?: boolean;
  enableXFrameOptions?: boolean;
  enableXContentTypeOptions?: boolean;
  enableReferrerPolicy?: boolean;
  customCSP?: string;
  customHSTS?: {
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
}

export interface SecurityMiddleware {
  (req: any, res: any, next: any): void;
}

/**
 * Security Headers Manager using Helmet
 */
export class SecurityHeadersManager {
  private config: SecurityHeadersConfig;
  private helmetMiddleware: any;

  constructor(config: SecurityHeadersConfig = {}) {
    this.config = {
      enableCSP: true,
      enableHSTS: true,
      enableXFrameOptions: true,
      enableXContentTypeOptions: true,
      enableReferrerPolicy: true,
      ...config
    };

    this.setupHelmet();
  }

  private setupHelmet(): void {
    try {
      const helmetOptions: HelmetOptions = {};

      // Content Security Policy
      if (this.config.enableCSP) {
        if (this.config.customCSP) {
          helmetOptions.contentSecurityPolicy = {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:", "https:"],
              connectSrc: ["'self'"],
              fontSrc: ["'self'"],
              objectSrc: ["'none'"],
              mediaSrc: ["'self'"],
              frameSrc: ["'none'"],
            },
          };
        } else {
          helmetOptions.contentSecurityPolicy = {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'"],
              imgSrc: ["'self'", "data:", "https:"],
              connectSrc: ["'self'"],
              fontSrc: ["'self'"],
              objectSrc: ["'none'"],
              mediaSrc: ["'self'"],
              frameSrc: ["'none'"],
            },
          };
        }
      }

      // HTTP Strict Transport Security
      if (this.config.enableHSTS) {
        helmetOptions.hsts = {
          maxAge: this.config.customHSTS?.maxAge || 31536000, // 1 year
          includeSubDomains: this.config.customHSTS?.includeSubDomains || false,
          preload: this.config.customHSTS?.preload || false,
        };
      }

      // X-Frame-Options
      if (this.config.enableXFrameOptions) {
        helmetOptions.frameguard = { action: 'deny' };
      }

      // X-Content-Type-Options
      if (this.config.enableXContentTypeOptions) {
        helmetOptions.noSniff = true;
      }

      // Referrer Policy
      if (this.config.enableReferrerPolicy) {
        helmetOptions.referrerPolicy = { policy: 'strict-origin-when-cross-origin' };
      }

      // Additional security headers (remove incompatible options)
      // helmetOptions.crossOriginEmbedderPolicy = { policy: 'require-corp' };
      // helmetOptions.crossOriginOpenerPolicy = { policy: 'same-origin' };
      // helmetOptions.crossOriginResourcePolicy = { policy: 'cross-origin' };
      // helmetOptions.nsPrefetchControl = { allow: false };
      // helmetOptions.expectCt = { maxAge: 86400, enforce: true };
      // helmetOptions.permittedCrossDomainPolicies = false;
      helmetOptions.xssFilter = true;

      this.helmetMiddleware = helmet(helmetOptions);
    } catch (error) {
      qerrors(error as Error, 'SecurityHeadersManager.setupHelmet: failed', {
        config: this.config
      });
      
      // Fallback to basic helmet configuration
      this.helmetMiddleware = helmet({
        contentSecurityPolicy: false,
        hsts: false
      });
    }
  }

  /**
   * Get Express middleware
   */
  getMiddleware(): SecurityMiddleware {
    return this.helmetMiddleware;
  }

  /**
   * Get custom CSP middleware
   */
  getCSPMiddleware(customCSP?: string): SecurityMiddleware {
    try {
      const cspValue = customCSP || this.config.customCSP || 
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; font-src 'self'; object-src 'none'; media-src 'self'; frame-src 'none';";

      return (req: any, res: any, next: any) => {
        res.setHeader('Content-Security-Policy', cspValue);
        next();
      };
    } catch (error) {
      qerrors(error as Error, 'SecurityHeadersManager.getCSPMiddleware: failed', {
        customCSP
      });

      // Fallback middleware
      return (req: any, res: any, next: any) => next();
    }
  }

  /**
   * Get HSTS middleware
   */
  getHSTSMiddleware(options?: SecurityHeadersConfig['customHSTS']): SecurityMiddleware {
    try {
      const maxAge = options?.maxAge || 31536000;
      const includeSubDomains = options?.includeSubDomains || false;
      const preload = options?.preload || false;

      const hstsValue = `max-age=${maxAge}${includeSubDomains ? '; includeSubDomains' : ''}${preload ? '; preload' : ''}`;

      return (req: any, res: any, next: any) => {
        res.setHeader('Strict-Transport-Security', hstsValue);
        next();
      };
    } catch (error) {
      qerrors(error as Error, 'SecurityHeadersManager.getHSTSMiddleware: failed', {
        options
      });

      // Fallback middleware
      return (req: any, res: any, next: any) => next();
    }
  }

  /**
   * Get X-Frame-Options middleware
   */
  getXFrameOptionsMiddleware(action: 'deny' | 'sameorigin' = 'deny'): SecurityMiddleware {
    return (req: any, res: any, next: any) => {
      res.setHeader('X-Frame-Options', action);
      next();
    };
  }

  /**
   * Get X-Content-Type-Options middleware
   */
  getXContentTypeOptionsMiddleware(): SecurityMiddleware {
    return (req: any, res: any, next: any) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      next();
    };
  }

  /**
   * Get Referrer Policy middleware
   */
  getReferrerPolicyMiddleware(policy: string = 'strict-origin-when-cross-origin'): SecurityMiddleware {
    return (req: any, res: any, next: any) => {
      res.setHeader('Referrer-Policy', policy);
      next();
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SecurityHeadersConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.setupHelmet();
  }

  /**
   * Get current configuration
   */
  getConfig(): SecurityHeadersConfig {
    return { ...this.config };
  }

  /**
   * Validate security headers for a response
   */
  validateSecurityHeaders(response: any): {
    hasCSP: boolean;
    hasHSTS: boolean;
    hasXFrameOptions: boolean;
    hasXContentTypeOptions: boolean;
    hasReferrerPolicy: boolean;
    securityScore: number;
  } {
    const headers = response.getHeaders ? response.getHeaders() : response.headers || {};
    
    const hasCSP = !!headers['content-security-policy'];
    const hasHSTS = !!headers['strict-transport-security'];
    const hasXFrameOptions = !!headers['x-frame-options'];
    const hasXContentTypeOptions = !!headers['x-content-type-options'];
    const hasReferrerPolicy = !!headers['referrer-policy'];

    const score = [
      hasCSP,
      hasHSTS,
      hasXFrameOptions,
      hasXContentTypeOptions,
      hasReferrerPolicy
    ].filter(Boolean).length;

    return {
      hasCSP,
      hasHSTS,
      hasXFrameOptions,
      hasXContentTypeOptions,
      hasReferrerPolicy,
      securityScore: (score / 5) * 100 // Percentage of implemented headers
    };
  }
}

/**
 * Legacy compatibility functions
 */

/**
 * Apply security headers to Express app
 */
export function applySecurityHeaders(app: any, config?: SecurityHeadersConfig): void {
  try {
    const securityManager = new SecurityHeadersManager(config);
    app.use(securityManager.getMiddleware());
    
    console.log('Security headers applied using helmet');
  } catch (error) {
    qerrors(error as Error, 'applySecurityHeaders: failed', { config });
  }
}

/**
 * Create CSP middleware
 */
export function createCSPMiddleware(csp: string): SecurityMiddleware {
  const manager = new SecurityHeadersManager();
  return manager.getCSPMiddleware(csp);
}

/**
 * Create HSTS middleware
 */
export function createHSTSMiddleware(options?: SecurityHeadersConfig['customHSTS']): SecurityMiddleware {
  const manager = new SecurityHeadersManager();
  return manager.getHSTSMiddleware(options);
}

/**
 * Create X-Frame-Options middleware
 */
export function createXFrameOptionsMiddleware(action?: 'deny' | 'sameorigin'): SecurityMiddleware {
  const manager = new SecurityHeadersManager();
  return manager.getXFrameOptionsMiddleware(action);
}

/**
 * Create X-Content-Type-Options middleware
 */
export function createXContentTypeOptionsMiddleware(): SecurityMiddleware {
  const manager = new SecurityHeadersManager();
  return manager.getXContentTypeOptionsMiddleware();
}

/**
 * Create Referrer Policy middleware
 */
export function createReferrerPolicyMiddleware(policy?: string): SecurityMiddleware {
  const manager = new SecurityHeadersManager();
  return manager.getReferrerPolicyMiddleware(policy);
}

// Export helmet for direct usage
export { helmet };

export default SecurityHeadersManager;