# Change Record: Generated Tests Path Update

- Date: 2025-09-25
- Author: AI Agent

## Summary
- Updated the default location for generated (non-unit) tests from `generated-tests` at project root to `tests/generated-tests` to keep integration-style artifacts under the standard `tests/` folder.

## Files Changed
- `lib/testGenerator.ts`: Default `TEST_DIR` set to `tests/generated-tests`; updated fallbacks and comments; ensured http test utils scaffold under `tests/generated-tests/utils`.
- `lib/testGenerator.GenerateTest.test.ts`: Adjusted temp generator configuration and path assertions to the new folder layout.
- `README.md`: Updated examples and CLI flag default documentation to reference `tests/generated-tests`.

## Migration Performed
- Moved existing folder: `generated-tests` -> `tests/generated-tests` (preserved structure: `integration/`, `utils/`).

## Rationale
- Aligns with project policy that integration tests live under `./tests`. Keeps generated artifacts scoped and discoverable by tooling and CI.

## Notes
- Jest and the custom runner already match `**/generated-tests/**` so no changes required for discovery.
- No behavioral changes to unit test locations (still colocated next to sources).

