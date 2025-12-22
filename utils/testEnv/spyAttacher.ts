import { withErrorLogging } from '../../lib/errorHandling/index.js';

interface MockSpy {
  mockClear?: () => void;
  mockReset?: () => void;
}

export function attachMockSpies<T extends MockSpy>(mock: T): T {
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

export function makeLoggedMock<T extends MockSpy>(name: string, creator: () => T): T {
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