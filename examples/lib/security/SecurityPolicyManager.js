/**
 * Security Headers and Policies Configuration
 *
 * Provides security headers configuration, Content Security Policy (CSP)
 * setup, and CORS security configurations for web-facing
 * components of qtests testing framework.
 */
import qerrors from 'qerrors';
/**
 * Security policy manager
 */
export class SecurityPolicyManager {
    constructor() {
        this.defaultSecurityHeaders = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
        };
        this.defaultCSP = {
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
        this.defaultCORS = {
            origin: false, // Default to no CORS
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            credentials: false,
            maxAge: 86400, // 24 hours
            optionsSuccessStatus: 204
        };
    }
    /**
     * Generate security headers object
     */
    generateSecurityHeaders(config) {
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
    generateCSP(config) {
        const csp = { ...this.defaultCSP, ...config };
        return Object.entries(csp)
            .filter(([_, value]) => value !== undefined)
            .map(([directive, values]) => {
            if (directive === 'report-uri' || directive === 'report-to') {
                return `${directive} ${values}`;
            }
            return `${directive} ${values.join(' ')}`;
        })
            .join('; ');
    }
    /**
     * Generate CORS configuration
     */
    generateCORSConfig(config) {
        return { ...this.defaultCORS, ...config };
    }
    /**
     * Validate security headers configuration
     */
    validateSecurityHeaders(headers) {
        const errors = [];
        // Check for required headers in production
        if (process.env.NODE_ENV === 'production') {
            const requiredHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection'];
            for (const header of requiredHeaders) {
                if (!headers[header]) {
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
    validateCSP(csp) {
        const errors = [];
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
    getExpressSecurityHeaders(config) {
        const headers = this.generateSecurityHeaders(config);
        return Object.entries(headers).reduce((acc, [key, value]) => {
            if (value) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }
    /**
     * Get CORS middleware configuration
     */
    getExpressCORSConfig(config) {
        return this.generateCORSConfig(config);
    }
    /**
     * Generate security policy report
     */
    generateSecurityReport() {
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
    getSecurityRecommendations() {
        const recommendations = [];
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
    applySecurityHeaders(response, config) {
        try {
            const headers = this.generateSecurityHeaders(config);
            Object.entries(headers).forEach(([header, value]) => {
                if (value) {
                    response.setHeader(header, value);
                }
            });
        }
        catch (error) {
            qerrors(error instanceof Error ? error : new Error('Failed to apply security headers'), 'qtests.security.headers', { config });
        }
    }
    /**
     * Apply CORS headers to HTTP response
     */
    applyCORSHeaders(response, request, config) {
        try {
            const cors = this.generateCORSConfig(config);
            // Set origin
            if (cors.origin) {
                const origin = request.headers.origin;
                if (typeof cors.origin === 'boolean') {
                    response.setHeader('Access-Control-Allow-Origin', cors.origin ? '*' : 'false');
                }
                else if (Array.isArray(cors.origin)) {
                    if (origin && cors.origin.includes(origin)) {
                        response.setHeader('Access-Control-Allow-Origin', origin);
                    }
                }
                else {
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
        }
        catch (error) {
            qerrors(error instanceof Error ? error : new Error('Failed to apply CORS headers'), 'qtests.security.cors', { config });
        }
    }
}
// Global security policy manager instance
export const securityPolicyManager = new SecurityPolicyManager();
/**
 * Convenience function to get security headers
 */
export function getSecurityHeaders(config) {
    return securityPolicyManager.generateSecurityHeaders(config);
}
/**
 * Convenience function to get CSP
 */
export function getCSP(config) {
    return securityPolicyManager.generateCSP(config);
}
/**
 * Convenience function to get CORS config
 */
export function getCORSConfig(config) {
    return securityPolicyManager.generateCORSConfig(config);
}
