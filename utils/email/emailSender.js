/**
 * Email Sender Core Utility
 * 
 * This module provides the core email sending functionality and batch operations.
 * It coordinates with other email utilities for validation, formatting, and history.
 */

const { logStart, logReturn } = require('../../lib/logUtils');
const { validateEmail } = require('./emailValidator');
const { formatEmailContent } = require('./emailFormatter');
const { addToHistory } = require('./emailHistory');

/**
 * Core sendEmail Mock Function
 *
 * Purpose: Prepares email data for external delivery without coupling to a mailing service.
 * This lightweight approach avoids additional dependencies while enabling tests that expect
 * email payloads and comprehensive verification of email workflows.
 *
 * @param {string} recipient - Email address of destination user
 * @param {string} subject - Subject line for email message
 * @param {string} body - Body content for email message
 * @param {Object} options - Optional configuration for email behavior
 * @returns {{success:boolean,emailData:Object,message:string,timestamp:Date}}
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
    addToHistory(error);
    
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
    ...options
  };
  
  // Create response object
  const response = {
    success: true,
    emailData,
    message: "Client should send this email using preferred mail service",
    timestamp: new Date(),
    id: `mock-email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  
  // Store in history for test verification
  addToHistory(response);
  
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
 * a summary with individual results.
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
    success: failed === 0,
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

module.exports = {
  sendEmail,
  sendEmailBatch
};