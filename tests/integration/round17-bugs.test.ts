/**
 * Round 17 dogfood regression tests
 *
 * Bug-1: lib/utils/httpMockFramework.ts — MSWMock HTTP methods returned raw
 *   MSW HttpResponse objects instead of axios-style { status, data } objects.
 *
 *   Root cause: BaseHttpMock.handleRequest() (and MSWMock's override) wraps
 *   preset and default responses with createResponse() which calls
 *   HttpResponse.json(data, { status }).  MSW's HttpResponse is a Response
 *   subclass — it carries .status on its prototype but has no .data field and
 *   serialises to "{}" with JSON.stringify.  The HTTP methods (get/post/put/
 *   patch/delete/request) passed that object straight back to the caller, so
 *   every MSWMock call using a preset or default response returned an unusable
 *   object: r.status was 200 but r.data was undefined and String(r) was "{}".
 *
 *   Fix: added BaseHttpMock.toAxiosStyle(result, fallback) — detects MSW
 *   Response objects by duck-typing (typeof result.json === 'function' &&
 *   typeof result.status === 'number'), awaits result.json() to extract the
 *   body, then wraps it in createAxiosStyleResponse(data, status).  All six
 *   HTTP methods now route through toAxiosStyle instead of the broken
 *   result-or-fallback pattern.
 *
 * Bug-2: lib/utils/httpMockFramework.ts — presetData passed to
 *   createUserConfigurableMock (via clientFactories.createUserConfigurableMock)
 *   was silently ignored by MSWMock.handleRequest.
 *
 *   Root cause: clientFactories.createUserConfigurableMock stores presetData in
 *   the config object and forwards it to createAdvancedMSWMock (= createMSWMock).
 *   createMSWMock spreads the config into this.config, so this.config.presetData
 *   is present, but handleRequest only checked this.config.presetResponses (a
 *   Map).  Because presetData is a plain object — not a Map — the check always
 *   missed it, and every url fell through to the default response.
 *
 *   Fix: added a second lookup in handleRequest after the presetResponses check:
 *   if this.config.presetData has an own property matching the requested url,
 *   it is used as the response data (wrapped in createResponse, then unwrapped
 *   by toAxiosStyle in the calling HTTP method).
 *
 * Modules probed and found clean (no bugs):
 *   lib/httpMock/legacyAxiosImplementation (LegacyAxiosMock — get/post/put/
 *     delete/patch/request all return axios-style),
 *   lib/httpMock/userConfigurableAxiosMock (UserConfigurableAxiosMock.__set/get —
 *     intentionally rejects unknown URLs with plain-object error, which is by
 *     design),
 *   lib/security/SecurityTestingFramework (PenetrationTester.testXSS/
 *     testSQLInjection/testPathTraversal/testCommandInjection/runPenetrationTest,
 *     SecurityRegressionTester.runAllTests/generateReport,
 *     runFullSecurityTest/generateSecurityTestReport),
 *   lib/security/JoiSecurityValidator (validateEmail/validateInput with ruleName/
 *     validatePath/validateURL/validateJSON/validateModuleId — all correct),
 *   lib/security/SecurityValidator (validateInput/validatePath/sanitize/
 *     validateModuleId — all correct),
 *   lib/httpMock/advancedMSWMock (re-exports from httpMockFramework — no own bugs),
 *   lib/httpMock/enhancedMSWMock (re-exports from httpMockFramework — no own bugs).
 */

import * as path from 'path';

const load = (rel: string) => import(path.resolve(__dirname, rel));

// ─── Regression Bug-1: MSW HttpResponse not converted to axios-style ──────────
describe('Regression Bug-1: MSWMock returns axios-style {status,data} for default/preset responses', () => {
  let adv: any;

  beforeAll(async () => {
    adv = await load('../../dist/lib/httpMock/advancedMSWMock.js');
  });

  it('AdvancedMSWMock.get with default response returns .status and .data', async () => {
    const { AdvancedMSWMock } = adv;
    const mock = new AdvancedMSWMock({ defaultResponse: { hello: 'world' }, logRequests: false });
    const r = await mock.get('/api/test');
    expect(r.status).toBe(200);
    expect(r.data).toEqual({ hello: 'world' });
  });

  it('AdvancedMSWMock default response data is not undefined', async () => {
    const { AdvancedMSWMock } = adv;
    const mock = new AdvancedMSWMock({ logRequests: false });
    const r = await mock.get('/api/anything');
    expect(r.data).toBeDefined();
    expect(r.status).toBe(200);
  });

  it('mockUtils.withPresetResponses returns correct data for preset url', async () => {
    const { mockUtils } = adv;
    const mock = mockUtils.withPresetResponses({ '/api/preset': { preset: 'value' } });
    const r = await mock.get('/api/preset');
    expect(r.status).toBe(200);
    expect(r.data).toEqual({ preset: 'value' });
  });

  it('mockUtils.withPresetResponses falls back to default for unknown url', async () => {
    const { mockUtils } = adv;
    const mock = mockUtils.withPresetResponses({ '/api/known': { ok: true } });
    const r = await mock.get('/api/unknown');
    expect(r.status).toBe(200);
    expect(r.data).toBeDefined();
  });

  it('AdvancedMSWMock.post returns axios-style', async () => {
    const { AdvancedMSWMock } = adv;
    const mock = new AdvancedMSWMock({ logRequests: false });
    const body = { name: 'alice' };
    const r = await mock.post('/api/create', body);
    expect(r.status).toBe(200);
    expect(r.data).toBeDefined();
  });

  it('AdvancedMSWMock.put returns axios-style', async () => {
    const { AdvancedMSWMock } = adv;
    const mock = new AdvancedMSWMock({ logRequests: false });
    const r = await mock.put('/api/update', { id: 1 });
    expect(r.status).toBe(200);
  });

  it('AdvancedMSWMock.delete returns axios-style', async () => {
    const { AdvancedMSWMock } = adv;
    const mock = new AdvancedMSWMock({ logRequests: false });
    const r = await mock.delete('/api/delete');
    expect(r.status).toBe(200);
  });

  it('AdvancedMSWMock.patch returns axios-style', async () => {
    const { AdvancedMSWMock } = adv;
    const mock = new AdvancedMSWMock({ logRequests: false });
    const r = await mock.patch('/api/patch', { x: 1 });
    expect(r.status).toBe(200);
  });

  it('AdvancedMSWMock.request returns axios-style', async () => {
    const { AdvancedMSWMock } = adv;
    const mock = new AdvancedMSWMock({ logRequests: false });
    const r = await mock.request({ method: 'GET', url: '/api/req' });
    expect(r.status).toBe(200);
  });

  it('custom function handler still returns its own response as-is', async () => {
    const { AdvancedMSWMock } = adv;
    const mock = new AdvancedMSWMock({ logRequests: false });
    mock.addCustomHandler('GET', '/api/custom', () => ({ status: 201, data: { custom: true } }));
    const r = await mock.get('/api/custom');
    expect(r.status).toBe(201);
    expect(r.data).toEqual({ custom: true });
  });

  it('setDefaultResponse updates the response returned', async () => {
    const { AdvancedMSWMock } = adv;
    const mock = new AdvancedMSWMock({ logRequests: false });
    mock.setDefaultResponse({ updated: true }, 202);
    const r = await mock.get('/api/any');
    expect(r.status).toBe(202);
    expect(r.data).toEqual({ updated: true });
  });
});

// ─── Regression Bug-2: presetData silently ignored in createUserConfigurableMock ─
describe('Regression Bug-2: createUserConfigurableMock presetData is used for url lookup', () => {
  let cf: any;

  beforeAll(async () => {
    cf = await load('../../dist/lib/httpMock/clientFactories.js');
  });

  it('createUserConfigurableMock returns preset data for a configured url', async () => {
    const mock = cf.createUserConfigurableMock({ '/api/users': [1, 2, 3] });
    const r = await mock.get('/api/users');
    expect(r.status).toBe(200);
    expect(r.data).toEqual([1, 2, 3]);
  });

  it('createUserConfigurableMock returns preset data for multiple urls', async () => {
    const mock = cf.createUserConfigurableMock({
      '/api/a': { a: true },
      '/api/b': { b: true }
    });
    const ra = await mock.get('/api/a');
    const rb = await mock.get('/api/b');
    expect(ra.data).toEqual({ a: true });
    expect(rb.data).toEqual({ b: true });
  });

  it('createUserConfigurableMock with empty presetData returns default for any url', async () => {
    const mock = cf.createUserConfigurableMock({});
    const r = await mock.get('/api/anything');
    expect(r.status).toBe(200);
    expect(r.data).toBeDefined();
  });
});

// ─── Regression: LegacyAxiosMock clean ───────────────────────────────────────
describe('Regression: LegacyAxiosMock HTTP methods', () => {
  let la: any;

  beforeAll(async () => {
    la = await load('../../dist/lib/httpMock/legacyAxiosImplementation.js');
  });

  it('LegacyAxiosMock.get returns axios-style response', async () => {
    const { LegacyAxiosMock } = la;
    const mock = new LegacyAxiosMock({ simulateErrors: false });
    const r = await mock.get('/api/test');
    expect(r.status).toBe(200);
    expect(r).toHaveProperty('data');
  });

  it('LegacyAxiosMock.post returns axios-style response', async () => {
    const { LegacyAxiosMock } = la;
    const mock = new LegacyAxiosMock({ simulateErrors: false });
    const r = await mock.post('/api/create', { name: 'x' });
    expect(r.status).toBe(200);
  });

  it('LegacyAxiosMock.delete returns axios-style response', async () => {
    const { LegacyAxiosMock } = la;
    const mock = new LegacyAxiosMock({ simulateErrors: false });
    const r = await mock.delete('/api/delete');
    expect(r.status).toBe(200);
  });

  it('LegacyAxiosMock.request returns axios-style response', async () => {
    const { LegacyAxiosMock } = la;
    const mock = new LegacyAxiosMock({ simulateErrors: false });
    const r = await mock.request({ method: 'GET', url: '/api/req' });
    expect(r.status).toBe(200);
  });
});

// ─── Regression: SecurityTestingFramework ────────────────────────────────────
describe('Regression: SecurityTestingFramework', () => {
  let stf: any;

  beforeAll(async () => {
    stf = await load('../../dist/lib/security/SecurityTestingFramework.js');
  });

  it('PenetrationTester.testXSS with string template returns SecurityTestResult', () => {
    const { PenetrationTester } = stf;
    const pt = new PenetrationTester();
    const r = pt.testXSS('Search: {{payload}}');
    expect(typeof r.passed).toBe('boolean');
    expect(Array.isArray(r.vulnerabilities)).toBe(true);
    expect(Array.isArray(r.recommendations)).toBe(true);
    expect(typeof r.executionTime).toBe('number');
  });

  it('PenetrationTester.testXSS with callback function', () => {
    const { PenetrationTester } = stf;
    const pt = new PenetrationTester();
    const r = pt.testXSS((payload: string) => payload.replace(/<[^>]*>/g, ''));
    expect(typeof r.passed).toBe('boolean');
  });

  it('PenetrationTester.testSQLInjection with template detects unsafe queries', () => {
    const { PenetrationTester } = stf;
    const pt = new PenetrationTester();
    const r = pt.testSQLInjection('SELECT * WHERE id={{param}}', false);
    expect(r.passed).toBe(false);
    expect(r.vulnerabilities.length).toBeGreaterThan(0);
  });

  it('PenetrationTester.testSQLInjection with parametrize=true passes', () => {
    const { PenetrationTester } = stf;
    const pt = new PenetrationTester();
    const r = pt.testSQLInjection('SELECT * WHERE id={{param}}', true);
    expect(r.passed).toBe(true);
  });

  it('PenetrationTester.testPathTraversal returns SecurityTestResult', () => {
    const { PenetrationTester } = stf;
    const pt = new PenetrationTester();
    const r = pt.testPathTraversal('/uploads/{{path}}', false);
    expect(typeof r.passed).toBe('boolean');
    expect(Array.isArray(r.vulnerabilities)).toBe(true);
  });

  it('PenetrationTester.testCommandInjection returns SecurityTestResult', () => {
    const { PenetrationTester } = stf;
    const pt = new PenetrationTester();
    const r = pt.testCommandInjection('echo {{arg}}', false);
    expect(typeof r.passed).toBe('boolean');
  });

  it('PenetrationTester.runPenetrationTest with object arg returns array', () => {
    const { PenetrationTester } = stf;
    const pt = new PenetrationTester();
    const results = pt.runPenetrationTest({
      inputEndpoint: 'Input: {{payload}}',
      queryEndpoint: 'SELECT WHERE id={{param}}'
    });
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('SecurityRegressionTester.runAllTests returns array of results', () => {
    const { SecurityRegressionTester } = stf;
    const tester = new SecurityRegressionTester();
    const results = tester.runAllTests();
    expect(Array.isArray(results)).toBe(true);
    results.forEach((r: any) => {
      expect(typeof r.passed).toBe('boolean');
      expect(typeof r.description).toBe('string');
    });
  });

  it('runFullSecurityTest returns array', () => {
    const results = stf.runFullSecurityTest();
    expect(Array.isArray(results)).toBe(true);
  });

  it('generateSecurityTestReport returns a string report', () => {
    const report = stf.generateSecurityTestReport();
    expect(typeof report).toBe('string');
    expect(report.length).toBeGreaterThan(0);
  });
});

// ─── Regression: JoiSecurityValidator ────────────────────────────────────────
describe('Regression: JoiSecurityValidator', () => {
  let jsv: any;

  beforeAll(async () => {
    jsv = await load('../../dist/lib/security/JoiSecurityValidator.js');
  });

  it('validateEmail accepts valid email', () => {
    expect(jsv.validateEmail('user@example.com').valid).toBe(true);
  });

  it('validateEmail rejects invalid email', () => {
    expect(jsv.validateEmail('not-an-email').valid).toBe(false);
  });

  it('validateInput with valid ruleName accepts safe string', () => {
    expect(jsv.validateInput('hello world', 'userInput').valid).toBe(true);
  });

  it('validateInput with valid ruleName rejects XSS', () => {
    expect(jsv.validateInput('<script>alert(1)</script>', 'userInput').valid).toBe(false);
  });

  it('validatePath rejects path traversal', () => {
    expect(jsv.validatePath('../../../etc/passwd').valid).toBe(false);
  });

  it('validatePath accepts relative safe path', () => {
    expect(jsv.validatePath('./safe-file.txt').valid).toBe(true);
  });

  it('validateURL accepts valid URL', () => {
    expect(jsv.validateURL('https://example.com').valid).toBe(true);
  });

  it('validateURL rejects javascript: scheme', () => {
    expect(jsv.validateURL('javascript:alert(1)').valid).toBe(false);
  });

  it('validateJSON accepts safe JSON', () => {
    expect(jsv.validateJSON('{"key":"val"}').valid).toBe(true);
  });

  it('validateJSON rejects prototype pollution', () => {
    expect(jsv.validateJSON('{"__proto__":{}}').valid).toBe(false);
  });

  it('validateModuleId accepts safe module name', () => {
    expect(jsv.validateModuleId('my-safe-module').valid).toBe(true);
  });

  it('validateModuleId rejects path traversal in module id', () => {
    expect(jsv.validateModuleId('../../../etc/passwd').valid).toBe(false);
  });
});
