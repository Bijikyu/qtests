/**
 * Send Email Integration Tests - Core functionality
 */

const { sendEmail, getEmailHistory, clearEmailHistory } = require('../utils/sendEmail');

describe('Send Email Integration', () => {
  
  beforeEach(() => {
    clearEmailHistory();
  });
  
  test('sendEmail captures email data', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    };
    
    const result = await sendEmail(emailData);
    
    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
    expect(result.to).toBe('test@example.com');
  });
  
  test('getEmailHistory tracks sent emails', async () => {
    await sendEmail({
      to: 'user1@example.com',
      subject: 'Email 1',
      text: 'First email'
    });
    
    await sendEmail({
      to: 'user2@example.com', 
      subject: 'Email 2',
      text: 'Second email'
    });
    
    const history = getEmailHistory();
    expect(history).toHaveLength(2);
    expect(history[0].to).toBe('user1@example.com');
    expect(history[1].to).toBe('user2@example.com');
  });
  
  test('clearEmailHistory resets tracking', async () => {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      text: 'Test email'
    });
    
    expect(getEmailHistory()).toHaveLength(1);
    
    clearEmailHistory();
    expect(getEmailHistory()).toHaveLength(0);
  });
});