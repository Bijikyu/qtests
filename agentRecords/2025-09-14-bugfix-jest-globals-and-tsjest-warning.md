# 2025-09-14 — Fix jest globals usage and ts-jest warning

- Context: DEBUG_TESTS.md showed systemic failures: `ReferenceError: jest is not defined` across all suites, originating from `config/jest-setup.ts`. Also saw `ts-jest[config]` deprecation warning about `isolatedModules`.

## Changes

- config/jest-setup.ts
  - Keep `import 'qtests/setup'` first (module resolution patching).
  - Replace `import 'jest'` with `import { jest as jestFromGlobals } from '@jest/globals'`.
  - Add fallback to `globalThis.jest` for compatibility and use alias `J` for setup calls.
  - Add inline comments explaining rationale and ordering constraints.

- config/jest.config.mjs
  - Remove deprecated `isolatedModules` option from `ts-jest` transform config; it is now set only in `config/tsconfig.jest.json` per ts-jest guidance.

## Validation

- Ran targeted tests via runner using `QTESTS_INBAND=1` and `QTESTS_PATTERN`:
  - index.test.ts: passed (no `jest` reference error).
  - manual-tests/logUtils.test.ts: passed; no ts-jest warning.
  - utils/mockAxios.test.ts: passed; no ts-jest warning.
  - generated-tests/integration/utils__httpTest.GeneratedTest__get.test.ts: passed; no ts-jest warning.

## Notes

- Runner policy satisfied: `qtests-runner.mjs` spawns `jest` with `--config config/jest.config.mjs --passWithNoTests` and never uses `tsx`.
- DEBUG_TESTS.md will be (re)generated only when failures occur; kept as-is.

