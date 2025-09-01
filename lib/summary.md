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
- Non-dry runs also write `jest.config.js`, `setup.ts`, generate `qtests-runner.ts`, and update `package.json` test script

## Edge Cases & Caveats
- Legacy `GeneratedTest.test.ts` naming still recognized for backwards compatibility
- Force flag only applies to generated test files (those containing `.GenerateTest.test.ts`)
- Dry-run mode shows planned actions and skips Jest/runner/package.json writes
- AST analysis requires TypeScript dependency in host project (optional)
- Module resolution detection prefers ES modules for TypeScript projects

## AI Agent Task Anchors
- `🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS` — qtests/setup import location
- `🚩AI: UNIT_TEMPLATE_SECTION` — per-export describe/it generation logic  
- `🚩AI: INTEGRATION_TEMPLATE_SECTION` — createMockApp + supertest integration
- `🚩AI: TYPE_INFERENCE_OPTION` — TypeScript AST analysis implementation
- `🚩AI: DETERMINISM_HELPERS` — fake timers and seeded randomness
- `🚩AI: CLI_FLAGS_WIRING` — command-line option processing
