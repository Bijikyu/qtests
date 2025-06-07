require('..').setup(); // (initialize stubs before imports)

const { setTestEnv, saveEnv, restoreEnv, createScheduleMock, createQerrorsMock, createAxiosMock, resetMocks, initSearchTest } = require('../utils/testEnv'); // (import utilities under test)

test('setTestEnv sets variables', () => { // (verify environment variable setup)
  const saved = saveEnv(); // (store current environment)
  delete process.env.GOOGLE_API_KEY; // (remove old key)
  delete process.env.GOOGLE_CX; // (remove old cx)
  delete process.env.OPENAI_TOKEN; // (remove old token)
  setTestEnv(); // (apply standard test env)
  expect(process.env.GOOGLE_API_KEY).toBe('key'); // (check key value)
  expect(process.env.GOOGLE_CX).toBe('cx'); // (check cx value)
  expect(process.env.OPENAI_TOKEN).toBe('token'); // (check token value)
  restoreEnv(saved); // (restore original env)
});

test('saveEnv and restoreEnv capture state', () => { // (verify env round trip)
  process.env.TEST_ENV_TEMP = 'a'; // (set test variable)
  const saved = saveEnv(); // (capture environment)
  process.env.TEST_ENV_TEMP = 'b'; // (modify variable)
  restoreEnv(saved); // (restore environment)
  expect(process.env.TEST_ENV_TEMP).toBe('a'); // (verify value restored)
  delete process.env.TEST_ENV_TEMP; // (cleanup variable)
});


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


test('initSearchTest sets env and returns mocks', () => { // (verify full init)
  const saved = saveEnv(); // (save environment state)
  const { mock, scheduleMock, qerrorsMock } = initSearchTest(); // (initialize search test)
  expect(process.env.GOOGLE_API_KEY).toBe('key'); // (env key set)
  expect(mock).toBeDefined(); // (axios mock present)
  expect(scheduleMock).toBeDefined(); // (schedule mock present)
  expect(qerrorsMock).toBeDefined(); // (qerrors mock present)
  resetMocks(mock, scheduleMock, qerrorsMock); // (reset mocks)
  restoreEnv(saved); // (restore environment)
});

