/**
 * Email Template Utility
 * 
 * This module provides email templating functionality for consistent
 * email formatting across the application. It handles template creation
 * and variable substitution.
 */

const { logStart, logReturn } = require('../../lib/logUtils');

/**
 * Create email template for consistent formatting
 * 
 * This function provides a template system for common email patterns.
 * Useful for applications that send similar emails with variable content.
 * 
 * @param {string} templateName - Name of the email template to use
 * @param {Object} variables - Variables to substitute in the template
 * @returns {Object} Email template with subject and body
 */
function createEmailTemplate(templateName, variables = {}) {
  logStart('createEmailTemplate', templateName, variables);
  
  const templates = {
    welcome: {
      subject: 'Welcome to {{appName}}!',
      body: 'Hello {{userName}},\n\nWelcome to {{appName}}! We\'re excited to have you on board.\n\nBest regards,\nThe {{appName}} Team'
    },
    notification: {
      subject: '{{appName}} Notification: {{title}}',
      body: 'Hello {{userName}},\n\n{{message}}\n\nBest regards,\nThe {{appName}} Team'
    },
    reset: {
      subject: 'Reset your {{appName}} password',
      body: 'Hello {{userName}},\n\nYou requested to reset your password. Use this link: {{resetLink}}\n\nIf you didn\'t request this, please ignore this email.\n\nBest regards,\nThe {{appName}} Team'
    }
  };
  
  const template = templates[templateName];
  if (!template) {
    const error = {
      success: false,
      message: `Unknown email template: ${templateName}`,
      availableTemplates: Object.keys(templates)
    };
    logReturn('createEmailTemplate', error);
    return error;
  }
  
  // Substitute variables in template
  let subject = template.subject;
  let body = template.body;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), value || '');
    body = body.replace(new RegExp(placeholder, 'g'), value || '');
  }
  
  // Replace any remaining placeholders with empty strings
  subject = subject.replace(/\{\{[^}]+\}\}/g, '');
  body = body.replace(/\{\{[^}]+\}\}/g, '');
  
  const result = {
    success: true,
    template: {
      subject,
      body
    },
    templateName,
    variables
  };
  
  logReturn('createEmailTemplate', result);
  return result;
}

module.exports = {
  createEmailTemplate
};