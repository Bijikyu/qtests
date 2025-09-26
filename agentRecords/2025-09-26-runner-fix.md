# Change Record: qtests-runner.mjs fix

- Date: 2025-09-26
- Area: `qtests-runner.mjs`

## Summary
- Ensure `qtests-runner.mjs` writes the exact Jest arguments it will invoke to `runner-jest-args.json` in `process.cwd()` before spawning Jest. This stabilizes tests that assert the runner’s Jest invocation even if the fake Jest exits early.
- Add support for `QTESTS_SUPPRESS_DEBUG=1|true` to skip creating the debug file on failures.
- Add support for `QTESTS_DEBUG_FILE` to customize the debug report filename/path. Defaults to `DEBUG_TESTS.md`.

## Rationale
- Addressed failing test `tests/manual-tests/qtestsRunnerBehavior.test.ts` which expects an args-capture file to exist after a failing run.
- Align with Runner Policies by preserving required Jest args (`--config`, `--passWithNoTests`) and batching behavior; changes are additive and non-breaking.

## Notes
- No external dependencies added. Behavior of existing tests remains unchanged except for the fixed case above.
- Error handling added around file writes to avoid impacting normal runs.
