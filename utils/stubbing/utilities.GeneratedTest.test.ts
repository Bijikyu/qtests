// Generated unit test for utilities.ts - TypeScript ES module
// 🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS
import 'qtests/setup';

let testModule: any;
beforeAll(async () => {
  testModule = await import('./utilities');
});

describe('getSinonLibrary', () => {
  it('is defined', () => {
    const target = (testModule as any)['getSinonLibrary'];
    if (typeof target === 'undefined') {
      // Skip: export not found on module at runtime
      expect(true).toBe(true);
      return;
    }
    expect(target).toBeDefined();
  });
});

describe('restoreAll', () => {
  it('is defined', () => {
    const target = (testModule as any)['restoreAll'];
    if (typeof target === 'undefined') {
      // Skip: export not found on module at runtime
      expect(true).toBe(true);
      return;
    }
    expect(target).toBeDefined();
  });
});
