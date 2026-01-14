/**
 * Service Mocks - Simplified test mocks for third-party services
 * 
 * This module provides factory functions for creating mocks of commonly used
 * third-party services that qtests doesn't automatically stub. These mocks
 * enable isolated testing without external dependencies.
 * 
 * Design philosophy:
 * - Type-safe mock interfaces
 * - Consistent factory pattern across all services
 * - Sensible default mock data for common testing scenarios
 * - Easy customization for specific test cases
 * 
 * Usage patterns:
 * - Import specific factory: import { createMockOpenAI } from 'qtests/utils/testEnv/serviceMocks'
 * - Import default data: import { DEFAULT_MOCK_DATA } from 'qtests/utils/testEnv/serviceMocks'
 */

import { jest } from '@jest/globals';

// =============================================================================
// MOCK INTERFACES - Type definitions for mock responses
// =============================================================================

export interface MockWhoisResponse {
  [key: string]: string;
}

export interface MockOpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface MockNodemailerTransport {
  sendMail: jest.Mock;
}

export interface MockNodemailerResult {
  mockCreateTransport: jest.Mock;
  mockTransport: MockNodemailerTransport;
  nodemailer: {
    createTransport: jest.Mock;
  };
}

export interface MockWhoisResult {
  mockWhois: jest.Mock;
  whois: jest.Mock;
}

export interface MockOpenAIResult {
  mockCreate: jest.Mock;
  openai: {
    default: new () => {
      chat: {
        completions: {
          create: jest.Mock;
        };
      };
    };
  };
}

// =============================================================================
// FACTORY FUNCTIONS - Create mocks for third-party services
// =============================================================================

/**
 * Create a mock for whois-json module
 * @returns Object containing the mock function and module structure
 */
export const createMockWhois = (): MockWhoisResult => {
  const mockWhois = jest.fn();
  return {
    mockWhois,
    whois: mockWhois
  };
};

/**
 * Create a mock for OpenAI SDK
 * @returns Object containing the mock create function and SDK structure
 */
export const createMockOpenAI = (): MockOpenAIResult => {
  const mockCreate = jest.fn();
  return {
    mockCreate,
    openai: {
      default: class {
        constructor() {}
        chat = {
          completions: {
            create: mockCreate
          }
        };
      }
    }
  };
};

/**
 * Create a mock for nodemailer module
 * @returns Object containing mock transport and createTransport function
 */
export const createMockNodemailer = (): MockNodemailerResult => {
  const mockCreateTransport = jest.fn();
  const mockTransport: MockNodemailerTransport = {
    sendMail: jest.fn()
  };
  (mockTransport.sendMail as any).mockResolvedValue({ messageId: 'test-message-id' });
  (mockCreateTransport as any).mockReturnValue(mockTransport);
  
  return {
    mockCreateTransport,
    mockTransport,
    nodemailer: {
      createTransport: mockCreateTransport
    }
  };
};

// =============================================================================
// DEFAULT MOCK DATA - Consistent test data for common scenarios
// =============================================================================

/**
 * Default mock data for consistent testing across test suites
 * Use these defaults for predictable test behavior
 */
export const DEFAULT_MOCK_DATA = {
  whois: {
    success: {
      // whois-json parse output is camelCased (see node_modules/whois-json/parse-raw-data.js)
      registrantEmail: 'admin@example.com',
      adminEmail: 'admin@example.com'
    } as MockWhoisResponse,
    empty: {} as MockWhoisResponse
  },
  openai: {
    success: {
      choices: [{
        message: {
          content: 'Collaboration opportunity - generated email content for outreach'
        }
      }]
    } as MockOpenAIResponse
  },
  nodemailer: {
    success: {
      messageId: 'test-message-id',
      accepted: ['recipient@example.com'],
      rejected: []
    }
  }
};
