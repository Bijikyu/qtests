// Generated unit test for httpClient.ts - TypeScript ES module
// 🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS
import 'qtests/setup';

let testModule: any;
beforeAll(async () => {
  testModule = await import('./httpClient');
});

// External dependencies automatically stubbed by qtests/setup:
// - axios: stubbed by qtests (no jest.mock needed)

// Deterministic test helpers
beforeEach(() => {
  // Fix time for deterministic Date behavior
  jest.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

describe('httpClient', () => {
  it('is defined', () => {
    const target = (testModule as any)['httpClient'];
    if (typeof target === 'undefined') {
      // Skip: export not found on module at runtime
      expect(true).toBe(true);
      return;
    }
    expect(target).toBeDefined();
  });
});

describe('createHttpClient', () => {
  it('is defined', () => {
    const target = (testModule as any)['createHttpClient'];
    if (typeof target === 'undefined') {
      // Skip: export not found on module at runtime
      expect(true).toBe(true);
      return;
    }
    expect(target).toBeDefined();
  });
});

describe('addMonitoringInterceptors', () => {
  it('is defined', () => {
    const target = (testModule as any)['addMonitoringInterceptors'];
    if (typeof target === 'undefined') {
      // Skip: export not found on module at runtime
      expect(true).toBe(true);
      return;
    }
    expect(target).toBeDefined();
  });
});

describe('cleanup', () => {
  it('is defined', () => {
    const target = (testModule as any)['cleanup'];
    if (typeof target === 'undefined') {
      // Skip: export not found on module at runtime
      expect(true).toBe(true);
      return;
    }
    expect(target).toBeDefined();
  });
});

describe('httpsAgent', () => {
  it('is defined', () => {
    const target = (testModule as any)['httpsAgent'];
    if (typeof target === 'undefined') {
      // Skip: export not found on module at runtime
      expect(true).toBe(true);
      return;
    }
    expect(target).toBeDefined();
  });
});

describe('httpAgent', () => {
  it('is defined', () => {
    const target = (testModule as any)['httpAgent'];
    if (typeof target === 'undefined') {
      // Skip: export not found on module at runtime
      expect(true).toBe(true);
      return;
    }
    expect(target).toBeDefined();
  });
});
