/**
 * Email Mock Utility for Testing - Working Implementation
 */

const { executeWithLogs } = require('../lib/logUtils');

// Simple email history storage
let emailHistory = [];

/**
 * Mock email sending function
 */
function sendEmail(emailData) {
  return executeWithLogs('sendEmail', async () => {
    // Validate basic email structure
    if (!emailData || !emailData.to) {
      throw new Error('Email requires "to" field');
    }
    
    // Create mock result
    const result = {
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
function getEmailHistory() {
  return [...emailHistory]; // Return copy
}

/**
 * Clear email history
 */
function clearEmailHistory() {
  return executeWithLogs('clearEmailHistory', () => {
    const cleared = emailHistory.length;
    emailHistory = [];
    return cleared;
  });
}

/**
 * Validate email data
 */
function validateEmail(emailData) {
  return executeWithLogs('validateEmail', () => {
    if (!emailData) return false;
    if (!emailData.to) return false;
    if (typeof emailData.to !== 'string') return false;
    return emailData.to.includes('@');
  }, emailData);
}

module.exports = {
  sendEmail,
  getEmailHistory,
  clearEmailHistory,
  validateEmail,
  emailHistory: () => emailHistory // Function to access for debugging
};