/** Email Mock Utility for Testing - Consolidated Implementation */
import { validateEmail } from './email/emailValidator.js';
import { formatEmailContent } from './email/emailFormatter.js';
import { addToHistory, getEmailHistory, clearEmailHistory, type EmailHistoryEntry } from './email/emailHistory.js';
import { sendEmail as coreSendEmail, sendEmailBatch, type EmailOptions, type EmailResponse, type EmailBatchItem, type BatchResult } from './email/emailSender.js';

// Re-export core functionality
export { coreSendEmail as sendEmail, sendEmailBatch, addToHistory, getEmailHistory, clearEmailHistory };

// Re-export validation and formatting functions
export { validateEmail } from './email/emailValidator.js';
export { formatEmailContent } from './email/emailFormatter.js';

// Re-export types
export type { EmailOptions, EmailResponse, EmailBatchItem, BatchResult } from './email/emailSender.js';
export type { EmailHistoryEntry } from './email/emailHistory.js';

// Legacy compatibility - alias EmailHistoryEntry to EmailData
export type EmailData = EmailHistoryEntry;
export type EmailResult = EmailResponse;