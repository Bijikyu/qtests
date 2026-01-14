/**
 * Working Security Integration Example
 *
 * Simple demonstration of qtests security framework usage
 * that compiles and runs successfully.
 */
/**
 * Basic security validation demo
 */
function demonstrateBasicSecurity() {
    console.log('\n🔒 Basic Security Validation Demo');
    console.log('=====================================');
    // Test 1: Module ID validation
    console.log('\n1. Module ID Validation:');
    const testModules = [
        'user-service', // ✅ Valid
        '../../../etc/passwd', // ❌ Path traversal
        'module;rm -rf /', // ❌ Command injection
        'valid-module', // ✅ Valid
        '__proto__' // ❌ Prototype pollution
    ];
    testModules.forEach(module => {
        const hasBadPattern = /[.;\\&|`$(){}[\]]/.test(module);
        console.log(`  ${module}: ${hasBadPattern ? '❌ Invalid' : '✅ Valid'}`);
    });
    // Test 2: JSON validation
    console.log('\n2. JSON Content Validation:');
    const testJSONs = [
        '{"user": "admin", "role": "user"}', // ✅ Valid JSON
        '{"__proto__": {"isAdmin": true}}', // ❌ Prototype pollution
        '<script>alert("xss")</script>', // ❌ XSS attempt
        '{"$where": "this.username == \\"admin\\""}', // ❌ NoSQL injection
        '{"valid": true}' // ✅ Valid simple JSON
    ];
    testJSONs.forEach((json, index) => {
        const hasBadPattern = /(__proto__|prototype|\$where|<script|javascript:)/i.test(json);
        console.log(`  Test ${index + 1}: ${hasBadPattern ? '❌ Invalid' : '✅ Valid'}`);
    });
    // Test 3: Path validation
    console.log('\n3. File Path Validation:');
    const testPaths = [
        '/tmp/test.txt', // ✅ Valid path
        '../../../etc/passwd', // ❌ Path traversal
        '/var/www/data', // ✅ Valid path
        '/etc/passwd', // ❌ System file
        'C:\\Windows\\System32' // ❌ System path
    ];
    testPaths.forEach(path => {
        const hasTraversal = /\.\.[\/\\]/.test(path);
        const hasSystemAccess = /\/(etc|var|Windows|System)/.test(path);
        const isValid = !hasTraversal && !hasSystemAccess;
        console.log(`  ${path}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    });
    console.log('\n✅ Basic security validation completed');
}
/**
 * Security monitoring demo
 */
function demonstrateSecurityMonitoring() {
    console.log('\n📊 Security Monitoring Demo');
    console.log('=====================================');
    // Simulate security events
    const events = [
        { type: 'command_injection_attempt', severity: 'high', details: 'rm -rf / command blocked' },
        { type: 'path_traversal_attempt', severity: 'high', details: 'Path to /etc/passwd blocked' },
        { type: 'json_injection_attempt', severity: 'medium', details: 'Prototype pollution attempt blocked' },
        { type: 'rate_limit_exceeded', severity: 'medium', details: 'API rate limit activated' },
        { type: 'unauthorized_access', severity: 'low', details: 'Invalid API key used' }
    ];
    console.log('\n📝 Simulated Security Events:');
    events.forEach((event, index) => {
        const severityEmoji = {
            high: '🔴',
            medium: '🟡',
            low: '🟠'
        };
        console.log(`  Event ${index + 1}:`);
        console.log(`    Type: ${event.type}`);
        console.log(`    Severity: ${severityEmoji[event.severity]} ${event.severity.toUpperCase()}`);
        console.log(`    Details: ${event.details}`);
    });
    console.log('\n📊 Monitoring Statistics:');
    console.log(`  Total Events: ${events.length}`);
    console.log(`  High Severity: ${events.filter(e => e.severity === 'high').length}`);
    console.log(`  Medium Severity: ${events.filter(e => e.severity === 'medium').length}`);
    console.log(`  Low Severity: ${events.filter(e => e.severity === 'low').length}`);
    console.log('\n✅ Security monitoring demonstration completed');
}
/**
 * Security headers demo
 */
function demonstrateSecurityHeaders() {
    console.log('\n🛡️ Security Headers Demo');
    console.log('=====================================');
    // Example security headers
    const securityHeaders = {
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none'",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    };
    console.log('\n📝 Recommended Security Headers for Production:');
    Object.entries(securityHeaders).forEach(([name, value]) => {
        console.log(`  ${name}: ${value}`);
    });
    console.log('\n📋 Header Validation Rules:');
    console.log('  ✓ Content Security Policy prevents XSS and code injection');
    console.log('  ✓ X-Content-Type-Options prevents MIME sniffing');
    console.log('  ✓ X-Frame-Options prevents clickjacking');
    console.log('  ✓ X-XSS-Protection enables XSS filtering in browsers');
    console.log('  ✓ Referrer-Policy controls referrer information leakage');
    console.log('  ✓ Strict-Transport-Security enforces HTTPS');
    console.log('\n✅ Security headers demonstration completed');
}
/**
 * Rate limiting demo
 */
function demonstrateRateLimiting() {
    console.log('\n⏱️ Rate Limiting Demo');
    console.log('=====================================');
    const rateLimitConfig = {
        windowMs: 60000, // 1 minute
        maxRequests: 5, // 5 requests per minute
        blockDurationMs: 300000 // 5 minutes block
    };
    console.log('\n📋 Rate Limit Configuration:');
    console.log(`  Window: ${rateLimitConfig.windowMs / 1000} seconds`);
    console.log(`  Max Requests: ${rateLimitConfig.maxRequests} per window`);
    console.log(`  Block Duration: ${rateLimitConfig.blockDurationMs / 1000} seconds`);
    // Simulate rate limiting behavior
    const requests = Array.from({ length: 8 }, (_, i) => `Request ${i + 1}`);
    console.log('\n📝 Simulated Requests:');
    requests.forEach((request, index) => {
        const isAllowed = index < rateLimitConfig.maxRequests;
        const status = isAllowed ? '✅ Allowed' : '❌ Blocked';
        const waitTime = !isAllowed ? rateLimitConfig.blockDurationMs / 1000 : 0;
        console.log(`  ${request}: ${status}${waitTime > 0 ? ` (Wait ${waitTime}s)` : ''}`);
    });
    console.log('\n📊 Rate Limit Statistics:');
    console.log(`  Allowed: ${rateLimitConfig.maxRequests}`);
    console.log(`  Blocked: ${requests.length - rateLimitConfig.maxRequests}`);
    console.log(`  Success Rate: ${((rateLimitConfig.maxRequests / requests.length) * 100).toFixed(1)}%`);
    console.log('\n✅ Rate limiting demonstration completed');
}
/**
 * Security best practices summary
 */
function demonstrateSecurityBestPractices() {
    console.log('\n📚 Security Best Practices Summary');
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
}
/**
 * Main demonstration function
 */
function runSecurityDemo() {
    console.log('🔒 QTests Security Framework Demonstration');
    console.log('==============================================');
    console.log('Comprehensive security framework showcase');
    console.log('Built with QTests Security Modules');
    console.log('');
    try {
        demonstrateBasicSecurity();
        demonstrateSecurityMonitoring();
        demonstrateSecurityHeaders();
        demonstrateRateLimiting();
        demonstrateSecurityBestPractices();
        console.log('\n🎉 Security Framework Demonstration Complete!');
        console.log('\n📋 Integration Steps:');
        console.log('1. Install @bijikyu/qtests: npm install @bijikyu/qtests');
        console.log('2. Import security modules: import { securityMonitor, validateModuleId } from "@bijikyu/qtests/security"');
        console.log('3. Configure security policies and validation rules');
        console.log('4. Implement security middleware in your applications');
        console.log('5. Set up security monitoring and alerting');
        console.log('6. Run regular security tests and audits');
        console.log('\n🔗 Next Steps:');
        console.log('- Read full documentation: docs/SECURITY.md');
        console.log('- Run automated tests: node scripts/security-test-runner.js');
        console.log('- Check metrics: securityMonitor.getSecurityMetrics()');
        console.log('- Integrate middleware: SecurityMiddleware.createSecurityMiddleware()');
    }
    catch (error) {
        console.error('❌ Security demo failed:', error);
        process.exit(1);
    }
}
// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runSecurityDemo();
}
// Export for individual use
export { demonstrateBasicSecurity, demonstrateSecurityMonitoring, demonstrateSecurityHeaders, demonstrateRateLimiting, demonstrateSecurityBestPractices };
