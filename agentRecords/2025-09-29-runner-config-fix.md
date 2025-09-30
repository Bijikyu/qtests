# Runner config fix and test pass

- Date: 2025-09-29
- Author: AI Agent

## Summary
- Switched `npm test` to use the API-based `qtests-runner.mjs`.
- Removed misconfigured `jest.config.js` that was causing Jest to auto-pick an invalid config (`moduleNameMapping` typo, wrong `roots`).
- All tests now pass; debug artifact no longer shows config validation errors.

## Context
- DEBUG_TESTS.md showed repeated Jest validation errors: unknown option `moduleNameMapping` and missing `src` in `roots`.
- Root cause: legacy `qtests-runner.js` (invoked by `npm test`) spawned `npx jest` without `--config`, allowing Jest to auto-discover the incorrect `jest.config.js`.
- Policy alignment: Runner must be API-only via `jest.runCLI` and always pass `--config config/jest.config.mjs` and `--passWithNoTests`.

## Changes
- package.json: set `scripts.test` to `node qtests-runner.mjs`.
- Deleted root `jest.config.js`; single source of truth is `config/jest.config.mjs`.

## Verification
- Ran `npm test` → 94 files, all passed.
- DEBUG_TESTS.md not regenerated; runner logs show API mode and correct config path usage.

## Notes
- Generator and templates already scaffold `qtests-runner.mjs` and set test script accordingly for client projects.
- If a local consumer requires `jest.config.js`, re-export from `config/jest.config.mjs` to avoid drift.

