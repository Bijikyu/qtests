# Record: Demo MERN Testbed Setup

## Summary
- Added `demo/` MERN test project to validate qtests end-to-end in CI.
- Scaffolded Express backend, minimal React frontend, Jest config aligned with qtests runner.
- Added GitHub Action to run demo tests across Node 16/18/20.

## Files Added
- See `demo/SUMMARY.md` for a per-file breakdown of roles and flows.
- CI workflow: `.github/workflows/demo-e2e.yml`.

## Rationale
- Provide integration coverage for stub injection (axios, winston) and route behavior.
- Exercise `qtests-generate` and `qtests-runner` without altering protected core files.

## Follow-ups
- Optionally expand client with a Vite setup if UI validation becomes necessary.
- Consider adding a negative test that asserts `DEBUG_TESTS.md` is created on failures (guarded by env toggles) if we want to exercise the debug artifact behavior.

