/**
 * QTests Security Framework - Index
 *
 * Central export point for all qtests security modules.
 * Provides comprehensive security functionality including monitoring,
 * validation, policy management, and testing.
 */
// Core security components
export { SecurityMonitor, securityMonitor, SecurityEventType, SecuritySeverity } from './SecurityMonitor.js';
export { SecurityValidator, securityValidator, validateInput, validateJSON, validateModuleId, validatePath } from './SecurityValidator.js';
export { SecurityPolicyManager, securityPolicyManager, getSecurityHeaders, getCSP, getCORSConfig } from './SecurityPolicyManager.js';
export { PenetrationTester, SecurityRegressionTester, penetrationTester, securityRegressionTester, runFullSecurityTest, generateSecurityTestReport } from './SecurityTestingFramework.js';
// Convenience exports for common security operations
export const logSecurityEvent = (type, severity, source, details, blocked = true, remediation) => {
    return import('./SecurityMonitor.js').then(({ securityMonitor }) => {
        return securityMonitor.logEvent({
            type,
            severity,
            source,
            details,
            blocked,
            remediation
        });
    });
};
export const validateAllInputs = (inputs, ruleSet = 'default') => {
    return import('./SecurityValidator.js').then(({ securityValidator }) => {
        const results = {};
        for (const [key, value] of Object.entries(inputs)) {
            const ruleName = `${ruleSet}_${key}`;
            let result;
            try {
                switch (key) {
                    case 'moduleId':
                        result = securityValidator.validateModuleId(value);
                        break;
                    case 'path':
                    case 'filePath':
                        result = securityValidator.validatePath(value);
                        break;
                    case 'json':
                    case 'jsonContent':
                        result = securityValidator.validateJSON(value);
                        break;
                    case 'command':
                        result = securityValidator.validateCommand(value);
                        break;
                    case 'envVar':
                    case 'environment':
                        result = securityValidator.validateEnvironmentVariable(value);
                        break;
                    default:
                        result = securityValidator.validate(value, ruleName);
                        break;
                }
            }
            catch (error) {
                result = {
                    valid: false,
                    errors: [`Validation error for ${key}: ${String(error)}`],
                    warnings: [],
                    securityFlags: []
                };
            }
            results[key] = result;
        }
        const allResults = Object.values(results);
        return {
            valid: allResults.every(r => r.valid),
            results,
            errors: allResults.flatMap(r => r.errors),
            warnings: allResults.flatMap(r => r.warnings),
            securityFlags: allResults.flatMap(r => r.securityFlags)
        };
    });
};
export const applySecurityHeaders = (response, config) => {
    return import('./SecurityPolicyManager.js').then(({ securityPolicyManager }) => {
        return securityPolicyManager.applySecurityHeaders(response, config);
    });
};
// Note: runSecurityAudit requires the security-test-runner.js to be imported dynamically
// to avoid module resolution issues. Use the script directly for now:
// node scripts/security-test-runner.js
export const getSecurityStatus = () => {
    return Promise.all([
        import('./SecurityMonitor.js'),
        import('./SecurityPolicyManager.js'),
        import('./SecurityValidator.js')
    ]).then(([{ securityMonitor }, { securityPolicyManager }, { securityValidator }]) => {
        const metrics = securityMonitor.getSecurityMetrics();
        const headers = securityPolicyManager.generateSecurityHeaders();
        const ruleSets = securityValidator.getRuleSets();
        return {
            timestamp: new Date().toISOString(),
            metrics,
            securityHeaders: Object.keys(headers).length,
            validationRules: ruleSets.length,
            status: metrics.totalEvents === 0 ? 'secure' : 'active_monitoring'
        };
    });
};
export const generateFullSecurityReport = () => {
    return getSecurityStatus().then(status => {
        return import('./SecurityMonitor.js').then(({ securityMonitor }) => {
            const metrics = securityMonitor.generateReport();
            return {
                timestamp: status.timestamp,
                status: status.status,
                metrics,
                recommendations: generateRecommendations(status)
            };
        });
    });
};
/**
 * Generate security recommendations based on current status
 */
function generateRecommendations(status) {
    const recommendations = [];
    if (status.metrics.totalEvents > 0) {
        recommendations.push('Security events detected - review security logs');
        recommendations.push('Consider increasing monitoring sensitivity');
    }
    if (status.securityHeaders < 5) {
        recommendations.push('Add more comprehensive security headers');
    }
    if (status.validationRules < 3) {
        recommendations.push('Add more input validation rules');
    }
    if (recommendations.length === 0) {
        recommendations.push('Security configuration looks good - continue monitoring');
    }
    return recommendations;
}
