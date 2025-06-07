const { expect } = require('chai'); // (added chai for assertions and structured tests)
const {
  setTestEnv,
  saveEnv,
  restoreEnv,
  createScheduleMock,
  createQerrorsMock,
  createAxiosMock,
  resetMocks,
  initSearchTest
} = require('../utils/testEnv'); // (import testEnv utilities for testing)

describe('testEnv utilities', function () {
  let originalEnv;
  beforeEach(function () {
    originalEnv = saveEnv(); // (capture env before each test for isolation)
  });
  afterEach(function () {
    restoreEnv(originalEnv); // (restore env after each test to avoid pollution)
  });

  it('setTestEnv sets expected vars', function () {
    setTestEnv(); // (invoke function under test)
    expect(process.env.GOOGLE_API_KEY).to.equal('key'); // (verify google key)
    expect(process.env.GOOGLE_CX).to.equal('cx'); // (verify cx value)
    expect(process.env.OPENAI_TOKEN).to.equal('token'); // (verify openai token)
  });

  it('saveEnv and restoreEnv restore environment correctly', function () {
    process.env.NEW_VAR = 'temp'; // (define env var for test)
    const snap = saveEnv(); // (snapshot current environment)
    process.env.NEW_VAR = 'changed'; // (change env var after snapshot)
    restoreEnv(snap); // (restore from snapshot)
    expect(process.env.NEW_VAR).to.equal('temp'); // (original value restored)
    delete process.env.NEW_VAR; // (clean up after verification)
  });

  it('restoreEnv removes added variables', function () {
    const snap = saveEnv(); // (snapshot environment)
    process.env.EXTRA_VAR = 'value'; // (add variable after snapshot)
    restoreEnv(snap); // (restore snapshot to remove variable)
    expect(process.env.EXTRA_VAR).to.be.undefined; // (variable removed)
  });

  it('createScheduleMock executes immediately', async function () {
    const mock = createScheduleMock(); // (create schedule mock)
    let ran = false; // (track if function executed)
    const result = await mock(() => { ran = true; return 'done'; }); // (invoke mock)
    expect(ran).to.be.true; // (verify immediate execution)
    expect(result).to.equal('done'); // (verify return value)
  });

  it('createQerrorsMock captures arguments', function () {
    const mock = createQerrorsMock(); // (create qerrors mock)
    const result = mock('err', { code: 1 }); // (call mock with arguments)
    expect(result).to.deep.equal(['err', { code: 1 }]); // (verify captured args)
  });

  it('createAxiosMock handles onGet, onPost and reset', function () {
    const mock = createAxiosMock(); // (create axios mock)
    const getObj = mock.onGet('/a').reply(200, { a: 1 }); // (configure get reply)
    const postObj = mock.onPost('/b').reply(201, { b: 2 }); // (configure post reply)
    expect(getObj._replies['/a']).to.deep.equal({ status: 200, data: { a: 1 } }); // (check get storage on returned obj)
    expect(postObj._replies['/b']).to.deep.equal({ status: 201, data: { b: 2 } }); // (check post storage on returned obj)
    mock.reset(); // (reset mock replies)
    expect(mock._replies).to.deep.equal({}); // (verify reset clears replies on mock)
  });

  it('resetMocks calls provided mock clear methods', function () {
    const mock = createAxiosMock(); // (create axios mock)
    mock.onGet('/a').reply(200, {}); // (add reply for later clear test)
    let axiosReset = false; // (flag for axios reset)
    mock.reset = () => { axiosReset = true; mock._replies = {}; }; // (override reset to set flag)
    let scheduleCleared = false; // (flag for schedule mock clear)
    const scheduleMock = createScheduleMock(); // (create schedule mock)
    scheduleMock.mockClear = () => { scheduleCleared = true; }; // (override to set flag)
    let qerrorsCleared = false; // (flag for qerrors clear)
    const qerrorsMock = createQerrorsMock(); // (create qerrors mock)
    qerrorsMock.mockClear = () => { qerrorsCleared = true; }; // (override to set flag)
    resetMocks(mock, scheduleMock, qerrorsMock); // (invoke resetMocks)
    expect(axiosReset).to.be.true; // (axios reset was called)
    expect(scheduleCleared).to.be.true; // (schedule mock cleared)
    expect(qerrorsCleared).to.be.true; // (qerrors mock cleared)
    expect(mock._replies).to.deep.equal({}); // (replies cleared after reset)
  });

  it('initSearchTest sets up env and returns mocks', function () {
    const { mock, scheduleMock, qerrorsMock } = initSearchTest(); // (initialize search test)
    expect(process.env.GOOGLE_API_KEY).to.equal('key'); // (verify env set)
    expect(mock).to.have.property('reset'); // (mock contains reset)
    expect(scheduleMock).to.be.a('function'); // (schedule mock is function)
    expect(qerrorsMock).to.be.a('function'); // (qerrors mock is function)
    let cleared = false; // (flag for mock clearing)
    scheduleMock.mockClear = () => { cleared = true; }; // (override clear)
    mock.onGet('/x').reply(200, {}); // (add reply to test reset)
    resetMocks(mock, scheduleMock, qerrorsMock); // (reset all mocks)
    expect(cleared).to.be.true; // (schedule mock cleared by reset)
    expect(mock._replies).to.deep.equal({}); // (axios replies cleared)
  });
});
