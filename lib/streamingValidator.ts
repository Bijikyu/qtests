import { z } from 'zod';

function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  return str.replace(/[&<>"']/g, char => htmlEscapes[char] || char);
}

const dangerousPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /vbscript:/gi,
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi
];

function hasDangerousPatterns(input: string): boolean {
  for (const pattern of dangerousPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(input)) return true;
  }
  return false;
}

function sanitizeString(input: string): string {
  let sanitized = input;
  for (const pattern of dangerousPatterns) {
    pattern.lastIndex = 0;
    sanitized = sanitized.replace(pattern, '');
  }
  return escapeHtml(sanitized);
}

const safeString = z.string().transform(sanitizeString);
const safeNumber = z.number();
const safeBoolean = z.boolean();
const safeArray = z.array(z.any());
const safeObject = z.object({}).passthrough();

const shortString = z.string().max(500).transform(sanitizeString);
const mediumString = z.string().max(5000).transform(sanitizeString);
const longString = z.string().max(50000).transform(sanitizeString);

export interface ValidationConfig {
  maxStringLength?: number;
  maxQueryStringLength?: number;
  dangerousPatterns?: RegExp[];
}

export interface ValidationResult {
  isValid: boolean;
  sanitized?: any;
  error?: string;
  processingTime?: number;
}

export class StreamingStringValidator {
  private config: ValidationConfig;
  private maxStringLength: number;

  constructor(config: ValidationConfig = {}) {
    this.config = { ...config };
    this.maxStringLength = config.maxStringLength ?? 50000;
  }

  async validateString(input: string, maxLength?: number): Promise<string> {
    const actualMaxLength = maxLength ?? this.maxStringLength;
    const schema = z.string().max(actualMaxLength).transform(sanitizeString);
    const result = schema.safeParse(input);
    
    if (result.success) {
      return result.data;
    } else {
      console.warn(`Validation failed: ${result.error?.message}`);
      return sanitizeString(input).substring(0, actualMaxLength);
    }
  }

  async validateObject(obj: any, depth = 0, maxDepth = 10): Promise<any> {
    if (depth > maxDepth) throw new Error('Maximum object depth exceeded');
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') return this.validateString(obj);
    
    if (Array.isArray(obj)) {
      const validatedArray = [];
      for (const item of obj) {
        validatedArray.push(await this.validateObject(item, depth + 1, maxDepth));
      }
      return validatedArray;
    }

    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      const validatedObj: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        const validatedKey = await this.validateString(key, 100);
        validatedObj[validatedKey] = await this.validateObject(value, depth + 1, maxDepth);
      }
      return validatedObj;
    }

    return obj;
  }

  hasDangerousPatterns(input: string): boolean {
    return hasDangerousPatterns(input);
  }

  getConfig(): ValidationConfig {
    return { ...this.config };
  }
}

export const defaultValidator = new StreamingStringValidator();
export const strictValidator = new StreamingStringValidator({
  maxStringLength: 10000,
  maxQueryStringLength: 200
});
export const relaxedValidator = new StreamingStringValidator({
  maxStringLength: 100000,
  maxQueryStringLength: 1000
});

export {
  z,
  safeString,
  safeNumber,
  safeBoolean,
  safeArray,
  safeObject,
  shortString,
  mediumString,
  longString
};

export function createStreamingValidator(config: ValidationConfig = {}): StreamingStringValidator {
  return new StreamingStringValidator(config);
}

export function streamingValidationMiddleware(config: ValidationConfig = {}) {
  const validator = createStreamingValidator(config);

  return async (req: any, res: any, next: any) => {
    const startTime = Date.now();

    try {
      if (req.body && typeof req.body === 'object') {
        req.body = await validator.validateObject(req.body);
      }

      if (req.query && typeof req.query === 'object') {
        for (const [key, value] of Object.entries(req.query)) {
          if (typeof value === 'string') {
            const maxQueryLength = validator['config']?.maxQueryStringLength ?? 500;
            req.query[key] = await validator.validateString(value, maxQueryLength);
          }
        }
      }

      if (req.params && typeof req.params === 'object') {
        for (const [key, value] of Object.entries(req.params)) {
          if (typeof value === 'string') {
            req.params[key] = await validator.validateString(value, 200);
          }
        }
      }

      const processingTime = Date.now() - startTime;
      res.set('X-Validation-Time', `${processingTime}ms`);
      next();
    } catch (error) {
      console.error('Validation error:', error);
      res.status(400).json({
        error: 'Validation failed',
        message: error instanceof Error ? error.message : 'Invalid input'
      });
    }
  };
}

export default StreamingStringValidator;