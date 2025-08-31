/**
 * Email Mock Utility for Testing - TypeScript Implementation
 */

import { executeWithLogs } from '../lib/logUtils.js';

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
    // Validate basic email structure
    if (!emailData || !emailData.to) {
      throw new Error('Email requires "to" field');
    }
    
    // Create mock result
    const result: EmailResult = {
      success: true,
      messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    if (!emailData) return false;
    if (!emailData.to) return false;
    if (typeof emailData.to !== 'string') return false;
    return emailData.to.includes('@');
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