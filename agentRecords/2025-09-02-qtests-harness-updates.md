# Qtests Harness: ESM/TSX + HTTP shim + Runner updates

Date: 2025-09-02

Summary of changes implemented to address ESM/TSX support, HTTP shim parity, Jest runner stability, alias resolution, and Mongoose mocking.

- Runner: Always invokes Jest with project config + `--passWithNoTests`, added JS ESM runner `dist/qtests-runner.mjs` and updated CI usage to avoid tsx IPC issues.
- Jest Config: `config/jest.config.mjs` now supports TSX (ts-jest ESM preset), reads TS path aliases from `config/tsconfig.jest.json`/`tsconfig.json`, adds CSS/asset mocks, and ignores demo/examples.
- TSX Config: Added `config/tsconfig.jest.json` with `jsx: react-jsx` and `allowJs` for JS interop.
- HTTP Shim: Ensured generated `httpTest.ts` re-exports ESM JS shim with `.send()`, `.set()`, `.expect()`, `.end()` and proper `req.body` handling.
- Mongoose Mock: Default Jest `moduleNameMapper` maps `mongoose` to `__mocks__/mongoose.js` (model map + common methods).
- Generator: 
  - Derives `moduleNameMapper` from tsconfig paths with fallbacks for `@/` and `@shared/`.
  - Adds CSS/asset mocks; merges optional `aliases` from CLI/config.
  - Unit tests import target modules via dynamic import in `beforeAll()` to avoid TLA/import.meta parse issues.
  - Package script update prefers `node node_modules/qtests/dist/qtests-runner.mjs`.

Acceptance: Local Jest run passes; demo/example tests excluded via `testPathIgnorePatterns`.

