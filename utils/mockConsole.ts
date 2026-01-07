/** Consolidated Console Mocking Utilities */
import { withErrorLogging } from '../lib/errorHandling/index.js';
import { logStart } from '../lib/logUtils.js';
import { tryCreateJestSpy } from './console/jestMocker.js';
import { createFallbackMock } from './console/fallbackMocker.js';
import { withMockConsole, mockAllConsole, withAllMockedConsole, isMocked, restoreMock, restoreAllMocks } from './console/consoleUtils.js';
import type { ConsoleMethod, ConsoleMockOptions, JestSpy } from './console/jestMocker.js';
import type { FallbackMock } from './console/fallbackMocker.js';

export { ConsoleMethod, JestSpy, ConsoleMockOptions, tryCreateJestSpy, mockConsoleWithJest } from './console/jestMocker.js';
export { FallbackMock, createFallbackMock, mockConsoleWithFallback } from './console/fallbackMocker.js';
export { MockSpy, withMockConsole, mockAllConsole, withAllMockedConsole, isMocked, restoreMock, restoreAllMocks } from './console/consoleUtils.js';
export const mockConsole=(method:ConsoleMethod,options:ConsoleMockOptions={}):JestSpy|FallbackMock=>(logStart('mockConsole',method),withErrorLogging(()=>{const{captureCalls=true,silent=true,implementation,preferJest=true}=options;if(preferJest){const jestSpy=tryCreateJestSpy(method,silent,implementation);if(jestSpy){console.log(`mockConsole is returning Jest spy`);return jestSpy;}}console.log(`mockConsole is using fallback implementation`);return createFallbackMock(method,captureCalls,silent,implementation);},'mockConsole'));

export const consoleMocking={mockConsole,withMockConsole,mockAllConsole,withAllMockedConsole,isMocked,restoreMock,restoreAllMocks};
export default mockConsole;