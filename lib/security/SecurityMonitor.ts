/**
 * Security Monitor
 * 
 * Comprehensive security monitoring and incident tracking system
 */

import { randomBytes } from 'crypto';

/**
 * Security event types
 */
export enum SecurityEventType {
  INJECTION_ATTACK = 'injection_attack',
  XSS_ATTEMPT = 'xss_attempt',
  PATH_TRAVERSAL = 'path_traversal',
  COMMAND_INJECTION = 'command_injection',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  ANOMALOUS_PATTERN = 'anomalous_pattern',
  SECURITY_VIOLATION = 'security_violation'
}

/**
 * Security severity levels
 */
export enum SecuritySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Security event interface
 */
export interface SecurityEvent {
  type: SecurityEventType;
  severity: SecuritySeverity;
  source: string;
  details: any;
  blocked: boolean;
  remediation: string;
  timestamp?: string;
  id?: string;
}

/**
 * Rate limit result interface
 */
export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
  reason?: string;
}

/**
 * Security Monitor class
 */
export class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private rateLimits = new Map<string, { count: number; resetTime: number }>();
  private maxEvents = 1000;
  private cleanupInterval?: NodeJS.Timeout;

  /**
   * Initialize security monitor
   */
  constructor() {
    console.log('🔒 Security Monitor Initialized');
    this.setupCleanup();
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
    this.events = [];
    this.rateLimits.clear();
  }

  /**
   * Destroy method for complete cleanup
   */
  destroy(): void {
    this.dispose();
    console.log('🔒 SecurityMonitor: Instance destroyed');
  }

  /**
   * Log security event
   */
  logEvent(event: SecurityEvent): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date().toISOString()
    };

    this.events.push(securityEvent);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console for immediate visibility
    console.log(`🚨 Security Event [${event.severity.toUpperCase()}]: ${event.type}`, {
      source: event.source,
      blocked: event.blocked,
      details: event.details
    });
  }

  /**
   * Check rate limit
   */
  checkRateLimit(identifier: string, options: {
    windowMs?: number;
    maxRequests?: number;
  } = {}): RateLimitResult {
    const windowMs = options.windowMs || 60000; // 1 minute default
    const maxRequests = options.maxRequests || 100; // 100 requests per minute default

    const now = Date.now();
    const key = identifier;

    // Get or initialize rate limit data
    let rateLimitData = this.rateLimits.get(key);
    if (!rateLimitData || now > rateLimitData.resetTime) {
      rateLimitData = {
        count: 0,
        resetTime: now + windowMs
      };
      this.rateLimits.set(key, rateLimitData);
    }

    // Increment count first to prevent off-by-one error
    rateLimitData.count++;

    // Check if limit exceeded
    if (rateLimitData.count > maxRequests) {
      this.logEvent({
        type: SecurityEventType.RATE_LIMIT_EXCEEDED,
        severity: SecuritySeverity.MEDIUM,
        source: 'rate_limit',
        details: { identifier, count: rateLimitData.count, maxRequests },
        blocked: true,
        remediation: 'Rate limit exceeded. Please try again later.'
      });

      return {
        allowed: false,
        retryAfter: rateLimitData.resetTime - now,
        reason: 'Rate limit exceeded'
      };
    }

    return { allowed: true };
  }

  /**
   * Get security events by type (optimized to avoid creating new arrays)
   */
  getEventsByType(type: SecurityEventType): SecurityEvent[] {
    const result: SecurityEvent[] = [];
    for (const event of this.events) {
      if (event.type === type) {
        result.push(event);
      }
    }
    return result;
  }

  /**
   * Get security events by severity (optimized to avoid creating new arrays)
   */
  getEventsBySeverity(severity: SecuritySeverity): SecurityEvent[] {
    const result: SecurityEvent[] = [];
    for (const event of this.events) {
      if (event.severity === severity) {
        result.push(event);
      }
    }
    return result;
  }

  /**
   * Get recent security events (optimized to avoid creating new arrays)
   */
  getRecentEvents(minutes: number = 60): SecurityEvent[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    const result: SecurityEvent[] = [];
    for (const event of this.events) {
      if (event.timestamp && new Date(event.timestamp) > cutoff) {
        result.push(event);
      }
    }
    return result;
  }

  /**
   * Generate security report
   */
  generateReport(): string {
    const now = new Date().toISOString();
    const recentEvents = this.getRecentEvents(24 * 60); // Last 24 hours

    const report = [
      '# Security Monitor Report',
      `Generated: ${now}`,
      '',
      '## Summary',
      `- Total Events: ${this.events.length}`,
      `- Recent Events (24h): ${recentEvents.length}`,
      `- Critical Events: ${this.getEventsBySeverity(SecuritySeverity.CRITICAL).length}`,
      `- High Events: ${this.getEventsBySeverity(SecuritySeverity.HIGH).length}`,
      '',
      '## Recent Events',
      ...recentEvents.slice(-10).map(event => [
        `### ${event.type}`,
        `- Severity: ${event.severity}`,
        `- Source: ${event.source}`,
        `- Blocked: ${event.blocked}`,
        `- Time: ${event.timestamp}`,
        `- Details: ${JSON.stringify(event.details)}`,
        ''
      ]).flat(),
      '',
      '--- End of Report ---'
    ];

    return report.join('\n');
  }

  /**
   * Get security metrics
   */
  getMetrics(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    blockedEvents: number;
    recentEvents: number;
  } {
    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    let blockedEvents = 0;

    for (const event of this.events) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      if (event.blocked) {
        blockedEvents++;
      }
    }

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      blockedEvents,
      recentEvents: this.getRecentEvents().length
    };
  }

  /**
   * Clear old events (optimized to avoid creating intermediate arrays)
   */
  clearOldEvents(olderThanHours: number = 24): void {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    const filteredEvents: SecurityEvent[] = [];
    
    for (const event of this.events) {
      if (event.timestamp && new Date(event.timestamp) > cutoff) {
        filteredEvents.push(event);
      }
    }
    
    this.events = filteredEvents;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${randomBytes(8).toString('hex')}`;
  }

  /**
   * Setup cleanup interval
   */
  private setupCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.clearOldEvents(24); // Clear events older than 24 hours
    }, 60 * 60 * 1000); // Run every hour
  }
}

/**
 * Validate security headers
 */
export function validateSecurityHeaders(headers: Record<string, string>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

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
    if (!csp.includes('default-src')) {
      errors.push('CSP should include default-src directive');
    }
  }

  // Validate HSTS
  if (headers['Strict-Transport-Security']) {
    const hsts = headers['Strict-Transport-Security'];
    if (!hsts.includes('max-age')) {
      errors.push('Strict-Transport-Security must include max-age directive');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Export global instance
export const securityMonitor = new SecurityMonitor();