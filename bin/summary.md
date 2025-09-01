# bin/ Directory Summary

## Overview
The `bin/` directory contains executable CLI tools for the qtests framework.

## Files and Their Roles

### qtests-ts-generate
**Role**: Command-line interface for generating automated TypeScript tests  
**Key Features**:
- Supports multiple analysis modes: `heuristic` (default) and `ast` (TypeScript AST)
- Scope control: `--unit` (unit tests only) or `--integration` (integration tests only)  
- Safety features: `--dry-run` (preview without writing), `--force` (overwrite generated files)
- File filtering: `--include` and `--exclude` glob patterns
- Configurable source and test directories

**Command Examples**:
```bash
qtests-ts-generate                           # Scan current directory with defaults
qtests-ts-generate --src lib                 # Scan 'lib' directory instead  
qtests-ts-generate --unit --dry-run          # Preview unit tests only
qtests-ts-generate --mode ast --force        # Use TypeScript AST analysis, overwrite existing
qtests-ts-generate --include "**/*.ts"       # Only process TypeScript files
qtests-ts-generate --exclude "**/demo/**"    # Skip demo directories
```

**Request/Response Flows**:
- Input: CLI arguments and project source files
- Processing: Creates TestGenerator instance with parsed options
- Output: Generated `.GenerateTest.test.ts` files with qtests/setup integration

## Known Side Effects  
- Creates Jest configuration files if missing (jest.config.js) on non-dry runs
- Updates package.json test script to use qtests-ts-runner.ts on non-dry runs
- Creates qtests-ts-runner.ts for TypeScript ES module execution on non-dry runs
- Generates test files in filesystem (unless --dry-run specified)
- Enhanced file filtering automatically skips demo/, examples/, config/, bin/, manual-tests/, and fixtures/ directories

## Edge Cases & Caveats
- AST mode requires TypeScript dependency (graceful fallback to heuristic)
- Force flag only applies to generated test files (those containing `.GenerateTest` in the filename)
- Include/exclude patterns use standard glob syntax
- Process exits with error code 1 on invalid options or generation failures
- **Bug Fixed (Sept 2025)**: Now correctly creates qtests-ts-runner.ts instead of qtests-runner.ts
- **Enhanced Filtering (Sept 2025)**: Improved directory exclusion logic prevents test generation for config/demo files

## AI Agent Task Anchors  
- `🚩AI: CLI_FLAGS_WIRING` — command-line argument parsing and validation logic
