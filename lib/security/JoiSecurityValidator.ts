/**
 * Joi-based Security Validation Framework
 * 
 * Provides enterprise-grade input validation, sanitization, and security
 * using Joi schema validation with proven security patterns.
 */

import Joi from 'joi';
import { securityMonitor, SecurityEventType, SecuritySeverity } from './SecurityMonitor.js';

/**
 * Validation result interface compatible with legacy SecurityValidator
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
 * Security-enhanced validation rules using Joi
 */
export class JoiSecurityValidator {
  private readonly schemas: Map<string, Joi.Schema> = new Map();
  
  constructor() {
    this.initializeSchemas();
  }

  /**
   * Initialize Joi schemas with security constraints
   */
  private initializeSchemas(): void {
    // Module ID validation - prevents path traversal and injection
    this.schemas.set('moduleId', Joi.string()
      .min(1)
      .max(255)
      .pattern(/^[a-zA-Z0-9@/._-]+$/)
      .required()
      .messages({
        'string.base': 'Module ID must be a string',
        'string.empty': 'Module ID cannot be empty',
        'string.min': 'Module ID must be at least 1 character long',
        'string.max': 'Module ID must be no more than 255 characters long',
        'string.pattern.base': 'Module ID contains invalid characters',
        'any.required': 'Module ID is required'
      }));

    // File path validation - prevents path traversal attacks
    this.schemas.set('filePath', Joi.string()
      .min(1)
      .max(4096)
      .custom((value, helpers) => {
        // Additional path validation for security
        if (value.includes('\0')) {
          return helpers.error('custom.nullBytes');
        }
        if (value.includes('../') || value.includes('..\\')) {
          return helpers.error('custom.pathTraversal');
        }
        return value;
      }, 'Path validation')
      .messages({
        'string.base': 'File path must be a string',
        'string.empty': 'File path cannot be empty',
        'string.max': 'File path must be no more than 4096 characters long',
        'custom.nullBytes': 'Null bytes not allowed in paths',
        'custom.pathTraversal': 'Path traversal detected'
      }));

    // Command validation - allows only safe commands
    const safeCommands = ['npm', 'node', 'jest', 'git', 'tsc', 'rm', 'mkdir', 'cp', 'mv'];
    this.schemas.set('command', Joi.string()
      .valid(...safeCommands)
      .required()
      .messages({
        'string.base': 'Command must be a string',
        'any.only': 'Command must be one of: ' + safeCommands.join(', '),
        'any.required': 'Command is required'
      }));

    // Environment variable validation
    this.schemas.set('envVar', Joi.string()
      .pattern(/^[A-Z_][A-Z0-9_]*$/)
      .max(255)
      .required()
      .messages({
        'string.base': 'Environment variable must be a string',
        'string.pattern.base': 'Environment variable must match pattern:^[A-Z_][A-Z0-9_]*$',
        'string.max': 'Environment variable must be no more than 255 characters long',
        'any.required': 'Environment variable is required'
      }));

    // JSON content validation with security checks
    this.schemas.set('jsonContent', Joi.string()
      .max(1024 * 1024) // 1MB
      .custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed === 'object' && parsed !== null) {
            // Check for prototype pollution attempts
            if (parsed.hasOwnProperty('__proto__') || 
                parsed.hasOwnProperty('constructor') || 
                parsed.hasOwnProperty('prototype')) {
              return helpers.error('custom.prototypePollution');
            }
          }
          return value;
        } catch (error) {
          return helpers.error('custom.invalidJSON');
        }
      }, 'JSON validation')
      .messages({
        'string.base': 'JSON content must be a string',
        'string.max': 'JSON content must be no more than 1MB',
        'custom.invalidJSON': 'Invalid JSON format',
        'custom.prototypePollution': 'Prototype pollution attempt detected'
      }));

    // Email validation
    this.schemas.set('email', Joi.string()
      .email({ tlds: { allow: true } })
      .max(254)
      .messages({
        'string.base': 'Email must be a string',
        'string.email': 'Email must be a valid email address',
        'string.max': 'Email must be no more than 254 characters long'
      }));

    // URL validation
    this.schemas.set('url', Joi.string()
      .uri()
      .max(2048)
      .messages({
        'string.base': 'URL must be a string',
        'string.uri': 'URL must be a valid URI',
        'string.max': 'URL must be no more than 2048 characters long'
      }));

    // Generic string validation for user input
    this.schemas.set('userInput', Joi.string()
      .max(10000)
      .custom((value, helpers) => {
        // Check for common injection patterns
        const dangerousPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // XSS
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi, // SQL injection
          /[;&|`$(){}\[\]]/g, // Command injection
          /__proto__|constructor|prototype/gi // Prototype pollution
        ];

        for (const pattern of dangerousPatterns) {
          if (pattern.test(value)) {
            return helpers.error('custom.dangerousPattern');
          }
        }
        return value;
      }, 'Security validation')
      .messages({
        'string.base': 'Input must be a string',
        'string.max': 'Input must be no more than 10,000 characters long',
        'custom.dangerousPattern': 'Input contains potentially dangerous content'
      }));

    // Number validation
    this.schemas.set('number', Joi.number()
      .messages({
        'number.base': 'Value must be a number'
      }));

    // Boolean validation
    this.schemas.set('boolean', Joi.boolean()
      .messages({
        'boolean.base': 'Value must be a boolean'
      }));

    // Array validation
    this.schemas.set('array', Joi.array()
      .max(1000)
      .messages({
        'array.base': 'Value must be an array',
        'array.max': 'Array must contain no more than 1000 items'
      }));

    // Object validation
    this.schemas.set('object', Joi.object()
      .max(100)
      .messages({
        'object.base': 'Value must be an object',
        'object.max': 'Object must have no more than 100 properties'
      }));
  }

  /**
   * Validate input using Joi schema
   */
  validate(input: any, ruleName?: string, customSchema?: Joi.Schema): ValidationResult {
    const schema = customSchema || this.schemas.get(ruleName || '');
    
    if (!schema) {
      const result: ValidationResult = {
        valid: false,
        errors: [`No schema found for rule: ${ruleName}`],
        warnings: [],
        securityFlags: []
      };
      
      securityMonitor.logEvent({
        type: SecurityEventType.SECURITY_VIOLATION,
        severity: SecuritySeverity.LOW,
        source: 'joi_security_validator',
        details: { ruleName, input: typeof input === 'string' ? input.substring(0, 100) : String(input) },
        blocked: false,
        remediation: 'Invalid validation rule specified'
      });
      
      return result;
    }

    const { error, value } = schema.validate(input, { 
      abortEarly: false,
      stripUnknown: true,
      convert: true 
    });

    const result: ValidationResult = {
      valid: !error,
      errors: error ? error.details.map(detail => detail.message) : [],
      warnings: [],
      securityFlags: [],
      sanitized: value
    };

    // Check for security flags based on error types
    if (error) {
      const securityErrors = error.details.filter(detail => 
        detail.type === 'custom.pathTraversal' ||
        detail.type === 'custom.prototypePollution' ||
        detail.type === 'custom.dangerousPattern' ||
        detail.type === 'custom.nullBytes'
      );

      if (securityErrors.length > 0) {
        result.securityFlags = securityErrors.map(detail => `Security flag: ${detail.type}`);
        
        // Log security events
        securityMonitor.logEvent({
          type: SecurityEventType.INJECTION_ATTACK,
          severity: SecuritySeverity.MEDIUM,
          source: 'joi_security_validator',
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
    }

    // Apply sanitization if needed
    if (result.valid && typeof input === 'string') {
      result.sanitized = this.sanitize(input, {
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
   * Validate email address
   */
  validateEmail(email: string): ValidationResult {
    return this.validate(email, 'email');
  }

  /**
   * Validate URL
   */
  validateURL(url: string): ValidationResult {
    return this.validate(url, 'url');
  }

  /**
   * Validate generic user input
   */
  validateUserInput(input: string): ValidationResult {
    return this.validate(input, 'userInput');
  }

  /**
   * Create custom Joi schema
   */
  createSchema(schema: Joi.Schema): Joi.Schema {
    return schema;
  }

  /**
   * Add custom schema
   */
  addSchema(name: string, schema: Joi.Schema): void {
    this.schemas.set(name, schema);
  }

  /**
   * Get available schemas
   */
  getSchemas(): string[] {
    return Array.from(this.schemas.keys());
  }

  /**
   * Create schema with security extensions
   */
  createSecureSchema(baseSchema: Joi.Schema, options: {
    sanitize?: boolean;
    preventInjection?: boolean;
    preventTraversal?: boolean;
  } = {}): Joi.Schema {
    let schema = baseSchema;

    if (options.preventInjection && schema.type === 'string') {
      schema = schema.custom((value, helpers) => {
        const dangerousPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
          /[;&|`$(){}\[\]]/g
        ];

        for (const pattern of dangerousPatterns) {
          if (pattern.test(value)) {
            return helpers.error('custom.injectionDetected');
          }
        }
        return value;
      }, 'Injection prevention').message('Injection attempt detected');
    }

    if (options.preventTraversal && schema.type === 'string') {
      schema = schema.custom((value, helpers) => {
        if (value.includes('../') || value.includes('..\\')) {
          return helpers.error('custom.pathTraversal');
        }
        return value;
      }, 'Path traversal prevention');
    }

    return schema;
  }
}

// Global Joi-based security validator instance
export const joiSecurityValidator = new JoiSecurityValidator();

/**
 * Convenience function for quick validation using Joi
 */
export function validateInput(input: any, ruleName: string): ValidationResult {
  return joiSecurityValidator.validate(input, ruleName);
}

/**
 * Convenience function for JSON validation using Joi
 */
export function validateJSON(jsonString: string): ValidationResult {
  return joiSecurityValidator.validateJSON(jsonString);
}

/**
 * Convenience function for module ID validation using Joi
 */
export function validateModuleId(moduleId: string): ValidationResult {
  return joiSecurityValidator.validateModuleId(moduleId);
}

/**
 * Convenience function for path validation using Joi
 */
export function validatePath(filePath: string): ValidationResult {
  return joiSecurityValidator.validatePath(filePath);
}

/**
 * Convenience function for email validation using Joi
 */
export function validateEmail(email: string): ValidationResult {
  return joiSecurityValidator.validateEmail(email);
}

/**
 * Convenience function for URL validation using Joi
 */
export function validateURL(url: string): ValidationResult {
  return joiSecurityValidator.validateURL(url);
}

/**
 * Convenience function for user input validation using Joi
 */
export function validateUserInput(input: string): ValidationResult {
  return joiSecurityValidator.validateUserInput(input);
}