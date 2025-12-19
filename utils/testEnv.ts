import { executeWithLogs, logStart, logReturn, setLogging } from '../lib/logUtils.js';
import { withErrorLogging } from '../lib/errorHandling/index.js';
import localVars from '../config/localVars.js';

// Set logging based on environment using localVars pattern
if ((localVars as any).nodeEnv !== 'test') {
  setLogging(false);
}
import * as dotenv from 'dotenv';

interface DefaultEnv {
  GOOGLE_API_KEY: string;
  GOOGLE_CX: string;
  OPENAI_TOKEN: string;
}

interface MockSpy {
  mockClear?: () => void;
  mockReset?: () => void;
}

interface AxiosMock {
  onGet: (url: string) => ReplyBinder;
  onPost: (url: string) => ReplyBinder;
  reset: () => void;
  _replies: Record<string, { status: number; data: any }>;
}

interface ReplyBinder {
  reply: (status: number, data: any) => AxiosMock;
}

const defaultEnv: DefaultEnv = {
  GOOGLE_API_KEY: 'key',
  GOOGLE_CX: 'cx',
  OPENAI_TOKEN: 'token'
};

function setTestEnv(): boolean {
  logStart('setTestEnv', 'default values');
  
  return withErrorLogging(() => {
    dotenv.config();
    Object.assign(process.env, defaultEnv);
    logReturn('setTestEnv', true);
    return true;
  }, 'setTestEnv');
}

function saveEnv(): Record<string, string | undefined> {
  logStart('saveEnv');
  
  return withErrorLogging(() => {
    const savedEnv = { ...process.env };
    logReturn('saveEnv', `${Object.keys(savedEnv).length} env vars`);
    return savedEnv;
  }, 'saveEnv');
}

function restoreEnv(savedEnv: Record<string, string | undefined>): boolean {
  logStart('restoreEnv', savedEnv);

  return withErrorLogging(() => {
    if (!savedEnv || typeof savedEnv !== 'object') {
      console.log(`restoreEnv: invalid saved environment`);
      return false;
    }

    const currentKeys = new Set(Object.keys(process.env));
    const backupKeys = new Set(Object.keys(savedEnv));

    currentKeys.forEach(key => {
      if (!backupKeys.has(key)) delete process.env[key];
    });

    for (const [key, value] of Object.entries(savedEnv)) {
      if (value !== undefined) process.env[key] = value; else delete process.env[key];
    }

    logReturn('restoreEnv', true);
    return true;
  }, 'restoreEnv');
}

function attachMockSpies<T extends MockSpy>(mock: T): T {
  console.log(`attachMockSpies is running with ${mock}`);
  
  return withErrorLogging(() => {
    if (typeof jest !== `undefined`) {
      mock.mockClear = jest.fn();
      mock.mockReset = jest.fn();
    } else {
      mock.mockClear = () => {};
      mock.mockReset = () => {};
    }
    console.log(`attachMockSpies is returning ${mock}`);
    return mock;
  }, 'attachMockSpies');
}

function makeLoggedMock<T extends MockSpy>(name: string, creator: () => T): T {
  console.log(`makeLoggedMock is running with ${name}, ${creator}`);
  
  try {
    const mock = creator();
    attachMockSpies(mock);
    console.log(`makeLoggedMock is returning ${mock}`);
    return mock;
  } catch (error: any) {
    console.log(`makeLoggedMock error: ${error.message}`);
    throw error;
  }
}

function createScheduleMock(): Function & MockSpy {
  console.log(`createScheduleMock is running with none`);
  
  try {
    const scheduleMock = function(fn: Function): Promise<any> {
      return Promise.resolve(fn());
    } as Function & MockSpy;
    attachMockSpies(scheduleMock);
    console.log(`createScheduleMock is returning ${scheduleMock}`);
    return scheduleMock;
  } catch (error: any) {
    console.log(`createScheduleMock error: ${error.message}`);
    throw error;
  }
}

function createQerrorsMock(): Function & MockSpy {
  console.log(`createQerrorsMock is running with none`);
  
  try {
    const qerrorsMock = function(...args: any[]): any[] {
      return args;
    } as Function & MockSpy;
    attachMockSpies(qerrorsMock);
    console.log(`createQerrorsMock is returning ${qerrorsMock}`);
    return qerrorsMock;
  } catch (error: any) {
    console.log(`createQerrorsMock error: ${error.message}`);
    throw error;
  }
}

function createAxiosMock(): AxiosMock & MockSpy {
  return makeLoggedMock('createAxiosMock', () => {
    const mock = {
      onGet: function(url: string): ReplyBinder {
        return createReplyBinder(url);
      },
      onPost: function(url: string): ReplyBinder {
        return createReplyBinder(url);
      },
      reset: function(): void {
        mock._replies = {};
      },
      _replies: {} as Record<string, { status: number; data: any }>
    } as AxiosMock & MockSpy;
    
    function createReplyBinder(url: string): ReplyBinder {
      return {
        reply: function(status: number, data: any): AxiosMock {
          mock._replies[url] = { status, data };
          return mock;
        }
      };
    }
    return mock;
  });
}

function resetMocks(
  mock?: AxiosMock, 
  scheduleMock?: Function & MockSpy, 
  qerrorsMock?: Function & MockSpy
): boolean {
  return executeWithLogs('resetMocks', () => {
    if (mock && mock.reset) {
      mock.reset();
    }
    if (scheduleMock && scheduleMock.mockClear) {
      scheduleMock.mockClear();
    }
    if (qerrorsMock && qerrorsMock.mockClear) {
      qerrorsMock.mockClear();
    }
    return true;
  }, 'mocks');
}

function initSearchTest(): {
  mock: AxiosMock & MockSpy;
  scheduleMock: Function & MockSpy;
  qerrorsMock: Function & MockSpy;
} {
  return executeWithLogs('initSearchTest', () => {
    if (typeof jest !== 'undefined' && jest.resetModules) {
      jest.resetModules();
    }
    setTestEnv();
    const scheduleMock = createScheduleMock();
    const qerrorsMock = createQerrorsMock();
    const mock = createAxiosMock();
    return { mock, scheduleMock, qerrorsMock };
  }, 'none');
}

export {
  defaultEnv,
  setTestEnv,
  saveEnv,
  restoreEnv,
  attachMockSpies,
  makeLoggedMock,
  createScheduleMock,
  createQerrorsMock,
  createAxiosMock,
  resetMocks,
  initSearchTest
};