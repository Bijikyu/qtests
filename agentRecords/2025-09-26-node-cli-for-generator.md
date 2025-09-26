# Change Record: Node-native generator CLI (no tsx)

- Date: 2025-09-26
- Areas: `bin/qtests-generate.mjs`, `package.json`, `tsconfig.json`

## Summary
- Added `bin/qtests-generate.mjs`, a Node-native ESM CLI that imports the compiled generator from `dist/lib/testGenerator.js`. No tsx/IPC.
- Updated `package.json` bins: both `qtests-generate` and `qtests-ts-generate` now point to the Node CLI.
- Added build scripts: `build` (tsc) and `prepublishOnly` to ensure compiled output is present in published artifacts.
- Declared `files` to ship `bin/`, `dist/`, and runner templates so generation works reliably in client apps.
- Added a root `tsconfig.json` to emit ESM to `dist/`.

## Rationale
- In restricted environments (CI, seccomp sandboxes), `tsx` fails early (EPERM on IPC), preventing the generator from running. Shipping a Node CLI removes that fragility and ensures `qtests-runner.mjs` is always created on non–dry runs.

## Validation
- CLI alias test asserts bin mappings point to `bin/qtests-generate.mjs`.
- Shebang test verifies the CLI uses Node and contains no `tsx` usage.
- Existing generator tests continue to pass as they invoke the class directly.

## Notes
- The generator continues to create `qtests-runner.mjs` on non–dry runs and retains the template/bin fallback logic for robustness.
