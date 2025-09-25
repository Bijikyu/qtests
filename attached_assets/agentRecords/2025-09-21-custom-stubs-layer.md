## 2025-09-21: Add Custom Stubs Layer

### Summary
- Introduced `utils/customStubs.ts` to allow registering ad‑hoc module stubs without modifying core `setup.js`.
- Added `utils/customStubs.test.ts` covering registration, unregistration, listing, and non‑interference with axios/winston stubs.
- Updated README with "Custom Module Stubs" section and usage notes.
- Added `utils/summary.md` documenting flow, side effects, and anchors.

### Rationale
- Reduce fragility for client‑specific needs by providing a sanctioned extension point.
- Avoids touching protected module resolution logic while enabling stubbing of niche modules.

### Files
- Added: `utils/customStubs.ts`
- Added: `utils/customStubs.test.ts`
- Updated: `README.md`
- Added: `utils/summary.md`

### Follow‑ups
- Consider optional JSON/env mapping support (e.g., `QTESTS_CUSTOM_STUBS`) if teams prefer config files.
- If future requirements demand cache invalidation, expose a safe opt‑in helper with strong warnings.

