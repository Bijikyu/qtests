
const { setTestEnv, saveEnv, restoreEnv, createScheduleMock, createQerrorsMock, createAxiosMock, resetMocks, initSearchTest, defaultEnv } = require('../utils/testEnv'); // (import utilities under test including defaults)
const { withSavedEnv } = require("../utils/testHelpers"); //(import env helper)

test('setTestEnv sets variables', () => withSavedEnv(() => { // (use helper to restore env)
  delete process.env.GOOGLE_API_KEY; // (remove old key)
  delete process.env.GOOGLE_CX; // (remove old cx)
  delete process.env.OPENAI_TOKEN; // (remove old token)
  setTestEnv(); // (apply standard test env)
  expect(process.env.GOOGLE_API_KEY).toBe(defaultEnv.GOOGLE_API_KEY); // (check key value)
  expect(process.env.GOOGLE_CX).toBe(defaultEnv.GOOGLE_CX); // (check cx value)
  expect(process.env.OPENAI_TOKEN).toBe(defaultEnv.OPENAI_TOKEN); // (check token value)
}));

test('saveEnv and restoreEnv capture state', () => withSavedEnv(() => { // (verify env round trip)
  process.env.TEST_ENV_TEMP = 'a'; // (set test variable)
  const saved = saveEnv(); // (capture environment)
  process.env.TEST_ENV_TEMP = 'b'; // (modify variable)
  process.env.EXTRA_ENV_TEMP = 'c'; // (add new variable)
  const oldPath = process.env.PATH; // (record critical variable)
  restoreEnv(saved); // (restore environment)
  expect(process.env.TEST_ENV_TEMP).toBe('a'); // (verify value restored)
  expect(process.env.EXTRA_ENV_TEMP).toBeUndefined(); // (added variable removed)
  expect(process.env.PATH).toBe(oldPath); // (critical variable preserved)
  delete process.env.TEST_ENV_TEMP; // (cleanup variable)
}));


test('createScheduleMock executes function immediately', async () => { // (verify scheduler mock)
  const scheduleMock = createScheduleMock(); // (create schedule mock)
  const fn = jest.fn(() => 'done'); // (spy function)
  const result = await scheduleMock(fn); // (run scheduled function)
  expect(result).toBe('done'); // (ensure result)
  expect(typeof scheduleMock.mockClear).toBe('function'); // (has mockClear)
  expect(typeof scheduleMock.mockReset).toBe('function'); // (has mockReset)
});


test('createQerrorsMock captures arguments', () => { // (verify error mock)
  const qerrorsMock = createQerrorsMock(); // (create qerrors mock)
  const args = qerrorsMock('err', 'ctx'); // (invoke with sample data)
  expect(args).toEqual(['err', 'ctx']); // (returned arguments)
  expect(typeof qerrorsMock.mockClear).toBe('function'); // (has mockClear)
  expect(typeof qerrorsMock.mockReset).toBe('function'); // (has mockReset)
});


test('createAxiosMock stores replies and resets', () => { // (verify axios mock)
  const axiosMock = createAxiosMock(); // (create axios adapter)
  axiosMock.onGet('/test').reply(200, { ok: true }); // (configure get reply)
  expect(axiosMock._replies['/test']).toEqual({ status: 200, data: { ok: true } }); // (reply stored on adapter)
  axiosMock.reset(); // (reset replies on adapter)
  axiosMock.onGet('/again').reply(200, { ok: false }); // (configure after reset)
  expect(axiosMock._replies).toEqual({ '/again': { status: 200, data: { ok: false } } }); // (old replies cleared)
});

test('createAxiosMock stores post replies', () => { // (verify axios post mock)
  const axiosMock = createAxiosMock(); // (create adapter for post)
  axiosMock.onPost('/url').reply(200, { foo: 'bar' }); // (configure post reply)
  expect(axiosMock._replies['/url']).toEqual({ status: 200, data: { foo: 'bar' } }); // (post reply stored)
});


test('resetMocks clears history on mocks', () => { // (verify centralized reset)
  const scheduleMock = createScheduleMock(); // (create schedule mock)
  const qerrorsMock = createQerrorsMock(); // (create error mock)
  const axiosMock = createAxiosMock(); // (create axios adapter)

  scheduleMock(() => {}); // (use schedule mock)
  qerrorsMock('err'); // (use error mock)
  axiosMock.onPost('/a').reply(201, {}); // (add post reply)

  resetMocks(axiosMock, scheduleMock, qerrorsMock); // (reset all mocks)

  expect(scheduleMock.mockClear.mock.calls.length).toBe(1); // (schedule cleared)
  expect(qerrorsMock.mockClear.mock.calls.length).toBe(1); // (qerrors cleared)
  expect(Object.keys(axiosMock._replies).length).toBe(0); // (axios replies cleared)
});


test('initSearchTest sets env and returns mocks', () => withSavedEnv(() => { // (wrap env lifecycle)
  const { mock, scheduleMock, qerrorsMock } = initSearchTest(); // (initialize search test)
  expect(process.env.GOOGLE_API_KEY).toBe(defaultEnv.GOOGLE_API_KEY); // (env key set)
  expect(mock).toBeDefined(); // (axios mock present)
  expect(scheduleMock).toBeDefined(); // (schedule mock present)
  expect(qerrorsMock).toBeDefined(); // (qerrors mock present)
  resetMocks(mock, scheduleMock, qerrorsMock); // (reset mocks)
}));

