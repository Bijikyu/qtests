/**
 * Tests for sendEmail utility
 * 
 * This test suite verifies the email mocking functionality including:
 * - Basic email sending with validation
 * - Email history tracking and management
 * - Batch email processing
 * - Template system functionality
 * - Error handling and edge cases
 * - Integration with qtests framework patterns
 */

const { sendEmail } = require('../lib/envUtils');
const {
  sendEmail: sendEmailFn,
  sendEmailBatch,
  createEmailTemplate,
  clearEmailHistory,
  getEmailHistory,
  validateEmail,
  formatEmailContent
} = sendEmail;

describe('sendEmail utility', () => {
  beforeEach(() => {
    // Clear email history before each test for isolation
    clearEmailHistory();
  });

  describe('validateEmail function', () => {
    test('validates correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('simple@test.org')).toBe(true);
    });

    test('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('formatEmailContent function', () => {
    test('formats valid content correctly', () => {
      const result = formatEmailContent('Test Subject', 'Test Body');
      expect(result.subject).toBe('Test Subject');
      expect(result.body).toBe('Test Body');
    });

    test('handles missing content with defaults', () => {
      const result = formatEmailContent('', '');
      expect(result.subject).toBe('[No Subject]');
      expect(result.body).toBe('[No Body]');
    });

    test('handles undefined content', () => {
      const result = formatEmailContent(undefined, null);
      expect(result.subject).toBe('[No Subject]');
      expect(result.body).toBe('[No Body]');
    });

    test('trims whitespace from content', () => {
      const result = formatEmailContent('  Subject  ', '  Body  ');
      expect(result.subject).toBe('Subject');
      expect(result.body).toBe('Body');
    });
  });

  describe('sendEmail core function', () => {
    test('sends email with valid parameters', () => {
      const result = sendEmailFn('user@example.com', 'Test Subject', 'Test Body');
      
      expect(result.success).toBe(true);
      expect(result.emailData.to).toBe('user@example.com');
      expect(result.emailData.subject).toBe('Test Subject');
      expect(result.emailData.body).toBe('Test Body');
      expect(result.message).toBe('Client should send this email using preferred mail service');
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.id).toMatch(/^mock-email-\d+-[a-z0-9]+$/);
    });

    test('handles invalid email addresses', () => {
      const result = sendEmailFn('invalid-email', 'Subject', 'Body');
      
      expect(result.success).toBe(false);
      expect(result.emailData).toBe(null);
      expect(result.message).toBe('Invalid email address: invalid-email');
      expect(result.error).toBe('INVALID_RECIPIENT');
    });

    test('formats email content automatically', () => {
      const result = sendEmailFn('user@example.com', '  Subject  ', '  Body  ');
      
      expect(result.success).toBe(true);
      expect(result.emailData.subject).toBe('Subject');
      expect(result.emailData.body).toBe('Body');
    });

    test('handles missing subject and body', () => {
      const result = sendEmailFn('user@example.com', '', '');
      
      expect(result.success).toBe(true);
      expect(result.emailData.subject).toBe('[No Subject]');
      expect(result.emailData.body).toBe('[No Body]');
    });

    test('includes additional options in email data', () => {
      const options = { cc: 'cc@example.com', priority: 'high' };
      const result = sendEmailFn('user@example.com', 'Subject', 'Body', options);
      
      expect(result.success).toBe(true);
      expect(result.emailData.cc).toBe('cc@example.com');
      expect(result.emailData.priority).toBe('high');
    });
  });

  describe('email history management', () => {
    test('tracks successful emails in history', () => {
      sendEmailFn('user1@example.com', 'Subject 1', 'Body 1');
      sendEmailFn('user2@example.com', 'Subject 2', 'Body 2');
      
      const history = getEmailHistory();
      expect(history).toHaveLength(2);
      expect(history[0].emailData.to).toBe('user1@example.com');
      expect(history[1].emailData.to).toBe('user2@example.com');
    });

    test('tracks failed emails in history', () => {
      sendEmailFn('invalid-email', 'Subject', 'Body');
      
      const history = getEmailHistory();
      expect(history).toHaveLength(1);
      expect(history[0].success).toBe(false);
      expect(history[0].error).toBe('INVALID_RECIPIENT');
    });

    test('clears email history correctly', () => {
      sendEmailFn('user@example.com', 'Subject', 'Body');
      expect(getEmailHistory()).toHaveLength(1);
      
      const cleared = clearEmailHistory();
      expect(cleared).toBe(1);
      expect(getEmailHistory()).toHaveLength(0);
    });

    test('returns copy of history to prevent modification', () => {
      sendEmailFn('user@example.com', 'Subject', 'Body');
      
      const history1 = getEmailHistory();
      const history2 = getEmailHistory();
      
      expect(history1).not.toBe(history2); // different objects
      expect(history1).toEqual(history2); // same content
      
      history1.push({ fake: 'email' });
      expect(getEmailHistory()).toHaveLength(1); // original unchanged
    });
  });

  describe('sendEmailBatch function', () => {
    test('processes multiple valid emails', () => {
      const emails = [
        { to: 'user1@example.com', subject: 'Subject 1', body: 'Body 1' },
        { to: 'user2@example.com', subject: 'Subject 2', body: 'Body 2' },
        { to: 'user3@example.com', subject: 'Subject 3', body: 'Body 3' }
      ];
      
      const result = sendEmailBatch(emails);
      
      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(3);
      expect(result.summary.total).toBe(3);
      expect(result.summary.successful).toBe(3);
      expect(result.summary.failed).toBe(0);
      
      // Verify all emails were processed
      result.results.forEach((emailResult, index) => {
        expect(emailResult.success).toBe(true);
        expect(emailResult.emailData.to).toBe(emails[index].to);
      });
    });

    test('handles mixed valid and invalid emails', () => {
      const emails = [
        { to: 'valid@example.com', subject: 'Valid', body: 'Valid body' },
        { to: 'invalid-email', subject: 'Invalid', body: 'Invalid body' },
        { to: 'another@example.com', subject: 'Another', body: 'Another body' }
      ];
      
      const result = sendEmailBatch(emails);
      
      expect(result.success).toBe(false); // batch fails if any individual email fails
      expect(result.results).toHaveLength(3);
      expect(result.summary.total).toBe(3);
      expect(result.summary.successful).toBe(2);
      expect(result.summary.failed).toBe(1);
      
      expect(result.results[0].success).toBe(true);
      expect(result.results[1].success).toBe(false);
      expect(result.results[2].success).toBe(true);
    });

    test('handles invalid input gracefully', () => {
      const result = sendEmailBatch('not-an-array');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('sendEmailBatch requires an array of email objects');
      expect(result.results).toEqual([]);
      expect(result.summary.failed).toBe(1);
    });

    test('processes empty array correctly', () => {
      const result = sendEmailBatch([]);
      
      expect(result.success).toBe(true);
      expect(result.results).toEqual([]);
      expect(result.summary.total).toBe(0);
      expect(result.summary.successful).toBe(0);
      expect(result.summary.failed).toBe(0);
    });

    test('passes options to individual emails', () => {
      const emails = [
        { to: 'user@example.com', subject: 'Test', body: 'Test', options: { priority: 'high' } }
      ];
      const batchOptions = { verbose: true };
      
      const result = sendEmailBatch(emails, batchOptions);
      
      expect(result.success).toBe(true);
      expect(result.results[0].emailData.priority).toBe('high');
      expect(result.results[0].emailData.verbose).toBe(true);
    });
  });

  describe('createEmailTemplate function', () => {
    test('creates welcome template with variables', () => {
      const variables = { appName: 'TestApp', userName: 'John' };
      const result = createEmailTemplate('welcome', variables);
      
      expect(result.success).toBe(true);
      expect(result.template.subject).toBe('Welcome to TestApp!');
      expect(result.template.body).toContain('Hello John,');
      expect(result.template.body).toContain('Welcome to TestApp!');
      expect(result.templateName).toBe('welcome');
    });

    test('creates notification template with variables', () => {
      const variables = { 
        appName: 'TestApp', 
        userName: 'Jane', 
        title: 'System Update',
        message: 'The system will be updated tonight.'
      };
      const result = createEmailTemplate('notification', variables);
      
      expect(result.success).toBe(true);
      expect(result.template.subject).toBe('TestApp Notification: System Update');
      expect(result.template.body).toContain('Hello Jane,');
      expect(result.template.body).toContain('The system will be updated tonight.');
    });

    test('creates reset template with variables', () => {
      const variables = { 
        appName: 'TestApp', 
        userName: 'Bob',
        resetLink: 'https://example.com/reset/123'
      };
      const result = createEmailTemplate('reset', variables);
      
      expect(result.success).toBe(true);
      expect(result.template.subject).toBe('Reset your TestApp password');
      expect(result.template.body).toContain('Hello Bob,');
      expect(result.template.body).toContain('https://example.com/reset/123');
    });

    test('handles unknown template names', () => {
      const result = createEmailTemplate('unknown', {});
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Unknown email template: unknown');
      expect(result.availableTemplates).toContain('welcome');
      expect(result.availableTemplates).toContain('notification');
      expect(result.availableTemplates).toContain('reset');
    });

    test('handles missing variables gracefully', () => {
      const result = createEmailTemplate('welcome', { appName: 'TestApp' }); // missing userName
      
      expect(result.success).toBe(true);
      expect(result.template.body).toContain('Hello ,'); // empty userName
    });

    test('replaces multiple occurrences of same variable', () => {
      const result = createEmailTemplate('welcome', { appName: 'TestApp', userName: 'John' });
      
      expect(result.success).toBe(true);
      const bodyAppNameCount = (result.template.body.match(/TestApp/g) || []).length;
      expect(bodyAppNameCount).toBeGreaterThan(1); // appName appears multiple times
    });
  });

  describe('integration scenarios', () => {
    test('complete email workflow with template and batch sending', () => {
      // Create template
      const template = createEmailTemplate('welcome', { appName: 'MyApp', userName: 'User' });
      expect(template.success).toBe(true);
      
      // Use template for batch emails
      const emails = [
        { to: 'user1@example.com', ...template.template },
        { to: 'user2@example.com', ...template.template },
        { to: 'user3@example.com', ...template.template }
      ];
      
      const batchResult = sendEmailBatch(emails);
      expect(batchResult.success).toBe(true);
      expect(batchResult.summary.successful).toBe(3);
      
      // Verify history contains all emails
      const history = getEmailHistory();
      expect(history).toHaveLength(3);
      history.forEach(email => {
        expect(email.emailData.subject).toBe('Welcome to MyApp!');
        expect(email.emailData.body).toContain('Hello User,');
      });
    });

    test('error handling maintains email history integrity', () => {
      // Send valid email
      sendEmailFn('valid@example.com', 'Valid', 'Valid body');
      
      // Send invalid email
      sendEmailFn('invalid-email', 'Invalid', 'Invalid body');
      
      // Send another valid email
      sendEmailFn('another@example.com', 'Another', 'Another body');
      
      const history = getEmailHistory();
      expect(history).toHaveLength(3);
      expect(history[0].success).toBe(true);
      expect(history[1].success).toBe(false);
      expect(history[2].success).toBe(true);
    });

    test('supports complex email options and metadata', () => {
      const options = {
        cc: 'cc@example.com',
        bcc: 'bcc@example.com',
        priority: 'high',
        attachments: ['file1.pdf', 'file2.doc'],
        template: 'custom',
        verbose: true
      };
      
      const result = sendEmailFn('user@example.com', 'Complex Email', 'Body with options', options);
      
      expect(result.success).toBe(true);
      expect(result.emailData.cc).toBe('cc@example.com');
      expect(result.emailData.bcc).toBe('bcc@example.com');
      expect(result.emailData.priority).toBe('high');
      expect(result.emailData.attachments).toEqual(['file1.pdf', 'file2.doc']);
      expect(result.emailData.template).toBe('custom');
      expect(result.emailData.verbose).toBe(true);
    });
  });

  // Removed console logging tests to prevent hanging in parallel execution
});