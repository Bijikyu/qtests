/**
 * HTML Sanitization Utilities
 * Provides HTML escaping and dangerous pattern detection
 */

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
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  return str.replace(/[&<>"']/g, char => htmlEscapes[char] || char);
}

export function hasDangerousPatterns(input: string): boolean {
  for (const pattern of dangerousPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(input)) return true;
  }
  return false;
}

export function sanitizeString(input: string): string {
  let sanitized = input;
  for (const pattern of dangerousPatterns) {
    pattern.lastIndex = 0;
    sanitized = sanitized.replace(pattern, '');
  }
  return escapeHtml(sanitized);
}

export { dangerousPatterns };