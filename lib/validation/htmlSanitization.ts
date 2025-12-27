/**
 * HTML Sanitization Utilities
 * Provides HTML escaping and dangerous pattern detection
 */

import qerrors from 'qerrors';

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

export function escapeHtml(str: string): string {
  try {
    if (typeof str !== 'string') {
      qerrors(new Error('Input must be a string'), 'htmlSanitization.escapeHtml: invalid input type', {
        inputType: typeof str
      });
      return '';
    }
    
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return str.replace(/[&<>"']/g, char => htmlEscapes[char] || char);
  } catch (error) {
    qerrors(error, 'htmlSanitization.escapeHtml: unexpected error', {
      inputLength: str?.length || 0
    });
    return '';
  }
}

export function hasDangerousPatterns(input: string): boolean {
  for (const pattern of dangerousPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(input)) return true;
  }
  return false;
}

export function sanitizeString(input: string): string {
  try {
    if (typeof input !== 'string') {
      qerrors(new Error('Input must be a string'), 'htmlSanitization.sanitizeString: invalid input type', {
        inputType: typeof input
      });
      return '';
    }
    
    let sanitized = input;
    for (const pattern of dangerousPatterns) {
      pattern.lastIndex = 0;
      sanitized = sanitized.replace(pattern, '');
    }
    return escapeHtml(sanitized);
} catch (error) {
    qerrors(error, 'htmlSanitization.sanitizeString: sanitization failed', {
      inputLength: input?.length || 0
    });
    return '';
  }
}

export { dangerousPatterns };