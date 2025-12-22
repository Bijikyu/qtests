// Re-export from focused modules for backward compatibility
export {
  defaultEnv,
  setTestEnv,
  saveEnv,
  restoreEnv
} from './testEnv/envManager.js';

export {
  attachMockSpies,
  makeLoggedMock,
  createScheduleMock,
  createQerrorsMock,
  createAxiosMock,
  resetMocks
} from './testEnv/mockFactory.js';

export {
  initSearchTest
} from './testEnv/testInitializer.js';