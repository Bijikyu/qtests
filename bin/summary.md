# bin/ Directory Summary

## Overview
The `bin/` directory contains executable CLI tools for the qtests framework.

## Files and Their Roles

### qtests-generate (alias: qtests-ts-generate)
**Role**: Command-line interface for generating automated TypeScript tests  
**Key Features**:
- Supports multiple analysis modes: `heuristic` (default) and `ast` (TypeScript AST)
- Scope control: `--unit` (unit tests only) or `--integration` (integration tests only)  
- Safety features: `--dry-run` (preview without writing), `--force` (overwrite generated files)
- File filtering: `--include` and `--exclude` glob patterns
- Configurable source and test directories
 - React-aware options: `--react` to force React mode; `--with-router` to wrap detected React Router components with `MemoryRouter`
 - Package script update: `--update-pkg-script` opt-in to update `package.json` test script

**Recent Updates**:
- New command name `qtests-generate` added (keeps `qtests-ts-generate` as a backward-compatible alias).
- Imports compiled generator from `../dist/lib/testGenerator.js` for predictable runtime without tsx.
- ALWAYS writes/overwrites `qtests-runner.mjs` at the client root (INIT_CWD) using a validated API‑only template (runCLI + API Mode).

**Command Examples**:
```bash
qtests-generate                           # Scan current directory with defaults
qtests-generate --src lib                 # Scan 'lib' directory instead  
qtests-generate --unit --dry-run          # Preview unit tests only
qtests-generate --mode ast --force        # Use TypeScript AST analysis, overwrite existing
qtests-generate --include "**/*.ts"       # Only process TypeScript files
qtests-generate --exclude "**/demo/**"    # Skip demo directories
qtests-generate --react --with-router     # Force React mode and wrap Router components
qtests-generate --update-pkg-script       # Opt-in to update npm test script
```

**Request/Response Flows**:
- Input: CLI arguments and project source files
- Processing: Creates TestGenerator instance with parsed options
- Output: Generated `.GenerateTest.test.ts` files with qtests/setup integration

## Known Side Effects  
- Creates Jest configuration file (jest.config.mjs) on non-dry runs
- Creates Jest setup file (jest-setup.ts) on non-dry runs; imports `qtests/setup` first and adds DOM/browser stubs
- Creates/overwrites qtests-runner.mjs (API‑only via runCLI) and configures Jest invocation with `--config config/jest.config.mjs` and `--passWithNoTests`
- Scaffolds local HTTP test utils: `generated-tests/utils/httpTest.ts` (re-exports) and `generated-tests/utils/httpTest.shim.js` (implementation with `.send()`)
- Adds `moduleNameMapper` for `mongoose` pointing to qtests' manual mock to avoid real DB access in unit tests
- Generates test files in filesystem (unless --dry-run specified)
- Enhanced file filtering automatically skips demo/, examples/, config/, bin/, manual-tests/, and fixtures/ directories
- Package.json test script update is now opt-in via `--update-pkg-script`

## Edge Cases & Caveats
- AST mode requires TypeScript dependency (graceful fallback to heuristic)
- Force flag only applies to generated test files (those containing `.GenerateTest` in the filename)
- Include/exclude patterns use standard glob syntax
- Process exits with error code 1 on invalid options or generation failures
- **Policy Alignment (Sept 2025)**: Generator now correctly creates `qtests-runner.mjs` (ESM) instead of a TypeScript runner file
- **Enhanced Filtering (Sept 2025)**: Improved directory exclusion logic prevents test generation for config/demo files

## AI Agent Task Anchors  
- `🚩AI: CLI_FLAGS_WIRING` — command-line argument parsing and validation logic
