/**
 * Working Security Example
 * 
 * Simple demonstration of qtests security framework
 * that compiles and runs successfully.
 */

import { 
  securityTestFixtures, 
  securityOutputFormatters, 
  securityValidationPatterns,
  securityTestRunner 
} from './lib/security/SecurityTestFramework.js';

/**
 * Test 1: Basic validation using shared framework
 */
async function test1_BasicValidation() {
  console.log('\n1. Basic Security Validation Demo:');
  
  // Use shared test fixtures and patterns
  console.log('Module ID Validation:');
  securityTestFixtures.moduleIds.forEach(testCase => {
    const result = securityValidationPatterns.quickValidate(
      testCase.input, 
      ['commandInjection', 'prototypePollution']
    );
    const isValid = result.valid && testCase.expected;
    console.log(`  ${testCase.input}: ${isValid ? '✅ Valid' : '❌ Invalid'} (${testCase.description})`);
  });

  // Test JSON validation
  console.log('\n2. JSON Content Validation:');
  securityTestFixtures.jsonStrings.forEach((testCase, index) => {
    const result = securityValidationPatterns.quickValidate(
      testCase.input, 
      ['xss', 'prototypePollution', 'nosqlInjection']
    );
    const isValid = result.valid && testCase.expected;
    console.log(`  Test ${index + 1}: ${isValid ? '✅ Valid' : '❌ Invalid'} (${testCase.description})`);
  });

  // Test path validation
  console.log('\n3. File Path Validation:');
  securityTestFixtures.filePaths.forEach(testCase => {
    const result = securityValidationPatterns.quickValidate(
      testCase.input, 
      ['pathTraversal', 'systemAccess']
    );
    const isValid = result.valid && testCase.expected;
    console.log(`  ${testCase.input}: ${isValid ? '✅ Valid' : '❌ Invalid'} (${testCase.description})`);
  });

  console.log('\n✅ Basic security validation completed');
  return true;
}

/**
 * Test 2: Security monitoring using shared framework
 */
async function test2_SecurityMonitoring() {
  console.log('\n2. Security Monitoring Demo:');
  
  console.log('\n📝 Simulated Security Events:');
  securityTestFixtures.securityEvents.forEach((eventData) => {
    console.log(securityOutputFormatters.formatSecurityEvent(eventData));
  });

  console.log('\n📊 Security Monitoring Statistics:');
  const events = securityTestFixtures.securityEvents;
  console.log(`  Total Events: ${events.length}`);
  console.log(`  High Severity: ${events.filter(e => e.severity === 'high').length}`);
  console.log(`  Medium Severity: ${events.filter(e => e.severity === 'medium').length}`);
  console.log(`  Low Severity: ${events.filter(e => e.severity === 'low').length}`);

  console.log('\n✅ Security monitoring demonstration completed');
  return true;
}

/**
 * Test 3: Security headers using shared framework
 */
function test3_SecurityHeaders() {
  console.log('\n3. Security Headers Demo:');
  
  const headers = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  };

  console.log('\n📝 Recommended Security Headers for Production:');
  console.log(securityOutputFormatters.formatSecurityHeaders(headers));

  console.log('\n📋 Header Validation Rules:');
  console.log('  ✓ Content Security Policy prevents XSS and code injection');
  console.log('  ✓ X-Content-Type-Options prevents MIME sniffing');
  console.log('  ✓ X-Frame-Options prevents clickjacking');
  console.log('  ✓ X-XSS-Protection enables XSS filtering in browsers');
  console.log('  ✓ Referrer-Policy controls referrer information leakage');
  console.log('  ✓ Strict-Transport-Security enforces HTTPS');

  console.log('\n✅ Security headers demonstration completed');
  return true;
}

/**
 * Test 4: Rate limiting
 */
function test4_RateLimiting() {
  console.log('\n4. Rate Limiting Demo:');
  
  const rateLimitConfig = {
    windowMs: 60000,    // 1 minute
    maxRequests: 5,
    blockDurationMs: 300000  // 5 minutes
  };

  console.log('\n📋 Rate Limit Configuration:');
  console.log(`  Window: ${rateLimitConfig.windowMs / 1000} seconds`);
  console.log(`  Max Requests: ${rateLimitConfig.maxRequests} per window`);
  console.log(`  Block Duration: ${rateLimitConfig.blockDurationMs / 1000} seconds`);

  const requests = Array.from({ length: 8 }, (_, i) => `Request ${i + 1}`);
  console.log('\n📝 Simulated Requests:');
  
  requests.forEach((request, index) => {
    const isAllowed = index < rateLimitConfig.maxRequests;
    const status = isAllowed ? '✅ Allowed' : '❌ Blocked';
    const waitTime = !isAllowed ? rateLimitConfig.blockDurationMs / 1000 : 0;
    
    console.log(`  Request ${index + 1}: ${status}${waitTime > 0 ? ` (Wait ${waitTime}s)` : ''}`);
  });

  console.log('\n📊 Rate Limit Statistics:');
  console.log(`  Allowed: ${rateLimitConfig.maxRequests}`);
  console.log(`  Blocked: ${requests.length - rateLimitConfig.maxRequests}`);
  console.log(` Success Rate: ${((rateLimitConfig.maxRequests / requests.length) * 100).toFixed(1)}%`);

  console.log('\n✅ Rate limiting demonstration completed');
  return true;
}

/**
 * Test 5: Best practices summary
 */
function test5_SecurityBestPractices() {
  console.log('\n5. Security Best Practices Summary:');
  console.log('=====================================');

  const bestPractices = [
    {
      category: 'Input Validation',
      practices: [
        '✅ Validate all user input at application entry points',
        '✅ Use allowlists instead of blocklists when possible',
        '✅ Sanitize data before processing or storage',
        '✅ Implement length limits and type checking',
        '✅ Validate file paths to prevent traversal attacks'
      ]
    },
    {
      category: 'Output Encoding',
      practices: [
        '✅ Escape HTML entities in web responses',
        '✅ Use JSON encoding for API responses',
        '✅ Set proper Content-Type headers',
        '✅ Implement Content Security Policy (CSP)'
      ]
    },
    {
      category: 'Authentication & Authorization',
      practices: [
        '✅ Use strong authentication mechanisms',
        '✅ Implement rate limiting on authentication',
        '✅ Use secure session management',
        '✅ Validate API keys and tokens',
        '✅ Implement proper authorization checks'
      ]
    },
    {
      category: 'Security Headers',
      practices: [
        '✅ Set Content Security Policy (CSP)',
        '✅ Use X-Frame-Options to prevent clickjacking',
        '✅ Set X-Content-Type-Options: nosniff',
        '✅ Implement Strict-Transport-Security (HSTS)',
        '✅ Use Referrer-Policy for privacy'
      ]
    },
    {
      category: 'Monitoring & Logging',
      practices: [
        '✅ Log security events with full context',
        '✅ Implement real-time monitoring and alerting',
        '✅ Use structured logging for security analysis',
        '✅ Regular security audits and penetration testing',
        '✅ Monitor for anomalies and attack patterns'
      ]
    }
  ];

  bestPractices.forEach(({ category, practices }) => {
    console.log(`\n${category}:`);
    practices.forEach(practice => console.log(`  ${practice}`));
  });

  console.log('\n✅ Security best practices summary completed');
  return true;
}

/**
 * Main demonstration function
 */
async function runSecurityDemo() {
  console.log('🔒 QTests Security Framework Demonstration');
  console.log('==============================================');
  
  try {
    const success1 = await test1_BasicValidation();
    const success2 = await test2_SecurityMonitoring();
    const success3 = test3_SecurityHeaders();
    const success4 = test4_RateLimiting();
    const success5 = test5_SecurityBestPractices();

    console.log('\n🎉 Security Framework Demonstration Complete!');
    
    console.log('\n📊 Next Steps:');
    console.log('1. Install qtests: npm install qtests');
    console.log('2. Import security modules: import { securityMonitor, validateInput } from "qtests/security"');
    console.log('3. Configure security policies and validation rules');
    console.log('4. Implement security middleware in your applications');
    console.log('5. Set up security monitoring and alerting');
    console.log('6. Run regular security tests and audits');
    
    console.log('\n🎉 Security Framework Demonstration Complete!');
    
    console.log('\n📊 Integration Steps:');
    console.log('1. Install qtests: npm install qtests');
    console.log('2. Import security modules: import { securityMonitor, validateInput } from "qtests/security"');
    console.log('3. Configure security policies and validation rules');
    console.log('4. Implement security middleware in your applications');
    console.log('5. Set up security monitoring and alerting');
    console.log('6. Run regular security tests and audits');
    console.log('7. Check metrics: securityMonitor.getSecurityMetrics()');
    console.log('8. Integrate middleware: SecurityMiddleware.createSecurityMiddleware()');

    console.log('\n✅ All security examples completed successfully!');
    
  } catch (error) {
    console.error('❌ Security demo failed:', error);
    process.exit(1);
  }
}

// Export for individual use
export {
  test1_BasicValidation,
  test2_SecurityMonitoring,
  test3_SecurityHeaders,
  test4_RateLimiting,
  test5_SecurityBestPractices
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityDemo();
}
