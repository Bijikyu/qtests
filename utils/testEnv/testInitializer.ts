import { executeWithLogs } from '../../lib/logUtils.js';
import { setTestEnv } from './envManager.js';
import { createScheduleMock, createQerrorsMock } from './functionMocks.js';
import { createAxiosMock, resetMocks } from './axiosMocks.js';

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

export function initSearchTest(): {
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

export { resetMocks };