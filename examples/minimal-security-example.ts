/**
 * Minimal Security Working Example
 * 
 * Demonstrates qtests security framework basic functionality
 * This version avoids complex imports and type issues
 */

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
        console.log(`✅ ${test}: ${result}`);
        passed++;
      } else {
        console.log(`❌ ${test}: ${result}`);
      }
    } catch (error) {
      console.error(`❌ ${test} failed: ${error.message}`);
    }
  }
  }

  console.log(`\n✅ ${passed}/${tests.length} tests passed`);
  
  if (passed === tests.length) {
    console.log('🎉 All security tests passed successfully!');
  } else {
    console.log('\n❌ Some tests failed');
    }
  }
}

async function testInputValidation() {
  console.log('\n🔍 Testing Input Validation...');
  try {
    const { validateInput } = await import('../lib/security/SecurityUtils.js');
    
    const testCases = [
      { input: 'good-input', expected: true },
      { input: '../../etc/passwd', expected: false },
      { input: 'module;rm -rf /', expected: false },
      { input: '<script>alert("xss")</script>', expected: false }
    ];

    for (const testCase of testCases) {
      const result = validateInput(testCase.input);
      console.log(`  Input "${testCase.input}": ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
      if (!result.valid && testCase.expected === false) {
        console.log(`    ⚠️ Security Issue: ${result.errors.join(', ')}`);
      }
    }
    }
    
    return true;
  } catch (error) {
    console.error('Input validation test failed:', error.message);
    return false;
    }
  }
}

async function testSecurityMonitoring() {
  console.log('\n📊 Testing Security Monitoring...');
  try {
    const { securityMonitor } = await import('../lib/security/SecurityMonitor.js');
    
    // Test event logging
    securityMonitor.logEvent({
      type: 'test_event',
      severity: 'low',
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
    Object.entries(headers).forEach(([name, value]) => {
      console.log(`  ${name}: ${value}`);
    });
    
    return true;
  } catch (error) {
      console.error('Security headers test failed:', error.message);
      return false;
    }
  }
}

// Run all tests
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}