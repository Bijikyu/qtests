import { makeLoggedMock } from './spyAttacher.js';
import { withErrorLogging } from '../../lib/errorHandling/index.js';

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

export function createAxiosMock(): AxiosMock & MockSpy {
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

export function resetMocks(
  mock?: AxiosMock, 
  scheduleMock?: Function & MockSpy, 
  qerrorsMock?: Function & MockSpy
): boolean {
  return require('../../lib/errorHandling/index.js').withErrorLogging(() => {
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
  }, 'resetMocks');
}