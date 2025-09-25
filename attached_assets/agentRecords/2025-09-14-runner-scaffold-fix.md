# Runner Scaffold Fix: qtests-runner.mjs generation

- Date: 2025-09-14
- Area: Test generator, runner import behavior

## Summary
- Updated `lib/testGenerator.ts::generateQtestsRunner()` to scaffold `qtests-runner.mjs` (ESM) instead of `qtests-ts-runner.ts`, aligning with AGENTS.md runner policies.
- Added a clear file marker `GENERATED RUNNER: qtests-runner.mjs` to satisfy and document test expectations.
- Prevented recursive test execution by guarding auto-run in `qtests-ts-runner.ts` when imported under Jest (checks `JEST_WORKER_ID`/`JEST`).

## Rationale
- Manual test `manual-tests/qtestsRunnerScaffold.test.ts` expects `qtests-runner.mjs` to be generated. Prior implementation created `qtests-ts-runner.ts`, causing failure.
- Importing the TypeScript runner during tests triggered the CLI’s top-level execution, spawning nested Jest runs and causing hangs/slowdowns.

## Files Changed
- lib/testGenerator.ts: Generate `qtests-runner.mjs` using `bin/qtests-ts-runner` as template; insert generated-file header.
- qtests-ts-runner.ts: Add Jest guard to avoid auto-run when imported; keep CLI behavior for direct execution unchanged.

## Validation
- Ran targeted Jest: `manual-tests/qtestsRunnerScaffold.test.ts` now passes.
- Ran targeted Jest: `qtests-ts-runner.GeneratedTest.test.ts` completes quickly and passes.
- Ran `qtests-ts-runner` with `QTESTS_PATTERN` to confirm no hanging behavior and proper summary output.

## Notes
- No changes to `bin/qtests-ts-runner` (sacrosanct).
- Jest invocation remains compliant: all runners use `--config config/jest.config.mjs --passWithNoTests`.

