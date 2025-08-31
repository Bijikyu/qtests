/**
 * Email Content Formatting Utility - TypeScript Implementation
 * 
 * This module handles email content formatting and sanitization.
 * It ensures consistent email content structure across the application.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';

// Type definitions
interface FormattedEmailContent {
  subject: string;
  body: string;
}

/**
 * Format email content for consistent output
 * 
 * This function ensures email content is properly formatted and handles
 * edge cases like undefined values or non-string content.
 */
function formatEmailContent(subject: any, body: any): FormattedEmailContent {
  logStart('formatEmailContent', subject, body);
  
  const formatted: FormattedEmailContent = {
    subject: (subject || '').toString().trim() || '[No Subject]',
    body: (body || '').toString().trim() || '[No Body]'
  };
  
  logReturn('formatEmailContent', formatted);
  return formatted;
}

// Export using ES module syntax
export { formatEmailContent };