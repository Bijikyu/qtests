/**
 * Round 11 bug-fix regression tests
 *
 * Bug 1: testSetupFactory.ts — named import of `jest` from '@jest/globals' crashed on load
 *   Fix: changed to `import type` (erased at build); all runtime usages use (globalThis as any).jest
 *
 * Bug 2: monitoring.ts — singleton starts setInterval in constructor unconditionally,
 *   leaking interval into test suites and preventing clean exit.
 *   Fix: startMonitoring() bails when NODE_ENV==='test' or JEST_WORKER_ID is set
 *
 * Bug 3: unifiedHttpMock.ts — createAxiosMock() called jest.fn() at runtime which
 *   throws a ReferenceError when Jest is not in scope.
 *   Fix: safe fallback using (globalThis as any).jest, plain function when absent
 *
 * Bug 4: scalableApi.ts — createScalableApiClient() returns ScalableApiClient instances
 *   that have no .get()/.post()/.put()/.delete()/.patch() shorthand methods.
 *   Fix: added all five shorthand methods directly to the ScalableApiClient class
 */

describe('Round 11 Bug Fixes', () => {

  // ── Bug 1: testSetupFactory loads without crashing ──────────────────────────
  describe('testSetupFactory — no crash on import', () => {
    let mod: any;

    beforeAll(async () => {
      mod = await import('../../dist/lib/testSetupFactory.js');
    });

    test('module loads without throwing', () => {
      expect(mod).toBeDefined();
    });

    test('exports createJestSetup as a function', () => {
      expect(typeof mod.createJestSetup).toBe('function');
    });

    test('exports createMinimalJestSetup as a function', () => {
      expect(typeof mod.createMinimalJestSetup).toBe('function');
    });

    test('exports testSetupFactory as an object', () => {
      expect(mod.testSetupFactory).toBeDefined();
      expect(typeof mod.testSetupFactory).toBe('object');
    });
  });

  // ── Bug 2: monitoring singleton does NOT start interval in tests ─────────────
  describe('monitoring — no interval leak under JEST_WORKER_ID', () => {
    let monitoringMod: any;

    beforeAll(async () => {
      monitoringMod = await import('../../dist/lib/monitoring.js');
    });

    test('module loads without hanging (interval not started)', () => {
      expect(monitoringMod).toBeDefined();
    });

    test('MonitoringSystem constructor is exported', () => {
      expect(typeof monitoringMod.MonitoringSystem).toBe('function');
    });

    test('new MonitoringSystem({enabled:true}) does not start interval in test env', () => {
      const svc = new monitoringMod.MonitoringSystem({ enabled: true });
      expect(svc.metricsInterval).toBeUndefined();
      if (typeof svc.shutdown === 'function') svc.shutdown();
    });

    test('monitoring singleton (monitoringSystem) exports without hanging', () => {
      const singleton = monitoringMod.monitoringSystem ?? monitoringMod.default;
      expect(singleton).toBeDefined();
    });
  });

  // ── Bug 3: createAxiosMock works outside jest.fn() context ──────────────────
  describe('unifiedHttpMock — createAxiosMock safe outside Jest scope', () => {
    let mod: any;

    beforeAll(async () => {
      mod = await import('../../dist/lib/unifiedHttpMock.js');
    });

    test('createAxiosMock is exported', () => {
      expect(typeof mod.createAxiosMock).toBe('function');
    });

    test('createAxiosMock() returns an object without throwing', () => {
      expect(() => mod.createAxiosMock()).not.toThrow();
    });

    test('createAxiosMock() result has .get, .post, .put, .delete, .patch', () => {
      const m = mod.createAxiosMock({ id: 1 });
      expect(typeof m.get).toBe('function');
      expect(typeof m.post).toBe('function');
      expect(typeof m.put).toBe('function');
      expect(typeof m.delete).toBe('function');
      expect(typeof m.patch).toBe('function');
    });

    test('createAxiosMock() result has interceptors with use and eject', () => {
      const m = mod.createAxiosMock();
      expect(typeof m.interceptors.request.use).toBe('function');
      expect(typeof m.interceptors.request.eject).toBe('function');
      expect(typeof m.interceptors.response.use).toBe('function');
      expect(typeof m.interceptors.response.eject).toBe('function');
    });

    test('createAxiosMock().get() resolves with presetData', async () => {
      const m = mod.createAxiosMock({ foo: 'bar' });
      const result = await m.get('/test');
      expect(result).toEqual({ data: { foo: 'bar' } });
    });

    test('createAxiosMock() result has defaults.headers.common', () => {
      const m = mod.createAxiosMock();
      expect(m.defaults).toBeDefined();
      expect(m.defaults.headers).toBeDefined();
      expect(m.defaults.headers.common).toBeDefined();
    });
  });

  // ── Bug 4: ScalableApiClient instances have shorthand HTTP methods ───────────
  describe('scalableApi — ScalableApiClient shorthand methods', () => {
    let mod: any;
    let client: any;

    beforeAll(async () => {
      mod = await import('../../dist/lib/scalableApi.js');
      client = mod.createScalableApiClient();
    });

    test('createScalableApiClient exports and returns an object', () => {
      expect(typeof mod.createScalableApiClient).toBe('function');
      expect(client).toBeDefined();
    });

    test('client exposes .get method', () => {
      expect(typeof client.get).toBe('function');
    });

    test('client exposes .post method', () => {
      expect(typeof client.post).toBe('function');
    });

    test('client exposes .put method', () => {
      expect(typeof client.put).toBe('function');
    });

    test('client exposes .delete method', () => {
      expect(typeof client.delete).toBe('function');
    });

    test('client exposes .patch method', () => {
      expect(typeof client.patch).toBe('function');
    });

    test('client.get() returns a Promise', () => {
      const result = client.get('http://localhost/nonexistent').catch(() => {});
      expect(typeof result.then).toBe('function');
    });

    test('client.post() returns a Promise', () => {
      const result = client.post('http://localhost/nonexistent', {}).catch(() => {});
      expect(typeof result.then).toBe('function');
    });

    test('defaultApiClient also has shorthand methods', () => {
      expect(typeof mod.defaultApiClient.get).toBe('function');
      expect(typeof mod.defaultApiClient.post).toBe('function');
      expect(typeof mod.defaultApiClient.put).toBe('function');
      expect(typeof mod.defaultApiClient.delete).toBe('function');
      expect(typeof mod.defaultApiClient.patch).toBe('function');
    });
  });
});
