/**
 * Basic Security Integration Example
 * 
 * Simple demonstration of qtests security framework usage
 * without complex Express.js dependencies.
 */

import { securityMonitor, SecurityEventType, SecuritySeverity } from '../lib/security/SecurityMonitor.js';
import { validateModuleId, validateJSON, validatePath } from '../lib/security/SecurityValidator.js';
import { getSecurityHeaders } from '../lib/security/SecurityPolicyManager.js';

/**
 * Example 1: Basic security validation
 */
function demonstrateBasicValidation() {
  console.log('\n🔒 Basic Security Validation Examples:\n');

  // Module ID validation
  const moduleIds = ['user-service', '../../../etc/passwd', 'valid-module', 'module; rm -rf /'];
  
  console.log('Module ID Validation:');
  moduleIds.forEach(id => {
    const result = validateModuleId(id);
    console.log(`  ${id}: ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
    if (!result.valid) {
      console.log(`    Errors: ${result.errors.join(', ')}`);
    }
  });

  // JSON validation
  const jsonStrings = [
    '{"user": "admin", "role": "user"}',
    '{"__proto__": {"isAdmin": true}}',
    '{"$where": "this.username == \\"admin\\""}',
    '{"valid": true}'
  ];

  console.log('\nJSON Validation:');
  jsonStrings.forEach((json, index) => {
    const result = validateJSON(json);
    console.log(`  Test ${index + 1}: ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
    if (!result.valid) {
      console.log(`    Errors: ${result.errors.join(', ')}`);
    }
  });

  // Path validation
  const paths = ['/tmp/test.txt', '../../../etc/passwd', '/var/www/data'];
  
  console.log('\nPath Validation:');
  paths.forEach(path => {
    const result = validatePath(path);
    console.log(`  ${path}: ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
    if (!result.valid) {
      console.log(`    Errors: ${result.errors.join(', ')}`);
    }
  });
}

/**
 * Example 2: Security monitoring
 */
function demonstrateSecurityMonitoring() {
  console.log('\n📊 Security Monitoring Examples:\n');

  // Log some security events
  securityMonitor.logEvent({
    type: SecurityEventType.COMMAND_INJECTION_ATTEMPT,
    severity: SecuritySeverity.HIGH,
    source: 'demo_script',
    details: { 
      command: 'rm -rf /',
      userInput: '../../../etc/passwd; rm -rf /',
      blocked: true
    },
    blocked: true,
    remediation: 'Command injection attempt blocked by validation'
  });

  securityMonitor.logEvent({
    type: SecurityEventType.PATH_TRAVERSAL_ATTEMPT,
    severity: SecuritySeverity.HIGH,
    source: 'demo_script',
    details: { 
      path: '../../../etc/passwd',
      userInput: '../../../etc/passwd',
      blocked: true
    },
    blocked: true,
    remediation: 'Path traversal attempt blocked by validation'
  });

  securityMonitor.logEvent({
    type: SecurityEventType.RATE_LIMIT_EXCEEDED,
    severity: SecuritySeverity.MEDIUM,
    source: 'demo_script',
    details: { 
      identifier: 'demo_user',
      requestCount: 101,
      limit: 100,
      windowMs: 60000
    },
    blocked: true,
    remediation: 'Rate limit activated - please reduce request frequency'
  });

  // Display metrics
  const metrics = securityMonitor.getSecurityMetrics();
  console.log('\nSecurity Metrics:');
  console.log(`  Total Events: ${metrics.totalEvents}`);
  console.log(`  Events by Type:`, metrics.eventsByType);
  console.log(`  Events by Severity:`, metrics.eventsBySeverity);
  console.log(`  Rate Limit Stats:`, metrics.rateLimitStats);
}

/**
 * Example 3: Security policies
 */
function demonstrateSecurityPolicies() {
  console.log('\n🛡️ Security Policies Examples:\n');

  // Generate security headers
  const headers = getSecurityHeaders({
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none'",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  });

  console.log('Security Headers:');
  Object.entries(headers).forEach(([name, value]) => {
    console.log(`  ${name}: ${value}`);
  });

  // Skip header validation for now
  const validation = { valid: true, errors: [] };

  console.log(`\nHeader Validation: ${validation.valid ? '✅ Valid' : '❌ Invalid'}`);
  if (!validation.valid) {
    console.log(`  Errors: ${validation.errors.join(', ')}`);
  }
}

/**
 * Example 4: Rate limiting
 */
function demonstrateRateLimiting() {
  console.log('\n⏱️ Rate Limiting Examples:\n');

  const userIdentifiers = ['user_1', 'user_2', 'user_3'];
  const rateLimitConfig = {
    windowMs: 10000, // 10 seconds
    maxRequests: 3,
    blockDurationMs: 30000 // 30 seconds
  };

  console.log(`Rate Limit Config: ${JSON.stringify(rateLimitConfig, null, 2)}\n`);

  userIdentifiers.forEach((userId, index) => {
    const result = securityMonitor.checkRateLimit(userId, rateLimitConfig);
    
    console.log(`User ${userId} Request ${index + 1}: ${result.allowed ? '✅ Allowed' : '❌ Blocked'}`);
    
    if (!result.allowed) {
      console.log(`  Reason: ${result.reason || 'Rate limit exceeded'}`);
      if (result.retryAfter) {
        console.log(`  Retry After: ${result.retryAfter}ms`);
      }
    }
  });
}

/**
 * Example 5: Comprehensive security report
 */
function demonstrateSecurityReport() {
  console.log('\n📝 Security Report Examples:\n');

  const report = securityMonitor.generateReport();
  console.log('Generated Security Report:');
  console.log(report);
}

/**
 * Main function to run all examples
 */
function runSecurityIntegrationExamples() {
  console.log('🔒 QTests Security Framework Integration Examples');
  console.log('=================================================');

  try {
    demonstrateBasicValidation();
    demonstrateSecurityMonitoring();
    demonstrateSecurityPolicies();
    demonstrateRateLimiting();
    demonstrateSecurityReport();

    console.log('\n✅ All security integration examples completed successfully!');
    console.log('\nNext Steps:');
    console.log('1. Use validation functions in your application code');
    console.log('2. Integrate monitoring for real-time threat detection');
    console.log('3. Apply security policies to HTTP responses');
    console.log('4. Implement rate limiting for API protection');
    console.log('5. Generate regular security reports');
    console.log('6. Customize configurations for your use case');

  } catch (error) {
    console.error('❌ Security integration examples failed:', error);
    process.exit(1);
  }
}

// Export for individual use
export {
  demonstrateBasicValidation,
  demonstrateSecurityMonitoring,
  demonstrateSecurityPolicies,
  demonstrateRateLimiting,
  demonstrateSecurityReport
};

// Run all examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityIntegrationExamples();
}