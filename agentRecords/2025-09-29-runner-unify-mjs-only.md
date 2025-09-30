# Record: Unify Runner to ESM Only

## Summary
- Updated root `package.json` to run `node qtests-runner.mjs`.
- Removed legacy `qtests-runner.js` which violated runner policies (spawn, npx jest).
- Verified scripts ensure only the ESM runner is scaffolded (`scripts/ensure-runner.mjs`, `scripts/postinstall-scaffold.mjs`).

## Rationale
- Align with Runner Policies: generator may only scaffold `qtests-runner.mjs` (ESM), API-only via Jest `runCLI`.
- Avoid maintaining two runner implementations and reduce confusion.

## Files Changed
- package.json: `scripts.test` → `node qtests-runner.mjs`.
- Deleted `qtests-runner.js`.

## Follow-ups
- Ensure any external docs or client samples reference `.mjs` only.
- CI check `scripts/ci-verify-runner.mjs` already enforces `.mjs` usage.

