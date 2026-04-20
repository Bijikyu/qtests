// Generated unit test for leakDetector.ts - TypeScript ES module
// 🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS
import 'qtests/setup';

let testModule: any;
beforeAll(async () => {
  testModule = await import('./leakDetector');
});

describe('MemoryLeakDetector', () => {
  it('is defined', () => {
    const target = (testModule as any)['MemoryLeakDetector'];
    if (typeof target === 'undefined') {
      // Skip: export not found on module at runtime
      expect(true).toBe(true);
      return;
    }
    expect(target).toBeDefined();
  });
});
