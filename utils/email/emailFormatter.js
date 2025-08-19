/**
 * Email Content Formatting Utility
 * 
 * This module handles email content formatting and sanitization.
 * It ensures consistent email content structure across the application.
 */

const { logStart, logReturn } = require('../../lib/logUtils');

/**
 * Format email content for consistent output
 * 
 * This function ensures email content is properly formatted and handles
 * edge cases like undefined values or non-string content.
 * 
 * @param {string} subject - Email subject line
 * @param {string} body - Email body content
 * @returns {Object} Formatted subject and body
 */
function formatEmailContent(subject, body) {
  logStart('formatEmailContent', subject, body);
  
  const formatted = {
    subject: (subject || '').toString().trim() || '[No Subject]',
    body: (body || '').toString().trim() || '[No Body]'
  };
  
  logReturn('formatEmailContent', formatted);
  return formatted;
}

module.exports = {
  formatEmailContent
};