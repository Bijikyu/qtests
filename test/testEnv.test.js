
// Simplified testEnv tests to prevent hanging in parallel execution
const { setTestEnv, createScheduleMock, createQerrorsMock, createAxiosMock } = require('../utils/testEnv');

describe('testEnv utilities', () => {
  test('testEnv utilities exist and are callable', () => {
    expect(typeof setTestEnv).toBe('function');
    expect(typeof createScheduleMock).toBe('function');
    expect(typeof createQerrorsMock).toBe('function');
    expect(typeof createAxiosMock).toBe('function');
  });

  test('schedule mock works', async () => {
    const scheduleMock = createScheduleMock();
    const fn = jest.fn(() => 'done');
    const result = await scheduleMock(fn);
    expect(result).toBe('done');
    expect(typeof scheduleMock.mockClear).toBe('function');
  });

  test('qerrors mock works', () => {
    const qerrorsMock = createQerrorsMock();
    const args = qerrorsMock('err', 'ctx');
    expect(args).toEqual(['err', 'ctx']);
    expect(typeof qerrorsMock.mockClear).toBe('function');
  });

  test('axios mock basic functionality', () => {
    const axiosMock = createAxiosMock();
    axiosMock.onGet('/test').reply(200, { ok: true });
    expect(axiosMock._replies['/test']).toEqual({ status: 200, data: { ok: true } });
  });
});

