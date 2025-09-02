# 2025-09-02 Test Generator Fixes

- Context: DEBUG_TESTS.md showed massive Jest env errors. Root cause was generator erroneously setting `testEnvironment: 'jsdom'` due to scanning `node_modules` and other folders, plus config not self-correcting once generated.

- Changes:
  - walkRecursive: skip `node_modules`, `dist`, `build`, `.git`, `demo`, `examples`, `docs` to avoid false React detection.
  - scaffoldJestSetup: remove duplicate `tsconfig` keys in `transform` options; keep `useESM` + `isolatedModules`; add inline `jsx` only when React.
  - Config overwrite policy: if `jest.config.mjs` or `jest-setup.ts` exist and contain the qtests header, safely overwrite to fix prior mistakes. Otherwise, leave user-managed files untouched.

- Rationale:
  - Prevent reoccurrence of jsdom dependency errors in Node-only projects.
  - Ensure generator outputs remain correct across runs without manual cleanup.

- Next considerations:
  - Optionally warn when `testEnvironment: 'jsdom'` is selected but `jest-environment-jsdom` is missing.
  - Consider improving `moduleNameMapper` for local development self-resolution.

