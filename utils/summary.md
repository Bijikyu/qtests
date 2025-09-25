# Summary: utils

## Files
- utils/customStubs.ts: Layered Module._load hook allowing ad‑hoc, in‑memory module stubs without modifying core setup. Exports `registerModuleStub`, `unregisterModuleStub`, `listModuleStubs`, `clearAllModuleStubs`.

## Request/Response Flows
- Tests import `setup.js` first to activate core axios/winston stubs.
- Tests import `utils/customStubs.js` and call `registerModuleStub(id, exports|factory)`.
- When `require(id)` is called, the layered loader returns the provided exports object; otherwise, it delegates to the previous loader (preserving core behavior).

## Known Side Effects
- Patches `Module._load` once; additive to the core patch done by `setup.ts`. Order matters: call after setup.
- Does not touch `require.cache`. If a real module was already required, the stub won’t take effect until a fresh process or manual cache clearing (discouraged). Prefer correct order.

## Edge Cases & Caveats
- If the provided stub is a factory function and throws, the original error is re‑thrown.
- If `QTESTS_SILENT` is set to `1` or `true`, logs are suppressed.
- Works for non‑installed modules, useful for vendor SDKs or heavy clients.

## AI Task Anchors
// 🚩AI: ENTRY_POINT_FOR_AD_HOC_STUBS
// 🚩AI: MUST_UPDATE_IF_SETUP_PATCH_ORDER_CHANGES

