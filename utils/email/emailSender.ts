/**
 * Email Sender Core Utility - TypeScript Implementation
 * 
 * This module provides the core email sending functionality and batch operations.
 * It coordinates with other email utilities for validation, formatting, and history.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';
import { validateEmail } from './emailValidator.js';
import { formatEmailContent } from './emailFormatter.js';
import { addToHistory } from './emailHistory.js';

// Type definitions
interface EmailOptions {
  verbose?: boolean;
  [key: string]: any;
}

interface EmailResponse {
  success: boolean;
  emailData?: any;
  message: string;
  timestamp: Date;
  id?: string;
  error?: string;
}

interface EmailBatchItem {
  to?: string;
  recipient?: string;
  subject: string;
  body: string;
  options?: EmailOptions;
}

interface BatchResult {
  success: boolean;
  message?: string;
  results: EmailResponse[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

/**
 * Core sendEmail Mock Function
 *
 * Purpose: Prepares email data for external delivery without coupling to a mailing service.
 * This lightweight approach avoids additional dependencies while enabling tests that expect
 * email payloads and comprehensive verification of email workflows.
 */
function sendEmail(recipient: string, subject: string, body: string, options: EmailOptions = {}): EmailResponse {
  logStart('sendEmail', recipient, subject, body, options);
  
  // Validate input parameters
  if (!validateEmail(recipient)) {
    const error: EmailResponse = {
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
  const response: EmailResponse = {
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
 */
function sendEmailBatch(emails: EmailBatchItem[], options: EmailOptions = {}): BatchResult {
  logStart('sendEmailBatch', emails, options);
  
  if (!Array.isArray(emails)) {
    const error: BatchResult = {
      success: false,
      message: 'sendEmailBatch requires an array of email objects',
      results: [],
      summary: { total: 0, successful: 0, failed: 1 }
    };
    logReturn('sendEmailBatch', error);
    return error;
  }
  
  const results: EmailResponse[] = [];
  let successful = 0;
  let failed = 0;
  
  // Process each email individually
  for (const email of emails) {
    try {
      const result = sendEmail(
        email.to || email.recipient || '',
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
    } catch (error: any) {
      const errorResult: EmailResponse = {
        success: false,
        emailData: null,
        message: `Failed to process email: ${error.message}`,
        timestamp: new Date(),
        error: 'PROCESSING_ERROR'
      };
      
      results.push(errorResult);
      failed++;
    }
  }
  
  const batchResult: BatchResult = {
    success: failed === 0,
    results,
    summary: {
      total: emails.length,
      successful,
      failed
    }
  };
  
  if (failed > 0) {
    batchResult.message = `Batch completed with ${failed} failures out of ${emails.length} emails`;
  } else {
    batchResult.message = `Batch completed successfully - ${successful} emails processed`;
  }
  
  logReturn('sendEmailBatch', batchResult);
  return batchResult;
}

// Export using ES module syntax
export { sendEmail, sendEmailBatch };