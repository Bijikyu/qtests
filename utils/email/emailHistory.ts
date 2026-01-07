/**
 * Email History Management Utility - TypeScript Implementation
 * 
 * This module manages email history for testing and verification purposes.
 * It provides a clean separation of history management from email sending logic.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';

// Type definitions
interface EmailHistoryEntry {
  success: boolean;
  emailData?: any;
  message: string;
  timestamp: Date;
  id?: string;
  error?: string;
  [key: string]: any;
}

// In-memory storage for email history during testing
const emailHistory: EmailHistoryEntry[] = [];

/**
 * Clear email history for test isolation
 * 
 * This function provides a clean slate for each test by removing all previously
 * mocked email records. Essential for test isolation and preventing test
 * interference when running multiple email-related test suites.
 */
function clearEmailHistory(): number {
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
 */
function getEmailHistory(): EmailHistoryEntry[] {
  logStart('getEmailHistory');
  const history = [...emailHistory];
  logReturn('getEmailHistory', `${history.length} emails`);
  return history;
}

/**
 * Add email to history
 * 
 * Internal function to add an email to the history tracking.
 */
function addToHistory(emailData: EmailHistoryEntry): void {
  emailHistory.push(emailData);
  
  // Prevent unbounded memory growth by keeping only last 1000 entries
  if (emailHistory.length > 1000) {
    emailHistory.splice(0, emailHistory.length - 1000);
  }
}

// Export using ES module syntax
export { 
  clearEmailHistory, 
  getEmailHistory, 
  addToHistory, 
  emailHistory // Export for direct access in advanced testing scenarios
};

export type { EmailHistoryEntry };