# FILE_FLOWS.md

## Data Workflow and File Organization

### Core Application Flow

**Main Entry Point:**
1. `index.ts` - Main entry point, exports all qtests functionality
2. `setup.ts` - Global module resolution patching, must be imported first
3. `lib/` - Core library implementation files
4. `utils/` - Utility functions and testing helpers
5. `config/` - Configuration files for Jest and TypeScript

**Test Execution Flow:**
1. `qtests-runner.mjs` - Main test runner (generated)
2. `bin/qtests-ts-runner` - Protected test runner (never modified)
3. `config/jest.config.mjs` - Jest configuration
4. `config/jest-setup.ts` - Jest setup and globals
5. `tests/` - Integration tests (only test files kept)

### Module Resolution Flow

**Setup Process:**
1. User imports `import './node_modules/qtests/setup'`
2. `setup.ts` patches Node.js module resolution
3. `lib/mockSystem.js` registers default stubs (axios, winston, mongoose)
4. All subsequent requires get stub implementations

**Stub Registry:**
- Modules: `axios`, `winston`, `mongoose` (default)
- Stubs located in: `stubs/` directory
- Registration via: `lib/mockSystem.js`

### Configuration Flow

**Environment Variables:**
1. `config/localVars.js` - Single source of truth for all env vars
2. Categories: Node env, qtests config, testing constants, Jest config
3. Export pattern: `export const varName = process.env.VAR_NAME || 'default'`

**Build Configuration:**
1. `tsconfig.json` - TypeScript configuration
2. `config/tsconfig.jest.json` - Jest-specific TypeScript config  
3. `package.json` - NPM scripts and dependencies

### Library Architecture Flow

**Core Libraries (lib/):**
- `setup.ts` - Framework initialization
- `coreUtils.ts` - Basic testing utilities
- `mockSystem.ts` - Module mocking system
- `envUtils.ts` - Environment management
- `errorHandling.ts` - Error wrapper utilities
- `circuitBreaker.ts` - Circuit breaker pattern
- `rateLimiter.ts` - Rate limiting utilities
- `memoryMonitor.ts` - Memory tracking
- `testIsolation.ts` - Test isolation helpers

**Utilities (utils/):**
- `httpTest.ts` - HTTP testing utilities
- `runTestSuite.ts` - Test execution helpers
- `stubMethod.ts` - Method stubbing utilities
- `mockConsole.ts` - Console mocking
- `testHelpers.ts` - General test helpers

### Test Generation Flow

**Generator Process:**
1. `bin/qtests-generate.mjs` - Test generator CLI
2. `lib/templates/` - Test templates
3. Generated tests go to client projects (not in this repo)

**Test Discovery:**
1. Pattern: `**/integration/**/*.test.*`
2. Excludes: `node_modules/`, `dist/`, `build/`, `__mocks__/`
3. Runner: `qtests-runner.mjs` (batched execution)

### Data Flow Patterns

**Request Flow in Tests:**
1. Test file → `utils/httpTest.ts` → Mock/stubbed HTTP
2. Integration tests use real Express app with stubbed dependencies
3. Console output captured via `utils/mockConsole.ts`

**Environment Flow:**
1. `config/localVars.js` → All modules
2. `lib/envUtils.ts` provides test environment management
3. Backup/restore for isolation

### Import Dependencies

**Circular Import Prevention:**
- `lib/coreUtils.ts` has no internal dependencies
- `lib/setup.ts` imports from `lib/mockSystem.js`
- Most lib files import from `config/localVars.js`

**ESM Module Pattern:**
- All files use `.js` extensions in imports
- `index.ts` re-exports everything for treeshaking
- Type definitions exported alongside functions

### Build and Distribution Flow

**Build Process:**
1. `npm run build` → `tsc` → `dist/`
2. Tests run from source files, not dist
3. Distribution includes `dist/`, `bin/`, `templates/`

**Package Publishing:**
1. `npm publish` uses `dist/` for production
2. Source files included for development
3. Templates copied to client projects

### Debugging and Monitoring Flow

**Debug Output:**
1. Failed tests create `DEBUG_TESTS.md`
2. `config/jest.config.mjs` controls Jest verbosity
3. `QTESTS_SILENT` env var controls logging

**Error Handling:**
1. `lib/errorHandling.ts` provides error wrappers
2. `qerrors` module used for consistent error logging
3. Test failures captured and reported with context

### Security and Safety Flow

**Module Resolution Safety:**
1. Only registered modules get stubbed
2. Original Node.js behavior preserved for others
3. No permanent modifications to system

**Test Isolation:**
1. `lib/testIsolation.ts` manages environment backup/restore
2. Memory cleanup between tests
3. Server connection tracking and cleanup