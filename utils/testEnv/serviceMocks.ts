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
function getJestRef(): any {
  const j = (globalThis as any).jest;
  if (!j) {
    throw new Error('serviceMocks: Jest global not found (this utility must run inside Jest with injectGlobals enabled)');
  }
  return j;
}

// =============================================================================
// MOCK INTERFACES - Type definitions for mock responses
// =============================================================================

// Minimal mock function shape (avoids a hard dependency on the global `jest` namespace types).
export type JestMockLike = {
  (...args: any[]): any;
  mockClear?: () => void;
  mockResolvedValue?: (value: any) => any;
  mockReturnValue?: (value: any) => any;
};

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
  sendMail: JestMockLike;
}

export interface MockNodemailerResult {
  mockCreateTransport: JestMockLike;
  mockTransport: MockNodemailerTransport;
  nodemailer: {
    createTransport: JestMockLike;
  };
}

export interface MockWhoisResult {
  mockWhois: JestMockLike;
  whois: JestMockLike;
}

export interface MockOpenAIResult {
  mockCreate: JestMockLike;
  openai: {
    default: new () => {
      chat: {
        completions: {
          create: JestMockLike;
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
  const jestRef = getJestRef();
  const mockWhois = jestRef.fn();
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
  const jestRef = getJestRef();
  const mockCreate = jestRef.fn();
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
  const jestRef = getJestRef();
  const mockCreateTransport = jestRef.fn();
  const mockTransport: MockNodemailerTransport = {
    sendMail: jestRef.fn()
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

// =============================================================================
// SETUP UTILITIES - Bulk mock setup for ESM modules
// =============================================================================

export interface SetupManualMocksResult {
  mockWhois: JestMockLike;
  mockCreate: JestMockLike;
  mockCreateTransport: JestMockLike;
}

/**
 * Setup all manual mocks at once using jest.unstable_mockModule for ESM compatibility
 * ESM-safe: in Jest ESM mode, static imports are evaluated before jest.mock()
 * so we must use jest.unstable_mockModule and import targets after this is called.
 * @returns Object containing all created mock functions
 */
export const setupManualMocks = async (): Promise<SetupManualMocksResult> => {
  const jestRef = getJestRef();
  const { mockWhois } = createMockWhois();
  const { mockCreate } = createMockOpenAI();
  const { mockCreateTransport } = createMockNodemailer();
  
  jestRef.unstable_mockModule('whois-json', () => ({ default: mockWhois }));
  jestRef.unstable_mockModule('openai', () => ({
    default: class {
      constructor() {}
      chat = {
        completions: {
          create: mockCreate,
        },
      };
    },
  }));
  jestRef.unstable_mockModule('nodemailer', () => ({
    default: {
      createTransport: mockCreateTransport,
    },
  }));
  jestRef.unstable_mockModule('qerrors', () => ({
    __esModule: true,
    default: jestRef.fn(),
  }));

  return {
    mockWhois,
    mockCreate,
    mockCreateTransport
  };
};

// =============================================================================
// CLEANUP UTILITIES - Efficient mock clearing
// =============================================================================

/**
 * Clear all mocks efficiently - calls jest.clearAllMocks plus any passed mocks
 * More generic than resetMocks, works with any jest.Mock instances
 * @param mocks - Variable number of mock functions to clear
 */
export const clearAllMocks = (...mocks: JestMockLike[]): void => {
  const jestRef = getJestRef();
  jestRef.clearAllMocks();
  mocks.forEach(mock => {
    if (mock && typeof mock.mockClear === 'function') {
      mock.mockClear();
    }
  });
};
