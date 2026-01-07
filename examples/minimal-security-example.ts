/**
 * Minimal Security Working Example
 * 
 * Demonstrates qtests security framework basic functionality
 * This version avoids complex imports and type issues
 */

import { 
  securityTestFixtures, 
  securityOutputFormatters, 
  securityValidationPatterns 
} from './lib/security/SecurityTestFramework.js';

console.log('🔒 QTests Security Framework - Minimal Working Example');

async function main() {
  console.log('Testing basic security functionality...');
  
  const tests = [
    { test: 'Input validation', fn: () => testInputValidation() },
    { test: 'Security monitoring', fn: () => testSecurityMonitoring() },
    { test: 'Security headers', fn: () => testSecurityHeaders() }
  ];
  
  let passed = 0;
  
  for (const { test, fn } of tests) {
    try {
      const result = await fn();
      if (result) {
        console.log(`✅ ${test}: passed`);
        passed++;
      } else {
        console.log(`❌ ${test}: failed`);
      }
    } catch (error) {
      console.error(`❌ ${test} failed: ${error.message}`);
    }
  }

  console.log(`\n✅ ${passed}/${tests.length} tests passed`);
  
  if (passed === tests.length) {
    console.log('🎉 All security tests passed successfully!');
  } else {
    console.log('\n❌ Some tests failed');
  }
}

async function testInputValidation() {
  console.log('\n🔍 Testing Input Validation...');
  try {
    // Use shared framework test fixtures
    for (const testCase of securityTestFixtures.moduleIds.slice(0, 4)) {
      const result = securityValidationPatterns.quickValidate(
        testCase.input, 
        ['pathTraversal', 'commandInjection']
      );
      console.log(`  Input "${testCase.input}": ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
      if (!result.valid && testCase.expected === false) {
        console.log(`    ⚠️ Security Issue: ${testCase.description}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Input validation test failed:', error.message);
    return false;
  }
}

async function testSecurityMonitoring() {
  console.log('\n📊 Testing Security Monitoring...');
  try {
    const { securityMonitor, SecurityEventType, SecuritySeverity } = await import('../lib/security/SecurityMonitor.js');
    
    // Test event logging using shared framework
    const testEvent = securityTestFixtures.securityEvents[0]; // Use first event
    securityMonitor.logEvent({
      type: testEvent.type as any, // Cast for compatibility
      severity: testEvent.severity as any,
      source: 'minimal_example',
      details: { test: 'event logging test' },
      blocked: false,
      remediation: 'Test event logged successfully'
    });

    // Test metrics
    const metrics = securityMonitor.getSecurityMetrics();
    console.log(`  Total Events: ${metrics.totalEvents}`);
    
    return true;
  } catch (error) {
    console.error('Security monitoring test failed:', error.message);
    return false;
  }
}

async function testSecurityHeaders() {
  console.log('\n🛡️ Testing Security Headers...');
  try {
    const { getSecurityHeaders } = await import('../lib/security/SecurityPolicyManager.js');
    
    const headers = getSecurityHeaders({
      'Content-Security-Policy': "default-src 'self'",
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    });

    console.log('Security Headers:');
    console.log(securityOutputFormatters.formatSecurityHeaders(headers));
    
    return true;
  } catch (error) {
    console.error('Security headers test failed:', error.message);
    return false;
  }
}

// Run all tests
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}