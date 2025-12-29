/**
 * Simple Security Integration Example
 *
 * Basic demonstration of qtests security framework usage
 * without complex TypeScript or Express.js dependencies.
 */
// Import security modules (simplified)
console.log('🔒 Loading QTests Security Framework...');
// Example 1: Basic validation
function demonstrateValidation() {
    console.log('\n1. Basic Security Validation:');
    // Import validation modules
    import('../lib/security/SecurityValidator.js').then(({ validateModuleId, validateJSON, validatePath }) => {
        // Test module ID validation
        const testModules = ['user-service', '../../../etc/passwd', 'valid-module', 'module;rm -rf /'];
        console.log('  Module ID Validation:');
        testModules.forEach(moduleId => {
            const result = validateModuleId(moduleId);
            console.log(`    ${moduleId}: ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
            if (!result.valid) {
                console.log(`      Errors: ${result.errors.join(', ')}`);
            }
        });
        // Test JSON validation
        const testJSON = [
            '{"user": "admin"}', // Valid
            '{"__proto__": {"isAdmin": true}}', // Prototype pollution
            '{"$where": "this.username == \\"admin\\""}', // NoSQL injection
            '<script>alert("xss")</script>' // XSS attempt
        ];
        console.log('\n  JSON Validation:');
        testJSON.forEach((jsonString, index) => {
            const result = validateJSON(jsonString);
            console.log(`    Test ${index + 1}: ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
            if (!result.valid) {
                console.log(`      Errors: ${result.errors.join(', ')}`);
            }
        });
        // Test path validation
        const testPaths = ['/tmp/file.txt', '../../../etc/passwd', '/var/www/data', '/valid/path'];
        console.log('\n  Path Validation:');
        testPaths.forEach(testPath => {
            const result = validatePath(testPath);
            console.log(`    ${testPath}: ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
            if (!result.valid) {
                console.log(`      Errors: ${result.errors.join(', ')}`);
            }
        });
    });
}
// Example 2: Security monitoring
function demonstrateMonitoring() {
    console.log('\n2. Security Monitoring:');
    import('../lib/security/SecurityMonitor.js').then(({ securityMonitor, SecurityEventType, SecuritySeverity }) => {
        // Log some example security events
        console.log('  Logging security events...');
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
        // Get security metrics
        const metrics = securityMonitor.getSecurityMetrics();
        console.log('\n  Security Metrics:');
        console.log(`    Total Events: ${metrics.totalEvents}`);
        console.log(`    Events by Type:`, metrics.eventsByType);
        console.log(`    Events by Severity:`, metrics.eventsBySeverity);
        console.log(`    Rate Limit Stats:`, metrics.rateLimitStats);
    });
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
// Example 4: Rate limiting
function demonstrateRateLimiting() {
    console.log('\n4. Rate Limiting:');
    import('../lib/security/SecurityMonitor.js').then(({ securityMonitor }) => {
        const testIdentifiers = ['user1', 'user2', 'user3'];
        console.log('  Testing rate limiting...');
        // Test rate limiting with multiple requests
        testIdentifiers.forEach((identifier, index) => {
            for (let i = 0; i < 5; i++) {
                const result = securityMonitor.checkRateLimit(identifier, {
                    windowMs: 10000, // 10 seconds
                    maxRequests: 3
                });
                console.log(`    ${identifier} Request ${i + 1}: ${result.allowed ? '✅ Allowed' : '❌ Blocked'}`);
                if (!result.allowed) {
                    console.log(`      Reason: ${result.reason}`);
                }
            }
        });
        // Show final rate limit stats
        const metrics = securityMonitor.getSecurityMetrics();
        console.log(`\n  Final Rate Limit Stats:`, metrics.rateLimitStats);
    });
}
// Example 5: Security testing
function demonstrateSecurityTesting() {
    console.log('\n5. Security Testing:');
    import('../lib/security/SecurityTestingFramework.js').then(({ runFullSecurityTest, generateSecurityTestReport }) => {
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
    });
}
// Example 6: Security utilities
function demonstrateSecurityUtilities() {
    console.log('\n6. Security Utilities:');
    import('../lib/security/SecurityUtils.js').then(({ generateSecureToken, validateFilePath, containsSuspiciousPatterns, createSecureErrorResponse }) => {
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
    }
    catch (error) {
        console.error('❌ Security examples failed:', error);
        process.exit(1);
    }
}
// Export for individual use
export { demonstrateValidation, demonstrateMonitoring, demonstratePolicies, demonstrateRateLimiting, demonstrateSecurityTesting, demonstrateSecurityUtilities };
// Run all examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllSecurityExamples();
}
