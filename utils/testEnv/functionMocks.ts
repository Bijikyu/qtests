import { makeLoggedMock } from './spyAttacher.js';

interface MockSpy {
  mockClear?: () => void;
  mockReset?: () => void;
}

export function createScheduleMock(): Function & MockSpy {
  console.log(`createScheduleMock is running with none`);
  
  try {
    const scheduleMock = function(fn: Function): Promise<any> {
      return Promise.resolve(fn());
    } as Function & MockSpy;
    return makeLoggedMock('createScheduleMock', () => scheduleMock);
  } catch (error: any) {
    console.log(`createScheduleMock error: ${error.message}`);
    throw error;
  }
}

export function createQerrorsMock(): Function & MockSpy {
  console.log(`createQerrorsMock is running with none`);
  
  try {
    const qerrorsMock = function(...args: any[]): any[] {
      return args;
    } as Function & MockSpy;
    return makeLoggedMock('createQerrorsMock', () => qerrorsMock);
  } catch (error: any) {
    console.log(`createQerrorsMock error: ${error.message}`);
    throw error;
  }
}