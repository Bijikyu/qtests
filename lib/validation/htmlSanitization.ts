/**
 * HTML Sanitization Utilities
 * Provides HTML escaping and dangerous pattern detection
 */

import qerrors from 'qerrors';

// Comprehensive list of potentially dangerous HTML/JavaScript patterns
// These patterns are commonly used in XSS attacks and should be removed from user input
const dangerousPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags with any content
  /javascript:/gi,                                      // JavaScript protocol in URLs
  /on\w+\s*=/gi,                                       // Event handlers (onclick, onload, etc.)
  /data:text\/html/gi,                                 // Data URLs with HTML content
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, // Inline frames
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, // Object tags
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,   // Embed tags
  /vbscript:/gi,                                       // VBScript protocol (legacy IE)
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi   // Style tags (can contain JS)
];

export function escapeHtml(str: string): string {
  try {
    if (typeof str !== 'string') {
      qerrors(new Error('Input must be a string'), 'htmlSanitization.escapeHtml: invalid input type', {
        inputType: typeof str
      });
      return '';
    }
    
    // HTML entity mapping for safe output
    // These are the most critical characters for XSS prevention
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',   // Ampersand - must be first to avoid double-escaping
      '<': '&lt;',     // Less than - prevents tag opening
      '>': '&gt;',     // Greater than - prevents tag closing
      '"': '&quot;',   // Double quote - prevents attribute value escape
      "'": '&#x27;'    // Single quote - prevents attribute value escape
    };
    return str.replace(/[&<>"']/g, char => htmlEscapes[char] || char);
  } catch (error) {
    qerrors(error as Error, 'htmlSanitization.escapeHtml: unexpected error', {
      inputLength: str?.length || 0
    });
    return '';
  }
}

export function hasDangerousPatterns(input: string): boolean {
  // Reset regex lastIndex to ensure consistent matching across multiple calls
  // This is critical for global regex patterns (/g flag) which maintain state
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
    // Remove all dangerous patterns by replacing them with empty strings
    // This is more aggressive than simple HTML escaping as it removes the content entirely
    for (const pattern of dangerousPatterns) {
      pattern.lastIndex = 0; // Reset regex state for consistent matching
      sanitized = sanitized.replace(pattern, '');
    }
    return escapeHtml(sanitized); // Apply HTML escaping as final safety layer
  } catch (error) {
    qerrors(error as Error, 'htmlSanitization.sanitizeString: sanitization failed', {
      inputLength: input?.length || 0
    });
    return '';
  }
}

export { dangerousPatterns };