/**
 * Shared Security Test Framework
 * 
 * This module provides common test data, validation patterns, and helper functions
 * to eliminate duplication across security example files. It serves as a centralized
 * repository for security testing utilities.
 */

// Common test data fixtures
export const securityTestFixtures = {
  // Module ID test cases
  moduleIds: [
    { input: 'user-service', expected: true, description: 'Valid module name' },
    { input: '../../../etc/passwd', expected: false, description: 'Path traversal attack' },
    { input: 'module;rm -rf /', expected: false, description: 'Command injection' },
    { input: 'valid-module', expected: true, description: 'Valid hyphenated module' },
    { input: '__proto__', expected: false, description: 'Prototype pollution attempt' },
    { input: 'module;rm -rf /', expected: false, description: 'Command injection with semicolon' }
  ],

  // JSON test cases
  jsonStrings: [
    { input: '{"user": "admin"}', expected: true, description: 'Valid simple JSON' },
    { input: '{"__proto__": {"isAdmin": true}}', expected: false, description: 'Prototype pollution' },
    { input: '{"$where": "this.username == \\"admin\\""}', expected: false, description: 'NoSQL injection' },
    { input: '<script>alert("xss")</script>', expected: false, description: 'XSS attempt' },
    { input: '{"valid": true}', expected: true, description: 'Valid boolean JSON' },
    { input: '{"user": "admin", "role": "user"}', expected: true, description: 'Valid complex JSON' }
  ],

  // File path test cases
  filePaths: [
    { input: '/tmp/file.txt', expected: true, description: 'Valid temporary file path' },
    { input: '../../../etc/passwd', expected: false, description: 'Path traversal attack' },
    { input: '/var/www/data', expected: true, description: 'Valid web data path' },
    { input: '/valid/path', expected: true, description: 'Valid relative path' },
    { input: '/etc/passwd', expected: false, description: 'System file access' },
    { input: 'C:\\Windows\\System32', expected: false, description: 'Windows system path' }
  ],

  // Security event test cases
  securityEvents: [
    {
      type: 'command_injection_attempt',
      severity: 'high',
      details: 'rm -rf / command blocked',
      expected: { valid: true, blocked: true }
    },
    {
      type: 'path_traversal_attempt',
      severity: 'high',
      details: 'Path to /etc/passwd blocked',
      expected: { valid: true, blocked: true }
    },
    {
      type: 'json_injection_attempt',
      severity: 'medium',
      details: 'Prototype pollution attempt blocked',
      expected: { valid: true, blocked: true }
    },
    {
      type: 'rate_limit_exceeded',
      severity: 'medium',
      details: 'API rate limit activated',
      expected: { valid: true, blocked: true }
    },
    {
      type: 'unauthorized_access',
      severity: 'low',
      details: 'Invalid API key used',
      expected: { valid: true, blocked: false }
    }
  ]
};

// Console output formatting utilities
export const securityOutputFormatters = {
  // Format validation test results
  formatValidationResult(testCase, result, index = null) {
    const prefix = index !== null ? `Test ${index + 1}:` : '';
    const status = result.valid ? '✅ Valid' : '❌ Invalid';
    const description = testCase.description ? ` (${testCase.description})` : '';
    
    let output = `  ${prefix} "${testCase.input}": ${status}${description}`;
    
    if (!result.valid && result.errors) {
      output += `\n    Errors: ${result.errors.join(', ')}`;
    }
    
    return output;
  },

  // Format security events with severity indicators
  formatSecurityEvent(event, index = null) {
    const prefix = index !== null ? `Event ${index + 1}:` : '';
    const severityEmojis = {
      high: '🔴',
      medium: '🟡',
      low: '🟠',
      critical: '🚨'
    };
    
    const emoji = severityEmojis[event.severity] || '⚪';
    
    return [
      `  ${prefix}`,
      `    Type: ${event.type}`,
      `    Severity: ${emoji} ${event.severity.toUpperCase()}`,
      `    Details: ${event.details}`
    ].join('\n');
  },

  // Format rate limiting test results
  formatRateLimitResult(requestIndex, allowed, waitTime = 0) {
    const status = allowed ? '✅ Allowed' : '❌ Blocked';
    const waitInfo = waitTime > 0 ? ` (Wait ${waitTime}s)` : '';
    return `  Request ${requestIndex + 1}: ${status}${waitInfo}`;
  },

  // Format security headers
  formatSecurityHeaders(headers) {
    return Object.entries(headers).map(([name, value]) => 
      `  ${name}: ${value}`
    ).join('\n');
  }
};

// Common validation patterns
export const securityValidationPatterns = {
  // Basic pattern matching for quick validation
  patterns: {
    pathTraversal: /\.\.[\/\\]/,
    commandInjection: /[.;\\&|`$(){}\[\]]/,
    xss: /<script|javascript:/i,
    prototypePollution: /__proto__|constructor|prototype/i,
    sqlInjection: /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b/i,
    nosqlInjection: /\$where|\$ne|\$gt|\$lt|\$regex/i,
    systemAccess: /\/(etc|var|Windows|System)/
  },

  // Quick validation function for common patterns
  quickValidate(input, patterns = []) {
    for (const patternName of patterns) {
      const pattern = this.patterns[patternName];
      if (pattern && pattern.test(input)) {
        return { valid: false, pattern: patternName };
      }
    }
    return { valid: true };
  }
};

// Security test runner utilities
export class SecurityTestRunner {
  constructor() {
    this.results = [];
  }

  // Run validation tests with common pattern
  async runValidationTests(testCases, validator, testName) {
    console.log(`\n${testName}:`);
    const results = [];
    
    for (const [index, testCase] of testCases.entries()) {
      try {
        const result = await validator(testCase.input);
        const passed = result.valid === testCase.expected;
        
        console.log(securityOutputFormatters.formatValidationResult(testCase, result, index));
        
        results.push({
          testCase,
          result,
          passed,
          index
        });
      } catch (error) {
        console.error(`  ❌ Test ${index + 1} failed: ${error.message}`);
        results.push({
          testCase,
          result: { valid: false, error: error.message },
          passed: false,
          index
        });
      }
    }
    
    return results;
  }

  // Run rate limiting tests
  async runRateLimitTests(testIdentifiers, rateLimiter, config) {
    console.log('\nRate Limiting Tests:');
    
    const results = [];
    for (const identifier of testIdentifiers) {
      for (let i = 0; i < config.testRequests; i++) {
        const result = rateLimiter(identifier, config);
        
        console.log(securityOutputFormatters.formatRateLimitResult(
          i, 
          result.allowed, 
          !result.allowed ? config.blockDurationMs / 1000 : 0
        ));
        
        results.push({
          identifier,
          requestIndex: i,
          result
        });
      }
    }
    
    return results;
  }

  // Generate summary report
  generateSummary(allResults) {
    const totalTests = allResults.flat().length;
    const passedTests = allResults.flat().filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      successRate: ((passedTests / totalTests) * 100).toFixed(1)
    };
  }
}

// Export default test runner instance
export const securityTestRunner = new SecurityTestRunner();

// Convenience functions for common test scenarios
export async function runStandardSecurityValidation() {
  const { validateModuleId, validateJSON, validatePath } = await import('./SecurityValidator.js');
  
  console.log('🔒 Running Standard Security Validation Tests');
  console.log('==========================================');
  
  const results = [];
  
  // Test module validation
  const moduleResults = await securityTestRunner.runValidationTests(
    securityTestFixtures.moduleIds,
    validateModuleId,
    'Module ID Validation'
  );
  results.push(moduleResults);
  
  // Test JSON validation
  const jsonResults = await securityTestRunner.runValidationTests(
    securityTestFixtures.jsonStrings,
    validateJSON,
    'JSON Content Validation'
  );
  results.push(jsonResults);
  
  // Test path validation
  const pathResults = await securityTestRunner.runValidationTests(
    securityTestFixtures.filePaths,
    validatePath,
    'File Path Validation'
  );
  results.push(pathResults);
  
  const summary = securityTestRunner.generateSummary(results);
  
  console.log(`\n📊 Validation Summary:`);
  console.log(`  Total: ${summary.total}`);
  console.log(`  Passed: ${summary.passed}`);
  console.log(`  Failed: ${summary.failed}`);
  console.log(`  Success Rate: ${summary.successRate}%`);
  
  return summary;
}