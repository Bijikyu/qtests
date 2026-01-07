/**
 * Simple Security Integration Example
 * 
 * Basic demonstration of qtests security framework usage
 * without complex TypeScript or Express.js dependencies.
 */

import { 
  securityTestFixtures, 
  securityOutputFormatters, 
  securityTestRunner,
  runStandardSecurityValidation 
} from './lib/security/SecurityTestFramework.js';

console.log('🔒 Loading QTests Security Framework...');

// Example 1: Basic validation using shared framework
async function demonstrateValidation() {
  console.log('\n1. Basic Security Validation:');
  
  const { validateModuleId, validateJSON, validatePath } = await import('../lib/security/SecurityValidator.js');
  
  // Test module ID validation
  console.log('  Module ID Validation:');
  securityTestFixtures.moduleIds.forEach((testCase, index) => {
    const result = validateModuleId(testCase.input);
    console.log(securityOutputFormatters.formatValidationResult(testCase, result));
  });

  // Test JSON validation
  console.log('\n  JSON Validation:');
  securityTestFixtures.jsonStrings.forEach((testCase, index) => {
    const result = validateJSON(testCase.input);
    console.log(securityOutputFormatters.formatValidationResult(testCase, result));
  });

  // Test path validation
  console.log('\n  Path Validation:');
  securityTestFixtures.filePaths.forEach((testCase, index) => {
    const result = validatePath(testCase.input);
    console.log(securityOutputFormatters.formatValidationResult(testCase, result));
  });
}

// Example 2: Security monitoring using shared framework
async function demonstrateMonitoring() {
  console.log('\n2. Security Monitoring:');
  
  const { securityMonitor, SecurityEventType, SecuritySeverity } = await import('../lib/security/SecurityMonitor.js');
  
  console.log('  Logging security events...');
  
  // Log events from shared fixtures
  securityTestFixtures.securityEvents.forEach((eventData, index) => {
    const event = {
      type: eventData.type as any, // Cast to any for compatibility
      severity: eventData.severity as any,
      source: 'demo_script',
      details: eventData.details,
      blocked: eventData.expected.blocked,
      remediation: `${eventData.type} ${eventData.expected.blocked ? 'blocked' : 'logged'} by validation`
    };
    
    securityMonitor.logEvent(event);
    console.log(securityOutputFormatters.formatSecurityEvent(event));
  });

  // Get security metrics
  const metrics = securityMonitor.getSecurityMetrics();
  console.log('\n  Security Metrics:');
  console.log(`    Total Events: ${metrics.totalEvents}`);
  console.log(`    Events by Type:`, metrics.eventsByType);
  console.log(`    Events by Severity:`, metrics.eventsBySeverity);
  console.log(`    Active Rate Limits: ${metrics.activeRateLimits}`);
}

// Example 3: Security policies
function demonstratePolicies() {
  console.log('\n3. Security Policies:');
  
  import('../lib/security/SecurityPolicyManager.js').then(({ securityPolicyManager, getSecurityHeaders, getCSP }) => {
    
    // Generate security headers
    const headers = getSecurityHeaders({
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    });

    console.log('  Security Headers:');
    Object.entries(headers).forEach(([name, value]) => {
      console.log(`    ${name}: ${value}`);
    });

    // Generate CSP
    const csp = getCSP({
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", "data:", "https:"]
    });

    console.log('\n  Content Security Policy:');
    console.log(`    ${csp}`);

    // Validate headers
    const validation = securityPolicyManager.validateSecurityHeaders(headers);
    console.log(`\n  Header Validation: ${validation.valid ? '✅ Valid' : '❌ Invalid'}`);
    if (!validation.valid) {
      console.log(`    Errors: ${validation.errors.join(', ')}`);
    }
  });
}

// Example 4: Rate limiting using shared framework
async function demonstrateRateLimiting() {
  console.log('\n4. Rate Limiting:');
  
  const { securityMonitor } = await import('../lib/security/SecurityMonitor.js');
  
  const testIdentifiers = ['user1', 'user2', 'user3'];
  const rateLimitConfig = {
    windowMs: 10000, // 10 seconds
    maxRequests: 3,
    testRequests: 5
  };
  
  console.log('  Testing rate limiting...');
  
  // Use shared test runner for rate limiting tests
  await securityTestRunner.runRateLimitTests(
    testIdentifiers, 
    (identifier) => securityMonitor.checkRateLimit(identifier, rateLimitConfig),
    rateLimitConfig
  );

  // Show final rate limit stats
  const metrics = securityMonitor.getSecurityMetrics();
  console.log(`\n  Final Rate Limit Stats:`, {
    activeRateLimits: metrics.activeRateLimits,
    blockedRequests: metrics.blockedRequests
  });
}

// Example 5: Security testing using shared framework
async function demonstrateSecurityTesting() {
  console.log('\n5. Security Testing:');
  
  const { runFullSecurityTest, generateSecurityTestReport } = await import('../lib/security/SecurityTestingFramework.js');
  
  console.log('  Running security regression tests...');
  
  const results = runFullSecurityTest();
  console.log(`    Total Tests: ${results.length}`);
  console.log(`    Passed: ${results.filter(r => r.passed).length}`);
  console.log(`    Failed: ${results.filter(r => !r.passed).length}`);
  console.log(`    Vulnerabilities: ${results.reduce((sum, r) => sum + r.vulnerabilities.length, 0)}`);

  // Generate report
  const report = generateSecurityTestReport(results);
  console.log('\n  Security Test Report Generated');
  
  // Save report to file
  const fs = await import('fs');
  await fs.promises.writeFile('./demo-security-report.md', report);
  console.log('    Report saved to: ./demo-security-report.md');
}

// Example 6: Security utilities
function demonstrateSecurityUtilities() {
  console.log('\n6. Security Utilities:');
  
  import('../lib/security/SecurityUtils.js').then(({ 
    generateSecureToken, 
    validateFilePath,
    containsSuspiciousPatterns,
    createSecureErrorResponse
  }) => {
    
    // Generate secure tokens
    console.log('  Generating secure tokens:');
    for (let i = 0; i < 3; i++) {
      const token = generateSecureToken(16);
      console.log(`    Token ${i + 1}: ${token}`);
    }

    // Test file path validation
    const testPaths = ['/tmp/test.txt', '../../../etc/passwd'];
    console.log('\n  File Path Security:');
    testPaths.forEach(testPath => {
      const validation = validateFilePath(testPath);
      console.log(`    ${testPath}: ${validation.valid ? '✅ Secure' : '❌ Dangerous'}`);
      if (!validation.valid) {
        console.log(`      Error: ${validation.error}`);
      }
    });

    // Test suspicious pattern detection
    const testInputs = [
      'normal_input',
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '../../../etc/passwd'
    ];
    
    console.log('\n  Suspicious Pattern Detection:');
    testInputs.forEach((input, index) => {
      const check = containsSuspiciousPatterns(input);
      console.log(`    Input ${index + 1}: ${check.suspicious ? '❌ Suspicious' : '✅ Clean'}`);
      if (check.suspicious) {
        console.log(`      Patterns: ${check.patterns.join(', ')}`);
      }
    });

    // Create secure error responses
    console.log('\n  Secure Error Response:');
    const errorResponse = createSecureErrorResponse('This is a secure error message', 'SECURITY_ERROR');
    console.log(`    Response: ${JSON.stringify(errorResponse, null, 2)}`);
  });
}

// Main function to run all examples
async function runAllSecurityExamples() {
  console.log('🔒 QTests Security Framework Examples');
  console.log('=====================================');
  
  try {
    await demonstrateValidation();
    await demonstrateMonitoring();
    await demonstratePolicies();
    await demonstrateRateLimiting();
    await demonstrateSecurityTesting();
    await demonstrateSecurityUtilities();
    
    console.log('\n✅ All security examples completed successfully!');
    console.log('\nSecurity Framework Features Demonstrated:');
    console.log('  🔍 Input Validation & Sanitization');
    console.log('  📊 Security Monitoring & Alerting');
    console.log('  🛡️ Security Headers & Policies');
    console.log('  ⏱️ Rate Limiting & Abuse Prevention');
    console.log('  🧪 Security Testing & Vulnerability Scanning');
    console.log('  🔧 Security Utilities & Helpers');
    console.log('  📝 Security Reporting & Auditing');
    
  } catch (error) {
    console.error('❌ Security examples failed:', error);
    process.exit(1);
  }
}

// Export for individual use
export {
  demonstrateValidation,
  demonstrateMonitoring,
  demonstratePolicies,
  demonstrateRateLimiting,
  demonstrateSecurityTesting,
  demonstrateSecurityUtilities
};

// Run all examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllSecurityExamples();
}