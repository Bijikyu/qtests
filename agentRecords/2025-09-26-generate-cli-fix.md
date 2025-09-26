# Change Record: Generator CLI resolution + runner template args capture

- Date: 2025-09-26
- Areas: `bin/qtests-ts-generate`, `lib/templates/qtests-runner.mjs.template`

## Summary
- Fix generator CLI import to reference `../lib/testGenerator.ts` directly so `tsx` resolves the TypeScript source outside Jest.
- Enhance runner template to write `runner-jest-args.json` with the exact Jest argv before spawning. This makes behavior observable even when spawning `jest` is restricted, aligning with tests that assert argv capture.

## Rationale
- Users reported the generator was not creating `qtests-runner.mjs`. The CLI previously imported `../lib/testGenerator.js`, which does not exist at runtime; Jest-only mapping hid the issue in tests. Importing the `.ts` source ensures proper execution under the `tsx` interpreter.
- In locked-down environments, the fake `jest` binary may never run, so the test expecting argv capture could fail. Writing `runner-jest-args.json` directly from the runner restores determinism.

## Notes
- No changes made to `bin/qtests-ts-runner` (sacrosanct).
- Template retains `QTESTS_SILENT`, debug suppression, debug file path override, and Jest API fallback.
