# Record: Fix generator using .js runner

- Date: 2025-09-29
- Author: AI agent

## Summary
- Removed legacy `qtests-runner.js` and updated `package.json` to run `node qtests-runner.mjs`.
- Aligned repository with Runner Policies: single generated runner `qtests-runner.mjs` (API-only via Jest `runCLI`).

## Rationale
- Users reported `qtests-generate` producing `qtests-runner.js` and updating `scripts.test` to use it.
- Policy requires the generator to only scaffold `qtests-runner.mjs` and for projects to invoke the ESM runner.

## Changes
- package.json: set `scripts.test` to `node qtests-runner.mjs`.
- Deleted `qtests-runner.js` to prevent accidental use of the legacy, spawn-based runner.

## Validation
- Ran `node scripts/ci-verify-runner.mjs` to confirm:
  - `scripts.test` invokes `qtests-runner.mjs`.
  - `qtests-runner.mjs` is API-only and contains `runCLI` with the "API Mode" banner.
  - No usage of `spawn` or `tsx` in the runner.

## Notes
- `bin/qtests-generate.mjs`, `lib/testGenerator.ts`, and postinstall scaffolding already create/normalize `qtests-runner.mjs` and clean up legacy `.js` when present.

