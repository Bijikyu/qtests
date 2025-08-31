/**
 * Email Template Utility - TypeScript Implementation
 * 
 * This module provides email templating functionality for consistent
 * email formatting across the application. It handles template creation
 * and variable substitution.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';

// Type definitions
interface EmailTemplate {
  subject: string;
  body: string;
}

interface TemplateResult {
  success: boolean;
  template?: EmailTemplate;
  templateName?: string;
  variables?: Record<string, any>;
  message?: string;
  availableTemplates?: string[];
}

interface TemplateVariables {
  [key: string]: string | number | undefined;
}

/**
 * Create email template for consistent formatting
 * 
 * This function provides a template system for common email patterns.
 * Useful for applications that send similar emails with variable content.
 */
function createEmailTemplate(templateName: string, variables: TemplateVariables = {}): TemplateResult {
  logStart('createEmailTemplate', templateName, variables);
  
  const templates: Record<string, EmailTemplate> = {
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
    const error: TemplateResult = {
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
    const valueStr = value?.toString() || '';
    subject = subject.replace(new RegExp(placeholder, 'g'), valueStr);
    body = body.replace(new RegExp(placeholder, 'g'), valueStr);
  }
  
  // Replace any remaining placeholders with empty strings
  subject = subject.replace(/\{\{[^}]+\}\}/g, '');
  body = body.replace(/\{\{[^}]+\}\}/g, '');
  
  const result: TemplateResult = {
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

// Export using ES module syntax
export { createEmailTemplate };