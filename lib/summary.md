# lib/ Directory Summary

## Overview
The `lib/` directory contains the core qtests framework functionality, including test generation, utilities, and TypeScript definitions.

## Files and Their Roles

### testGenerator.ts
**Role**: Main test generator implementation for creating automated unit and integration tests  
**Key Features**:
- Analyzes TypeScript/JavaScript source files for exports and API routes
- Generates `.GeneratedTest.test.ts` unit tests colocated with source files (backward-compatible with old `.GenerateTest.*`)
- Creates integration tests in `generated-tests/` directory
- Supports both heuristic and optional TypeScript AST analysis modes
- Honors CLI/config filters: `SRC_DIR`, `include` globs, and `exclude` globs
- Includes deterministic helpers for time and randomness in generated tests
- Always imports `qtests/setup` first in generated tests
- React-aware templates: JSX-free component smoke tests and hook probe component; no direct hook invocation
- Provider wrappers: auto-wraps with `QueryClientProvider` (when `@tanstack/react-query` present) and `FormProvider` + `useForm()` (when `react-hook-form` detected)
- Optional Router wrapper: when `--with-router` flag is set and file imports React Router, wraps renders with `MemoryRouter`
- Required props fallback: for components likely needing props (TS types or propTypes.isRequired), generator emits an existence test instead of rendering
- Component tests policy: as of Sept 2025, React component tests are skipped by default to reduce noise. Hooks are still generated. Opt-in via CLI `--react-components` or config `skipReactComponents: false`.
- **Enhanced Filtering (Sept 2025)**: Smart directory exclusion prevents test generation in `__mocks__/`, `__tests__/`, `tests/`, `test/`, `generated-tests/`, `manual-tests/`, `node_modules/`, `dist/`, `build/`, `.git/`
- **Export Safety Filters (Sept 2025)**: Skip reserved/falsy/non-identifier export names; no tests for `default`, `function`, `undefined`, etc.
- **React Test Exclusivity (Sept 2025)**: When proper React tests are emitted, skip adding generic existence tests.
- **File Extension Strategy (Sept 2025)**: Prefer `.ts` output; only emit `.tsx` when generated tests include JSX.
- **Local API Utils (Sept 2025)**: Scaffolds `generated-tests/utils/httpTest.ts` (re-exports) and `generated-tests/utils/httpTest.shim.js` (implementation). The shim is minimal, dependency‑free, supports `.send()`, and exposes `req.body`.
- **Performance Optimized (Sept 2025)**: Jest-like batch execution architecture achieving 69% speed improvement

**Request/Response Flows**: 
- Input: Source files from project scan
- Output: Generated test files with proper qtests setup and realistic test cases

### testGenerator.GenerateTest.test.ts  
**Role**: Unit tests for the test generator functionality
**Features**: Tests the generator's ability to create proper test files with correct naming and qtests integration

### logUtils.ts (if exists)
**Role**: Logging utilities and console capture functionality
**Features**: Provides controlled logging for test environments

## Known Side Effects
- Test generation modifies filesystem by creating new `.GeneratedTest.test.ts` files (non-dry runs)
- AST mode attempts dynamic import of TypeScript compiler (graceful fallback)
- Generated tests include fake timers and seeded randomness when source uses Date/Math.random
- Non-dry runs also write `jest.config.mjs`, `jest-setup.ts` (with DOM/clipboard/URL shims for React), generate `qtests-runner.mjs`. Updating `package.json` test script is opt-in via CLI flag.
- Safe overwrite: if existing `jest.config.mjs`/`jest-setup.ts` contain the qtests header, they will be overwritten to correct prior generator mistakes.
- Smarter React detection: generator now skips `node_modules`, build artifacts, and docs when scanning. This prevents false positives that forced `jsdom` and broke Node-only projects.
- **Bug Fixes (Sept 2025)**: generateKey helper now correctly returns test keys instead of empty strings

## Edge Cases & Caveats
- Legacy `.GenerateTest.*` and `GeneratedTest` forms are recognized for backwards compatibility
- Force flag only applies to generated test files (those containing `.GeneratedTest` or `.GenerateTest`)
- Dry-run mode shows planned actions and skips Jest/runner/package.json writes
- AST analysis requires TypeScript dependency in host project (optional)
- Module resolution detection prefers ES modules for TypeScript projects
- **Recent Improvements (Sept 2025)**:
  - Export-name validation avoids bogus tests; falls back to module smoke test when no safe targets
  - JSX-free templates produce `.ts` tests; JSX emits `.tsx` when needed and Jest transforms include TSX
  - Local HTTP shim pair ensures generated API tests run without external dependencies and align with generated test expectations
  - Jest config now includes a `moduleNameMapper` for `mongoose` pointing to qtests' manual mock, preventing real DB access

## AI Agent Task Anchors
- `🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS` — qtests/setup import location
- `🚩AI: UNIT_TEMPLATE_SECTION` — per-export describe/it generation logic  
- `🚩AI: INTEGRATION_TEMPLATE_SECTION` — createMockApp + supertest integration
- `🚩AI: TYPE_INFERENCE_OPTION` — TypeScript AST analysis implementation
- `🚩AI: DETERMINISM_HELPERS` — fake timers and seeded randomness
- `🚩AI: CLI_FLAGS_WIRING` — command-line option processing
