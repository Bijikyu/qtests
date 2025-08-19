/**
 * Email History Management Utility
 * 
 * This module manages email history for testing and verification purposes.
 * It provides a clean separation of history management from email sending logic.
 */

const { logStart, logReturn } = require('../../lib/logUtils');

// In-memory storage for email history during testing
const emailHistory = [];

/**
 * Clear email history for test isolation
 * 
 * This function provides a clean slate for each test by removing all previously
 * mocked email records. Essential for test isolation and preventing test
 * interference when running multiple email-related test suites.
 * 
 * @returns {number} Number of emails cleared from history
 */
function clearEmailHistory() {
  logStart('clearEmailHistory');
  const cleared = emailHistory.length;
  emailHistory.length = 0;
  logReturn('clearEmailHistory', cleared);
  return cleared;
}

/**
 * Get email history for test verification
 * 
 * This function provides access to all emails that have been "sent" through
 * the sendEmail function. Returns a copy to prevent accidental modification.
 * 
 * @returns {Array} Copy of all emails in chronological order
 */
function getEmailHistory() {
  logStart('getEmailHistory');
  const history = [...emailHistory];
  logReturn('getEmailHistory', `${history.length} emails`);
  return history;
}

/**
 * Add email to history
 * 
 * Internal function to add an email to the history tracking.
 * 
 * @param {Object} emailData - Email data to add to history
 */
function addToHistory(emailData) {
  emailHistory.push(emailData);
}

module.exports = {
  clearEmailHistory,
  getEmailHistory,
  addToHistory,
  emailHistory // Export for direct access in advanced testing scenarios
};