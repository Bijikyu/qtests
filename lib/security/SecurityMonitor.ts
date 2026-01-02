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
  private rateLimits = new Map<string, { count: number; resetTime: number; blocked?: boolean }>();
  private maxEvents = 1000;
  private maxRateLimits = 5000; // Reduced for more aggressive cleanup
  private cleanupInterval?: NodeJS.Timeout;
  private isDestroyed = false; // Prevent operations after destroy
  private serializationCache = new WeakMap<object, string>(); // Cache for JSON operations

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
  if (this.isDestroyed) return;
  
  if (this.cleanupInterval) {
    clearInterval(this.cleanupInterval);
    this.cleanupInterval = undefined;
  }
  
  // Clear arrays and maps to free memory
  this.events.length = 0;
  this.rateLimits.clear();
}

/**
 * Destroy method for complete cleanup
 */
destroy(): void {
  if (this.isDestroyed) return;
  
  this.dispose();
  this.isDestroyed = true;
  console.log('🔒 SecurityMonitor: Instance destroyed');
}

/**
 * Log security event
 */
logEvent(event: SecurityEvent): void {
  if (this.isDestroyed) {
    console.warn('SecurityMonitor: Cannot log event - instance destroyed');
    return;
  }

  const securityEvent: SecurityEvent = {
    ...event,
    id: this.generateEventId(),
    timestamp: new Date().toISOString()
  };

  // More aggressive cleanup to prevent unbounded growth
  if (this.events.length >= this.maxEvents * 0.8) {
    // Remove oldest events in larger batches to avoid frequent array copying
    const removeCount = Math.floor(this.maxEvents * 0.3); // Remove 30% at once
    this.events.splice(0, removeCount);
  }

  this.events.push(securityEvent);

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
  if (this.isDestroyed) {
    return { allowed: false, reason: 'SecurityMonitor destroyed' };
  }

  const windowMs = options.windowMs || 60000; // 1 minute default
  const maxRequests = options.maxRequests || 100; // 100 requests per minute default

  const now = Date.now();
  const key = identifier;

  // Cleanup expired rate limits to prevent memory leaks
  this.cleanupExpiredRateLimits(now);

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
   * Get security events by type (optimized with early exit)
   */
  getEventsByType(type: SecurityEventType): SecurityEvent[] {
    const result: SecurityEvent[] = [];
    for (const event of this.events) {
      if (event.type === type) {
        result.push(event);
        // Early exit if we have enough results
        if (result.length >= 100) break;
      }
    }
    return result;
  }

  /**
   * Get security events by severity (optimized with early exit)
   */
  getEventsBySeverity(severity: SecuritySeverity): SecurityEvent[] {
    const result: SecurityEvent[] = [];
    for (const event of this.events) {
      if (event.severity === severity) {
        result.push(event);
        // Early exit if we have enough results
        if (result.length >= 100) break;
      }
    }
    return result;
  }

  /**
   * Get security metrics and statistics
   */
  getSecurityMetrics() {
    const now = Date.now();
    const lastHour = now - 3600000; // 1 hour ago
    const recentEvents = this.events.filter(event => 
      new Date(event.timestamp || '').getTime() > lastHour
    );
    
    const eventsByType = Object.values(SecurityEventType).reduce((acc, type) => {
      acc[type] = this.events.filter(event => event.type === type).length;
      return acc;
    }, {} as Record<string, number>);
    
    const eventsBySeverity = Object.values(SecuritySeverity).reduce((acc, severity) => {
      acc[severity] = this.events.filter(event => event.severity === severity).length;
      return acc;
    }, {} as Record<string, number>);
    
    const activeLimits = Array.from(this.rateLimits.values()).filter(rl => rl.blocked).length;
    const blockedRequests = Array.from(this.rateLimits.values()).reduce((sum, rl) => sum + rl.count, 0);
    
    return {
      totalEvents: this.events.length,
      recentEvents: recentEvents.length,
      eventsByType,
      eventsBySeverity,
      activeRateLimits: activeLimits,
      blockedRequests,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };
  }

  /**
   * Get recent security events (optimized with early exit)
   */
  getRecentEvents(minutes: number = 60): SecurityEvent[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    const result: SecurityEvent[] = [];
    for (const event of this.events) {
      if (event.timestamp && new Date(event.timestamp) > cutoff) {
        result.push(event);
        // Early exit if we have enough results
        if (result.length >= 100) break;
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
        `- Details: ${this.sanitizeDetailsForReport(event.details)}`,
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
   * Cleanup expired rate limits to prevent memory leaks (more aggressive)
   */
  private cleanupExpiredRateLimits(now: number): void {
    // Always cleanup expired entries, not just when over limit
    const toDelete: string[] = [];
    this.rateLimits.forEach((data, key) => {
      if (now > data.resetTime) {
        toDelete.push(key);
      }
    });

    // Delete expired entries
    for (const key of toDelete) {
      this.rateLimits.delete(key);
    }

    // More aggressive cleanup if over limit
    if (this.rateLimits.size > this.maxRateLimits * 0.8) {
      const entries = Array.from(this.rateLimits.entries());
      entries.sort((a, b) => a[1].resetTime - b[1].resetTime);
      const toRemove = Math.floor(this.maxRateLimits * 0.2); // Remove 20% oldest
      for (let i = 0; i < toRemove && i < entries.length; i++) {
        this.rateLimits.delete(entries[i][0]);
      }
    }
  }

/**
    * Generate unique event ID
    */
  private generateEventId(): string {
    return `evt_${Date.now()}_${randomBytes(8).toString('hex')}`;
  }

  /**
     * Sanitize details for report to prevent large JSON output (with caching)
     */
  private sanitizeDetailsForReport(details: any): string {
    if (!details) return 'null';
    
    try {
      // Use cached serialization if available
      if (this.serializationCache.has(details)) {
        return this.serializationCache.get(details)!;
      }
      
      const detailsStr = JSON.stringify(details);
      if (detailsStr.length > 500) {
        // Truncate large details
        const truncated = detailsStr.substring(0, 497) + '...';
        this.serializationCache.set(details, truncated);
        return truncated;
      }
      
      this.serializationCache.set(details, detailsStr);
      return detailsStr;
    } catch (error) {
      return '[Unable to serialize details]';
    }
  }

  /**
   * Serialize data once and cache result for performance
   * @param data - Data to serialize
   * @returns Serialized string or empty object on error
   */
  private serializeOnce(data: any): string {
    if (this.serializationCache.has(data)) {
      return this.serializationCache.get(data)!;
    }
    
    try {
      const result = JSON.stringify(data);
      this.serializationCache.set(data, result);
      return result;
    } catch {
      return '{}';
    }
  }

/**
 * Setup cleanup interval (more frequent cleanup)
 */
private setupCleanup(): void {
  this.cleanupInterval = setInterval(() => {
    if (!this.isDestroyed) {
      this.clearOldEvents(12); // Clear events older than 12 hours (more aggressive)
      // Also cleanup rate limits
      this.cleanupExpiredRateLimits(Date.now());
    }
  }, 30 * 60 * 1000); // Run every 30 minutes (more frequent)
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