# QTests Security Documentation

## Overview

QTests includes a comprehensive security framework designed to protect against common web application vulnerabilities and ensure secure testing practices. This document provides an overview of security features, best practices, and implementation guidelines.

## Security Architecture

### Core Components

1. **Security Monitor** (`lib/security/SecurityMonitor.ts`)
   - Runtime security event monitoring
   - Anomaly detection and alerting
   - Rate limiting and abuse prevention
   - Security metrics and reporting

2. **Security Validator** (`lib/security/SecurityValidator.ts`)
   - Advanced input validation and sanitization
   - Multiple security pattern detection
   - Custom validation rules
   - Protection against injection attacks

3. **Security Policy Manager** (`lib/security/SecurityPolicyManager.ts`)
   - HTTP security headers configuration
   - Content Security Policy (CSP) management
   - CORS security configuration
   - Security policy validation

4. **Security Testing Framework** (`lib/security/SecurityTestingFramework.ts`)
   - Automated security regression testing
   - Penetration testing utilities
   - Vulnerability scanning
   - Security test reporting

## Security Features

### 1. Input Validation & Sanitization

#### Module ID Validation
```typescript
import { validateModuleId } from '@bijikyu/qtests/security';

const result = validateModuleId('user-service');
if (!result.valid) {
  console.error('Invalid module ID:', result.errors);
}
```

#### File Path Validation
```typescript
import { validatePath } from '@bijikyu/qtests/security';

const result = validatePath('/tmp/test-file.txt');
if (!result.valid) {
  console.error('Path validation failed:', result.errors);
}
```

#### JSON Content Validation
```typescript
import { validateJSON } from '@bijikyu/qtests/security';

const result = validateJSON('{"user": "admin"}');
if (!result.valid) {
  console.error('JSON validation failed:', result.errors);
}
```

### 2. Security Monitoring

#### Rate Limiting
```typescript
import { securityMonitor } from '@bijikyu/qtests/security';

const rateCheck = securityMonitor.checkRateLimit('api-endpoint', {
  windowMs: 60000,
  maxRequests: 100
});

if (!rateCheck.allowed) {
  console.log('Rate limit exceeded:', rateCheck.reason);
}
```

#### Security Event Logging
```typescript
import { securityMonitor, SecurityEventType, SecuritySeverity } from '@bijikyu/qtests/security';

securityMonitor.logEvent({
  type: SecurityEventType.COMMAND_INJECTION_ATTEMPT,
  severity: SecuritySeverity.HIGH,
  source: 'api-endpoint',
  details: { command: 'rm -rf /' },
  blocked: true,
  remediation: 'Command blocked due to security policy'
});
```

### 3. Security Headers & Policies

#### Generate Security Headers
```typescript
import { getSecurityHeaders } from '@bijikyu/qtests/security';

const headers = getSecurityHeaders({
  'Content-Security-Policy': "default-src 'self'",
  'Strict-Transport-Security': 'max-age=31536000'
});
```

#### CORS Configuration
```typescript
import { getCORSConfig } from '@bijikyu/qtests/security';

const corsConfig = getCORSConfig({
  origin: ['https://trusted-domain.com'],
  methods: ['GET', 'POST'],
  credentials: true
});
```

### 4. Security Testing

#### Automated Security Tests
```typescript
import { runFullSecurityTest, generateSecurityTestReport } from '@bijikyu/qtests/security';

const results = runFullSecurityTest();
const report = generateSecurityTestReport(results);
console.log(report);
```

#### Penetration Testing
```typescript
import { penetrationTester } from '@bijikyu/qtests/security';

const results = penetrationTester.runPenetrationTest({
  inputEndpoint: '/api/user-input',
  queryEndpoint: 'SELECT * FROM users WHERE id = {{param}}',
  pathEndpoint: '/files/{{path}}'
});
```

## Security Best Practices

### 1. Input Validation
- **Always validate** all user input using security validators
- **Sanitize data** before processing or storage
- **Use allowlisting** instead of blocklisting when possible
- **Validate content type** and format expectations

### 2. Rate Limiting
- **Implement rate limits** on all security-sensitive operations
- **Use different limits** for different types of operations
- **Monitor for abuse patterns** and automatically block attackers
- **Provide clear feedback** when rate limits are exceeded

### 3. Security Headers
- **Always include** security headers in HTTP responses
- **Use strict CSP** policies in production
- **Enable HSTS** for HTTPS-only applications
- **Configure CORS** with minimal allowed origins

### 4. Monitoring & Logging
- **Log all security events** with full context
- **Set up alerts** for critical security violations
- **Monitor patterns** for attack detection
- **Regular cleanup** of old security events

### 5. Testing
- **Run security regression tests** regularly
- **Perform penetration testing** on major changes
- **Test with real attack payloads**
- **Monitor for security test failures**

## Common Threat Mitigations

### Injection Attacks
- **SQL Injection**: Use parameterized queries and input validation
- **Command Injection**: Validate commands and use allowlisting
- **NoSQL Injection**: Validate JSON structure and operators
- **LDAP Injection**: Filter special characters and validate input

### Cross-Site Scripting (XSS)
- **Content Security Policy**: Strict CSP headers prevent script execution
- **Input Sanitization**: Remove HTML tags and escape content
- **Output Encoding**: Properly encode user-generated content
- **HttpOnly Cookies**: Prevent client-side access to cookies

### Path Traversal
- **Path Validation**: Normalize and validate all file paths
- **Chroot/Sandboxing**: Limit file system access
- **Allowlisting**: Only access specific allowed directories
- **Canonical Paths**: Use absolute paths after validation

### Authentication & Authorization
- **Rate Limiting**: Prevent brute force attacks
- **Secure Sessions**: Use secure, HttpOnly cookies
- **Strong Passwords**: Enforce password complexity
- **Multi-Factor Authentication**: Add additional security layers

## Security Configuration

### Environment Variables
```bash
# Security configuration
NODE_ENV=production
HTTPS=true
SECURITY_LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
SECURITY_REPORT_ENABLED=true
```

### Security Headers Configuration
```javascript
// security.config.js
export const securityConfig = {
  headers: {
    'Content-Security-Policy': {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:']
    },
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },
  cors: {
    origin: false, // Disabled by default
    credentials: false,
    maxAge: 86400
  }
};
```

## Security Monitoring

### Metrics Dashboard
```typescript
import { securityMonitor } from '@bijikyu/qtests/security';

const metrics = securityMonitor.getSecurityMetrics();
console.log('Security Metrics:', {
  totalEvents: metrics.totalEvents,
  eventsByType: metrics.eventsByType,
  eventsBySeverity: metrics.eventsBySeverity,
  rateLimitStats: metrics.rateLimitStats
});
```

### Security Reporting
```typescript
import { securityMonitor } from '@bijikyu/qtests/security';

// Generate hourly security report
const report = securityMonitor.generateReport();
console.log(report);
```

## Incident Response

### Security Event Handling
1. **Detection**: Automated detection via SecurityMonitor
2. **Logging**: Full event context logged with qerrors
3. **Blocking**: Immediate blocking of malicious requests
4. **Alerting**: Integration with monitoring systems
5. **Investigation**: Detailed reports for analysis

### Response Procedures
1. **Immediate**: Block malicious IP/identifier
2. **Analysis**: Review security logs and patterns
3. **Remediation**: Patch identified vulnerabilities
4. **Testing**: Verify fixes with security tests
5. **Monitoring**: Enhanced monitoring after incident

## Security Auditing

### Regular Audits
- **Code Reviews**: Security-focused code reviews
- **Dependency Scanning**: Regular vulnerability scans
- **Configuration Reviews**: Security configuration validation
- **Penetration Testing**: External security testing

### Compliance Checking
- **OWASP Top 10**: Verify protection against common vulnerabilities
- **Security Standards**: Ensure compliance with relevant standards
- **Industry Best Practices**: Follow current security guidelines
- **Legal Requirements**: Meet applicable security regulations

## Security Tools Integration

### External Security Tools
- **SAST Tools**: Static analysis security testing
- **DAST Tools**: Dynamic application security testing
- **Dependency Scanners**: Automated vulnerability scanning
- **SIEM Systems**: Security information and event management

### CI/CD Integration
```yaml
# .github/workflows/security.yml
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Security Tests
        run: npm run security:test
      - name: Dependency Audit
        run: npm audit --audit-level moderate
      - name: Upload Security Report
        uses: actions/upload-artifact@v2
        with:
          name: security-report
          path: security-report.md
```

## Troubleshooting

### Common Issues

#### Rate Limiting Too Aggressive
```typescript
// Adjust rate limiting configuration
const rateCheck = securityMonitor.checkRateLimit('api-endpoint', {
  windowMs: 120000, // Increase window to 2 minutes
  maxRequests: 200  // Increase limit to 200 requests
});
```

#### False Positives in Validation
```typescript
// Add custom validation rules
securityValidator.addRuleSet('custom-input', [
  {
    name: 'customField',
    type: 'string',
    pattern: /^[a-zA-Z0-9-_\s]+$/, // Custom pattern
    sanitize: true
  }
]);
```

#### Security Headers Not Working
```typescript
// Validate security header configuration
const headers = getSecurityHeaders();
const validation = securityPolicyManager.validateSecurityHeaders(headers);
if (!validation.valid) {
  console.error('Security header issues:', validation.errors);
}
```

## Contributing to Security

### Security Bug Reports
- **Private Disclosure**: Report security issues privately
- **Detailed Information**: Provide reproduction steps
- **Impact Assessment**: Describe potential impact
- **Contact Method**: Use designated security contact

### Security Development
- **Security First**: Consider security in all changes
- **Testing**: Include security tests for new features
- **Documentation**: Document security-related changes
- **Review**: Security review before merging

---

*For questions about qtests security features, contact the security team or open an issue in the repository.*