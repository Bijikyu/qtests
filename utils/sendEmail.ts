/**
 * Email Mock Utility for Testing - TypeScript Implementation
 */

import { executeWithLogs } from '../lib/logUtils.js';
import qerrors from 'qerrors';
import { randomBytes } from 'crypto';

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
      
      // Validate email format
      if (typeof emailData.to !== 'string' || !emailData.to.includes('@')) {
        const error = new Error('Invalid email format in "to" field');
        qerrors(error, 'sendEmail: invalid email format', { to: emailData.to });
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
 * Validate email data
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
      if (typeof emailData.to !== 'string') {
        qerrors(new Error('Email "to" field is not a string'), 'validateEmail: invalid to type', { toType: typeof emailData.to });
        return false;
      }
      if (!emailData.to.includes('@')) {
        qerrors(new Error('Email "to" field missing @ symbol'), 'validateEmail: invalid email format', { to: emailData.to });
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