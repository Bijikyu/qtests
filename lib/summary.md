# lib/ Directory Summary

## Overview
The `lib/` directory contains the core qtests framework functionality, including test generation, utilities, and TypeScript definitions.

## Files and Their Roles

### testGenerator.ts
**Role**: Main test generator implementation for creating automated unit and integration tests  
**Key Features**:
- Analyzes TypeScript/JavaScript source files for exports and API routes
- Generates `.GenerateTest.test.ts` unit tests colocated with source files
- Creates integration tests in `generated-tests/` directory
- Supports both heuristic and optional TypeScript AST analysis modes
- Honors CLI/config filters: `SRC_DIR`, `include` globs, and `exclude` globs
- Includes deterministic helpers for time and randomness in generated tests
- Always imports `qtests/setup` first in generated tests
- React-aware templates: JSX-free component smoke tests and hook probe component
- Provider wrapper: auto-wraps with `QueryClientProvider` when `@tanstack/react-query` detected
- Optional Router wrapper: when `--with-router` flag is set and file imports React Router, wraps renders with `MemoryRouter`
- Required props fallback: for components likely needing props (TS types or propTypes.isRequired), generator emits an existence test instead of rendering
- **Enhanced Filtering (Sept 2025)**: Smart directory exclusion prevents test generation for demo/, config/, bin/, and test utility files
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
- Test generation modifies filesystem by creating new `.GenerateTest.test.ts` files (non-dry runs)
- AST mode attempts dynamic import of TypeScript compiler (graceful fallback)
- Generated tests include fake timers and seeded randomness when source uses Date/Math.random
- Non-dry runs also write `jest.config.js`, `jest-setup.ts`, generate `qtests-ts-runner.ts`. Updating `package.json` test script is opt-in via CLI flag.
- **Bug Fixes (Sept 2025)**: generateKey helper now correctly returns test keys instead of empty strings

## Edge Cases & Caveats
- Legacy `GeneratedTest.test.ts` naming still recognized for backwards compatibility
- Force flag only applies to generated test files (those containing `.GenerateTest.test.ts`)
- Dry-run mode shows planned actions and skips Jest/runner/package.json writes
- AST analysis requires TypeScript dependency in host project (optional)
- Module resolution detection prefers ES modules for TypeScript projects
- **Recent Improvements (Sept 2025)**:
  - Enhanced file filtering excludes examples/, demo/, bin/, manual-tests/, fixtures/ directories
  - Generates qtests-ts-runner.ts (correct filename) instead of qtests-runner.ts
  - All 83 tests now pass with 0 failures after bug fixes
  - TypeScript type safety improvements throughout codebase

## AI Agent Task Anchors
- `🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS` — qtests/setup import location
- `🚩AI: UNIT_TEMPLATE_SECTION` — per-export describe/it generation logic  
- `🚩AI: INTEGRATION_TEMPLATE_SECTION` — createMockApp + supertest integration
- `🚩AI: TYPE_INFERENCE_OPTION` — TypeScript AST analysis implementation
- `🚩AI: DETERMINISM_HELPERS` — fake timers and seeded randomness
- `🚩AI: CLI_FLAGS_WIRING` — command-line option processing
