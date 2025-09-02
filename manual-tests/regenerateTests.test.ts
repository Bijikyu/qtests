// Purpose: Force-regenerate qtests-generated tests and utilities in-repo for validation.
// This uses the TestGenerator directly because the tsx-based CLI is not usable in this sandbox.

import { TestGenerator } from '../lib/testGenerator';

describe('Force regenerate generated tests', () => {
  test('regenerates without throwing', async () => {
    const gen = new TestGenerator({
      force: true,
      // Keep defaults: both unit and integration
      // Exclude heavy/demo directories implicitly via generator filters
    } as any);
    await gen.generateTestFiles(false);
    expect(true).toBe(true);
  });
});

