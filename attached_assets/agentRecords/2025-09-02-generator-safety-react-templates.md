# Record: Generator Safety, React Templates, and Scaffolding Updates (2025-09-02)

## Summary
- Hardened directory exclusions to avoid generating tests in mocks and test dirs.
- Validated export names to skip reserved/falsy/non-identifier symbols.
- Adopted React-safe templates (components and hooks) with provider wrappers.
- Implemented JSX-free default generation and extension strategy.
- Scaffolded local `generated-tests/utils/httpTest.js` for API tests.
- Tightened Jest scaffolding with jsdom and DOM shims when React is detected.

## Changes
- lib/testGenerator.ts
  - Exclusion: Added path-wise and name-wise filters for `__mocks__/`, `__tests__/`, `test/`, `tests/`, `generated-tests/`, `manual-tests/`, `node_modules/`, `dist/`, `build/`, `.git/`.
  - Export filters: Skip `default`, `function`, `undefined`, `null`, non-identifiers; ensure only safe targets are tested.
  - React templates:
    - Components: `import * as React`, `render(React.createElement(...))`, assert container defined.
    - Hooks: Probe component pattern; never call hooks directly; assert via `toBeInTheDocument()`.
    - Providers: MemoryRouter (flag-based) + QueryClientProvider + FormProvider/useForm (heuristic for react-hook-form).
  - File extension strategy: default `.ts`; `.tsx` only when emitting JSX (current templates avoid JSX).
  - API utilities: Write `generated-tests/utils/httpTest.js` (dependency-free) if missing.
  - Jest scaffolding: jsdom for React projects, ts-jest transform with jsx=react-jsx, transformIgnorePatterns for common ESM UI libs; setup adds shims for matchMedia, ResizeObserver, IntersectionObserver, clipboard, and URL.createObjectURL.
- lib/testGenerator.GenerateTest.test.ts
  - Expectations updated to `.ts` when no JSX is emitted.
- lib/summary.md and README.md
  - Documented new behavior: exclusions, export safety filters, provider wrappers, extension strategy, httpTest.js scaffolding.

## Rationale
- Prevent bogus tests (“function is defined”, “undefined is defined”).
- Avoid generating under `__mocks__/` (e.g., wouter mocks) and other excluded dirs.
- Stabilize React tests by rendering components and mounting hooks safely.
- Keep generated tests compatible across ESM/TSX stacks without requiring project surgery.

## Edge Cases
- Components with required props: generator emits existence-only fallback.
- React Router wrapper: only included if `--with-router` and router imports are detected.
- If no safe exports: module smoke test asserts module is defined and object-like.

## Follow-ups
- Optional flag to force JSX and `.tsx` output (not implemented).
- Additional provider heuristics could be added cautiously if needed for frequently failing stacks.
