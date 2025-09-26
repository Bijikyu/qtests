## Summary
- Change: Suppress unintended DEBUG_TESTS.md creation by runner during manual tests.
- Files: `qtests-runner.mjs`, `tests/manual-tests/runnerInbandAndWorkers.test.ts`, `tests/manual-tests/runnerSuppressDebugFile.test.ts`
- Rationale: Prevent confusion from a root-level debug artifact when tests intentionally simulate Jest failures with no output.

## Changes
- Added env flag parsing in `qtests-runner.mjs`:
  - `QTESTS_SUPPRESS_DEBUG` / `QTESTS_NO_DEBUG_FILE` to skip debug report generation.
  - Respect `QTESTS_SILENT` for non-essential logs.
- Updated `runnerInbandAndWorkers.test.ts`:
  - Set `QTESTS_SUPPRESS_DEBUG=1` when spawning the runner.
  - Cleanup `DEBUG_TESTS.md` in `afterEach`.
- Added `runnerSuppressDebugFile.test.ts` to assert no `DEBUG_TESTS.md` is created when suppression is enabled.

## Notes
- The original DEBUG_TESTS.md message stemmed from a fake Jest shim exiting with code 1 and no output, by design in tests.
- No changes to `bin/qtests-ts-runner` per Runner Policies.
- Existing test behavior remains; only artifact suppression and cleanup were added.

## Follow-ups
- Consider documenting `QTESTS_SUPPRESS_DEBUG` in README if we make it a supported user-facing option.

