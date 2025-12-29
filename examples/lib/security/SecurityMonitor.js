/**
 * Security Monitoring Framework
 *
 * Provides runtime security monitoring, anomaly detection, and alerting
 * for qtests testing framework. Implements rate limiting, event tracking,
 * and automated incident response capabilities.
 */
import qerrors from 'qerrors';
// Security event types for monitoring
export var SecurityEventType;
(function (SecurityEventType) {
    SecurityEventType["COMMAND_INJECTION_ATTEMPT"] = "command_injection_attempt";
    SecurityEventType["PATH_TRAVERSAL_ATTEMPT"] = "path_traversal_attempt";
    SecurityEventType["MODULE_HIJACKING_ATTEMPT"] = "module_hijacking_attempt";
    SecurityEventType["ENVIRONMENT_POLLUTION_ATTEMPT"] = "environment_pollution_attempt";
    SecurityEventType["JSON_INJECTION_ATTEMPT"] = "json_injection_attempt";
    SecurityEventType["RATE_LIMIT_EXCEEDED"] = "rate_limit_exceeded";
    SecurityEventType["ANOMALOUS_PATTERN"] = "anomalous_pattern";
    SecurityEventType["UNAUTHORIZED_ACCESS"] = "unauthorized_access";
})(SecurityEventType || (SecurityEventType = {}));
// Security event severity levels
export var SecuritySeverity;
(function (SecuritySeverity) {
    SecuritySeverity["LOW"] = "low";
    SecuritySeverity["MEDIUM"] = "medium";
    SecuritySeverity["HIGH"] = "high";
    SecuritySeverity["CRITICAL"] = "critical";
})(SecuritySeverity || (SecuritySeverity = {}));
/**
 * Security monitoring and event tracking
 */
export class SecurityMonitor {
    constructor() {
        this.events = [];
        this.rateLimits = new Map();
        this.counters = new Map();
        this.lastReset = new Map();
        this.rateLimitConfig = {
            windowMs: 60000, // 1 minute
            maxRequests: 100,
            blockDurationMs: 300000 // 5 minutes
        };
        this.anomalyThresholds = {
            maxFailedValidationPerMinute: 10,
            maxModuleLoadAttemptsPerMinute: 50,
            maxCommandExecutionsPerMinute: 20,
            suspiciousPatternScore: 0.8
        };
    }
    /**
     * Check rate limiting for security-sensitive operations
     */
    checkRateLimit(identifier, config) {
        const now = Date.now();
        const cfg = { ...this.rateLimitConfig, ...config };
        const key = `rate_${identifier}`;
        const current = this.rateLimits.get(key) || { count: 0, resetTime: now + cfg.windowMs, blocked: false };
        // Reset if window expired
        if (now > current.resetTime) {
            current.count = 0;
            current.resetTime = now + cfg.windowMs;
            current.blocked = false;
        }
        // Check if currently blocked
        if (current.blocked && now < current.resetTime) {
            return { allowed: false, blocked: true, reason: 'Rate limit block active' };
        }
        // Check limit
        if (current.count >= cfg.maxRequests) {
            current.blocked = true;
            current.resetTime = now + cfg.blockDurationMs;
            this.rateLimits.set(key, current);
            this.logEvent({
                type: SecurityEventType.RATE_LIMIT_EXCEEDED,
                severity: SecuritySeverity.MEDIUM,
                source: 'security_monitor',
                details: { identifier, count: current.count, limit: cfg.maxRequests },
                blocked: true,
                remediation: 'Rate limit activated. Please reduce request frequency.'
            });
            return { allowed: false, blocked: true, reason: 'Rate limit exceeded' };
        }
        // Increment counter
        current.count++;
        this.rateLimits.set(key, current);
        return { allowed: true, blocked: false };
    }
    /**
     * Detect anomalous patterns in security events
     */
    detectAnomalies() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const anomalies = [];
        // Count events by type in last minute
        const recentEvents = this.events.filter(event => event.timestamp.getTime() > oneMinuteAgo);
        const eventCounts = new Map();
        recentEvents.forEach(event => {
            eventCounts.set(event.type, (eventCounts.get(event.type) || 0) + 1);
        });
        // Check for anomalous patterns
        eventCounts.forEach((count, type) => {
            switch (type) {
                case SecurityEventType.COMMAND_INJECTION_ATTEMPT:
                case SecurityEventType.PATH_TRAVERSAL_ATTEMPT:
                case SecurityEventType.MODULE_HIJACKING_ATTEMPT:
                    if (count > 5) {
                        anomalies.push(this.createSecurityEvent({
                            type: SecurityEventType.ANOMALOUS_PATTERN,
                            severity: SecuritySeverity.HIGH,
                            source: 'security_monitor',
                            details: { pattern: type, count, threshold: 5 },
                            blocked: true,
                            remediation: 'Multiple security attack patterns detected. Investigation required.'
                        }));
                    }
                    break;
            }
        });
        return anomalies;
    }
    /**
     * Create security event with ID and timestamp
     */
    createSecurityEvent(eventData) {
        return {
            id: this.generateEventId(),
            timestamp: new Date(),
            ...eventData
        };
    }
    /**
     * Log security event with contextual information
     */
    logEvent(eventData) {
        const fullEvent = this.createSecurityEvent(eventData);
        // Store event
        this.events.push(fullEvent);
        // Log to qerrors for external monitoring
        qerrors(new Error(`Security Event: ${eventData.type}`), 'qtests.security.monitor', {
            eventId: fullEvent.id,
            type: eventData.type,
            severity: eventData.severity,
            source: eventData.source,
            details: eventData.details,
            blocked: eventData.blocked,
            remediation: eventData.remediation
        });
        // Check for anomalies after each event
        const anomalies = this.detectAnomalies();
        anomalies.forEach(anomaly => {
            this.events.push(anomaly);
            qerrors(new Error(`Security Anomaly Detected`), 'qtests.security.anomaly', {
                eventId: anomaly.id,
                type: anomaly.type,
                severity: anomaly.severity,
                details: anomaly.details,
                blocked: anomaly.blocked
            });
        });
        return fullEvent.id;
    }
    /**
     * Get security metrics and statistics
     */
    getSecurityMetrics() {
        const now = Date.now();
        const lastHour = now - 3600000; // 1 hour ago
        const recentEvents = this.events.filter(event => event.timestamp.getTime() > lastHour);
        const eventsByType = Object.values(SecurityEventType).reduce((acc, type) => {
            acc[type] = this.events.filter(event => event.type === type).length;
            return acc;
        }, {});
        const eventsBySeverity = Object.values(SecuritySeverity).reduce((acc, severity) => {
            acc[severity] = this.events.filter(event => event.severity === severity).length;
            return acc;
        }, {});
        const activeLimits = Array.from(this.rateLimits.values()).filter(rl => rl.blocked).length;
        const blockedRequests = Array.from(this.rateLimits.values()).reduce((sum, rl) => sum + rl.count, 0);
        return {
            totalEvents: this.events.length,
            eventsByType,
            eventsBySeverity,
            recentEvents: recentEvents.slice(-20), // Last 20 recent events
            rateLimitStats: {
                activeLimits,
                blockedRequests
            }
        };
    }
    /**
     * Clear old events to prevent memory leaks
     */
    cleanup(olderThanHours = 24) {
        const cutoffTime = Date.now() - (olderThanHours * 3600000);
        this.events = this.events.filter(event => event.timestamp.getTime() > cutoffTime);
        // Clean up expired rate limits
        const now = Date.now();
        for (const [key, limit] of this.rateLimits.entries()) {
            if (now > limit.resetTime) {
                this.rateLimits.delete(key);
            }
        }
    }
    /**
     * Generate security report for analysis
     */
    generateReport() {
        const metrics = this.getSecurityMetrics();
        const report = [
            '# QTests Security Monitor Report',
            `Generated: ${new Date().toISOString()}`,
            '',
            '## Summary',
            `- Total Events: ${metrics.totalEvents}`,
            `- Active Rate Limits: ${metrics.rateLimitStats.activeLimits}`,
            `- Blocked Requests: ${metrics.rateLimitStats.blockedRequests}`,
            '',
            '## Events by Type',
            ...Object.entries(metrics.eventsByType).map(([type, count]) => `- ${type}: ${count}`),
            '',
            '## Events by Severity',
            ...Object.entries(metrics.eventsBySeverity).map(([severity, count]) => `- ${severity}: ${count}`),
            '',
            '## Recent Events (Last Hour)',
            ...metrics.recentEvents.map(event => `- [${event.severity.toUpperCase()}] ${event.type}: ${JSON.stringify(event.details)}`),
            '',
            '--- End of Report ---'
        ];
        return report.join('\n');
    }
}
// Global security monitor instance
export const securityMonitor = new SecurityMonitor();
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
// Start automatic cleanup every hour
setInterval(() => {
    securityMonitor.cleanup();
}, 3600000);
