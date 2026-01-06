/**
 * Email Mock Utility for Testing - TypeScript Implementation
 * Uses Joi-based validation for enterprise-grade email validation
 */

import { executeWithLogs } from '../lib/logUtils.js';
import qerrors from 'qerrors';
import { randomBytes } from 'crypto';
import { validateEmail as joiValidateEmail } from '../lib/security/JoiSecurityValidator.js';

// Email data interface
interface EmailData {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  from?: string;
  [key: string]: any;
}

interface EmailResult {
  success: boolean;
  messageId: string;
  to: string;
  subject: string;
  timestamp: string;
}

// Simple email history storage
let emailHistory: Array<EmailData & EmailResult> = [];

/**
 * Mock email sending function
 */
function sendEmail(emailData: EmailData): Promise<EmailResult> {
  return executeWithLogs('sendEmail', async () => {
    try {
      // Validate basic email structure
      if (!emailData || !emailData.to) {
        const error = new Error('Email requires "to" field');
        qerrors(error, 'sendEmail: missing required field', { emailData });
        throw error;
      }
      
      // Validate email format using Joi-based validation
      const validationResult = joiValidateEmail(emailData.to);
      if (!validationResult.valid) {
        const error = new Error(`Invalid email format: ${validationResult.errors.join(', ')}`);
        qerrors(error, 'sendEmail: Joi validation failed', { 
          to: emailData.to, 
          errors: validationResult.errors 
        });
        throw error;
      }
      
      // Create mock result
      const result: EmailResult = {
        success: true,
        messageId: `mock-${Date.now()}-${randomBytes(4).toString('hex')}`,
        to: emailData.to,
        subject: emailData.subject || '',
        timestamp: new Date().toISOString()
      };
      
      // Store in history
      emailHistory.push({
        ...emailData,
        ...result
      });
      
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      qerrors(errorObj, 'sendEmail: unexpected error', { emailData });
      throw errorObj;
    }
  }, emailData);
}

/**
 * Get email history
 */
function getEmailHistory(): Array<EmailData & EmailResult> {
  return [...emailHistory]; // Return copy
}

/**
 * Clear email history
 */
function clearEmailHistory(): number {
  return executeWithLogs('clearEmailHistory', () => {
    const cleared = emailHistory.length;
    emailHistory = [];
    return cleared;
  });
}

/**
 * Validate email data using Joi-based validation
 */
function validateEmail(emailData: EmailData): boolean {
  return executeWithLogs('validateEmail', () => {
    try {
      if (!emailData) {
        qerrors(new Error('Email data is null or undefined'), 'validateEmail: null email data');
        return false;
      }
      if (!emailData.to) {
        qerrors(new Error('Email missing "to" field'), 'validateEmail: missing to field', { emailData });
        return false;
      }
      
      // Use Joi-based validation for enterprise-grade email validation
      const validationResult = joiValidateEmail(emailData.to);
      if (!validationResult.valid) {
        qerrors(new Error(`Invalid email format: ${validationResult.errors.join(', ')}`), 'validateEmail: Joi validation failed', { 
          to: emailData.to, 
          errors: validationResult.errors 
        });
        return false;
      }
      
      return true;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      qerrors(errorObj, 'validateEmail: unexpected error', { emailData });
      return false;
    }
  }, emailData);
}

// Export email utilities using ES module syntax
export {
  sendEmail,
  getEmailHistory,
  clearEmailHistory,
  validateEmail
};

// Default export for main functionality
const emailUtilities = {
  sendEmail,
  getEmailHistory,
  clearEmailHistory,
  validateEmail,
  emailHistory: () => emailHistory // Function to access for debugging
};

export default emailUtilities;