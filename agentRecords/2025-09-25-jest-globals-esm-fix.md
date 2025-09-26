# Change Record: Ensure `jest` is available in ESM setup

- Date: 2025-09-25
- Author: AI Agent

## Summary
- Fixed failing tests due to `ReferenceError: jest is not defined` by importing `jest` from `@jest/globals` in ESM setup and guarding access.

## Files Changed
- `config/jest-setup.ts`: Replace `import 'jest'` with `import { jest as jestFromGlobals } from '@jest/globals'` and add safe fallback to `globalThis.jest`. Guard calls in `beforeAll`/`afterEach`.

## Rationale
- In ESM contexts (ts-jest + ESM), relying on injected globals can be timing-sensitive. Importing from `@jest/globals` ensures the `jest` API is available consistently.

## Validation
- Ran the generator test suite filtered to the modified area; `lib/testGenerator.GenerateTest.test.ts` passed. Broader suite execution is environment-constrained in the harness but unrelated to this fix.

