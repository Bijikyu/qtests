# lib/ Directory Summary

## Overview
The `lib/` directory contains the core qtests framework functionality, including test generation, utilities, and TypeScript definitions.

## Files and Their Roles

### circuitBreaker.ts
**Role**: Opossum-based circuit breaker implementation for production reliability  
**Migration**: Replaced custom implementation with industry-standard Opossum library  
**Key Features**:
- Event-driven architecture with comprehensive monitoring
- AbortController support for modern async patterns  
- Prometheus metrics integration available
- Hystrix dashboard compatibility
- Comprehensive fallback system
- Better error handling and state management
**Request/Response Flows**: 
- Input: Async functions and configuration options
- Output: Protected function execution with circuit breaking  
**Key Features**:
- Analyzes TypeScript/JavaScript source files for exports and API routes
- Generates `.GeneratedTest.test.ts` integration tests for API endpoints and Express routes
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
 - **Express Router AST (Sept 2025)**: Robust AST-based Express route detection now supports:
   - `express.Router()` with custom variable names
   - Named imports and destructured require (e.g., `import { Router as R } from 'express'`; `const { Router } = require('express')`)
   - `require('express')()` app creation
   - Chained `router.route('/p').get().post().patch()` patterns
   - Nested prefixes via `app.use('/prefix', router)` and `router.use('/nested', child)`
   - Fallback generation for unmounted routers (routes emitted at root)
   - Back-compat: regex-detected routes are generated synchronously so callers that don’t `await analyze()` still get API tests

**Request/Response Flows**: 
- Input: Source files from project scan
- Output: Generated test files with proper qtests setup and realistic test cases

### testGenerator.GenerateTest.test.ts  
**Role**: Unit tests for the test generator functionality
**Features**: Tests the generator's ability to create proper test files with correct naming and qtests integration

### logUtils.ts
**Role**: Core logging utilities with controlled test environment output
**Features**: 
- Controlled logging for test environments
- Performance timing utilities with decorator support
- Backward compatibility with existing logStart/logReturn functions

### jestConfigFactory.ts
**Role**: Jest configuration factory that eliminates duplication across multiple config files
**Features**:
- Project type presets (typescript-esm, typescript-cjs, javascript-cjs, react-typescript, demo)
- Standardized configuration patterns
- Coverage configuration utilities
- Backward compatibility with existing Jest setups

### testSetupFactory.ts
**Role**: Test setup utilities that standardize Jest environment configuration
**Features**:
- Multiple setup types (minimal, typescript-esm, react, demo)
- Environment variable management
- Mock cleanup configuration
- React polyfills when needed

### unifiedHttpMock.ts
**Role**: Consolidated HTTP mocking that eliminates ~900 lines of duplicate code
**Features**:
- Multiple mocking strategies (legacy-axios, msw-modern, simple-axios, user-configurable)
- MSW server management
- Response and error factories
- Backward compatibility with existing mock implementations

### routeTestUtils.ts
**Role**: Parameterized route test generation that eliminates near-identical test files
**Features**:
- Standardized HTTP route testing patterns
- Convenience functions for GET, POST, PUT, DELETE
- Batch test generation for multiple routes
- Resource-based test generation for REST APIs

### logUtils.ts (if exists)
**Role**: Legacy logging utilities (now superseded by centralizedLogging.ts)
**Features**: Provides controlled logging for test environments

## Known Side Effects
- Test generation modifies filesystem by creating new `.GeneratedTest.test.ts` files (non-dry runs)
- AST mode attempts dynamic import of TypeScript compiler (graceful fallback)
- Generated tests include fake timers and seeded randomness when source uses Date/Math.random
- Non-dry runs also write `jest.config.mjs`, `jest-setup.ts` (with DOM/clipboard/URL shims for React), and generate `qtests-runner.mjs`. Updating `package.json` test script is opt-in via CLI flag.
- The generator CLI ALWAYS (re)writes `qtests-runner.mjs` at the client root (INIT_CWD) using a validated API‑only template.
- Postinstall scaffolding passively creates `qtests-runner.mjs` at client root when missing.
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
