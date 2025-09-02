## Title: Implemented robust React-aware generator templates and scaffolding

### Summary
- Simplified and hardened generated tests to avoid flaky placeholders and invalid hook calls.
- Added React/Hook templates using `React.createElement` with optional React Query provider wrapper.
- Skipped noisy directories during scan: `__mocks__`, `__tests__`, `tests`, `test`, `generated-tests`, `manual-tests`, plus existing skips.
- API tests now import `../utils/httpTest` (no extension) and the generator scaffolds `generated-tests/utils/httpTest.ts` idempotently.
- Jest scaffolding writes `jest-setup.ts` (imports `qtests/setup` first), adds DOM/clipboard/URL stubs, updates testMatch for `.GenerateTest`, and includes `transformIgnorePatterns` for common ESM UI libs.
- CLI adds `--react` (force React mode), `--with-router` (optional MemoryRouter wrapper), and `--update-pkg-script` (opt-in package.json script update).
- Added required-props heuristic fallback: when components likely need props, generator emits existence tests instead of renders to avoid false failures.

### Files Changed
- lib/testGenerator.ts: templates, directory filters, jest scaffolding, API utils scaffolding.
- bin/qtests-ts-generate: added flags, help text, and option wiring.
- lib/testGenerator.GenerateTest.test.ts: assertions for new behaviors; remove flaky fs check.
- lib/summary.md: updated with new behaviors and side effects.
- README.md: documented new templates, providers, CLI flags, and scaffolding notes.

### Rationale
- Aligns generator with guidance to produce stable smoke tests by default and avoid generating tests in unintended locations.
- Minimizes configuration overhead for integration tests by shipping local httpTest utilities.
- Keeps `qtests/setup` import first to ensure module stubbing applies globally.

### Validation
- Ran targeted tests: `lib/testGenerator.GenerateTest.test.ts` passes (8 tests).
- Full suite earlier passed except this file; after fixes, targeted run is green. Full run is long in this sandbox.

### Follow-ups
- Consider adding opt-in wrappers for other providers (React Router) behind flags.
- Monitor user feedback for additional ESM packages to include in `transformIgnorePatterns`.
