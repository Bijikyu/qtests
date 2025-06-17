/**
 * Email Mock Utility for Testing and Lightweight Applications
 * 
 * This module provides email mocking functionality that returns structured email data
 * instead of actually sending emails. This approach enables testing of email-dependent
 * code without requiring external mail service dependencies or configuration.
 * 
 * Design philosophy:
 * - Zero external dependencies for lightweight applications
 * - Returns structured data that calling code can forward to actual mail services
 * - Enables comprehensive testing of email workflows without side effects
 * - Follows qtests framework patterns for consistency and logging
 * 
 * Use cases:
 * - Unit testing email notification logic
 * - Development environments without mail service setup
 * - Lightweight deployments where email is handled by external workers
 * - Integration testing of applications that send email
 * 
 * Integration approach:
 * - Works seamlessly with qtests framework logging patterns
 * - Provides both simple and advanced usage modes
 * - Supports batch email operations for bulk notifications
 * - Compatible with existing email validation and formatting logic
 */

const { logStart, logReturn } = require('../lib/logUtils');

// In-memory storage for email history during testing
const emailHistory = []; //(track sent emails for test verification)

/**
 * Clear email history for test isolation
 * 
 * This function provides a clean slate for each test by removing all previously
 * mocked email records. Essential for test isolation and preventing test
 * interference when running multiple email-related test suites.
 * 
 * Why explicit clearing is important:
 * - Tests should not depend on emails from previous tests
 * - Email history can grow large in test suites with many email tests
 * - Provides predictable starting state for each test
 * - Enables testing of email count and order without interference
 * 
 * @returns {number} Number of emails cleared from history
 */
function clearEmailHistory() {
  logStart('clearEmailHistory');
  const cleared = emailHistory.length;
  emailHistory.length = 0; //(clear array efficiently)
  logReturn('clearEmailHistory', cleared);
  return cleared;
}

/**
 * Get email history for test verification
 * 
 * This function provides access to all emails that have been "sent" through
 * the sendEmail function. Essential for testing email workflows and verifying
 * that the correct emails were sent with the expected content.
 * 
 * Returns a copy of the email history to prevent accidental modification
 * of the internal state. This maintains test isolation while providing
 * full access to email data for assertions.
 * 
 * @returns {Array} Copy of all emails in chronological order
 */
function getEmailHistory() {
  logStart('getEmailHistory');
  const history = [...emailHistory]; //(return copy to prevent modification)
  logReturn('getEmailHistory', `${history.length} emails`);
  return history;
}

/**
 * Validate email address format
 * 
 * This function provides basic email validation using a simple regex pattern.
 * While not comprehensive for all edge cases, it catches common formatting
 * errors and provides helpful feedback for testing scenarios.
 * 
 * Validation approach:
 * - Uses simple regex for basic format checking
 * - Focuses on common patterns rather than RFC compliance
 * - Provides clear error messages for debugging
 * - Lightweight approach suitable for mock implementations
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format appears valid
 */
function validateEmail(email) {
  logStart('validateEmail', email);
  
  if (!email || typeof email !== 'string') {
    logReturn('validateEmail', false);
    return false;
  }
  
  // Simple email regex - sufficient for testing scenarios
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  logReturn('validateEmail', isValid);
  return isValid;
}

/**
 * Format email content for consistent output
 * 
 * This function ensures email content is properly formatted and handles
 * edge cases like undefined values or non-string content. Essential for
 * reliable email mocking and testing.
 * 
 * Formatting approach:
 * - Converts all content to strings for consistency
 * - Handles undefined/null values gracefully
 * - Trims whitespace for clean output
 * - Provides fallback values for missing content
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

/**
 * Core sendEmail Mock Function
 *
 * Purpose: Prepares email data for external delivery without coupling to a mailing service.
 * This lightweight approach avoids additional dependencies while enabling tests that expect
 * email payloads and comprehensive verification of email workflows.
 *
 * Implementation rationale:
 * 1. Returns structured data instead of attempting actual email delivery
 * 2. Logs email details for development debugging and test verification
 * 3. Stores email history for test assertions and workflow verification
 * 4. Validates input parameters to catch common errors early
 * 5. Follows qtests framework patterns for consistency and integration
 *
 * Error handling approach:
 * - Validates email format to catch obvious mistakes
 * - Handles missing or invalid parameters gracefully
 * - Returns success/failure status with clear error messages
 * - Maintains email history even for failed attempts (for testing)
 *
 * Testing integration:
 * - Email history enables verification of email count and content
 * - Clear separation between successful and failed email attempts
 * - Predictable return format for easy test assertions
 * - Compatible with existing qtests mock and stub patterns
 *
 * @param {string} recipient - Email address of destination user
 * @param {string} subject - Subject line for email message
 * @param {string} body - Body content for email message
 * @param {Object} options - Optional configuration for email behavior
 * @returns {{success:boolean,emailData:Object,message:string,timestamp:Date}}
 *          - Provides structured payload for the calling client to forward using its own
 *          mail provider, along with metadata for testing and logging
 * 
 * Usage examples:
 * - Basic: sendEmail('user@example.com', 'Welcome', 'Hello user!')
 * - Testing: const result = sendEmail(...); assert(result.success);
 * - Batch: emails.forEach(email => sendEmail(email.to, email.subject, email.body));
 */
function sendEmail(recipient, subject, body, options = {}) {
  logStart('sendEmail', recipient, subject, body, options);
  
  // Validate input parameters
  if (!validateEmail(recipient)) {
    const error = {
      success: false,
      emailData: null,
      message: `Invalid email address: ${recipient}`,
      timestamp: new Date(),
      error: 'INVALID_RECIPIENT'
    };
    
    // Store failed attempt in history for testing
    emailHistory.push(error);
    
    console.log(`[MOCK EMAIL ERROR] Invalid recipient: ${recipient}`);
    logReturn('sendEmail', error);
    return error;
  }
  
  // Format email content
  const formatted = formatEmailContent(subject, body);
  
  // Create email data structure
  const emailData = {
    to: recipient,
    subject: formatted.subject,
    body: formatted.body,
    ...options //(allow additional options like cc, bcc, etc.)
  };
  
  // Create response object
  const response = {
    success: true,
    emailData,
    message: "Client should send this email using preferred mail service",
    timestamp: new Date(),
    id: `mock-email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` //(unique identifier for tracking)
  };
  
  // Store in history for test verification
  emailHistory.push(response);
  
  // Log email details for development and debugging
  console.log(`[MOCK EMAIL] To: ${recipient}, Subject: ${formatted.subject}`);
  if (options.verbose) {
    console.log(`[MOCK EMAIL] Body: ${formatted.body.substring(0, 100)}${formatted.body.length > 100 ? '...' : ''}`);
  }
  
  logReturn('sendEmail', response);
  return response;
}

/**
 * Send multiple emails in batch
 * 
 * This function provides efficient batch email processing for applications
 * that need to send multiple emails. It processes all emails and returns
 * a summary with individual results for comprehensive error handling.
 * 
 * Batch processing approach:
 * - Processes all emails even if some fail
 * - Returns detailed results for each email attempt
 * - Provides summary statistics for quick overview
 * - Maintains same return format as single email for consistency
 * 
 * @param {Array} emails - Array of email objects with to, subject, body properties
 * @param {Object} options - Optional configuration for batch processing
 * @returns {Object} Batch results with individual email results and summary
 */
function sendEmailBatch(emails, options = {}) {
  logStart('sendEmailBatch', emails, options);
  
  if (!Array.isArray(emails)) {
    const error = {
      success: false,
      message: 'sendEmailBatch requires an array of email objects',
      results: [],
      summary: { total: 0, successful: 0, failed: 1 }
    };
    logReturn('sendEmailBatch', error);
    return error;
  }
  
  const results = [];
  let successful = 0;
  let failed = 0;
  
  // Process each email individually
  for (const email of emails) {
    try {
      const result = sendEmail(
        email.to || email.recipient,
        email.subject,
        email.body,
        { ...options, ...email.options }
      );
      
      results.push(result);
      if (result.success) {
        successful++;
      } else {
        failed++;
      }
    } catch (error) {
      const errorResult = {
        success: false,
        emailData: null,
        message: `Error processing email: ${error.message}`,
        timestamp: new Date(),
        error: 'PROCESSING_ERROR'
      };
      
      results.push(errorResult);
      failed++;
    }
  }
  
  const batchResult = {
    success: failed === 0, //(batch successful if no individual failures)
    message: `Processed ${emails.length} emails: ${successful} successful, ${failed} failed`,
    results,
    summary: {
      total: emails.length,
      successful,
      failed
    },
    timestamp: new Date()
  };
  
  console.log(`[MOCK EMAIL BATCH] Processed ${emails.length} emails: ${successful} successful, ${failed} failed`);
  
  logReturn('sendEmailBatch', batchResult);
  return batchResult;
}

/**
 * Create email template for consistent formatting
 * 
 * This function provides a template system for common email patterns.
 * Useful for applications that send similar emails with variable content
 * and need consistent formatting across different email types.
 * 
 * Template approach:
 * - Supports variable substitution using {{variable}} syntax
 * - Provides common email templates (welcome, notification, etc.)
 * - Enables custom template creation for specific use cases
 * - Maintains consistency across email communications
 * 
 * @param {string} templateName - Name of the email template to use
 * @param {Object} variables - Variables to substitute in the template
 * @returns {Object} Email template with subject and body
 */
function createEmailTemplate(templateName, variables = {}) {
  logStart('createEmailTemplate', templateName, variables);
  
  const templates = {
    welcome: {
      subject: 'Welcome to {{appName}}!',
      body: 'Hello {{userName}},\n\nWelcome to {{appName}}! We\'re excited to have you on board.\n\nBest regards,\nThe {{appName}} Team'
    },
    notification: {
      subject: '{{appName}} Notification: {{title}}',
      body: 'Hello {{userName}},\n\n{{message}}\n\nBest regards,\nThe {{appName}} Team'
    },
    reset: {
      subject: 'Reset your {{appName}} password',
      body: 'Hello {{userName}},\n\nYou requested to reset your password. Use this link: {{resetLink}}\n\nIf you didn\'t request this, please ignore this email.\n\nBest regards,\nThe {{appName}} Team'
    }
  };
  
  const template = templates[templateName];
  if (!template) {
    const error = {
      success: false,
      message: `Unknown email template: ${templateName}`,
      availableTemplates: Object.keys(templates)
    };
    logReturn('createEmailTemplate', error);
    return error;
  }
  
  // Substitute variables in template
  let subject = template.subject;
  let body = template.body;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), value || '');
    body = body.replace(new RegExp(placeholder, 'g'), value || '');
  }
  
  // Replace any remaining placeholders with empty strings
  subject = subject.replace(/\{\{[^}]+\}\}/g, '');
  body = body.replace(/\{\{[^}]+\}\}/g, '');
  
  const result = {
    success: true,
    template: {
      subject,
      body
    },
    templateName,
    variables
  };
  
  logReturn('createEmailTemplate', result);
  return result;
}

// Export all email utilities following qtests framework patterns
module.exports = {
  sendEmail,
  sendEmailBatch,
  createEmailTemplate,
  clearEmailHistory,
  getEmailHistory,
  validateEmail,
  formatEmailContent,
  emailHistory // Export for direct access in advanced testing scenarios
};