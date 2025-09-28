# Permanent Remediation Plan for Current Test Failures

This plan addresses every failure reported in DEBUG_TESTS.md and codifies “forever fixes” with configuration hardening, code changes, and guardrails to prevent regressions.

## Objectives

- Eliminate duplicate manual mock warnings from Jest’s haste-map permanently.
- Ensure ESM tests can call `require(...)` safely where needed.
- Make the ESM runner (`qtests-runner.mjs`) fail fast and propagate non‑zero exit codes without masking errors, while honoring env toggles and required Jest args.
- Remove `ts-jest` deprecation noise by consolidating config.
- Add CI checks that prevent these issues from reappearing.

## Summary of Observed Failures (from DEBUG_TESTS.md)

- Duplicate manual mocks detected for `utils/__mocks__/...` and `dist/utils/__mocks__/...`.
- Runner behavior tests expect exit code `1` on failures, but received `0` (fallback masked failure).
- Runner tests expect `--cache` and `--no-coverage` to be passed to Jest.
- ESM tests that call `require(...)` fail with `ReferenceError: require is not defined`.
- `ts-jest` warning about deprecated `isolatedModules` config placement.

## Root Causes and Permanent Fixes

1) Duplicate manual mocks (noise from `dist`)
- Symptoms: `jest-haste-map: duplicate manual mock found: esm-globals` (and `...GeneratedTest.test`).
- Root cause: TypeScript build currently outputs compiled files from nested `__mocks__` and test files into `dist`, and Jest scans `dist` for module mocks.
- Permanent fixes:
  - Update `tsconfig.json` excludes:
    - Exclude nested mocks: `"**/__mocks__/**"`.
    - Exclude test files from build: `"**/*.test.ts", "**/*.spec.ts", "**/*.test.tsx", "**/*.spec.tsx"`.
  - Harden Jest config to ignore built artifacts in module resolution:
    - Add `modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/']`.
    - Add `watchPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/']`.
  - Optional belt‑and‑suspenders: narrow Jest `roots` later if needed to exclude `dist` explicitly.

2) ESM tests using `require(...)` fail
- Symptoms: `ReferenceError: require is not defined` in ESM Jest runs.
- Root cause: ESM mode lacks CJS `require` global; current `config/jest-setup.ts` only assigns `global.require` if native `require` already exists (which it does not under ESM).
- Permanent fix:
  - In `config/jest-setup.ts`, polyfill `require` via `createRequire(import.meta.url)` and assign it to `globalThis.require` if absent. Keep `import 'qtests/setup'` first per policy.

3) Runner masks failures by falling back to in‑process Jest API
- Symptoms: Tests that intentionally make `jest` exit with code 1 received `0` from `qtests-runner.mjs`.
- Root cause: The runner treats a non‑zero exit with “no output” as a sandbox restriction and retries via programmatic Jest API, which can pass and hide real failures.
- Permanent fixes:
  - Restrict fallback conditions to only:
    - Explicit worker crash signature (retry in‑band once), or
    - Spawn errors like `ENOENT|EACCES|EPERM` (e.g., jest binary truly unavailable).
  - Do not fallback solely because there was “no output.” Propagate the non‑zero exit code and generate `DEBUG_TESTS.md`.

4) Runner missing expected Jest flags
- Symptoms: Tests expect `--cache` and `--no-coverage` but they’re absent.
- Permanent fix:
  - Always pass `--cache` and `--no-coverage` alongside `--config` and `--passWithNoTests` (still honoring `QTESTS_INBAND` and `QTESTS_FILE_WORKERS`).

5) `ts-jest` deprecation warning
- Symptoms: `ts-jest[config] (WARN) ... "isolatedModules" is deprecated ... use tsconfig`.
- Root cause: We set `isolatedModules` inside the `transform` options as well as `tsconfig.jest.json`.
- Permanent fix:
  - Remove `isolatedModules` from `ts-jest` transform options in `config/jest.config.mjs` and keep it only in `config/tsconfig.jest.json`.

## Detailed Implementation Steps

1) TypeScript build exclusions (prevents duplicates at the source)
- Edit `tsconfig.json`:
  - Add to `exclude` (without removing existing entries):
    - `"**/__mocks__/**"`
    - `"**/*.test.ts", "**/*.spec.ts", "**/*.test.tsx", "**/*.spec.tsx"`
- Rationale: Avoid emitting mocks and tests into `dist` so Jest never sees duplicate mocks.

2) Jest config hardening
- Edit `config/jest.config.mjs`:
  - Add `modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/']`.
  - Add `watchPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/']`.
  - Remove `isolatedModules` from the `ts-jest` transform options.
- Optional: If noise persists, consider narrowing `roots` to source directories (e.g., `['<rootDir>/lib', '<rootDir>/utils', '<rootDir>/tests']`). Not strictly required once `modulePathIgnorePatterns` is in place.

3) ESM `require` polyfill for tests
- Edit `config/jest-setup.ts`:
  - After importing `qtests/setup`, add:
    - `import { createRequire } from 'module';`
    - `const req = createRequire(import.meta.url);`
    - `if (!(globalThis as any).require) (globalThis as any).require = req as any;`
- Rationale: Enables legacy `require(...)` calls inside ESM‑mode tests without changing test code style.

4) Runner behavior alignment
- Edit `qtests-runner.mjs`:
  - Always include `--cache` and `--no-coverage` in Jest args.
  - Remove/adjust the “no output” heuristic from the fallback path. Only retry in‑band on worker crash signature; only fallback to Jest API on spawn errors (e.g., `ENOENT|EACCES|EPERM`), never on plain non‑zero exit.
  - Keep honoring:
    - `QTESTS_INBAND=1|true` → `--runInBand` (no `--maxWorkers`).
    - `QTESTS_FILE_WORKERS=<n>` → `--maxWorkers=<n>` when not in‑band.
  - Continue writing captured args to `runner-jest-args*.json` for introspection.

5) CI and guardrails (“forever” protections)
- Add a CI job that runs after `npm run build` to assert no test or mock files exist in `dist`:
  - `rg -n "^" dist/**/__mocks__ || true` should return empty.
  - `rg -n "\.(test|spec)\.\w+$" dist || true` should return empty.
- Add a unit test (or snapshot) for the runner to ensure args always include `--cache` and `--no-coverage`.
- Add a smoke test that intentionally exits jest with code 1 and verifies:
  - Runner exits with 1.
  - `DEBUG_TESTS.md` is created unless `QTESTS_SUPPRESS_DEBUG` is set.
- Keep `QTESTS_SILENT=1|true` respected to reduce CI noise.

## Definition of Done

- No duplicate mock warnings with a clean repo (after `npm run build && npm test`).
- All four failing tests in `DEBUG_TESTS.md` pass locally:
  - `tests/manual-tests/qtestsRunnerBehavior.test.ts`.
  - `tests/manual-tests/runnerInbandAndWorkers.test.ts`.
  - `tests/manual-tests/setupResolution.test.ts`.
  - `utils/customStubs.test.ts`.
- Runner consistently propagates non‑zero exits and creates `DEBUG_TESTS.md` on failures.
- `ts-jest` deprecation warning removed.

## Non‑Goals / Constraints

- Do not modify `setup.js`, `LICENSE`, or the `version` in `package.json` (per AGENTS.md).
- This plan only targets Node.js environments; do not recommend for browsers.
- Maintain zero external runtime deps for production code.

## Rollout Plan

1) Make the config/code changes in a focused PR.
2) Run typecheck (`tsc -p tsconfig.json --noEmit`) and the full test suite.
3) Verify runner tests capture the expected args and non‑zero exit behavior.
4) Merge, then monitor CI for any jest‑haste warnings; if any remain, tighten ignores.

## Appendix: Quick References

- Jest invocation policy: `jest --config config/jest.config.mjs --passWithNoTests ...args` (never via `tsx`).
- Env toggles respected by runner:
  - `QTESTS_INBAND=1|true` → use `--runInBand`.
  - `QTESTS_FILE_WORKERS=<n>` → use `--maxWorkers=<n>` when not in‑band.
  - `QTESTS_SUPPRESS_DEBUG=1|true` → skip writing `DEBUG_TESTS.md`.
- Silence logs in CI: `QTESTS_SILENT=1|true`.

