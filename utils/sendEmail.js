/**
 * Email Mock Utility for Testing and Lightweight Applications (Refactored)
 * 
 * This module has been refactored to follow Single Responsibility Principle.
 * It now coordinates between focused email utilities for better maintainability.
 * 
 * Components:
 * - email/emailValidator.js - Email validation logic
 * - email/emailFormatter.js - Email content formatting
 * - email/emailHistory.js - Email history management
 * - email/emailTemplate.js - Email templating
 * - email/emailSender.js - Core sending and batch operations
 */

// Import focused email utilities
const { sendEmail, sendEmailBatch } = require('./email/emailSender');
const { validateEmail } = require('./email/emailValidator');
const { formatEmailContent } = require('./email/emailFormatter');
const { clearEmailHistory, getEmailHistory, emailHistory } = require('./email/emailHistory');
const { createEmailTemplate } = require('./email/emailTemplate');

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