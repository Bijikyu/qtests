/**
 * Email Validation Utility
 * 
 * This module provides email validation functionality with clear separation
 * of concerns. It focuses solely on email format validation logic.
 */

const { logStart, logReturn } = require('../../lib/logUtils');

/**
 * Validate email address format
 * 
 * This function provides basic email validation using a simple regex pattern.
 * While not comprehensive for all edge cases, it catches common formatting
 * errors and provides helpful feedback for testing scenarios.
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

module.exports = {
  validateEmail
};