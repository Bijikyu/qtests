/**
 * QTests Security Framework - Index
 * 
 * Central export point for all qtests security modules.
 * Provides comprehensive security functionality including monitoring,
 * validation, policy management, and testing.
 */

// Import types for reuse
import type { ValidationRule, ValidationResult, SanitizeOptions } from './SecurityValidator.js';
import type { SecurityHeaders, CSPConfig, CORSConfig } from './SecurityPolicyManager.js';
import type { SecurityTestCase, SecurityTestResult } from './SecurityTestingFramework.js';
import type { SecurityEventType, SecuritySeverity } from './SecurityMonitor.js';

// Core security components
export { SecurityMonitor, securityMonitor, SecurityEventType, SecuritySeverity } from './SecurityMonitor.js';
export { 
  SecurityValidator, 
  securityValidator, 
  validateInput, 
  validateJSON, 
  validateModuleId, 
  validatePath,
  ValidationRule,
  ValidationResult,
  SanitizeOptions
} from './SecurityValidator.js';
export { 
  SecurityPolicyManager, 
  securityPolicyManager, 
  getSecurityHeaders, 
  getCSP, 
  getCORSConfig,
  SecurityHeaders,
  CSPConfig,
  CORSConfig
} from './SecurityPolicyManager.js';
export { 
  PenetrationTester, 
  SecurityRegressionTester, 
  penetrationTester, 
  securityRegressionTester, 
  runFullSecurityTest, 
  generateSecurityTestReport,
  SecurityTestCase,
  SecurityTestResult
} from './SecurityTestingFramework.js';

// Convenience exports for common security operations
export const logSecurityEvent = (
  type: SecurityEventType, 
  severity: SecuritySeverity, 
  source: string, 
  details: Record<string, any>, 
  blocked = true, 
  remediation?: string
) => {
  return import('./SecurityMonitor.js').then(({ securityMonitor }) => {
    return securityMonitor.logEvent({
      type,
      severity,
      source,
      details,
      blocked,
      remediation: remediation || 'No remediation available'
    });
  });
};

export const validateAllInputs = (inputs: Record<string, any>, ruleSet = 'default') => {
  return import('./SecurityValidator.js').then(({ securityValidator }) => {
    const results: Record<string, ValidationResult> = {};
    
    for (const [key, value] of Object.entries(inputs)) {
      const ruleName = `${ruleSet}_${key}`;
      let result: ValidationResult;
      
      try {
        switch (key) {
          case 'moduleId':
            result = securityValidator.validateModuleId(value as string);
            break;
          case 'path':
          case 'filePath':
            result = securityValidator.validatePath(value as string);
            break;
          case 'json':
          case 'jsonContent':
            result = securityValidator.validateJSON(value as string);
            break;
          case 'command':
            result = securityValidator.validateCommand(value as string);
            break;
          case 'envVar':
          case 'environment':
            result = securityValidator.validateEnvironmentVariable(value as string);
            break;
          default:
            result = securityValidator.validate(value, ruleName);
            break;
        }
      } catch (error) {
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

export const applySecurityHeaders = (response: any, config?: Partial<SecurityHeaders>) => {
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
    const metrics = securityMonitor.getMetrics();
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
function generateRecommendations(status: any): string[] {
  const recommendations: string[] = [];

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