/**
 * Advanced Input Validation Framework
 * 
 * Provides comprehensive input validation, sanitization, and security
 * for all data entering the qtests system. Implements multiple layers
 * of validation to prevent injection attacks and data corruption.
 */

import { securityMonitor, SecurityEventType, SecuritySeverity } from './SecurityMonitor.js';

/**
 * Validation rule configuration
 */
export interface ValidationRule {
  name: string;
  required?: boolean;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'email' | 'url' | 'path';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowedValues?: any[];
  forbiddenPatterns?: RegExp[];
  customValidator?: (value: any) => boolean | string;
  sanitize?: boolean;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  sanitized?: any;
  errors: string[];
  warnings: string[];
  securityFlags: string[];
}

/**
 * Input sanitization options
 */
export interface SanitizeOptions {
  removeHtml?: boolean;
  removeScriptTags?: boolean;
  normalizeWhitespace?: boolean;
  escapeHtml?: boolean;
  removeControlChars?: boolean;
  maxLength?: number;
}

/**
 * Advanced input validator with security focus
 */
export class SecurityValidator {
  private readonly defaultRules: Map<string, ValidationRule[]> = new Map();
  
  // Common security patterns
  private readonly securityPatterns = {
    xss: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    pathTraversal: /(\.\.[\/\\])/gi,
    commandInjection: /[;&|`$(){}\[\]]/g,
    ldapInjection: /[()*&|]/g,
    xmlInjection: /<\?xml|<!ENTITY|SYSTEM/gi,
    nosqlInjection: /\$where|\$ne|\$gt|\$lt|\$regex/gi,
    templateInjection: /\{\{.*\}\}/g,
    prototypePollution: /__proto__|constructor|prototype/gi
  };

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default validation rules for common input types
   */
  private initializeDefaultRules(): void {
    // Module ID validation
    this.defaultRules.set('moduleId', [
      {
        name: 'moduleId',
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 255,
        pattern: /^[a-zA-Z0-9@/._-]+$/,
        forbiddenPatterns: [this.securityPatterns.pathTraversal],
        sanitize: true
      }
    ]);

    // File path validation
    this.defaultRules.set('filePath', [
      {
        name: 'filePath',
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 4096,
        forbiddenPatterns: [this.securityPatterns.pathTraversal],
        customValidator: (value: string) => {
          // Additional path validation
          if (value.includes('\0')) return 'Null bytes not allowed in paths';
          if (value.length > 4096) return 'Path too long';
          return true;
        },
        sanitize: true
      }
    ]);

    // Command validation
    this.defaultRules.set('command', [
      {
        name: 'command',
        type: 'string',
        required: true,
        allowedValues: ['npm', 'node', 'jest', 'git', 'tsc', 'rm', 'mkdir', 'cp', 'mv'],
        sanitize: true
      }
    ]);

    // Environment variable validation
    this.defaultRules.set('envVar', [
      {
        name: 'envVar',
        type: 'string',
        required: true,
        pattern: /^[A-Z_][A-Z0-9_]*$/,
        maxLength: 255,
        sanitize: true
      }
    ]);

    // JSON content validation
    this.defaultRules.set('jsonContent', [
      {
        name: 'jsonContent',
        type: 'string',
        required: true,
        maxLength: 1024 * 1024, // 1MB
        forbiddenPatterns: [
          this.securityPatterns.xss,
          this.securityPatterns.prototypePollution
        ],
        customValidator: (value: string) => {
          try {
            const parsed = JSON.parse(value);
            if (parsed && typeof parsed === 'object' && parsed !== null) {
              if (parsed.hasOwnProperty('__proto__') || 
                  parsed.hasOwnProperty('constructor') || 
                  parsed.hasOwnProperty('prototype')) {
                return 'Prototype pollution attempt detected';
              }
            }
            return true;
          } catch {
            return 'Invalid JSON format';
          }
        },
        sanitize: true
      }
    ]);
  }

  /**
   * Validate input against specified rules
   */
  validate(input: any, ruleName?: string, customRules?: ValidationRule[]): ValidationResult {
    const rules = customRules || this.defaultRules.get(ruleName || '') || [];
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      securityFlags: []
    };

    let sanitizedValue = input;

    for (const rule of rules) {
      const ruleResult = this.applyRule(input, rule);
      
      if (!ruleResult.valid) {
        result.valid = false;
        result.errors.push(...ruleResult.errors);
      }
      
      if (ruleResult.warnings.length > 0) {
        result.warnings.push(...ruleResult.warnings);
      }
      
      if (ruleResult.securityFlags.length > 0) {
        result.securityFlags.push(...ruleResult.securityFlags);
      }

      // Update sanitized value
      if (ruleResult.sanitized !== undefined) {
        sanitizedValue = ruleResult.sanitized;
      }
    }

    result.sanitized = sanitizedValue;

    // Log security events if flags detected
    if (result.securityFlags.length > 0) {
      securityMonitor.logEvent({
        type: SecurityEventType.INJECTION_ATTACK,
        severity: SecuritySeverity.MEDIUM,
        source: 'security_validator',
        details: { 
          input: typeof input === 'string' ? input.substring(0, 100) : String(input),
          ruleName,
          securityFlags: result.securityFlags,
          errors: result.errors
        },
        blocked: !result.valid,
        remediation: 'Input validation failed due to security concerns'
      });
    }

    return result;
  }

  /**
   * Apply individual validation rule
   */
  private applyRule(input: any, rule: ValidationRule): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      securityFlags: []
    };

    let value = input;

    // Type validation
    if (rule.required && (value === null || value === undefined)) {
      result.valid = false;
      result.errors.push(`${rule.name} is required`);
      return result;
    }

    if (value === null || value === undefined) {
      return result;
    }

    // Type checking
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    // Special handling for email, url, path which are string-based validations
    if (rule.type === 'email' || rule.type === 'url' || rule.type === 'path') {
      if (actualType !== 'string') {
        result.valid = false;
        result.errors.push(`${rule.name} must be a string for ${rule.type} validation`);
        return result;
      }
    } else if (actualType !== rule.type) {
      result.valid = false;
      result.errors.push(`${rule.name} must be of type ${rule.type}, got ${actualType}`);
      return result;
    }

    // Convert to string for pattern-based validations
    const stringValue = String(value);

    // Length validation
    if (rule.minLength !== undefined && stringValue.length < rule.minLength) {
      result.valid = false;
      result.errors.push(`${rule.name} must be at least ${rule.minLength} characters long`);
    }

    if (rule.maxLength !== undefined && stringValue.length > rule.maxLength) {
      result.valid = false;
      result.errors.push(`${rule.name} must be no more than ${rule.maxLength} characters long`);
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      result.valid = false;
      result.errors.push(`${rule.name} does not match required pattern`);
    }

    // Allowed values validation
    if (rule.allowedValues && !rule.allowedValues.includes(value)) {
      result.valid = false;
      result.errors.push(`${rule.name} must be one of: ${rule.allowedValues.join(', ')}`);
    }

    // Forbidden patterns validation
    if (rule.forbiddenPatterns) {
      for (const pattern of rule.forbiddenPatterns) {
        if (pattern.test(stringValue)) {
          result.valid = false;
          result.securityFlags.push(`Forbidden pattern detected: ${pattern.source}`);
          result.errors.push(`${rule.name} contains forbidden pattern`);
        }
      }
    }

    // Custom validation
    if (rule.customValidator) {
      const customResult = rule.customValidator(value);
      if (customResult !== true) {
        result.valid = false;
        result.errors.push(typeof customResult === 'string' ? customResult : `${rule.name} failed custom validation`);
      }
    }

    // Sanitization
    if (rule.sanitize) {
      result.sanitized = this.sanitize(stringValue, {
        removeHtml: true,
        removeScriptTags: true,
        normalizeWhitespace: true,
        removeControlChars: true
      });
    }

    return result;
  }

  /**
   * Sanitize input value
   */
  sanitize(input: string, options: SanitizeOptions = {}): string {
    let sanitized = input;

    // Remove HTML tags
    if (options.removeHtml || options.removeScriptTags) {
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    }

    // Specifically remove script content
    if (options.removeScriptTags) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    // Escape HTML entities
    if (options.escapeHtml) {
      sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    // Remove control characters
    if (options.removeControlChars) {
      sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
    }

    // Normalize whitespace
    if (options.normalizeWhitespace) {
      sanitized = sanitized.replace(/\s+/g, ' ').trim();
    }

    // Apply max length
    if (options.maxLength && sanitized.length > options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }

    return sanitized;
  }

  /**
   * Validate JSON content with advanced security checks
   */
  validateJSON(jsonString: string): ValidationResult {
    return this.validate(jsonString, 'jsonContent');
  }

  /**
   * Validate module ID for security
   */
  validateModuleId(moduleId: string): ValidationResult {
    return this.validate(moduleId, 'moduleId');
  }

  /**
   * Validate file path for traversal prevention
   */
  validatePath(filePath: string): ValidationResult {
    return this.validate(filePath, 'filePath');
  }

  /**
   * Validate command for injection prevention
   */
  validateCommand(command: string): ValidationResult {
    return this.validate(command, 'command');
  }

  /**
   * Validate environment variable name
   */
  validateEnvironmentVariable(envVar: string): ValidationResult {
    return this.validate(envVar, 'envVar');
  }

  /**
   * Create custom validation rule
   */
  createRule(rule: ValidationRule): ValidationRule {
    return { ...rule };
  }

  /**
   * Add custom validation rule set
   */
  addRuleSet(name: string, rules: ValidationRule[]): void {
    this.defaultRules.set(name, rules);
  }

  /**
   * Get available rule sets
   */
  getRuleSets(): string[] {
    return Array.from(this.defaultRules.keys());
  }
}

// Global security validator instance
export const securityValidator = new SecurityValidator();

/**
 * Convenience function for quick validation
 */
export function validateInput(input: any, ruleName: string): ValidationResult {
  return securityValidator.validate(input, ruleName);
}

/**
 * Convenience function for JSON validation
 */
export function validateJSON(jsonString: string): ValidationResult {
  return securityValidator.validateJSON(jsonString);
}

/**
 * Convenience function for module ID validation
 */
export function validateModuleId(moduleId: string): ValidationResult {
  return securityValidator.validateModuleId(moduleId);
}

/**
 * Convenience function for path validation
 */
export function validatePath(filePath: string): ValidationResult {
  return securityValidator.validatePath(filePath);
}