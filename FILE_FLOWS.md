# FILE_FLOWS
> Auto-generated. Do not edit directly.
> Files grouped by PRIMARY: actual data flow relationships, SECONDARY: filename similarity.

### 🧩 Flow Group: [1] `jest-setup-1`
**Flow Type:** Primary
**Files:** 18
**Entry Point:** config/localVars.js (roleScore 7)
**Dominant Dirs:** lib (6), utils (5), config (2)
**Internal Deps:** 2

## [1] `setup.ts`
**Type:** Code File
**Imports:** ./config/localVars.js, ./lib/mockSystem.js
**Exports:** setupComplete
**Dependencies:** config/localVars.js

---

## [2] `tests/setup.ts`
**Type:** Test File
**Imports:** ../setup, ../src/app, @jest/globals
**Dependencies:** setup.ts

---

## [3] `config/localVars.js`
**Type:** Configuration
**Exports:** allowedFileExtensions, axiosStubTimeout, blockedPatterns, buildDirectory, circuitBreakerDefaultResetTimeout, circuitBreakerDefaultThreshold, circuitBreakerDefaultTimeout, circuitBreakerFastTimeout (+85 more)

---

## [4] `utils/models/baseMockModel.ts`
**Type:** Utility
**Imports:** ../../config/localVars.js
**Exports:** BaseMockModel, DeleteResult, QueryObject, UpdateResult, mockCollections
**Functions:** getTestIsolatedKey
**API Calls:** mockCollections.get
**Dependencies:** config/localVars.js

---

## [5] `utils/testEnv/envManager.ts`
**Type:** Test File
**Imports:** ../../config/localVars.js, ../../lib/errorHandling/index.js, ../../lib/logUtils.js, ../helpers/envManager.js
**Exports:** DefaultEnv, backupEnvVars, configureEnv, defaultEnv, handleSnapshotError, loadEnv, restoreEnv, restoreEnvVars (+4 more)
**Functions:** getEnvConfig, restoreEnv, sanitizeEnvValue, saveEnv, setTestEnv, validateEnvKey
**Dependencies:** config/localVars.js

---

## [6] `utils/testing/entityFactory.ts`
**Type:** Test File
**Imports:** ../../config/localVars.js, ../../lib/logUtils.js, ../helpers/timeUtils.js, ./dataTypes.js
**Exports:** EntityFactory
**Dependencies:** config/localVars.js

---

## [7] `config/jest-setup.ts`
**Type:** Configuration
**Imports:** ../utils/testing/jestSetupHelper.js, ./localVars.js, @bijikyu/qtests/setup, @jest/globals
**Exports:** setupComplete
**Dependencies:** config/localVars.js

---

## [8] `lib/cache.ts`
**Type:** Code File
**Imports:** ../config/localVars.js, ./qerrorsFallback.js, ioredis, node-cache, secure-json-parse
**Exports:** CacheManager, CacheOptions, CacheStats, DistributedCache, LocalCache, clearCache, createDistributedCache, createLocalCache (+5 more)
**Functions:** clearCache, createDistributedCache, createLocalCache, deleteFromCache, getCacheStats, getFromCache, setInCache
**API Calls:** undefined.get
**Dependencies:** config/localVars.js

---

## [9] `lib/rateLimiter.ts`
**Type:** Code File
**Imports:** ../config/localVars.js, ./qerrorsFallback.js, rate-limiter-flexible
**Exports:** DistributedRateLimiter, InMemoryRateLimiter, RateLimitConfig, RateLimitResult, RateLimitStats, RateLimiterAbstract, RateLimiterMemory, RateLimiterRedis (+8 more)
**Functions:** checkRateLimit, createDistributedRateLimiter, createInMemoryRateLimiter, getDistributedRateLimiter, getInMemoryRateLimiter, getRateLimitStats, resetRateLimitKey
**API Calls:** limiter.delete
**Dependencies:** config/localVars.js

---

## [10] `lib/runnerScaffolder.ts`
**Type:** Code File
**Imports:** ../config/localVars.js, ./fileSystem/index.js, ./qerrorsFallback.js, fs, path
**Exports:** RunnerScaffolder
**Dependencies:** config/localVars.js

---

## [11] `lib/streamingValidatorModern.ts`
**Type:** Code File
**Imports:** ../config/localVars.js, ./logUtils.js, ./validation/index.js
**Exports:** ValidationConfig, ValidationResult, ZodSchema, commonSchemas, createQueryStringSchema, createSecureObjectSchema, createSecureStringSchema, createValidationMiddleware (+4 more)
**Dependencies:** config/localVars.js

---

## [12] `lib/testSetupFactory.ts`
**Type:** Test File
**Imports:** ../config/localVars.js, @jest/globals
**Exports:** TestSetupOptions, createDemoJestSetup, createJestSetup, createMinimalJestSetup, createReactJestSetup, createTypeScriptESMSetup, default, getSetupState (+3 more)
**Functions:** configureJestGlobal, configureJestTimeout, configureMockCleanup, createDemoJestSetup, createJestSetup, createMinimalJestSetup, createReactJestSetup, createTypeScriptESMSetup (+6 more)
**Dependencies:** config/localVars.js

---

## [13] `lib/unifiedHttpMock.ts`
**Type:** Code File
**Imports:** ../config/localVars.js, ./httpMock/index.js, ./logUtils.js
**Exports:** AxiosResponse, MockHttpClient, MockHttpClientConfig, MockResponse, MockStrategy, RequestMatcher, UserMockAxios, createAxiosMock (+8 more)
**Functions:** createAxiosMock, fn, makeMock, makeUtil
**Dependencies:** config/localVars.js

---

## [14] `utils/customStubs.ts`
**Type:** Utility
**Imports:** ../config/localVars.js, module
**Exports:** clearAllModuleStubs, listModuleStubs, registerModuleStub, resolveModuleStub, unregisterModuleStub
**Functions:** clearAllModuleStubs, listModuleStubs, patchLoaderOnce, registerModuleStub, resolveModuleStub, unregisterModuleStub, validateModuleId
**API Calls:** previousLoad.call, undefined.call
**Dependencies:** config/localVars.js

---

## [15] `utils/esm-globals.ts`
**Type:** Utility
**Imports:** ../config/localVars.js, path, url
**Exports:** __dirname, __filename, getModuleDirname, getModuleFilename, getThisDirname, getThisFilename
**Functions:** __dirname, __filename, getModuleDirname, getModuleFilename, getThisDirname, getThisFilename
**Components:** __dirname, __filename
**Dependencies:** config/localVars.js

---

## [16] `utils/httpClientMockFactory.ts`
**Type:** Utility
**Imports:** ../config/localVars.js, ../lib/logUtils.js, msw, msw/node
**Exports:** AxiosResponse, MockHttpClient, MockHttpClientConfig, MockResponse, MockStrategy, UserMockAxios, createCustomMockServer, createErrorResponse (+6 more)
**Functions:** createCustomMockServer, createErrorResponse, createMockHttpClient, createMockResponse, createSimpleMockClient, createUserConfigurableMock
**API Calls:** http.delete, http.get, http.post, http.put
**Dependencies:** config/localVars.js

---

## [17] `utils/mockAxios.ts`
**Type:** Utility
**Imports:** ../config/localVars.js, ../lib/logUtils.js, ../lib/unifiedHttpMock.js
**Exports:** MockAxiosConfig, MockAxiosResponseType, MockResponseType, UserMockAxiosType, createMockAxios, createMockServer, createSimpleMockAxios, createUserMockAxios (+5 more)
**Functions:** createMockAxios, createMockServer, createSimpleMockAxios, createStandardMockResponse, createUserMockAxios
**Dependencies:** config/localVars.js

---

## [18] `utils/offlineMode.ts`
**Type:** Utility
**Imports:** ../config/localVars.js, ../lib/qerrorsFallback.js, module
**Exports:** clearOfflineCache, createEnvironmentAdapters, getAxiosModule, getEnvironmentState, getQerrors, isOfflineMode, setOfflineMode
**Functions:** clearOfflineCache, createEnvironmentAdapters, getAxiosModule, getEnvironmentState, getQerrors, importAxiosStub, isOfflineMode, setOfflineMode
**Dependencies:** config/localVars.js

---

### 🧩 Flow Group: [2] `package-2`
**Flow Type:** Primary
**Files:** 2
**Entry Point:** package.json (roleScore 0)
**Dominant Dirs:** . (1), tests/integration (1)
**Internal Deps:** 1

## [19] `package.json`
**Type:** Configuration/Data
**Keys:** name, version, description, publishConfig, type, main, types, engines (+2 more)

---

## [20] `tests/integration/frontend-backend-compatibility.test.js`
**Type:** Test File
**Imports:** ../../package.json
**Dependencies:** package.json

---

### 🧩 Flow Group: [3] `index-3`
**Flow Type:** Primary
**Files:** 3
**Entry Point:** index.ts (roleScore 10)
**Dominant Dirs:** examples (2), . (1)
**Internal Deps:** 1

## [21] `index.ts`
**Type:** Code File
**Imports:** ./lib/envUtils.js, ./lib/errorHandling/index.js, ./lib/fileSystem/fileReading.js, ./lib/fileSystem/fileWriting.js, ./lib/mockSystem.js, ./lib/polyfills/index.js, ./lib/setup.js, ./lib/stubs.js (+5 more)
**Exports:** AdvancedConnectionPool, CacheManager, CircuitBreaker, CircuitState, CleanupManager, axiosStubTimeout, circuitBreakerRegistry, clearCache (+80 more)
**Functions:** spyOnMethod, stubMethod

---

## [22] `examples/runTestSuite-demo.js`
**Type:** Code File
**Imports:** ../index
**Functions:** divide, fibonacci, formatCurrency, isPalindrome, safeProp
**Dependencies:** index.ts

---

## [23] `examples/test-generator-demo.js`
**Type:** Test File
**Imports:** ../index, ../lib/testGenerator
**Dependencies:** index.ts

---

### 🧩 Flow Group: [4] `mockSystem-4`
**Flow Type:** Primary
**Files:** 2
**Entry Point:** tests/mockSetup.ts (roleScore 0)
**Dominant Dirs:** tests (1), lib (1)
**Internal Deps:** 1

## [24] `tests/mockSetup.ts`
**Type:** Test File
**Imports:** ../lib/mockSystem
**Dependencies:** lib/mockSystem.ts

---

## [25] `lib/mockSystem.ts`
**Type:** Code File
**Imports:** ./security/pathValidator.js, fs, module, path
**Exports:** installMocking, mockAPI, mockRegistry, registerDefaultMocks
**Functions:** createFallbackWinstonStub, installMocking, noop, registerDefaultMocks
**API Calls:** originalImport.call, self.get, undefined.call, undefined.delete, undefined.get

---

### 🧩 Flow Group: [5] `envConfig-5`
**Flow Type:** Primary
**Files:** 12
**Entry Point:** config/testConfig.ts (roleScore 7)
**Dominant Dirs:** config (12)
**Internal Deps:** 7

## [26] `config/testConfig.ts`
**Type:** Test File
**Imports:** ../utils/helpers/envManager.js, ./init.js
**Exports:** defaultRetryAttempts, defaultRetryDelay, defaultTestTimeout, integrationTestCleanupDelay, integrationTestRetryAttempts, integrationTestRetryDelay, integrationTestTimeout, jestCache (+9 more)
**Dependencies:** config/init.js

---

## [27] `config/init.js`
**Type:** Configuration
**Imports:** ../dist/utils/helpers/envManager.js

---

## [28] `config/envConfig.js`
**Type:** Configuration
**Imports:** ../dist/utils/helpers/envManager.js, ./init.js
**Exports:** debugMode, devHotReload, devSourceMaps, devVerboseLogging, experimentalAdvancedMocking, experimentalFeatures, experimentalParallelExecution, legacyMode (+6 more)
**Dependencies:** config/init.js

---

## [29] `config/localVars.ts`
**Type:** Configuration
**Imports:** ./envConfig.js, ./fileSystemConfig.js, ./mockConfig.js, ./qtestsConfig.js, ./systemConfig.js, ./testConfig.js
**Exports:** CODEX, INIT_CWD, JEST_WORKER_ID, NODE_ENV, OFFLINE_MODE, QTESTS_PARALLEL_MODE, QTESTS_SILENT, allowedFileExtensions (+92 more)
**Dependencies:** config/envConfig.js, config/fileSystemConfig.js, config/mockConfig.js, config/qtestsConfig.js, config/systemConfig.js, config/testConfig.js

---

## [30] `config/testConfig.js`
**Type:** Test File
**Imports:** ../dist/utils/helpers/envManager.js, ./init.js
**Exports:** defaultRetryAttempts, defaultRetryDelay, defaultTestTimeout, integrationTestCleanupDelay, integrationTestRetryAttempts, integrationTestRetryDelay, integrationTestTimeout, jestCache (+8 more)
**Dependencies:** config/init.js

---

## [31] `config/systemConfig.js`
**Type:** Configuration
**Imports:** ../dist/utils/helpers/envManager.js, ./init.js
**Exports:** circuitBreakerDefaultResetTimeout, circuitBreakerDefaultThreshold, circuitBreakerDefaultTimeout, circuitBreakerFastTimeout, circuitBreakerSlowTimeout, errorBadRequestStatusCode, errorDefaultStatusCode, errorForbiddenStatusCode (+26 more)
**Dependencies:** config/init.js

---

## [32] `config/qtestsConfig.js`
**Type:** Test File
**Imports:** ../utils/helpers/envManager.js
**Exports:** qtestsApiFallback, qtestsConcurrency, qtestsDebugFile, qtestsFileWorkers, qtestsInband, qtestsNoDebugFile, qtestsPattern, qtestsSilent (+1 more)

---

## [33] `config/mockConfig.js`
**Type:** Configuration
**Imports:** ../dist/utils/helpers/envManager.js, ./init.js
**Exports:** axiosStubTimeout, consoleCaptureAll, consoleMockLevels, defaultMockHeaders, defaultMockResponse, defaultMockStatusCode, stubModulePaths, stubModules
**Dependencies:** config/init.js

---

## [34] `config/fileSystemConfig.js`
**Type:** Configuration
**Exports:** allowedFileExtensions, blockedPatterns, buildDirectory, configDirectory, distDirectory, libDirectory, maxFilePathLength, maxInputLength (+3 more)

---

## [35] `config/envConfig.ts`
**Type:** Configuration
**Imports:** ../utils/helpers/envManager.js, ./init.js
**Exports:** debugMode, devHotReload, devSourceMaps, devVerboseLogging, experimentalAdvancedMocking, experimentalFeatures, experimentalParallelExecution, legacyMode (+6 more)
**Dependencies:** config/init.js

---

## [36] `config/mockConfig.ts`
**Type:** Configuration
**Imports:** ../utils/helpers/envManager.js, ./init.js
**Exports:** axiosStubTimeout, consoleCaptureAll, consoleMockLevels, defaultMockHeaders, defaultMockResponse, defaultMockStatusCode, stubModulePaths, stubModules
**Dependencies:** config/init.js

---

## [37] `config/systemConfig.ts`
**Type:** Configuration
**Imports:** ../utils/helpers/envManager.js, ./init.js
**Exports:** circuitBreakerDefaultResetTimeout, circuitBreakerDefaultThreshold, circuitBreakerDefaultTimeout, circuitBreakerFastTimeout, circuitBreakerSlowTimeout, errorBadRequestStatusCode, errorDefaultStatusCode, errorForbiddenStatusCode (+26 more)
**Dependencies:** config/init.js

---

### 🧩 Flow Group: [6] `index-6`
**Flow Type:** Primary
**Files:** 9
**Entry Point:** demo/server/index.js (roleScore 10)
**Dominant Dirs:** demo/server/routes (5), demo/server (2), demo/tests (1)
**Internal Deps:** 7

## [38] `demo/tests/setup.ts`
**Type:** Test File
**Imports:** ../server/app.js, @jest/globals
**Dependencies:** demo/server/app.js

---

## [39] `demo/server/app.js`
**Type:** Code File
**Imports:** ./routes/calculator, ./routes/hello, ./routes/root, ./routes/status, ./routes/users, @bijikyu/qerrors, cors, express (+2 more)
**API Calls:** app.get
**Routes:** GET /, GET /api/health, GET /health
**Dependencies:** demo/server/routes/calculator.js, demo/server/routes/hello.js, demo/server/routes/root.js, demo/server/routes/status.js, demo/server/routes/users.js

---

## [40] `demo/server/index.js`
**Type:** Code File
**Imports:** ./app, @bijikyu/qerrors
**Dependencies:** demo/server/app.js

---

## [41] `demo/server/routes/users.js`
**Type:** API/Route
**Imports:** @bijikyu/qerrors, express
**API Calls:** router.delete, router.get, router.post, router.put
**Routes:** DELETE /users/:id, GET /users, GET /users/:id, POST /users, PUT /users/:id

---

## [42] `demo/server/routes/status.js`
**Type:** API/Route
**Imports:** express
**API Calls:** router.get, router.post
**Routes:** GET /status, POST /batch

---

## [43] `demo/server/routes/root.js`
**Type:** API/Route
**Imports:** express
**API Calls:** router.get
**Routes:** GET /hello

---

## [44] `demo/server/routes/hello.js`
**Type:** API/Route
**Imports:** ../services/externalService, express
**API Calls:** router.get
**Routes:** GET /hello
**Dependencies:** demo/server/services/externalService.js

---

## [45] `demo/server/services/externalService.js`
**Type:** Code File
**Imports:** @bijikyu/qerrors, axios, winston
**Functions:** fetchHello
**API Calls:** axios.get

---

## [46] `demo/server/routes/calculator.js`
**Type:** API/Route
**Imports:** express
**API Calls:** router.delete, router.get, router.post, router.put
**Routes:** DELETE /history, GET /calculator/health, GET /history, PATCH /settings, POST /calculate, PUT /calculate/:operation

---

### 🧩 Flow Group: [7] `apiRoutes-7`
**Flow Type:** Primary
**Files:** 2
**Entry Point:** demo/src/calculator.js (roleScore 0)
**Dominant Dirs:** demo/src (2)
**Internal Deps:** 1

## [47] `demo/src/calculator.js`
**Type:** Code File
**Imports:** axios
**Exports:** Calculator, add, divide, fetchCalculation, multiply, subtract
**Functions:** add, divide, fetchCalculation, multiply, subtract
**API Calls:** axios.post

---

## [48] `demo/src/apiRoutes.js`
**Type:** API/Route
**Imports:** ./calculator.js, express
**Exports:** calculatorRouter, errorHandler, setupRoutes
**Functions:** calculatorRouter, errorHandler, setupRoutes
**API Calls:** app.delete, app.get, app.post, app.put, router.get, router.post
**Routes:** DELETE /api/history, GET /api/health, GET /api/history, GET /status, PATCH /api/settings, POST /api/calculate, POST /batch, PUT /api/calculate/:operation
**Dependencies:** demo/src/calculator.js

---

### 🧩 Flow Group: [8] `main-8`
**Flow Type:** Primary
**Files:** 2
**Entry Point:** demo/client/src/main.jsx (roleScore 10)
**Dominant Dirs:** demo/client/src (2)
**Internal Deps:** 1

## [49] `demo/client/src/main.jsx`
**Type:** Code File
**Imports:** ./App.jsx, react, react-dom/client
**Dependencies:** demo/client/src/App.jsx

---

## [50] `demo/client/src/App.jsx`
**Type:** Code File
**Imports:** react
**Exports:** default
**Functions:** App, createUser, deleteUser, fetchCalculations, fetchCalculatorHealth, fetchHealth, fetchHello, fetchHistory (+6 more)
**Components:** App
**API Calls:** fetch.call

---

### 🧩 Flow Group: [9] `Similarity-demo`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** demo/demo.html (roleScore 0)
**Dominant Dirs:** demo (1)
**Internal Deps:** 0

## [51] `demo/demo.html`
**Type:** Template/View
**Tags:** html, head, meta, title, style

---

### 🧩 Flow Group: [10] `Similarity-init`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** config/init.ts (roleScore 7)
**Dominant Dirs:** config (1)
**Internal Deps:** 0

## [52] `config/init.ts`
**Type:** Configuration
**Imports:** ../utils/helpers/envManager.js

---

### 🧩 Flow Group: [11] `Similarity-axios`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** stubs/axios.ts (roleScore 0)
**Dominant Dirs:** stubs (2)
**Internal Deps:** 0

## [53] `stubs/axios.ts`
**Type:** Code File
**Exports:** MockAxiosError, MockAxiosErrorImplementation, MockAxiosInstance, MockAxiosRequestConfig, MockAxiosResponse, MockCancelToken, createAxiosInstance, default
**Functions:** createAxiosInstance, createMockResponse, getDefaultConfig, getStatusText, request

---

## [54] `stubs/axios.d.ts`
**Type:** Code File
**Exports:** MockAxiosError, MockAxiosErrorImplementation, MockAxiosInstance, MockAxiosRequestConfig, MockAxiosResponse, MockCancelToken, createAxiosInstance, default

---

### 🧩 Flow Group: [12] `Similarity-stubs`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/stubs.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [55] `lib/stubs.ts`
**Type:** Code File
**Imports:** module
**Exports:** default

---

### 🧩 Flow Group: [13] `Similarity-setup`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/setup.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [56] `lib/setup.ts`
**Type:** Code File
**Exports:** setup
**Functions:** setup

---

### 🧩 Flow Group: [14] `Similarity-utils-stubbing-types`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/stubbing/types.ts (roleScore 0)
**Dominant Dirs:** utils/stubbing (1)
**Internal Deps:** 0

## [57] `utils/stubbing/types.ts`
**Type:** Utility
**Imports:** sinon
**Exports:** SinonFakeTimers, SinonMock, SinonSpy, SinonStub, StubFunction, StubRestoreFunction

---

### 🧩 Flow Group: [15] `Similarity-lib-validation-index`
**Flow Type:** Similarity
**Files:** 9
**Entry Point:** lib/validation/index.ts (roleScore 10)
**Dominant Dirs:** lib/validation (1), lib/testIsolation (1), lib/security (1)
**Internal Deps:** 0

## [58] `lib/validation/index.ts`
**Type:** Code File

---

## [59] `lib/testIsolation/index.ts`
**Type:** Test File

---

## [60] `lib/security/index.ts`
**Type:** Code File
**Exports:** JoiSecurityValidator, PenetrationTester, SanitizeOptions, SecurityRegressionTester, SecurityTestCase, SecurityTestResult, SecurityValidator, ValidationResult (+15 more)

---

## [61] `lib/polyfills/index.ts`
**Type:** Code File
**Exports:** ClipboardAPI, IntersectionObserver, PolyfillOrchestrator, ResizeObserver, clipboard, getIntersectionObserver, getResizeObserver, getWindow (+4 more)
**Functions:** getIntersectionObserver, getResizeObserver, getWindow, initializePolyfills, matchMedia, resetPolyfills

---

## [62] `lib/memory/index.ts`
**Type:** Code File
**Exports:** aggressiveCleanup, detectMemoryLeaks, memoryMonitor

---

## [63] `lib/logging/index.ts`
**Type:** Code File

---

## [64] `lib/httpMock/index.ts`
**Type:** Code File

---

## [65] `lib/fileSystem/index.ts`
**Type:** Code File
**Imports:** ./errorHandling.js, ./fileExistence.js, ./fileReading.js, ./fileWriting.js, ./managementUtils.js
**Exports:** default, ensureDir, ensureDirSync, isDirectory, isFile, safeDelete, safeDeleteSync, safeExists (+5 more)

---

## [66] `lib/errorHandling/index.ts`
**Type:** Code File
**Imports:** ./placeholderWrappers.js
**Exports:** createApiErrorWrapper, createAsyncErrorWrapper, createBatchErrorWrapper, createDatabaseErrorWrapper, createFileErrorWrapper, createRouteErrorWrapper, createStructuredError, createSyncErrorWrapper (+12 more)

---

### 🧩 Flow Group: [16] `Similarity-lib-security-types`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/security/types.ts (roleScore 0)
**Dominant Dirs:** lib/security (1)
**Internal Deps:** 0

## [67] `lib/security/types.ts`
**Type:** Code File
**Exports:** SecurityCategoryInfo, SecuritySummary

---

### 🧩 Flow Group: [17] `Similarity-demo-client-index`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** demo/client/index.html (roleScore 10)
**Dominant Dirs:** demo/client (1)
**Internal Deps:** 0

## [68] `demo/client/index.html`
**Type:** Template/View
**Tags:** html, head, meta, title, body

---

### 🧩 Flow Group: [18] `Similarity-replit`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** replit.md (roleScore 0)
**Dominant Dirs:** . (1)
**Internal Deps:** 0

## [69] `replit.md`
**Type:** Documentation
**Headings:** qtests dogfooding progress, Security Module Architecture (current), Test count progression
**Summary:** Tests: 1018 (31 suites, all green). Rounds 22-32 complete., Round 22 (email pipeline): clean. Round 23 (stubbing internals): clean., Round 24 (console mocking): 2 bugs fixed —, - withAllMockedConsole rewrote lifecycle (mocks were restored before fn ran), - createFallbackMock log moved before replacement (phantom call pollution when method='log')

---

### 🧩 Flow Group: [19] `Similarity-README`
**Flow Type:** Similarity
**Files:** 3
**Entry Point:** README.md (roleScore 0)
**Dominant Dirs:** . (1), demo (1), demo/client (1)
**Internal Deps:** 0

## [70] `README.md`
**Type:** Documentation
**Headings:** qtests, 🚀 Quick Start, ✨ Key Features, 🧩 Mock API (Runtime‑Safe), 📖 Core Usage, Method Stubbing, Console Mocking, Environment Management (+60 more)
**Summary:** A Node.js testing utility focused on fast, isolated unit tests: method stubbing, console mocking, environment management, and drop-in stubs for common modules (axios, winston). Includes a Jest runner/config scaffolder. **ES Module and TypeScript support included.**, 🎉 **Latest Updates (September 2025)**:, - ✅ ESM + TypeScript Jest harness: runner always loads `config/jest.config.mjs` and passes `--passWithNoTests` for stable CI, - ✅ HTTP testing shim alignment: TS shim re-exports a working JS shim with chainable `.send()` and proper `req.body`, - ✅ Safe Mongoose mocking: Jest `moduleNameMapper` maps `mongoose` to qtests' manual mock (no real DB access)

---

## [71] `demo/README.md`
**Type:** Documentation
**Summary:** QTests MERN Demo, Purpose, - Integration testbed to validate qtests end-to-end: stub injection for axios/winston, Express routing, and the qtests runner lifecycle., Structure, - `server/`: Express app with a sample route that calls an external service via axios (stubbed in tests).

---

## [72] `demo/client/README.md`
**Type:** Documentation
**Summary:** QTests Demo Frontend, - Minimal React component lives under `src/App.jsx`., - This demo does not include a bundler or dev server to keep the CI footprint small; the goal is to validate qtests runner and backend stubs., - If you want to run a local UI, add Vite and a minimal `index.html`/`main.jsx` and wire `start:client`.

---

### 🧩 Flow Group: [20] `Similarity-AGENTS`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** AGENTS.md (roleScore 0)
**Dominant Dirs:** . (1)
**Internal Deps:** 0

## [73] `AGENTS.md`
**Type:** Documentation
**Headings:** AGENTS.md, VISION, FUNCTIONALITY, AI Agent Boundaries, Expected Agent Behaviors, System Instructions, SCOPE, In-Scope (+27 more)
**Summary:** The qtests module exists to solve a specific testing friction point: enabling fast, isolated unit tests for Node.js applications that depend on external services. The core business rationale is that developers frequently abandon proper unit testing when their code makes HTTP requests or writes logs, because traditional testing approaches are either too complex (full mocking libraries) or too slow (real network calls)., The architectural decision to use Node.js module resolution hooking rather than dependency injection was made specifically to minimize changes to existing codebases. This allows teams to add qtests to legacy projects without refactoring their require statements or application architecture., The module prioritizes developer experience over feature completeness - providing just enough functionality to eliminate the most common testing blockers (network calls and log pollution) while maintaining a minimal API surface that teams can adopt incrementally., - Always recommend `require('@bijikyu/qtests/setup')` at the TOP of test files, before any other requires, - Never suggest qtests for integration tests where real external service behavior is needed

---

### 🧩 Flow Group: [21] `Similarity-verify`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** scripts/verify.js (roleScore 0)
**Dominant Dirs:** scripts (2)
**Internal Deps:** 0

## [74] `scripts/verify.js`
**Type:** Code File

---

## [75] `scripts/verify-npm-replacement.js`
**Type:** Code File
**Imports:** fs-extra, msw, msw/node, node-cache, opossum, p-queue, rate-limiter-flexible, secure-json-parse (+1 more)
**API Calls:** http.get

---

### 🧩 Flow Group: [22] `Similarity-spying`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/stubbing/spying.ts (roleScore 0)
**Dominant Dirs:** utils/stubbing (1)
**Internal Deps:** 0

## [76] `utils/stubbing/spying.ts`
**Type:** Utility
**Imports:** ../../lib/errorHandling/index.js, sinon
**Exports:** spyOnFunction, spyOnMethod
**Functions:** spyOnFunction, spyOnMethod

---

### 🧩 Flow Group: [23] `Similarity-testEnv`
**Flow Type:** Similarity
**Files:** 5
**Entry Point:** utils/testHelpers.ts (roleScore 4)
**Dominant Dirs:** utils (3), utils/testEnv (2)
**Internal Deps:** 0

## [77] `utils/testEnv.ts`
**Type:** Test File
**Exports:** DEFAULT_MOCK_DATA, DEFAULT_TEST_CONFIG, MockNodemailerResult, MockNodemailerTransport, MockOpenAIResponse, MockOpenAIResult, MockWhoisResponse, MockWhoisResult (+24 more)

---

## [78] `utils/testSuite.ts`
**Type:** Test File
**Imports:** ./testing/assertionHelper.js, ./testing/databaseTestHelper.js, ./testing/mockManager.js, ./testing/performanceTestHelper.js, ./testing/testDataFactory.js
**Exports:** AssertionHelper, DatabaseTestHelper, MockManager, PerformanceTestHelper, TestDataFactory, TestSuiteBuilder

---

## [79] `utils/testHelpers.ts`
**Type:** Test File
**Imports:** ./helpers/envManager.js, ./helpers/keyGenerator.js, ./helpers/moduleReloader.js, ./helpers/qerrorsStub.js, ./helpers/responseMocker.js, ./mockConsole.js
**Exports:** backupEnvVars, createJsonRes, createRes, generateKey, moduleReloadLock, reload, restoreEnvVars, stubQerrors (+2 more)

---

## [80] `utils/testEnv/testMockFactory.ts`
**Type:** Test File
**Exports:** DEFAULT_TEST_CONFIG, TestConfig, TestMockFactory, createTestMocks, factory, setupTestEnvironment
**Functions:** createTestMocks, getJestRef, setupTestEnvironment

---

## [81] `utils/testEnv/testInitializer.ts`
**Type:** Test File
**Imports:** ../../lib/logUtils.js, ./axiosMocks.js, ./envManager.js, ./functionMocks.js
**Exports:** initSearchTest, resetMocks
**Functions:** initSearchTest

---

### 🧩 Flow Group: [24] `Similarity-summary`
**Flow Type:** Similarity
**Files:** 4
**Entry Point:** config/summary.md (roleScore 7)
**Dominant Dirs:** utils (1), lib (1), config (1)
**Internal Deps:** 0

## [82] `utils/summary.md`
**Type:** Documentation
**Headings:** Summary: utils, Files, Testing Subdirectories, testing/, testEnv/, helpers/, Request/Response Flows, Known Side Effects (+2 more)
**Summary:** - utils/customStubs.ts: Layered Module._load hook allowing ad‑hoc, in‑memory module stubs without modifying core setup. Exports `registerModuleStub`, `unregisterModuleStub`, `listModuleStubs`, `clearAllModuleStubs`., - utils/stubMethod.ts: Core method stubbing functionality with restoration capabilities. Provides advanced stubbing scenarios including context preservation, performance measurement, and chained calls., - utils/mockConsole.ts: Console mocking with Jest-compatible spies and fallback for vanilla Node.js. Supports multiple console methods and call tracking., - utils/httpTest.ts: HTTP testing utilities providing Express app mocking and supertest-like interface. Minimal dependency implementation with `.send()` support and request body handling., - utils/runTestSuite.ts: Lightweight test runner for executing test suites without external dependencies. Provides assertion methods and test result reporting.

---

## [83] `lib/summary.md`
**Type:** Documentation
**Headings:** lib/ Directory Summary, Overview, Files and Their Roles, circuitBreaker.ts, errorHandling/, performanceTesting/, testGenerator.GenerateTest.test.ts, logUtils.ts (+10 more)
**Summary:** The `lib/` directory contains the core qtests framework functionality, including test generation, utilities, and TypeScript definitions., **Role**: Opossum-based circuit breaker implementation for production reliability, **Migration**: Replaced custom implementation with industry-standard Opossum library, **Key Features**:, - Event-driven architecture with comprehensive monitoring

---

## [84] `config/summary.md`
**Type:** Documentation
**Headings:** config/ Directory Summary, Overview, Files and Their Roles, jest.config.mjs, ts-jest-resolver.cjs, Known Side Effects, Scaling & Maintenance Notes
**Summary:** Houses shared tooling configuration for qtests, including Jest setup, path resolution helpers, and polyfills that align the test runner with project-wide stubbing rules., **Role**: Primary Jest configuration consumed by `qtests-runner.mjs` for all suites, **Responsibilities**: Enables ts-jest ESM pipeline, installs require polyfills, ignores `dist/` and `build/`, and preserves qtests setup ordering for stub resolution, **Request/Response Flows**: Receives test discovery from the runner → forwards transforms/ignores to Jest → produces executed test plans, **Role**: Custom resolver that retries TypeScript sources when a `.js` path is missing

---

## [85] `bin/summary.md`
**Type:** Documentation
**Headings:** bin/ Directory Summary, Overview, Files and Their Roles, qtests-generate (Primary CLI, backward-compatible alias: qtests-ts-generate), Known Side Effects, Edge Cases & Caveats, AI Agent Task Anchors
**Summary:** The `bin/` directory contains executable CLI tools for the qtests framework., **Role**: Command-line interface for generating automated TypeScript tests, **Key Features**:, - Supports multiple analysis modes: `heuristic` (default) and `ast` (TypeScript AST), - Scope: Integration tests only

---

### 🧩 Flow Group: [25] `Similarity-winston`
**Flow Type:** Similarity
**Files:** 3
**Entry Point:** stubs/winston.ts (roleScore 0)
**Dominant Dirs:** stubs (2), __mocks__ (1)
**Internal Deps:** 0

## [86] `stubs/winston.ts`
**Type:** Code File
**Exports:** FormatStub, LogEntry, LoggerOptions, LoggerStub, MockConsoleTransport, MockFileTransport, MockLogger, MockTimer (+5 more)
**Functions:** noop
**API Calls:** undefined.delete, undefined.get

---

## [87] `__mocks__/winston.js`
**Type:** Code File
**Functions:** createLogger, noop

---

## [88] `stubs/winston.d.ts`
**Type:** Code File
**Exports:** FormatStub, LogEntry, LoggerOptions, LoggerStub, MockConsoleTransport, MockFileTransport, MockLogger, MockTimer (+5 more)

---

### 🧩 Flow Group: [26] `Similarity-logging`
**Flow Type:** Similarity
**Files:** 3
**Entry Point:** lib/logUtils.ts (roleScore 4)
**Dominant Dirs:** lib (3)
**Internal Deps:** 0

## [89] `lib/logging.ts`
**Type:** Code File
**Imports:** crypto, events, os, winston
**Exports:** LogEntry, LogFormat, LogLevel, Logger, LoggerConfig, LoggerFactory, TracingSpan, default (+2 more)
**API Calls:** undefined.delete, undefined.get

---

## [90] `lib/logUtils.ts`
**Type:** Code File
**Imports:** util
**Exports:** executeWithLogs, logReturn, logStart, safeSerialize, setLogging
**Functions:** executeWithLogs, logReturn, logStart, safeSerialize, setLogging

---

## [91] `lib/loggingDecorators.ts`
**Type:** Code File
**Imports:** ./logging/index.js
**Exports:** DEFAULT_OPTIONS, Log, LogClass, LogEntry, LogErrors, LogMethod, LogPerformance, LoggingOptions (+2 more)

---

### 🧩 Flow Group: [27] `Similarity-package`
**Flow Type:** Similarity
**Files:** 3
**Entry Point:** demo/package.json (roleScore 0)
**Dominant Dirs:** demo (2), . (1)
**Internal Deps:** 0

## [92] `demo/package.json`
**Type:** Configuration/Data
**Keys:** name, private, version, description, type, scripts, dependencies, devDependencies

---

## [93] `package-lock.json`
**Type:** Configuration/Data
**Keys:** name, version, lockfileVersion, requires, packages

---

## [94] `demo/package-lock.json`
**Type:** Configuration/Data
**Keys:** name, version, lockfileVersion, requires, packages

---

### 🧩 Flow Group: [28] `Similarity-SUMMARY`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** demo/SUMMARY.md (roleScore 0)
**Dominant Dirs:** demo (1)
**Internal Deps:** 0

## [95] `demo/SUMMARY.md`
**Type:** Documentation
**Headings:** Summary: QTests MERN Demo, Files & Roles, Request/Response Flows, Known Side Effects, Edge Cases & Caveats, AI-Anchors
**Summary:** - server/app.js: Express app creation, middleware, and route mounting., - server/index.js: Server entry that binds to a port for manual runs., - server/routes/hello.js: Route `GET /api/hello` calling external service wrapper., - server/services/externalService.js: Wraps axios call; logs via winston (stubbed in tests)., - client/src/App.jsx: Minimal React component placeholder.

---

### 🧩 Flow Group: [29] `Similarity-tsconfig`
**Flow Type:** Similarity
**Files:** 4
**Entry Point:** tsconfig.json (roleScore 7)
**Dominant Dirs:** config (2), . (1), demo (1)
**Internal Deps:** 0

## [96] `tsconfig.json`
**Type:** Configuration/Data
**Keys:** compilerOptions, include, exclude

---

## [97] `demo/tsconfig.json`
**Type:** Configuration/Data
**Keys:** compilerOptions, include

---

## [98] `config/tsconfig.json`
**Type:** Configuration/Data
**Keys:** compilerOptions, include, exclude, ts-node

---

## [99] `config/tsconfig.jest.json`
**Type:** Configuration/Data
**Keys:** extends, compilerOptions, include, exclude

---

### 🧩 Flow Group: [30] `Similarity-opencode`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** opencode.json (roleScore 0)
**Dominant Dirs:** . (1)
**Internal Deps:** 0

## [100] `opencode.json`
**Type:** Configuration/Data
**Keys:** $schema, provider, model

---

### 🧩 Flow Group: [31] `Similarity-SECURITY`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** SECURITY.md (roleScore 0)
**Dominant Dirs:** . (1), docs (1)
**Internal Deps:** 0

## [101] `SECURITY.md`
**Type:** Documentation
**Headings:** Security Policy, Overview, 🛡️ Security Features, Input Validation & Sanitization, Code Injection Prevention, Dependency Security, Process Security, Information Disclosure Prevention (+14 more)
**Summary:** qtests v2.0.0 maintains enterprise-grade security posture with comprehensive defense-in-depth security measures to protect against common attack vectors in testing frameworks., - **Command Injection Prevention**: All external command execution uses allow-list validation and argument sanitization, - **Path Traversal Protection**: Dynamic module loading includes path validation to prevent directory traversal attacks, - **Environment Variable Security**: Restricted environment variable access with allow-list enforcement, - **Eval() Elimination**: No use of eval() or Function constructor with dynamic strings

---

## [102] `docs/SECURITY.md`
**Type:** Documentation
**Headings:** QTests Security Documentation, Overview, Security Architecture, Core Components, Security Features, 1. Input Validation & Sanitization, Module ID Validation, File Path Validation (+46 more)
**Summary:** QTests includes a comprehensive security framework designed to protect against common web application vulnerabilities and ensure secure testing practices. This document provides an overview of security features, best practices, and implementation guidelines., 1. **Security Monitor** (`lib/security/SecurityMonitor.ts`), - Runtime security event monitoring, - Anomaly detection and alerting, - Rate limiting and abuse prevention

---

### 🧩 Flow Group: [32] `Similarity-httpTest`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** utils/httpTest.ts (roleScore 0)
**Dominant Dirs:** utils (2)
**Internal Deps:** 0

## [103] `utils/httpTest.ts`
**Type:** Utility
**Exports:** createMockApp, supertest

---

## [104] `utils/httpTest.shim.ts`
**Type:** Utility
**Exports:** createMockApp, supertest
**Functions:** add, app, createMockApp, dispatch, finalHandler, finish, makeReq, qerrors (+1 more)
**API Calls:** routes.get

---

### 🧩 Flow Group: [33] `Similarity-loadTest`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/loadTest.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [105] `lib/loadTest.ts`
**Type:** Code File
**Imports:** events
**Exports:** LoadTestConfig, LoadTestResults, LoadTestRunner, LoadTestScenario, LoadTestScenarios, LoadTestStep, default
**Functions:** runActivity
**API Calls:** errorCounts.get, fetch.call

---

### 🧩 Flow Group: [34] `Similarity-envUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/envUtils.ts (roleScore 4)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [106] `lib/envUtils.ts`
**Type:** Code File
**Imports:** ../utils/offlineMode.js, ../utils/testEnv.js, ../utils/testHelpers.js
**Exports:** offlineMode, testEnv, testHelpers

---

### 🧩 Flow Group: [35] `Similarity-mongoose`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** __mocks__/mongoose.js (roleScore 0)
**Dominant Dirs:** __mocks__ (1)
**Internal Deps:** 0

## [107] `__mocks__/mongoose.js`
**Type:** Code File
**Functions:** createFallbackFn, f

---

### 🧩 Flow Group: [36] `Similarity-fileMock`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** __mocks__/fileMock.js (roleScore 0)
**Dominant Dirs:** __mocks__ (1)
**Internal Deps:** 0

## [108] `__mocks__/fileMock.js`
**Type:** Code File

---

### 🧩 Flow Group: [37] `Similarity-sendEmail`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/sendEmail.ts (roleScore 0)
**Dominant Dirs:** utils (1)
**Internal Deps:** 0

## [109] `utils/sendEmail.ts`
**Type:** Utility
**Imports:** ./email/emailFormatter.js, ./email/emailHistory.js, ./email/emailSender.js, ./email/emailValidator.js
**Exports:** BatchResult, EmailBatchItem, EmailData, EmailHistoryEntry, EmailOptions, EmailResponse, EmailResult, addToHistory (+6 more)

---

### 🧩 Flow Group: [38] `Similarity-broadcast`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** scripts/broadcast.sh (roleScore 0)
**Dominant Dirs:** scripts (1)
**Internal Deps:** 0

## [110] `scripts/broadcast.sh`
**Type:** Script
**Commands:** echo

---

### 🧩 Flow Group: [39] `Similarity-testUtils`
**Flow Type:** Similarity
**Files:** 3
**Entry Point:** lib/testUtils.ts (roleScore 4)
**Dominant Dirs:** lib (3)
**Internal Deps:** 0

## [111] `lib/testUtils.ts`
**Type:** Test File
**Imports:** ../utils/testHelpers.js, ../utils/testSuite.js
**Exports:** testHelpers, testSuite

---

## [112] `lib/testPolyfills.ts`
**Type:** Test File
**Imports:** ./polyfills/index.js
**Exports:** ClipboardAPI, IntersectionObserver, ResizeObserver, clipboard, getIntersectionObserver, getResizeObserver, initializePolyfills, matchMedia (+2 more)

---

## [113] `lib/testIsolation.ts`
**Type:** Test File
**Imports:** ./testIsolation/index.js
**Exports:** backupEnvironment, closeAllDbConnections, closeAllServers, default, registerMockRestore, restoreAllMocks, restoreEnvironment, setupJestIsolation (+4 more)

---

### 🧩 Flow Group: [40] `Similarity-httpUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/httpUtils.ts (roleScore 4)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [114] `lib/httpUtils.ts`
**Type:** Code File
**Imports:** ../utils/httpTest.js, ../utils/mockAxios.js, ../utils/offlineMode.js
**Exports:** httpTest, mockAxios, offlineMode

---

### 🧩 Flow Group: [41] `Similarity-dataUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/dataUtils.ts (roleScore 4)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [115] `lib/dataUtils.ts`
**Type:** Code File
**Imports:** ../utils/mockModels.js, ../utils/sendEmail.js
**Exports:** mockModels, sendEmail

---

### 🧩 Flow Group: [42] `Similarity-coreUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/coreUtils.ts (roleScore 4)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [116] `lib/coreUtils.ts`
**Type:** Code File
**Exports:** createFakeTimers, createMock, mockConsole, spyOnMethod, stubMethod

---

### 🧩 Flow Group: [43] `Similarity-styleMock`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** config/styleMock.js (roleScore 7)
**Dominant Dirs:** config (1)
**Internal Deps:** 0

## [117] `config/styleMock.js`
**Type:** Configuration

---

### 🧩 Flow Group: [44] `Similarity-qerrors-d`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** @types/qerrors.d.ts (roleScore 0)
**Dominant Dirs:** @types (1)
**Internal Deps:** 0

## [118] `@types/qerrors.d.ts`
**Type:** Code File
**Exports:** createError, createStandardError, createTypedError, default, qerror, qinfo, qwarn

---

### 🧩 Flow Group: [45] `Similarity-mockUtils`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** utils/testing/mockUtils.ts (roleScore 4)
**Dominant Dirs:** utils/testing (2)
**Internal Deps:** 0

## [119] `utils/testing/mockUtils.ts`
**Type:** Test File
**Exports:** createRestoreFunction, safeRestoreMock, safeRestoreMocks
**Functions:** createRestoreFunction, safeRestoreMock, safeRestoreMocks

---

## [120] `utils/testing/mockManager.ts`
**Type:** Test File
**Imports:** ../../lib/logUtils.js, ../helpers/safeExecution.js
**Exports:** MockManager
**Functions:** mockConsole, restore
**API Calls:** undefined.get

---

### 🧩 Flow Group: [46] `Similarity-dataTypes`
**Flow Type:** Similarity
**Files:** 3
**Entry Point:** utils/testing/databaseTestHelper.ts (roleScore 4)
**Dominant Dirs:** utils/testing (3)
**Internal Deps:** 0

## [121] `utils/testing/dataTypes.ts`
**Type:** Test File
**Exports:** ApiKey, LogEntry, User

---

## [122] `utils/testing/datasetFactory.ts`
**Type:** Test File
**Imports:** ../helpers/functionLogger.js, ./dataTypes.js, ./entityFactory.js
**Exports:** createTestDataset

---

## [123] `utils/testing/databaseTestHelper.ts`
**Type:** Test File
**Imports:** ../../lib/logUtils.js
**Exports:** DatabaseTestHelper

---

### 🧩 Flow Group: [47] `Similarity-utilities`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/stubbing/utilities.ts (roleScore 4)
**Dominant Dirs:** utils/stubbing (1)
**Internal Deps:** 0

## [124] `utils/stubbing/utilities.ts`
**Type:** Utility
**Imports:** ../../lib/errorHandling/index.js, ../helpers/safeExecution.js, sinon
**Exports:** getSinonLibrary, restoreAll
**Functions:** getSinonLibrary, restoreAll

---

### 🧩 Flow Group: [48] `Similarity-timeUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/timeUtils.ts (roleScore 4)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [125] `utils/helpers/timeUtils.ts`
**Type:** Utility
**Exports:** createFutureTimestamp, createIsoTimestamp, createLogTimestamp, createMockTimestamp, createTimestamp, getCurrentTimeMs
**Functions:** createFutureTimestamp, createIsoTimestamp, createLogTimestamp, createMockTimestamp, createTimestamp, getCurrentTimeMs

---

### 🧩 Flow Group: [49] `Similarity-jsonUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/jsonUtils.ts (roleScore 4)
**Dominant Dirs:** lib/utils (1)
**Internal Deps:** 0

## [126] `lib/utils/jsonUtils.ts`
**Type:** Utility
**Imports:** secure-json-parse
**Exports:** batchJSONOperation, default, extractJSONFields, parse, safeJSONClone, safeJSONEquals, safeJSONParse, safeJSONParseAsync (+5 more)
**Functions:** batchJSONOperation, extractJSONFields, safeJSONClone, safeJSONEquals, safeJSONParse, safeJSONParseAsync, safeJSONStringify, safeJSONStringifyAsync (+3 more)

---

### 🧩 Flow Group: [50] `Similarity-mockTypes`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/httpMock/mockUtilities.ts (roleScore 4)
**Dominant Dirs:** lib/httpMock (2)
**Internal Deps:** 0

## [127] `lib/httpMock/mockTypes.ts`
**Type:** Code File
**Exports:** AxiosResponse, MockHttpClient, MockHttpClientConfig, MockResponse, MockStrategy, RequestMatcher, UserMockAxios

---

## [128] `lib/httpMock/mockUtilities.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, ./mockTypes.js
**Exports:** createAxiosStyleResponse, createErrorResponse, createMockResponse
**Functions:** createAxiosStyleResponse, createErrorResponse, createMockResponse

---

### 🧩 Flow Group: [51] `Similarity-stubMethod`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/stubMethod.ts (roleScore 0)
**Dominant Dirs:** utils (1)
**Internal Deps:** 0

## [129] `utils/stubMethod.ts`
**Type:** Utility
**Imports:** ../lib/errorHandling/index.js, ./helpers/validation.js, sinon
**Exports:** SinonFakeTimers, SinonMock, SinonSpy, SinonStub, StubFunction, StubRestoreFunction, createFakeServer, createFakeXHR (+13 more)
**Functions:** createFakeServer, createFakeXHR, getSinonLibrary, stubMethod, verifyCallCount, verifyCalledOnce, verifyCalledWith

---

### 🧩 Flow Group: [52] `Similarity-mockModels`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** utils/mockModels.ts (roleScore 0)
**Dominant Dirs:** utils (2)
**Internal Deps:** 0

## [130] `utils/mockModels.ts`
**Type:** Utility
**Imports:** ./models/baseMockModel.js
**Exports:** ApiKey, ApiLog, BaseMockModel, createMockModel, default, resetAllCollections
**Functions:** createMockModel, resetAllCollections

---

## [131] `utils/mockConsole.ts`
**Type:** Utility
**Imports:** ../lib/errorHandling/index.js, ../lib/logUtils.js, ./console/consoleUtils.js, ./console/fallbackMocker.js, ./console/jestMocker.js
**Exports:** ConsoleMethod, ConsoleMockOptions, FallbackMock, JestSpy, MockSpy, consoleMocking, createFallbackMock, default (+10 more)
**Functions:** mockConsole

---

### 🧩 Flow Group: [53] `Similarity-index-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/index.test.js (roleScore 10)
**Dominant Dirs:** tests (1)
**Internal Deps:** 0

## [132] `tests/index.test.js`
**Type:** Test File
**Imports:** assert, sinon
**Exports:** UserService, fetchUserData, fetchUserWithCallback, processAsyncData, processComplexData, processUserData, processWithError, runTests (+1 more)
**Functions:** fetchUserData, fetchUserWithCallback, processAsyncData, processComplexData, processUserData, processWithError, runTests
**API Calls:** undefined.delete, undefined.get

---

### 🧩 Flow Group: [54] `Similarity-post-merge`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** scripts/post-merge.sh (roleScore 0)
**Dominant Dirs:** scripts (1)
**Internal Deps:** 0

## [133] `scripts/post-merge.sh`
**Type:** Script

---

### 🧩 Flow Group: [55] `Similarity-kill-agent`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** scripts/kill-agent.sh (roleScore 0)
**Dominant Dirs:** scripts (2)
**Internal Deps:** 0

## [134] `scripts/kill-agent.sh`
**Type:** Script
**Commands:** echo

---

## [135] `scripts/kill-all-agents.sh`
**Type:** Script
**Commands:** echo, find

---

### 🧩 Flow Group: [56] `Similarity-monitoring`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/monitoring.ts (roleScore 0)
**Dominant Dirs:** lib (1), lib/memory (1)
**Internal Deps:** 0

## [136] `lib/monitoring.ts`
**Type:** Code File
**Imports:** ../utils/helpers/envManager.js, ./circuitBreaker.js, events, os
**Exports:** Alert, AlertChannel, AlertThresholds, MonitoringConfig, MonitoringDashboard, MonitoringSystem, SystemMetrics, default (+1 more)
**API Calls:** fetch.call

---

## [137] `lib/memory/monitoringOrchestration.ts`
**Type:** Code File
**Imports:** ./leakDetector.js, ./snapshotManager.js
**Exports:** MemoryLeakDetector, MemorySnapshotManager, checkpointMemory, detectMemoryLeaks, endMemoryMonitoring, memoryMonitor, startMemoryMonitoring
**Functions:** checkpointMemory, detectMemoryLeaks, endMemoryMonitoring, startMemoryMonitoring

---

### 🧩 Flow Group: [57] `Similarity-PUBLISHING`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** docs/PUBLISHING.md (roleScore 0)
**Dominant Dirs:** docs (1)
**Internal Deps:** 0

## [138] `docs/PUBLISHING.md`
**Type:** Documentation
**Headings:** Publishing to npm, Installing the package, Release workflow, Manual release (optional), Post-publish checks
**Summary:** `qtests` is published as `@bijikyu/qtests` on the public npm registry. The `publishConfig` entry in `package.json` targets `https://registry.npmjs.org/` with public access automatically. Install with `npm install @bijikyu/qtests --save-dev` — no `.npmrc` scope configuration required.

---

### 🧩 Flow Group: [58] `Similarity-axiosMocks`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testEnv/axiosMocks.ts (roleScore 0)
**Dominant Dirs:** utils/testEnv (1)
**Internal Deps:** 0

## [139] `utils/testEnv/axiosMocks.ts`
**Type:** Test File
**Imports:** ../../lib/errorHandling/index.js, ./spyAttacher.js
**Exports:** createAxiosMock, resetMocks
**Functions:** createAxiosMock, createReplyBinder, resetMocks

---

### 🧩 Flow Group: [59] `Similarity-validation`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/validation.ts (roleScore 0)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [140] `utils/helpers/validation.ts`
**Type:** Utility
**Exports:** validateArray, validateFunction, validateObject, validateString
**Functions:** describeValue, validateArray, validateFunction, validateObject, validateString

---

### 🧩 Flow Group: [60] `Similarity-envManager`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/envManager.ts (roleScore 0)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [141] `utils/helpers/envManager.ts`
**Type:** Utility
**Imports:** dotenv
**Exports:** EnvBackup, backupEnvVars, configureEnv, dotenv, getEnvVar, handleSnapshotError, initializeDotenv, loadEnv (+3 more)
**Functions:** backupEnvVars, configureEnv, getEnvVar, handleSnapshotError, initializeDotenv, loadEnv, restoreEnvVars, snapshotEnv (+1 more)

---

### 🧩 Flow Group: [61] `Similarity-jestMocker`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/console/jestMocker.ts (roleScore 0)
**Dominant Dirs:** utils/console (1)
**Internal Deps:** 0

## [142] `utils/console/jestMocker.ts`
**Type:** Utility
**Imports:** ../../lib/errorHandling/index.js, ../../lib/logUtils.js
**Exports:** ConsoleMethod, ConsoleMockOptions, JestSpy, mockConsoleWithJest, tryCreateJestSpy
**Functions:** mockConsoleWithJest, tryCreateJestSpy

---

### 🧩 Flow Group: [62] `Similarity-httpClient`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/utils/httpClient.ts (roleScore 0)
**Dominant Dirs:** lib/utils (2)
**Internal Deps:** 0

## [143] `lib/utils/httpClient.ts`
**Type:** Utility
**Imports:** ../qerrorsFallback.js, ./agentFactory.js, axios
**Exports:** addMonitoringInterceptors, cleanup, createHttpClient, httpAgent, httpClient, httpsAgent
**Functions:** addMonitoringInterceptors, cleanup, createHttpClient
**API Calls:** axios.create

---

## [144] `lib/utils/httpMockFramework.ts`
**Type:** Utility
**Imports:** ../httpMock/mockTypes.js, ../httpMock/mockUtilities.js, ../utils/errorHandling.js, ../utils/timingUtils.js, msw, msw/node
**Exports:** BaseHttpMock, GraphQLHandler, MSWMock, RequestHandler, SharedMockConfig, createGraphQLMock, createMSWMock, createQtestsMock (+1 more)
**Functions:** createGraphQLMock, createMSWMock, createQtestsMock
**API Calls:** http.delete, http.get, http.patch, http.post, http.put, undefined.call, undefined.delete, undefined.get

---

### 🧩 Flow Group: [63] `Similarity-asyncUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/asyncUtils.ts (roleScore 4)
**Dominant Dirs:** lib/utils (1)
**Internal Deps:** 0

## [145] `lib/utils/asyncUtils.ts`
**Type:** Utility
**Exports:** AsyncOptions, BatchOptions, WorkflowResult, WorkflowStep, configure, createTimeout, debounce, executeWithCallback (+11 more)
**Functions:** checkCondition, configure, createTimeout, debounce, executeWithCallback, executeWorkflow, getConfig, getReadySteps (+10 more)

---

### 🧩 Flow Group: [64] `Similarity-jestWorker`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/runner/jestWorker.ts (roleScore 0)
**Dominant Dirs:** lib/runner (1)
**Internal Deps:** 0

## [146] `lib/runner/jestWorker.ts`
**Type:** Code File
**Imports:** jest, module, worker_threads
**Functions:** runWorker

---

### 🧩 Flow Group: [65] `Similarity-decorators`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/logging/decorators.ts (roleScore 0)
**Dominant Dirs:** lib/logging (2)
**Internal Deps:** 0

## [147] `lib/logging/decorators.ts`
**Type:** Code File
**Imports:** ../logUtils.js, ./decoratorTypes.js
**Exports:** Log, LogClass, LogEntry, LogErrors, LogMethod, LogPerformance
**Functions:** Log, LogClass, LogEntry, LogErrors, LogMethod, LogPerformance
**Components:** Log, LogClass, LogEntry, LogErrors, LogMethod, LogPerformance

---

## [148] `lib/logging/decoratorTypes.ts`
**Type:** Code File
**Exports:** DEFAULT_OPTIONS, LoggingOptions

---

### 🧩 Flow Group: [66] `Similarity-errorTypes`
**Flow Type:** Similarity
**Files:** 6
**Entry Point:** lib/errorHandling/errorTypes.ts (roleScore 0)
**Dominant Dirs:** lib/errorHandling (4), lib/utils (1), lib/fileSystem (1)
**Internal Deps:** 0

## [149] `lib/errorHandling/errorTypes.ts`
**Type:** Code File
**Exports:** ApiErrorWrapperOptions, AsyncErrorWrapperOptions, BatchErrorWrapperOptions, BatchProcessingResult, BatchResult, DatabaseErrorWrapperOptions, RouteErrorWrapperOptions, StructuredError (+2 more)

---

## [150] `lib/errorHandling/errorLogging.ts`
**Type:** Code File
**Exports:** safeAsyncExecute, safeExecute, withAsyncErrorLogging, withErrorLogging
**Functions:** qerrorsFallback, safeAsyncExecute, safeExecute, withAsyncErrorLogging, withErrorLogging

---

## [151] `lib/utils/errorHandling.ts`
**Type:** Utility
**Imports:** ../qerrorsFallback.js
**Exports:** ErrorContext, ErrorHandlingOptions, createErrorResponse, getErrorMessage, getErrorType, handleAsyncError, handleError, handleMemoryError (+4 more)
**Functions:** createErrorResponse, getErrorMessage, getErrorType, handleAsyncError, handleError, handleMemoryError, handlePerformanceError, handleSecurityError (+2 more)

---

## [152] `lib/fileSystem/errorHandling.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js
**Exports:** withFileErrorHandling
**Functions:** withFileErrorHandling

---

## [153] `lib/errorHandling/errorWrappers.ts`
**Type:** Code File
**Exports:** wrapWithErrorLogging, wrapWithSafeExecute
**Functions:** wrapWithErrorLogging, wrapWithSafeExecute

---

## [154] `lib/errorHandling/errorTransformation.ts`
**Type:** Code File
**Imports:** ./errorTypes.js
**Exports:** createStructuredError, transformMongoError
**Functions:** createStructuredError, transformMongoError

---

### 🧩 Flow Group: [67] `Similarity-jest-setup`
**Flow Type:** Similarity
**Files:** 4
**Entry Point:** demo/config/jest-setup.ts (roleScore 7)
**Dominant Dirs:** demo/config (2), . (1), demo (1)
**Internal Deps:** 0

## [155] `demo/config/jest-setup.ts`
**Type:** Configuration
**Imports:** @bijikyu/qtests/setup, @jest/globals

---

## [156] `demo/config/jest-setup.js`
**Type:** Configuration
**Imports:** module

---

## [157] `jest.config.js`
**Type:** Configuration
**Exports:** default

---

## [158] `demo/jest.config.js`
**Type:** Configuration

---

### 🧩 Flow Group: [68] `Similarity-spawn-agent`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** scripts/spawn-agent.sh (roleScore 0)
**Dominant Dirs:** scripts (1)
**Internal Deps:** 0

## [159] `scripts/spawn-agent.sh`
**Type:** Script
**Commands:** echo, mkdir, printf

---

### 🧩 Flow Group: [69] `Similarity-list-agents`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** scripts/list-agents.sh (roleScore 0)
**Dominant Dirs:** scripts (1)
**Internal Deps:** 0

## [160] `scripts/list-agents.sh`
**Type:** Script
**Commands:** echo, find

---

### 🧩 Flow Group: [70] `Similarity-scalableApi`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/scalableApi.ts (roleScore 0)
**Dominant Dirs:** lib (2)
**Internal Deps:** 0

## [161] `lib/scalableApi.ts`
**Type:** Code File
**Imports:** events, secure-json-parse
**Exports:** ApiMetrics, ApiRequestConfig, ApiResponse, ScalableApiClient, api, createScalableApiClient, default, defaultApiClient
**Functions:** createScalableApiClient
**API Calls:** fetch.call, undefined.delete, undefined.get

---

## [162] `lib/scalableDatabase.ts`
**Type:** Code File
**Imports:** events, os
**Exports:** DatabaseConfig, DatabaseMetrics, QueryOptions, QueryResult, ScalableDatabaseClient, createScalableDatabaseClient, default
**Functions:** createScalableDatabaseClient
**API Calls:** undefined.delete, undefined.get

---

### 🧩 Flow Group: [71] `Similarity-spyAttacher`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testEnv/spyAttacher.ts (roleScore 0)
**Dominant Dirs:** utils/testEnv (1)
**Internal Deps:** 0

## [163] `utils/testEnv/spyAttacher.ts`
**Type:** Test File
**Imports:** ../../lib/errorHandling/index.js
**Exports:** attachMockSpies, makeLoggedMock
**Functions:** attachMockSpies, makeLoggedMock

---

### 🧩 Flow Group: [72] `Similarity-mockFactory`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testEnv/mockFactory.ts (roleScore 0)
**Dominant Dirs:** utils/testEnv (1)
**Internal Deps:** 0

## [164] `utils/testEnv/mockFactory.ts`
**Type:** Test File
**Exports:** DEFAULT_MOCK_DATA, DEFAULT_TEST_CONFIG, MockNodemailerResult, MockNodemailerTransport, MockOpenAIResponse, MockOpenAIResult, MockWhoisResponse, MockWhoisResult (+17 more)

---

### 🧩 Flow Group: [73] `Similarity-apiLogModel`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** utils/models/apiLogModel.ts (roleScore 0)
**Dominant Dirs:** utils/models (2)
**Internal Deps:** 0

## [165] `utils/models/apiLogModel.ts`
**Type:** API/Route
**Imports:** ./baseMockModel.js
**Exports:** ApiLog, mockLogs

---

## [166] `utils/models/apiKeyModel.ts`
**Type:** API/Route
**Imports:** ./baseMockModel.js
**Exports:** ApiKey, mockApiKeys

---

### 🧩 Flow Group: [74] `Similarity-stringUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/stringUtils.ts (roleScore 4)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [167] `utils/helpers/stringUtils.ts`
**Type:** Utility
**Exports:** truncateForDisplay, truncateJsonString, truncateString, truncateStringSafe
**Functions:** truncateForDisplay, truncateJsonString, truncateString, truncateStringSafe

---

### 🧩 Flow Group: [75] `Similarity-qerrorsStub`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/qerrorsStub.ts (roleScore 0)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [168] `utils/helpers/qerrorsStub.ts`
**Type:** Utility
**Exports:** stubQerrors
**Functions:** stubQerrors

---

### 🧩 Flow Group: [76] `Similarity-emailSender`
**Flow Type:** Similarity
**Files:** 5
**Entry Point:** utils/email/emailSender.ts (roleScore 0)
**Dominant Dirs:** utils/email (5)
**Internal Deps:** 0

## [169] `utils/email/emailSender.ts`
**Type:** Utility
**Imports:** ../../lib/logUtils.js, ../helpers/stringUtils.js, ../helpers/timeUtils.js, ../helpers/validation.js, ./emailFormatter.js, ./emailHistory.js, ./emailValidator.js, crypto
**Exports:** BatchResult, EmailBatchItem, EmailHistoryEntry, EmailOptions, EmailResponse, addToHistory, formatEmailContent, sendEmail (+2 more)
**Functions:** sendEmail, sendEmailBatch

---

## [170] `utils/email/emailHistory.ts`
**Type:** Utility
**Imports:** ../../lib/logUtils.js
**Exports:** EmailHistoryEntry, addToHistory, clearEmailHistory, emailHistory, getEmailHistory
**Functions:** addToHistory, clearEmailHistory, getEmailHistory

---

## [171] `utils/email/emailTemplate.ts`
**Type:** Utility
**Imports:** ../../lib/logUtils.js
**Exports:** createEmailTemplate
**Functions:** createEmailTemplate

---

## [172] `utils/email/emailValidator.ts`
**Type:** Utility
**Imports:** ../../lib/logUtils.js
**Exports:** validateEmail
**Functions:** validateEmail

---

## [173] `utils/email/emailFormatter.ts`
**Type:** Utility
**Imports:** ../../lib/logUtils.js
**Exports:** formatEmailContent
**Functions:** formatEmailContent

---

### 🧩 Flow Group: [77] `Similarity-esm-globals`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/__mocks__/esm-globals.ts (roleScore 0)
**Dominant Dirs:** utils/__mocks__ (1)
**Internal Deps:** 0

## [174] `utils/__mocks__/esm-globals.ts`
**Type:** Utility
**Imports:** path, url
**Exports:** __dirname, __filename, getModuleDirname, getModuleFilename
**Functions:** getModuleDirname, getModuleFilename

---

### 🧩 Flow Group: [78] `Similarity-timingUtils`
**Flow Type:** Similarity
**Files:** 3
**Entry Point:** lib/utils/timingUtils.ts (roleScore 4)
**Dominant Dirs:** lib/utils (2), lib/utils/__tests__ (1)
**Internal Deps:** 0

## [175] `lib/utils/timingUtils.ts`
**Type:** Utility
**Imports:** ./errorHandling.js
**Exports:** PerformanceMetrics, PerformanceTracker, Timer, TimingResult, analyzePerformance, globalPerformanceTracker, measureAsyncTime, measureAsyncWithAnalysis (+3 more)
**Functions:** analyzePerformance, measureAsyncTime, measureAsyncWithAnalysis, measureTime, measureWithAnalysis, withTiming

---

## [176] `lib/utils/timerManager.ts`
**Type:** Utility
**Exports:** TimerManager, cleanupAllTimers, globalTimerManager, trackedInterval, trackedTimeout
**Functions:** cleanupAllTimers, trackedInterval, trackedTimeout
**API Calls:** undefined.delete

---

## [177] `lib/utils/__tests__/timingUtils.test.ts`
**Type:** Test File
**Imports:** ../timingUtils.js, @jest/globals

---

### 🧩 Flow Group: [79] `Similarity-mockManager`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/testIsolation/mockManager.ts (roleScore 0)
**Dominant Dirs:** lib/testIsolation (1)
**Internal Deps:** 0

## [178] `lib/testIsolation/mockManager.ts`
**Type:** Test File
**Exports:** cleanupIsolationState, registerMockRestore, restoreAllMocks
**Functions:** cleanupIsolationState, getIsolationState, registerMockRestore, restoreAllMocks

---

### 🧩 Flow Group: [80] `Similarity-resultTypes`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/runner/resultTypes.ts (roleScore 0)
**Dominant Dirs:** lib/runner (1)
**Internal Deps:** 0

## [179] `lib/runner/resultTypes.ts`
**Type:** Code File
**Imports:** ../security/types.js
**Exports:** FileResult, RunResult, SecuritySummary

---

### 🧩 Flow Group: [81] `Similarity-memoryTypes`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/memory/memoryTypes.ts (roleScore 0)
**Dominant Dirs:** lib/memory (2)
**Internal Deps:** 0

## [180] `lib/memory/memoryTypes.ts`
**Type:** Code File
**Exports:** MemoryDelta, MemorySnapshot

---

## [181] `lib/memory/memoryMonitoring.ts`
**Type:** Code File
**Exports:** MemoryLeakDetector, MemorySnapshotManager, aggressiveCleanup, checkpointMemory, cleanupWithMemoryTracking, detectMemoryLeaks, endMemoryMonitoring, memoryMonitor (+1 more)

---

### 🧩 Flow Group: [82] `Similarity-coreWrapper`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/logging/coreWrapper.ts (roleScore 0)
**Dominant Dirs:** lib/logging (1)
**Internal Deps:** 0

## [182] `lib/logging/coreWrapper.ts`
**Type:** Code File
**Imports:** ../logUtils.js, ../utils/timingUtils.js, ./decoratorTypes.js
**Exports:** withLogging
**Functions:** withLogging

---

### 🧩 Flow Group: [83] `Similarity-fileWriting`
**Flow Type:** Similarity
**Files:** 4
**Entry Point:** lib/fileSystem/fileWriting.ts (roleScore 0)
**Dominant Dirs:** lib/fileSystem (4)
**Internal Deps:** 0

## [183] `lib/fileSystem/fileWriting.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, fs-extra
**Exports:** ensureDir, ensureDirSync, fs, safeWriteFile, safeWriteFileSync
**Functions:** ensureDir, ensureDirSync, safeWriteFile, safeWriteFileSync

---

## [184] `lib/fileSystem/fileReading.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, fs-extra
**Exports:** fs, safeReadFile, safeReadFileBuffer, safeReadFileBufferSync, safeReadFileSync
**Functions:** safeReadFile, safeReadFileBuffer, safeReadFileBufferSync, safeReadFileSync

---

## [185] `lib/fileSystem/fileDeletion.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, fs-extra, path
**Exports:** fs, safeDelete, safeDeleteSync
**Functions:** getDirectorySize, getDirectorySizeSync, safeDelete, safeDeleteSync

---

## [186] `lib/fileSystem/fileExistence.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, fs-extra
**Exports:** fs, isDirectory, isDirectoryAsync, isFile, isFileAsync, safeExists, safeExistsAsync, safeStats (+1 more)
**Functions:** isDirectory, isDirectoryAsync, isFile, isFileAsync, safeExists, safeExistsAsync, safeStats, safeStatsAsync

---

### 🧩 Flow Group: [84] `Similarity-vite-config`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** demo/client/vite.config.ts (roleScore 7)
**Dominant Dirs:** demo/client (1)
**Internal Deps:** 0

## [187] `demo/client/vite.config.ts`
**Type:** Configuration
**Imports:** @vitejs/plugin-react, vite
**Exports:** default

---

### 🧩 Flow Group: [85] `Similarity-runTestSuite`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/runTestSuite.ts (roleScore 0)
**Dominant Dirs:** utils (1)
**Internal Deps:** 0

## [188] `utils/runTestSuite.ts`
**Type:** Utility
**Exports:** createAssertions, runTestSuite, runTestSuites
**Functions:** createAssertions, runTestSuite, runTestSuites

---

### 🧩 Flow Group: [86] `Similarity-qtestsConfig`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** config/qtestsConfig.ts (roleScore 7)
**Dominant Dirs:** config (1)
**Internal Deps:** 0

## [189] `config/qtestsConfig.ts`
**Type:** Test File
**Imports:** ../utils/helpers/envManager.js
**Exports:** qtestsApiFallback, qtestsConcurrency, qtestsDebugFile, qtestsFileWorkers, qtestsInband, qtestsNoDebugFile, qtestsPattern, qtestsSilent (+1 more)

---

### 🧩 Flow Group: [87] `Similarity-serviceMocks`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testEnv/serviceMocks.ts (roleScore 0)
**Dominant Dirs:** utils/testEnv (1)
**Internal Deps:** 0

## [190] `utils/testEnv/serviceMocks.ts`
**Type:** Test File
**Exports:** DEFAULT_MOCK_DATA, JestMockLike, MockNodemailerResult, MockNodemailerTransport, MockOpenAIResponse, MockOpenAIResult, MockWhoisResponse, MockWhoisResult (+6 more)
**Functions:** clearAllMocks, createMockNodemailer, createMockOpenAI, createMockWhois, getJestRef, setupManualMocks

---

### 🧩 Flow Group: [88] `Similarity-verification`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/stubbing/verification.ts (roleScore 0)
**Dominant Dirs:** utils/stubbing (1)
**Internal Deps:** 0

## [191] `utils/stubbing/verification.ts`
**Type:** Utility
**Imports:** sinon
**Exports:** verifyCallCount, verifyCalledOnce, verifyCalledWith
**Functions:** verifyCallCount, verifyCalledOnce, verifyCalledWith

---

### 🧩 Flow Group: [89] `Similarity-mockCreation`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/stubbing/mockCreation.ts (roleScore 0)
**Dominant Dirs:** utils/stubbing (1)
**Internal Deps:** 0

## [192] `utils/stubbing/mockCreation.ts`
**Type:** Utility
**Exports:** createFake, createFakeServer, createFakeXHR, createMock, stubMethod

---

### 🧩 Flow Group: [90] `Similarity-modelFactory`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/models/modelFactory.ts (roleScore 0)
**Dominant Dirs:** utils/models (1)
**Internal Deps:** 0

## [193] `utils/models/modelFactory.ts`
**Type:** Utility
**Imports:** ./apiKeyModel.js, ./apiLogModel.js, ./baseMockModel.js
**Exports:** clearCollection, createMockModel, getAllCollections, resetAllCollections
**Functions:** clearCollection, createMockModel, getAllCollections, resetAllCollections
**API Calls:** mockCollections.get

---

### 🧩 Flow Group: [91] `Similarity-mockResponse`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/http/mockResponse.ts (roleScore 0)
**Dominant Dirs:** utils/http (1)
**Internal Deps:** 0

## [194] `utils/http/mockResponse.ts`
**Type:** Utility
**Exports:** MockResponseOptions, createBadRequestResponse, createErrorResponse, createJsonResponse, createMockResponse, createNotFoundResponse, createSuccessResponse
**Functions:** createBadRequestResponse, createErrorResponse, createJsonResponse, createMockResponse, createNotFoundResponse, createSuccessResponse

---

### 🧩 Flow Group: [92] `Similarity-promiseUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/promiseUtils.ts (roleScore 4)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [195] `utils/helpers/promiseUtils.ts`
**Type:** Utility
**Exports:** createTimeout, promiseWithTimeout, withTimeout
**Functions:** createTimeout, promiseWithTimeout, withTimeout

---

### 🧩 Flow Group: [93] `Similarity-keyGenerator`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/keyGenerator.ts (roleScore 8)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [196] `utils/helpers/keyGenerator.ts`
**Type:** Utility
**Imports:** crypto
**Exports:** generateKey
**Functions:** generateKey

---

### 🧩 Flow Group: [94] `Similarity-consoleUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/console/consoleUtils.ts (roleScore 4)
**Dominant Dirs:** utils/console (1)
**Internal Deps:** 0

## [197] `utils/console/consoleUtils.ts`
**Type:** Utility
**Imports:** ../../lib/errorHandling/index.js, ../../lib/logUtils.js, ../testing/mockUtils.js, ./fallbackMocker.js, ./jestMocker.js
**Exports:** MockSpy, isMocked, mockAllConsole, registerMocked, restoreAllMocks, restoreMock, unregisterMocked, withAllMockedConsole (+1 more)
**Functions:** isMocked, mockAllConsole, registerMocked, restoreAllMocks, restoreMock, unregisterMocked, withAllMockedConsole, withMockConsole
**API Calls:** _mockedByUs.delete

---

### 🧩 Flow Group: [95] `Similarity-basicSchemas`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/validation/basicSchemas.ts (roleScore 0)
**Dominant Dirs:** lib/validation (1)
**Internal Deps:** 0

## [198] `lib/validation/basicSchemas.ts`
**Type:** Code File
**Exports:** basicSchemas, objectSchemas, schemaUtils, schemas, securitySchemas, validationHelpers, z

---

### 🧩 Flow Group: [96] `Similarity-agentFactory`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/agentFactory.ts (roleScore 0)
**Dominant Dirs:** lib/utils (1)
**Internal Deps:** 0

## [199] `lib/utils/agentFactory.ts`
**Type:** Utility
**Imports:** ../qerrorsFallback.js, [object Object], [object Object]
**Exports:** AgentConfig, createAgent, createHTTPAgent, createHTTPSAgent, createHighPerformanceConfig, createLowResourceConfig
**Functions:** createAgent, createHTTPAgent, createHTTPSAgent, createHighPerformanceConfig, createLowResourceConfig

---

### 🧩 Flow Group: [97] `Similarity-leakDetector`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/memory/leakDetector.ts (roleScore 0)
**Dominant Dirs:** lib/memory (1)
**Internal Deps:** 0

## [200] `lib/memory/leakDetector.ts`
**Type:** Code File
**Imports:** ../utils/errorHandling.js, ../utils/memoryManagement.js, ./snapshotManager.js
**Exports:** MemoryLeakDetector

---

### 🧩 Flow Group: [98] `Similarity-readingUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/fileSystem/readingUtils.ts (roleScore 4)
**Dominant Dirs:** lib/fileSystem (1)
**Internal Deps:** 0

## [201] `lib/fileSystem/readingUtils.ts`
**Type:** Code File
**Exports:** ensureDir, isDirectory, isFile, safeDelete, safeExists, safeReadFile, safeReadFileBuffer, safeStats (+2 more)

---

### 🧩 Flow Group: [99] `Similarity-send-to-agent`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** scripts/send-to-agent.sh (roleScore 0)
**Dominant Dirs:** scripts (1)
**Internal Deps:** 0

## [202] `scripts/send-to-agent.sh`
**Type:** Script
**Commands:** echo

---

### 🧩 Flow Group: [100] `Similarity-API-REFERENCE`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** docs/API_REFERENCE.md (roleScore 0)
**Dominant Dirs:** docs (1)
**Internal Deps:** 0

## [203] `docs/API_REFERENCE.md`
**Type:** Documentation
**Headings:** Complete API Reference, 📦 Core Exports, Main Entry Point (`qtests`), 🔧 Core Utilities, setup(), stubs, 🎭 Method Stubbing, stubMethod() (+32 more)
**Summary:** This comprehensive reference documents all qtests APIs, methods, and configuration options., Initialize qtests module stubbing and global configurations., **Effects**:, - Registers default module stubs for axios and winston while the module resolution hook provides a lightweight mongoose fallback, - Sets up module resolution hooks

---

### 🧩 Flow Group: [101] `Similarity-portAllocator`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testing/portAllocator.ts (roleScore 0)
**Dominant Dirs:** utils/testing (1)
**Internal Deps:** 0

## [204] `utils/testing/portAllocator.ts`
**Type:** Test File
**Imports:** ../../lib/qerrorsFallback.js, events, fs, net, path
**Exports:** PortAllocator, allocatePort, cleanupPortAllocator, default, portAllocator, releaseAllPorts, releasePort
**Functions:** allocatePort, cleanup, cleanupPortAllocator, releaseAllPorts, releasePort, setupProcessHandlers
**API Calls:** undefined.delete

---

### 🧩 Flow Group: [102] `Similarity-functionMocks`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testEnv/functionMocks.ts (roleScore 0)
**Dominant Dirs:** utils/testEnv (1)
**Internal Deps:** 0

## [205] `utils/testEnv/functionMocks.ts`
**Type:** Test File
**Imports:** ./spyAttacher.js
**Exports:** createQerrorsMock, createScheduleMock
**Functions:** createQerrorsMock, createScheduleMock

---

### 🧩 Flow Group: [103] `Similarity-safeExecution`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/safeExecution.ts (roleScore 0)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [206] `utils/helpers/safeExecution.ts`
**Type:** Utility
**Exports:** safeFunctionCall, safeGetProperty, safeMethodCall
**Functions:** safeFunctionCall, safeGetProperty, safeMethodCall

---

### 🧩 Flow Group: [104] `Similarity-serverManager`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/testIsolation/serverManager.ts (roleScore 0)
**Dominant Dirs:** lib/testIsolation (1)
**Internal Deps:** 0

## [207] `lib/testIsolation/serverManager.ts`
**Type:** Test File
**Imports:** ../qerrorsFallback.js
**Exports:** closeAllServers, trackServer
**Functions:** closeAllServers, getIsolationState, trackServer

---

### 🧩 Flow Group: [105] `Similarity-pathValidator`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/security/pathValidator.ts (roleScore 0)
**Dominant Dirs:** lib/security (1), lib/security/__tests__ (1)
**Internal Deps:** 0

## [208] `lib/security/pathValidator.ts`
**Type:** Code File
**Imports:** ../../utils/helpers/validation.js, fs, module, path
**Exports:** PathValidationOptions, VALIDATORS, createPathValidator, validateSecurePath, validateSecurePaths
**Functions:** createPathValidator, validateSecurePath, validateSecurePaths

---

## [209] `lib/security/__tests__/pathValidator.test.ts`
**Type:** Test File
**Imports:** ../pathValidator.js, @jest/globals, fs, path

---

### 🧩 Flow Group: [106] `Similarity-moduleCleanup`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/memory/moduleCleanup.ts (roleScore 0)
**Dominant Dirs:** lib/memory (1)
**Internal Deps:** 0

## [210] `lib/memory/moduleCleanup.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, module
**Exports:** clearModuleCache
**Functions:** clearModuleCache

---

### 🧩 Flow Group: [107] `Similarity-globalCleanup`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/memory/globalCleanup.ts (roleScore 0)
**Dominant Dirs:** lib/memory (1)
**Internal Deps:** 0

## [211] `lib/memory/globalCleanup.ts`
**Type:** Code File
**Exports:** clearGlobalRefs, quickCleanup
**Functions:** cleanupAndResolve, cleanupSingleRef, clearGlobalRefs, quickCleanup

---

### 🧩 Flow Group: [108] `Similarity-winstonLogger`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/logging/winstonLogger.ts (roleScore 0)
**Dominant Dirs:** lib/logging (1)
**Internal Deps:** 0

## [212] `lib/logging/winstonLogger.ts`
**Type:** Code File
**Imports:** ../../utils/helpers/envManager.js, winston, winston-daily-rotate-file
**Exports:** WinstonConfig, WinstonLoggerManager, createLabeledLogger, default, defaultLogger, logDebug, logError, logInfo (+3 more)
**Functions:** createLabeledLogger, logDebug, logError, logInfo, logWarning

---

### 🧩 Flow Group: [109] `Similarity-basicWrappers`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/logging/basicWrappers.ts (roleScore 0)
**Dominant Dirs:** lib/logging (1), lib/errorHandling (1)
**Internal Deps:** 0

## [213] `lib/logging/basicWrappers.ts`
**Type:** Code File
**Exports:** logFunction, logPerformance, withLogging

---

## [214] `lib/errorHandling/basicWrappers.ts`
**Type:** Code File
**Exports:** createAsyncErrorWrapper, createRouteErrorWrapper, createStructuredError, createSyncErrorWrapper, logError, transformMongoError

---

### 🧩 Flow Group: [110] `Similarity-modernMSWMock`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/httpMock/modernMSWMock.ts (roleScore 0)
**Dominant Dirs:** lib/httpMock (1)
**Internal Deps:** 0

## [215] `lib/httpMock/modernMSWMock.ts`
**Type:** Code File
**Imports:** ./mockTypes.js, ./mockUtilities.js, module
**Exports:** ModernMSWMock
**API Calls:** http.delete, http.get, http.patch, http.post, http.put

---

### 🧩 Flow Group: [111] `Similarity-qtests-results`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** qtests-results.json (roleScore 0)
**Dominant Dirs:** . (1)
**Internal Deps:** 0

## [216] `qtests-results.json`
**Type:** Configuration/Data
**Keys:** schemaVersion, timestamp, totalDurationMs, passedFiles, failedFiles, files, securitySummary

---

### 🧩 Flow Group: [112] `Similarity-routeTestUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/routeTestUtils.ts (roleScore 4)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [217] `lib/routeTestUtils.ts`
**Type:** API/Route
**Exports:** RouteTestConfig, TestResult, createDeleteRouteTest, createGetRouteTest, createMultipleRouteTests, createPostRouteTest, createPutRouteTest, createResourceTests (+3 more)
**Functions:** add, app, createDeleteRouteTest, createErrorResponse, createErrorRouteApp, createGetRouteTest, createMockApp, createMultipleRouteTests (+12 more)
**API Calls:** request.delete, request.get, request.post, request.put, routes.get

---

### 🧩 Flow Group: [113] `Similarity-memoryPressure`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/memoryPressure.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [218] `lib/memoryPressure.ts`
**Type:** Code File
**Imports:** events, os
**Exports:** MemoryPressureConfig, MemoryPressureEvent, MemoryPressureMonitor, MemoryStats, default, memoryMonitor

---

### 🧩 Flow Group: [114] `Similarity-connectionPool`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/connectionPool.ts (roleScore 0)
**Dominant Dirs:** lib (2)
**Internal Deps:** 0

## [219] `lib/connectionPool.ts`
**Type:** Code File
**Imports:** events
**Exports:** AdvancedConnectionPool, CircuitState, ConnectionPoolOptions, Factory, PoolStats, createConnectionPool, default
**Functions:** createConnectionPool

---

## [220] `lib/connectionPoolHealth.md`
**Type:** Documentation
**Headings:** Connection Pool Health Monitoring, Overview, Features, Core Classes, ConnectionPoolHealthMonitor, Constructor, Key Methods, Configuration Options (+16 more)
**Summary:** This directory contains health monitoring functionality for connection pools in the qtests library., The `connectionPoolHealth.ts` module provides comprehensive health monitoring capabilities for `AdvancedConnectionPool` instances. It includes periodic validation, automatic replacement of stale connections, and detailed health event reporting., - **Periodic Health Checks**: Configurable interval-based validation of all connections (default: 30 seconds), - **Automatic Connection Replacement**: Replaces unhealthy connections after configurable failure thresholds, - **Concurrent Validation**: Validates connections in parallel with configurable concurrency limits

---

### 🧩 Flow Group: [115] `Similarity-cleanupManager`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/cleanupManager.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [221] `lib/cleanupManager.ts`
**Type:** Code File
**Imports:** events
**Exports:** CleanupManager, CleanupManagerConfig, CleanupMetrics, CleanupTask, createCleanupManager, default, globalCleanupManager
**Functions:** createCleanupManager
**API Calls:** componentTasks.delete, undefined.delete, undefined.get

---

### 🧩 Flow Group: [116] `Similarity-circuitBreaker`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/circuitBreaker.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [222] `lib/circuitBreaker.ts`
**Type:** Code File
**Imports:** events, opossum
**Exports:** CircuitBreaker, CircuitBreakerOptions, CircuitBreakerRegistry, CircuitBreakerStats, CircuitState, Options, circuitBreakerRegistry, createCircuitBreaker (+5 more)
**Functions:** createCircuitBreaker, executeWithCircuitBreaker, getCircuitBreakerStats, getCurrentState, resetCircuitBreaker, withCircuitBreaker
**API Calls:** undefined.get

---

### 🧩 Flow Group: [117] `Similarity-networkMocking`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/stubbing/networkMocking.ts (roleScore 0)
**Dominant Dirs:** utils/stubbing (1)
**Internal Deps:** 0

## [223] `utils/stubbing/networkMocking.ts`
**Type:** Utility
**Imports:** ../../lib/errorHandling/index.js, sinon
**Exports:** createFakeServer, createFakeXHR
**Functions:** createFakeServer, createFakeXHR

---

### 🧩 Flow Group: [118] `Similarity-responseMocker`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/responseMocker.ts (roleScore 0)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [224] `utils/helpers/responseMocker.ts`
**Type:** Utility
**Imports:** ../http/mockResponse.js
**Exports:** createJsonRes, createRes
**Functions:** createJsonRes, createRes

---

### 🧩 Flow Group: [119] `Similarity-moduleReloader`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/moduleReloader.ts (roleScore 0)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [225] `utils/helpers/moduleReloader.ts`
**Type:** Utility
**Imports:** ../esm-globals.js, path
**Exports:** moduleReloadLock, reload
**Functions:** getModuleDirnameForReloader, reload
**API Calls:** moduleReloadLock.delete

---

### 🧩 Flow Group: [120] `Similarity-functionLogger`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/functionLogger.ts (roleScore 0)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [226] `utils/helpers/functionLogger.ts`
**Type:** Utility
**Imports:** ../../lib/logUtils.js
**Exports:** logClassMethods, withLogging
**Functions:** logClassMethods, withLogging

---

### 🧩 Flow Group: [121] `Similarity-safeOperations`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/fileSystem/safeOperations.ts (roleScore 0)
**Dominant Dirs:** utils/fileSystem (1)
**Internal Deps:** 0

## [227] `utils/fileSystem/safeOperations.ts`
**Type:** Utility
**Imports:** fs/promises, path
**Exports:** safeDeleteDirectory, safeDeleteFile, safePathExists, safeReadFile, safeWriteFile
**Functions:** safeDeleteDirectory, safeDeleteFile, safePathExists, safeReadFile, safeWriteFile

---

### 🧩 Flow Group: [122] `Similarity-fallbackMocker`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/console/fallbackMocker.ts (roleScore 0)
**Dominant Dirs:** utils/console (1)
**Internal Deps:** 0

## [228] `utils/console/fallbackMocker.ts`
**Type:** Utility
**Imports:** ../../lib/errorHandling/index.js, ../../lib/logUtils.js, ./jestMocker.js
**Exports:** FallbackMock, createFallbackMock, mockConsoleWithFallback
**Functions:** createFallbackMock, mockConsoleWithFallback, mockedMethod

---

### 🧩 Flow Group: [123] `Similarity-streamingUtils`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/utils/streamingUtils.ts (roleScore 4)
**Dominant Dirs:** lib/utils (2)
**Internal Deps:** 0

## [229] `lib/utils/streamingUtils.ts`
**Type:** Utility
**Imports:** ../qerrorsFallback.js, fs, path, stream, stream/promises
**Exports:** FileChunk, FileTransform, StreamOptions, copyFileStream, countLines, default, getFileSize, readFileChunks (+5 more)
**Functions:** calculateAdaptiveChunkSize, copyFileStream, countLines, getFileSize, readFileChunks, readFileStream, searchInFile, shouldUseStreaming (+2 more)

---

## [230] `lib/utils/structuredLogger.ts`
**Type:** Utility
**Exports:** LogEntry, LogLevel, StructuredLoggerOptions, log, logger

---

### 🧩 Flow Group: [124] `Similarity-commonPatterns`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/commonPatterns.ts (roleScore 0)
**Dominant Dirs:** lib/utils (1)
**Internal Deps:** 0

## [231] `lib/utils/commonPatterns.ts`
**Type:** Utility
**Imports:** ./errorHandling.js
**Exports:** arrays, asyncCommon, common, conditionals, environment, logging, objects, performance (+3 more)

---

### 🧩 Flow Group: [125] `Similarity-summaryHelpers`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/security/summaryHelpers.ts (roleScore 4)
**Dominant Dirs:** lib/security (1)
**Internal Deps:** 0

## [232] `lib/security/summaryHelpers.ts`
**Type:** Code File
**Imports:** ./types.js, fs, path
**Exports:** SecurityCategoryInfo, SecuritySummary, formatSecurityCategory, readSecuritySummary
**Functions:** formatSecurityCategory, readSecuritySummary

---

### 🧩 Flow Group: [126] `Similarity-wrapperFactory`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/errorHandling/wrapperFactory.ts (roleScore 0)
**Dominant Dirs:** lib/errorHandling (1)
**Internal Deps:** 0

## [233] `lib/errorHandling/wrapperFactory.ts`
**Type:** Code File
**Imports:** ./errorTypes.js
**Exports:** createAsyncErrorWrapper, createRouteErrorWrapper, createSyncErrorWrapper
**Functions:** createAsyncErrorWrapper, createRouteErrorWrapper, createSyncErrorWrapper

---

### 🧩 Flow Group: [127] `Similarity-security-report`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** security-report.md (roleScore 0)
**Dominant Dirs:** . (2)
**Internal Deps:** 0

## [234] `security-report.md`
**Type:** Documentation
**Headings:** QTests Security Test Report, Executive Summary, Test Results Overview, Critical Issues, Detailed Results, Regression Tests, Summary, Test Details (+6 more)
**Summary:** **Generated:** 2026-04-19T07:50:53.556Z, **Execution Time:** 77ms, **Coverage Threshold:** 95%, **Actual Coverage:** 100.0% ✅, This security test suite ran **10** tests with a **100.0%** pass rate.

---

## [235] `security-summary.json`
**Type:** Configuration/Data
**Keys:** regression, penetration, configuration

---

### 🧩 Flow Group: [128] `Similarity-enhancedTesting`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/enhancedTesting.ts (roleScore 0)
**Dominant Dirs:** utils (1)
**Internal Deps:** 0

## [236] `utils/enhancedTesting.ts`
**Type:** Utility
**Imports:** ../lib/qerrorsFallback.js, ./helpers/promiseUtils.js
**Exports:** EnhancedTestConfig, EnhancedTestingPatterns, TestMetrics, createEnhancedTest, default
**Functions:** createEnhancedTest, createTestRunner, getMemoryUsage

---

### 🧩 Flow Group: [129] `Similarity-qerrorsFallback`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/qerrorsFallback.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [237] `lib/qerrorsFallback.ts`
**Type:** Code File
**Exports:** default
**Functions:** qerrors

---

### 🧩 Flow Group: [130] `Similarity-TROUBLESHOOTING`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** docs/TROUBLESHOOTING.md (roleScore 0)
**Dominant Dirs:** docs (1)
**Internal Deps:** 0

## [238] `docs/TROUBLESHOOTING.md`
**Type:** Documentation
**Headings:** Troubleshooting Guide, 🔧 Installation & Setup Issues, Module Resolution Problems, TypeScript Configuration Issues, 🧪 Test Execution Issues, Stub Not Working, Environment Variable Issues, Asynchronous Test Issues (+25 more)
**Summary:** This comprehensive guide addresses common issues, troubleshooting steps, and solutions for qtests users., **Issue**: Cannot resolve qtests imports, **Solutions**:, 1. **Check Build Status**: Ensure you're using the built version, 2. **Use Dist Path**: Import from compiled distribution

---

### 🧩 Flow Group: [131] `Similarity-testDataFactory`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testing/testDataFactory.ts (roleScore 0)
**Dominant Dirs:** utils/testing (1)
**Internal Deps:** 0

## [239] `utils/testing/testDataFactory.ts`
**Type:** Test File
**Imports:** ./datasetFactory.js, ./entityFactory.js, ./httpDataFactory.js
**Exports:** ApiKey, EntityFactory, LogEntry, PortAllocator, TestDataFactory, User, allocatePort, cleanupPortAllocator (+22 more)

---

### 🧩 Flow Group: [132] `Similarity-jestSetupHelper`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testing/jestSetupHelper.ts (roleScore 4)
**Dominant Dirs:** utils/testing (1)
**Internal Deps:** 0

## [240] `utils/testing/jestSetupHelper.ts`
**Type:** Test File
**Exports:** clearJestMocks, configureJestGlobals, getJestRef
**Functions:** clearJestMocks, configureJestGlobals, getJestRef

---

### 🧩 Flow Group: [133] `Similarity-httpDataFactory`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testing/httpDataFactory.ts (roleScore 0)
**Dominant Dirs:** utils/testing (1)
**Internal Deps:** 0

## [241] `utils/testing/httpDataFactory.ts`
**Type:** Test File
**Imports:** ../../lib/logUtils.js
**Exports:** createHttpRequest, createHttpResponse
**Functions:** createHttpRequest, createHttpResponse

---

### 🧩 Flow Group: [134] `Similarity-assertionHelper`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testing/assertionHelper.ts (roleScore 4)
**Dominant Dirs:** utils/testing (1)
**Internal Deps:** 0

## [242] `utils/testing/assertionHelper.ts`
**Type:** Test File
**Imports:** ../../lib/logUtils.js, ../../lib/qerrorsFallback.js, ../email/emailHistory.js, ../helpers/validation.js
**Exports:** AssertionHelper

---

### 🧩 Flow Group: [135] `Similarity-timerManagement`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/stubbing/timerManagement.ts (roleScore 0)
**Dominant Dirs:** utils/stubbing (1)
**Internal Deps:** 0

## [243] `utils/stubbing/timerManagement.ts`
**Type:** Utility
**Imports:** ../../lib/errorHandling/index.js, sinon
**Exports:** SinonFakeTimers, createFakeClock, createFakeTimers, restoreTimers
**Functions:** createFakeClock, createFakeTimers, restoreTimers

---

### 🧩 Flow Group: [136] `Similarity-arrayProcessing`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/helpers/arrayProcessing.ts (roleScore 0)
**Dominant Dirs:** utils/helpers (1)
**Internal Deps:** 0

## [244] `utils/helpers/arrayProcessing.ts`
**Type:** Utility
**Imports:** ./validation.js
**Exports:** ArrayProcessingResult, processArrayWithValidation, processArrayWithValidationAsync
**Functions:** processArrayWithValidation, processArrayWithValidationAsync

---

### 🧩 Flow Group: [137] `Similarity-runner-cli-test`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** tests/integration/runner-cli.test.js (roleScore 0)
**Dominant Dirs:** tests/integration (2)
**Internal Deps:** 0

## [245] `tests/integration/runner-cli.test.js`
**Type:** Test File
**Imports:** child_process, fs, path
**Functions:** makeTempDir, minimalJestConfigMjs, runRunner, writeFile

---

## [246] `tests/integration/runner-results-file.test.js`
**Type:** Test File
**Imports:** child_process, fs, path
**Functions:** makeTempDir, minimalJestConfigMjs, runMjsRunner, scaffoldProject, writeFile

---

### 🧩 Flow Group: [138] `Similarity-httpClient-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/httpClient.test.ts (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [247] `tests/integration/httpClient.test.ts`
**Type:** Test File
**Imports:** ../../lib/utils/httpClient.js, [object Object], [object Object], axios
**Functions:** lastRequestHandler, lastResponseHandler, makeConfig

---

### 🧩 Flow Group: [139] `Similarity-validationTypes`
**Flow Type:** Similarity
**Files:** 4
**Entry Point:** lib/validation/validationTypes.ts (roleScore 0)
**Dominant Dirs:** lib/validation (4)
**Internal Deps:** 0

## [248] `lib/validation/validationTypes.ts`
**Type:** Code File
**Imports:** zod
**Exports:** ValidationConfig, ValidationResult, ZodError, ZodSchema

---

## [249] `lib/validation/validationLogic.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, ./streamingValidationLogic.js, ./validationTypes.js, zod
**Exports:** createValidationMiddleware, validateWithZod
**Functions:** createValidationMiddleware, getCircuitBreakerState, incrementCircuitBreakerFailure, resetCircuitBreaker, validateWithZod
**API Calls:** circuitBreakerState.delete, circuitBreakerState.get, validationCache.get

---

## [250] `lib/validation/validationSchemas.ts`
**Type:** Code File
**Imports:** ./validationTypes.js, zod
**Exports:** commonSchemas, createQueryStringSchema, createSecureObjectSchema, createSecureStringSchema, defaultValidationConfig
**Functions:** createQueryStringSchema, createSecureObjectSchema, createSecureStringSchema

---

## [251] `lib/validation/validationMiddleware.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, ./streamingValidator.js
**Exports:** streamingValidationMiddleware
**Functions:** streamingValidationMiddleware

---

### 🧩 Flow Group: [140] `Similarity-databaseManager`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/testIsolation/databaseManager.ts (roleScore 0)
**Dominant Dirs:** lib/testIsolation (1)
**Internal Deps:** 0

## [252] `lib/testIsolation/databaseManager.ts`
**Type:** Test File
**Imports:** ../qerrorsFallback.js
**Exports:** closeAllDbConnections, trackDbConnection
**Functions:** closeAllDbConnections, getIsolationState, trackDbConnection

---

### 🧩 Flow Group: [141] `Similarity-snapshotManager`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/memory/snapshotManager.ts (roleScore 0)
**Dominant Dirs:** lib/memory (1)
**Internal Deps:** 0

## [253] `lib/memory/snapshotManager.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, ./memoryTypes.js, perf_hooks
**Exports:** MemorySnapshotManager

---

### 🧩 Flow Group: [142] `Similarity-serverFactories`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/httpMock/serverFactories.ts (roleScore 0)
**Dominant Dirs:** lib/httpMock (1)
**Internal Deps:** 0

## [254] `lib/httpMock/serverFactories.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, ./mockTypes.js, module
**Exports:** createCustomMockServer
**Functions:** createCustomMockServer
**API Calls:** http.undefined

---

### 🧩 Flow Group: [143] `Similarity-enhancedMSWMock`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/httpMock/enhancedMSWMock.ts (roleScore 0)
**Dominant Dirs:** lib/httpMock (1)
**Internal Deps:** 0

## [255] `lib/httpMock/enhancedMSWMock.ts`
**Type:** Code File
**Exports:** MSWMock, createGraphQLMock, createMSWMock, createQtestsMock, mockUtils

---

### 🧩 Flow Group: [144] `Similarity-clientFactories`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/httpMock/clientFactories.ts (roleScore 0)
**Dominant Dirs:** lib/httpMock (1)
**Internal Deps:** 0

## [256] `lib/httpMock/clientFactories.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, ./advancedMSWMock.js, ./legacyAxiosImplementation.js, ./mockTypes.js, ./modernMSWMock.js, ./userConfigurableAxiosMock.js
**Exports:** createMockHttpClient, createSimpleMockClient, createUserConfigurableMock
**Functions:** createMockHttpClient, createSimpleMockClient, createUserConfigurableMock

---

### 🧩 Flow Group: [145] `Similarity-advancedMSWMock`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/httpMock/advancedMSWMock.ts (roleScore 0)
**Dominant Dirs:** lib/httpMock (1)
**Internal Deps:** 0

## [257] `lib/httpMock/advancedMSWMock.ts`
**Type:** Code File
**Imports:** ../utils/httpMockFramework.js
**Exports:** MSWMock, createMSWMock, createModernUserConfigurableMock, mockUtils
**Functions:** createModernUserConfigurableMock

---

### 🧩 Flow Group: [146] `Similarity-managementUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/fileSystem/managementUtils.ts (roleScore 4)
**Dominant Dirs:** lib/fileSystem (1)
**Internal Deps:** 0

## [258] `lib/fileSystem/managementUtils.ts`
**Type:** Code File
**Imports:** ../../lib/qerrorsFallback.js, fs-extra
**Exports:** cleanDirectory, createTempDir, default, ensureDir, ensureDirSync, fs, safeCopy, safeDelete (+7 more)
**Functions:** cleanDirectory, createTempDir, ensureDir, ensureDirSync, safeCopy, safeDelete, safeDeleteSync, safeMove (+5 more)

---

### 🧩 Flow Group: [147] `Similarity-runner-jest-args`
**Flow Type:** Similarity
**Files:** 6
**Entry Point:** config/runner-jest-args.json (roleScore 7)
**Dominant Dirs:** config (4), . (1), demo (1)
**Internal Deps:** 0

## [259] `runner-jest-args.json`
**Type:** Configuration/Data
**Keys:** 0, 1, 2, 3, 4, 5

---

## [260] `demo/runner-jest-args.json`
**Type:** Configuration/Data
**Keys:** 0, 1, 2, 3, 4, 5

---

## [261] `config/runner-jest-args.json`
**Type:** Configuration/Data
**Keys:** 0, 1, 2, 3, 4, 5

---

## [262] `config/runner-args-debug.json`
**Type:** Configuration/Data
**Keys:** 0, 1, 2, 3, 4, 5, 6

---

## [263] `config/runner-jest-args-5.json`
**Type:** Configuration/Data
**Keys:** 0, 1, 2, 3, 4, 5

---

## [264] `config/runner-jest-args-2.json`
**Type:** Configuration/Data
**Keys:** 0, 1, 2, 3, 4, 5, 6

---

### 🧩 Flow Group: [148] `Similarity-writeSummaryFile`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** scripts/writeSummaryFile.ts (roleScore 0)
**Dominant Dirs:** scripts (1)
**Internal Deps:** 0

## [265] `scripts/writeSummaryFile.ts`
**Type:** Code File
**Imports:** ../lib/security/types.js, fs, path
**Exports:** SecurityResult, writeSummaryFile
**Functions:** writeSummaryFile

---

### 🧩 Flow Group: [149] `Similarity-waitForCondition`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/waitForCondition.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [266] `lib/waitForCondition.ts`
**Type:** Code File
**Imports:** ./qerrorsFallback.js
**Exports:** WaitForConditionOptions, default, waitForCondition
**Functions:** safeQerrors, waitForCondition

---

### 🧩 Flow Group: [150] `Similarity-integration-test`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** demo/integration-test.js (roleScore 0)
**Dominant Dirs:** demo (1), tests (1)
**Internal Deps:** 0

## [267] `demo/integration-test.js`
**Type:** Test File

---

## [268] `tests/integration-testing.test.js`
**Type:** Test File
**Imports:** assert, sinon
**Exports:** OrderService, PaymentService, UserService, runIntegrationTests
**Functions:** runIntegrationTests
**API Calls:** undefined.get

---

### 🧩 Flow Group: [151] `Similarity-fileSystemConfig`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** config/fileSystemConfig.ts (roleScore 7)
**Dominant Dirs:** config (1)
**Internal Deps:** 0

## [269] `config/fileSystemConfig.ts`
**Type:** Configuration
**Exports:** allowedFileExtensions, blockedPatterns, buildDirectory, configDirectory, distDirectory, libDirectory, maxFilePathLength, maxInputLength (+3 more)

---

### 🧩 Flow Group: [152] `Similarity-rateLimiter-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/rateLimiter.test.js (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [270] `tests/integration/rateLimiter.test.js`
**Type:** Test File

---

### 🧩 Flow Group: [153] `Similarity-mockConsole-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/mockConsole.test.js (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [271] `tests/integration/mockConsole.test.js`
**Type:** Test File
**Imports:** ../../dist/utils/mockConsole.js

---

### 🧩 Flow Group: [154] `Similarity-memory-benchmark`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** scripts/benchmarks/memory-benchmark.js (roleScore 0)
**Dominant Dirs:** scripts/benchmarks (2)
**Internal Deps:** 0

## [272] `scripts/benchmarks/memory-benchmark.js`
**Type:** Code File
**Imports:** ../../dist/lib/memoryPressure.js, ../../dist/lib/performanceMonitor.js

---

## [273] `scripts/benchmarks/memory-benchmark-simple.js`
**Type:** Code File
**Imports:** ../../dist/lib/memory/snapshotManager.js, perf_hooks

---

### 🧩 Flow Group: [155] `Similarity-htmlSanitization`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/validation/htmlSanitization.ts (roleScore 0)
**Dominant Dirs:** lib/validation (1)
**Internal Deps:** 0

## [274] `lib/validation/htmlSanitization.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js
**Exports:** dangerousPatterns, escapeHtml, hasDangerousPatterns, sanitizeString
**Functions:** escapeHtml, hasDangerousPatterns, sanitizeString

---

### 🧩 Flow Group: [156] `Similarity-memoryManagement`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/memoryManagement.ts (roleScore 0)
**Dominant Dirs:** lib/utils (1)
**Internal Deps:** 0

## [275] `lib/utils/memoryManagement.ts`
**Type:** Utility
**Imports:** ./errorHandling.js
**Exports:** CleanupOptions, MemoryAnalysisOptions, MemoryMonitor, MemorySnapshot, analyzeMemoryGrowth, calculateMemoryDelta, formatMemoryDelta, formatMemorySnapshot (+3 more)
**Functions:** analyzeMemoryGrowth, calculateGrowthConsistency, calculateMemoryDelta, clearGlobalReferences, clearModuleCache, formatMemoryDelta, formatMemorySnapshot, getMemorySnapshot (+2 more)

---

### 🧩 Flow Group: [157] `Similarity-concurrencyUtils`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/utils/configurationFramework.ts (roleScore 7)
**Dominant Dirs:** lib/utils (2)
**Internal Deps:** 0

## [276] `lib/utils/concurrencyUtils.ts`
**Type:** Utility
**Imports:** p-queue
**Exports:** PQueue, Semaphore, adaptiveConcurrency, debounce, default, limitedPromiseAll, limitedPromiseAllSettled, rateLimitedPromiseAll (+3 more)
**Functions:** adaptiveConcurrency, debounce, limitedPromiseAll, limitedPromiseAllSettled, processBatch, processTask, rateLimitedPromiseAll, rollingConcurrency (+2 more)

---

## [277] `lib/utils/configurationFramework.ts`
**Type:** Utility
**Imports:** ../../utils/fileSystem/safeOperations.js
**Exports:** ConfigSchema, Configuration, ConfigurationManager, MergeOptions, commonSchemas, configUtils
**Functions:** flattenSchema
**API Calls:** ConfigurationManager.get, undefined.delete, undefined.get

---

### 🧩 Flow Group: [158] `Similarity-advancedWrappers`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/logging/advancedWrappers.ts (roleScore 0)
**Dominant Dirs:** lib/logging (1), lib/errorHandling (1)
**Internal Deps:** 0

## [278] `lib/logging/advancedWrappers.ts`
**Type:** Code File
**Imports:** ./basicWrappers.js, ./decoratorTypes.js, ./decorators.js
**Exports:** createCustomLogger, wrapObject
**Functions:** createCustomLogger, wrapObject

---

## [279] `lib/errorHandling/advancedWrappers.ts`
**Type:** Code File
**Imports:** ./errorTypes.js
**Exports:** createApiErrorWrapper, createBatchErrorWrapper, createDatabaseErrorWrapper, createFileErrorWrapper, createTimeoutErrorWrapper
**Functions:** createApiErrorWrapper, createBatchErrorWrapper, createDatabaseErrorWrapper, createFileErrorWrapper, createTimeoutErrorWrapper

---

### 🧩 Flow Group: [159] `Similarity-fallbackHandlers`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/errorHandling/fallbackHandlers.ts (roleScore 0)
**Dominant Dirs:** lib/errorHandling (1)
**Internal Deps:** 0

## [280] `lib/errorHandling/fallbackHandlers.ts`
**Type:** Code File
**Exports:** withAsyncFallback, withFallback
**Functions:** withAsyncFallback, withFallback

---

### 🧩 Flow Group: [160] `Similarity-simple-index-test`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** tests/simple-index.test.js (roleScore 10)
**Dominant Dirs:** tests (1), scripts (1)
**Internal Deps:** 0

## [281] `tests/simple-index.test.js`
**Type:** Test File
**Imports:** assert, sinon
**Exports:** UserService, processUserData, runSimpleTests
**Functions:** fetchUserWithCallback, originalFetchUserData, processUserData, runSimpleTests
**API Calls:** undefined.get

---

## [282] `scripts/simple-scalability-test.js`
**Type:** Test File
**Functions:** simulateRequest
**API Calls:** activeRequests.delete

---

### 🧩 Flow Group: [161] `Similarity-jestConfigFactory`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/jestConfigFactory.ts (roleScore 7)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [283] `lib/jestConfigFactory.ts`
**Type:** Code File
**Imports:** @jest/types
**Exports:** JestConfigOptions, ProjectType, createCoverageConfig, createDemoConfig, createJavaScriptConfig, createJestConfig, createMinimalConfig, createReactConfig (+4 more)
**Functions:** createCoverageConfig, createDemoConfig, createJavaScriptConfig, createJestConfig, createMinimalConfig, createReactConfig, createTypeScriptCJSConfig, createTypeScriptESMConfig

---

### 🧩 Flow Group: [162] `Similarity-ADVANCED-FEATURES`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** docs/ADVANCED_FEATURES.md (roleScore 0)
**Dominant Dirs:** docs (1)
**Internal Deps:** 0

## [284] `docs/ADVANCED_FEATURES.md`
**Type:** Documentation
**Headings:** Advanced Features Documentation, 🔄 Error Handling System, Core Error Handling Functions, Error Handling Options, 🔗 Circuit Breaker Implementation, Circuit Breaker Setup, Circuit Breaker Events, 📊 Connection Pool Health Monitoring (+14 more)
**Summary:** This document covers advanced qtests features that require detailed configuration or have complex use cases., The error handling system provides comprehensive error management with context preservation, fallback mechanisms, and integration with monitoring systems., | Option | Type | Default | Description |, |--------|------|----------|-------------|, | `logToConsole` | boolean | true | Log errors to console |

---

### 🧩 Flow Group: [163] `Similarity-round24-bugs-test`
**Flow Type:** Similarity
**Files:** 13
**Entry Point:** tests/integration/routeTestUtils.test.js (roleScore 4)
**Dominant Dirs:** tests/integration (13)
**Internal Deps:** 0

## [285] `tests/integration/round24-bugs.test.ts`
**Type:** Test File
**Imports:** ../../utils/console/consoleUtils.js, ../../utils/console/fallbackMocker.js

---

## [286] `tests/integration/round21-bugs.test.ts`
**Type:** Test File
**Imports:** ../../dist/lib/errorHandling/errorTransformation.js, ../../dist/lib/errorHandling/fallbackHandlers.js, ../../dist/lib/errorHandling/wrapperFactory.js, ../../dist/utils/email/emailHistory.js, ../../dist/utils/helpers/arrayProcessing.js, ../../dist/utils/helpers/envManager.js, ../../dist/utils/helpers/promiseUtils.js, ../../dist/utils/helpers/safeExecution.js (+7 more)
**Functions:** fn

---

## [287] `tests/integration/round20-bugs.test.ts`
**Type:** Test File
**Imports:** ../../dist/lib/httpUtils.js, ../../dist/lib/stubs.js, ../../dist/lib/testUtils.js, ../../dist/lib/validation/htmlSanitization.js, ../../dist/lib/validation/legacyStreamingValidator.js, ../../dist/lib/validation/streamingValidationLogic.js, ../../dist/lib/validation/streamingValidator.js, ../../dist/lib/validation/validationLogic.js (+2 more)

---

## [288] `tests/integration/round19-bugs.test.ts`
**Type:** Test File
**Imports:** ../../dist/lib/dataUtils.js, ../../dist/lib/errorHandling/advancedWrappers.js, ../../dist/lib/errorHandling/errorLogging.js, ../../dist/lib/logging/advancedWrappers.js, ../../dist/lib/logging/coreWrapper.js, ../../dist/lib/memoryPressure.js, ../../dist/lib/mockSystem.js, ../../dist/lib/waitForCondition.js
**API Calls:** mockRegistry.get

---

## [289] `tests/integration/round18-bugs.test.ts`
**Type:** Test File
**Imports:** ../../dist/lib/testIsolation.js, ../../dist/lib/utils/commonPatterns.js, ../../dist/lib/utils/importExportUtils.js, ../../dist/lib/utils/structuredLogger.js, ../../dist/lib/utils/testIsolationFramework.js, ../../dist/lib/utils/validationSchemas.js

---

## [290] `tests/integration/round17-bugs.test.ts`
**Type:** Test File
**Imports:** path
**Functions:** load
**API Calls:** mock.delete, mock.get, mock.post, mock.put

---

## [291] `tests/integration/round16-bugs.test.ts`
**Type:** Test File
**Imports:** path
**Functions:** load
**API Calls:** c.get

---

## [292] `tests/integration/round15-bugs.test.ts`
**Type:** Test File
**Imports:** fs/promises, os, path
**Functions:** load

---

## [293] `tests/integration/round14-bugs.test.ts`
**Type:** Test File
**Imports:** fs/promises, os, path
**Functions:** load
**API Calls:** ConfigurationManager.get

---

## [294] `tests/integration/round13-bugs.test.ts`
**Type:** Test File
**Imports:** @jest/globals
**Functions:** load
**API Calls:** c.get

---

## [295] `tests/integration/round12-bugs.test.ts`
**Type:** Test File
**Imports:** @jest/globals
**Functions:** load

---

## [296] `tests/integration/round11-bugs.test.ts`
**Type:** Test File
**API Calls:** client.get, client.post, m.get

---

## [297] `tests/integration/routeTestUtils.test.js`
**Type:** Test File
**Imports:** ../../dist/lib/routeTestUtils.js

---

### 🧩 Flow Group: [164] `Similarity-generate-cli-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/generate-cli.test.js (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [298] `tests/integration/generate-cli.test.js`
**Type:** Test File
**Imports:** child_process, fs, os, path
**Functions:** makeIsolatedTempDir, makeRepoTempDir, runGenerate, writeJson

---

### 🧩 Flow Group: [165] `Similarity-agentFactory-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/agentFactory.test.ts (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [299] `tests/integration/agentFactory.test.ts`
**Type:** Test File
**Imports:** ../../lib/utils/agentFactory.js, [object Object], [object Object]

---

### 🧩 Flow Group: [166] `Similarity-validationSchemas`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/validationSchemas.ts (roleScore 0)
**Dominant Dirs:** lib/utils (1)
**Internal Deps:** 0

## [300] `lib/utils/validationSchemas.ts`
**Type:** Utility
**Imports:** ../validation/htmlSanitization.js, ./errorHandling.js, zod
**Exports:** basicSchemas, objectSchemas, schemaUtils, schemas, securitySchemas, validationHelpers, z

---

### 🧩 Flow Group: [167] `Similarity-importExportUtils`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/importExportUtils.ts (roleScore 4)
**Dominant Dirs:** lib/utils (1)
**Internal Deps:** 0

## [301] `lib/utils/importExportUtils.ts`
**Type:** Utility
**Exports:** barrelExports, commonReExports, createConditionalExports, createGroupedExports, createNamespace, createReExport, exportConfig, exportTypes (+3 more)
**Functions:** createConditionalExports, createGroupedExports, createNamespace, createReExport, flatten, mergeExports

---

### 🧩 Flow Group: [168] `Similarity-SecurityValidator`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/security/SecurityValidator.ts (roleScore 0)
**Dominant Dirs:** lib/security (2)
**Internal Deps:** 0

## [302] `lib/security/SecurityValidator.ts`
**Type:** Code File
**Imports:** ./JoiSecurityValidator.js, secure-json-parse
**Exports:** SanitizeOptions, SecurityValidator, ValidationResult, ValidationRule, joiSecurityValidator, securityValidator, validateCommand, validateEmail (+6 more)
**Functions:** validateInput, validateJSON, validateModuleId, validatePath
**API Calls:** undefined.get

---

## [303] `lib/security/SecurityTestingFramework.ts`
**Type:** Code File
**Imports:** ./SecurityValidator.js
**Exports:** PenetrationTester, SecurityRegressionTester, SecurityTestCase, SecurityTestResult, generateSecurityTestReport, penetrationTester, runFullSecurityTest, securityRegressionTester
**Functions:** generateSecurityTestReport, runFullSecurityTest

---

### 🧩 Flow Group: [169] `Similarity-clipboardPolyfill`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/polyfills/clipboardPolyfill.ts (roleScore 0)
**Dominant Dirs:** lib/polyfills (1)
**Internal Deps:** 0

## [304] `lib/polyfills/clipboardPolyfill.ts`
**Type:** Code File
**Exports:** ClipboardSpies, setupClipboard
**Functions:** setupClipboard

---

### 🧩 Flow Group: [170] `Similarity-garbageCollection`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/memory/garbageCollection.ts (roleScore 0)
**Dominant Dirs:** lib/memory (1)
**Internal Deps:** 0

## [305] `lib/memory/garbageCollection.ts`
**Type:** Code File
**Imports:** os
**Exports:** forceGC, getGCMetrics, isUnderMemoryPressure, smartGC
**Functions:** forceGC, getGCMetrics, isUnderMemoryPressure, smartGC

---

### 🧩 Flow Group: [171] `Similarity-cleanupOperations`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/memory/cleanupOperations.ts (roleScore 0)
**Dominant Dirs:** lib/memory (1)
**Internal Deps:** 0

## [306] `lib/memory/cleanupOperations.ts`
**Type:** Code File
**Imports:** ../utils/errorHandling.js, ../utils/memoryManagement.js, ./garbageCollection.js, ./globalCleanup.js, ./moduleCleanup.js, ./monitoringOrchestration.js
**Exports:** aggressiveCleanup, cleanupWithMemoryTracking
**Functions:** aggressiveCleanup, cleanupWithMemoryTracking

---

### 🧩 Flow Group: [172] `Similarity-timerManager-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/__tests__/timerManager.test.ts (roleScore 0)
**Dominant Dirs:** lib/utils/__tests__ (1)
**Internal Deps:** 0

## [307] `lib/utils/__tests__/timerManager.test.ts`
**Type:** Test File
**Imports:** ../timerManager.js, @jest/globals

---

### 🧩 Flow Group: [173] `Similarity-streamingValidator`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/streamingValidator.ts (roleScore 0)
**Dominant Dirs:** lib (1), lib/validation (1)
**Internal Deps:** 0

## [308] `lib/streamingValidator.ts`
**Type:** Code File
**Imports:** ./validation/basicSchemas.js
**Exports:** StreamingStringValidator, ValidationConfig, ValidationResult, createStreamingValidator, dangerousPatterns, default, defaultValidator, escapeHtml (+14 more)

---

## [309] `lib/validation/streamingValidator.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, ./htmlSanitization.js, zod
**Exports:** StreamingStringValidator, ValidationConfig, ValidationResult, createStreamingValidator, default, defaultValidator, relaxedValidator, strictValidator
**Functions:** createStreamingValidator
**API Calls:** undefined.delete, undefined.get

---

### 🧩 Flow Group: [174] `Similarity-performanceMonitor`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/performanceMonitor.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [310] `lib/performanceMonitor.ts`
**Type:** Code File
**Imports:** events, os
**Exports:** AlertThresholds, PerformanceMetrics, PerformanceMonitor, PerformanceMonitorOptions

---

### 🧩 Flow Group: [175] `Similarity-secure-express-app`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** examples/secure-express-app.ts (roleScore 0)
**Dominant Dirs:** examples (1)
**Internal Deps:** 0

## [311] `examples/secure-express-app.ts`
**Type:** Code File

---

### 🧩 Flow Group: [176] `Similarity-createMockApp-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/createMockApp.test.js (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [312] `tests/integration/createMockApp.test.js`
**Type:** Test File
**API Calls:** app.get, app.post, undefined.get, undefined.post
**Routes:** GET /boom, GET /crash, GET /guarded, GET /order, GET /ping, GET /plain, GET /search, GET /secure (+3 more)

---

### 🧩 Flow Group: [177] `Similarity-api-endpoints-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/api-endpoints.test.js (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [313] `tests/integration/api-endpoints.test.js`
**Type:** Test File
**Imports:** ../../dist/utils/httpTest.js
**Functions:** add, addHistory, app, calculate, createApiClient, createParamApp, json, resetState (+1 more)
**API Calls:** api.delete, api.get, api.patch, api.post, api.put, app.delete, app.get, app.post (+5 more)
**Routes:** DELETE /api/history, DELETE /api/users/:id, GET /api/calculator/health, GET /api/hello, GET /api/history, GET /api/status, GET /api/users, GET /api/users/:id (+7 more)

---

### 🧩 Flow Group: [178] `Similarity-environmentManager`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/testIsolation/environmentManager.ts (roleScore 0)
**Dominant Dirs:** lib/testIsolation (1)
**Internal Deps:** 0

## [314] `lib/testIsolation/environmentManager.ts`
**Type:** Test File
**Imports:** ../qerrorsFallback.js
**Exports:** backupEnvironment, restoreEnvironment
**Functions:** backupEnvironment, getIsolationState, restoreEnvironment

---

### 🧩 Flow Group: [179] `Similarity-mediaQueryPolyfill`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/polyfills/mediaQueryPolyfill.ts (roleScore 0)
**Dominant Dirs:** lib/polyfills (1)
**Internal Deps:** 0

## [315] `lib/polyfills/mediaQueryPolyfill.ts`
**Type:** Code File
**Exports:** MockMediaQueryList, setupMatchMedia
**Functions:** setupMatchMedia

---

### 🧩 Flow Group: [180] `Similarity-testDiscoveryCache`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/optimization/testDiscoveryCache.ts (roleScore 0)
**Dominant Dirs:** lib/optimization (1)
**Internal Deps:** 0

## [316] `lib/optimization/testDiscoveryCache.ts`
**Type:** Test File
**Imports:** events, fs, path
**Exports:** TestDiscoveryCache, testDiscoveryCache
**API Calls:** undefined.delete, undefined.get

---

### 🧩 Flow Group: [181] `Similarity-simpleErrorLogging`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/errorHandling/simpleErrorLogging.ts (roleScore 0)
**Dominant Dirs:** lib/errorHandling (1)
**Internal Deps:** 0

## [317] `lib/errorHandling/simpleErrorLogging.ts`
**Type:** Code File
**Imports:** ./errorTypes.js
**Exports:** logError
**Functions:** logError

---

### 🧩 Flow Group: [182] `Similarity-errorHandling-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/__tests__/errorHandling.test.ts (roleScore 0)
**Dominant Dirs:** lib/utils/__tests__ (1)
**Internal Deps:** 0

## [318] `lib/utils/__tests__/errorHandling.test.ts`
**Type:** Test File
**Imports:** ../errorHandling.js, @jest/globals, qerrors

---

### 🧩 Flow Group: [183] `Similarity-test-utilities-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/test-utilities.test.js (roleScore 4)
**Dominant Dirs:** tests (1)
**Internal Deps:** 0

## [319] `tests/test-utilities.test.js`
**Type:** Test File
**Imports:** assert, sinon
**Exports:** AssertionHelpers, MockFactory, TestDataBuilder, TestDataGenerators, TestEnvironmentManager, TestScenarioRunner, runTestUtilitiesTests
**Functions:** runTestUtilitiesTests
**API Calls:** undefined.get

---

### 🧩 Flow Group: [184] `Similarity-config-local-vars-d`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** @types/config-local-vars.d.ts (roleScore 7)
**Dominant Dirs:** @types (1)
**Internal Deps:** 0

## [320] `@types/config-local-vars.d.ts`
**Type:** Configuration
**Exports:** allowedFileExtensions, allowedOrigins, blockedPatterns, buildDirectory, configDirectory, debugMode, defaultHttpTimeout, defaultRetryAttempts (+44 more)

---

### 🧩 Flow Group: [185] `Similarity-securitySuite2-test`
**Flow Type:** Similarity
**Files:** 4
**Entry Point:** tests/integration/securitySuite2.test.js (roleScore 0)
**Dominant Dirs:** tests/integration (4)
**Internal Deps:** 0

## [321] `tests/integration/securitySuite2.test.js`
**Type:** Test File
**Imports:** ../../dist/lib/security/SecurityValidator.js

---

## [322] `tests/integration/securityTesting.test.js`
**Type:** Test File
**Imports:** ../../dist/lib/security/JoiSecurityValidator.js, ../../dist/lib/security/SecurityTestingFramework.js

---

## [323] `tests/integration/securitySummary.test.ts`
**Type:** Test File
**Imports:** ../../dist/scripts/writeSummaryFile.js, ../../lib/security/summaryHelpers.js, child_process, fs, path
**Functions:** makeTempDir, runRunner, stripAnsi

---

## [324] `tests/integration/securityValidator.test.js`
**Type:** Test File
**Imports:** ../../dist/lib/security/SecurityTestingFramework.js, ../../dist/lib/security/SecurityValidator.js

---

### 🧩 Flow Group: [186] `Similarity-fileSystemFramework`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/fileSystemFramework.ts (roleScore 0)
**Dominant Dirs:** lib/utils (1)
**Internal Deps:** 0

## [325] `lib/utils/fileSystemFramework.ts`
**Type:** Utility
**Imports:** ./errorHandling.js, ./timingUtils.js, fs-extra
**Exports:** FileOperationOptions, FileOperationResult, FileStats, FileSystemOperations, ensureDir, ensureDirSync, fileSystemUtils, safeReadFile (+1 more)
**Functions:** ensureDirSync

---

### 🧩 Flow Group: [187] `Similarity-convenienceWrappers`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/logging/convenienceWrappers.ts (roleScore 0)
**Dominant Dirs:** lib/logging (1)
**Internal Deps:** 0

## [326] `lib/logging/convenienceWrappers.ts`
**Type:** Code File
**Imports:** ./coreWrapper.js, ./decoratorTypes.js
**Exports:** logFunction, logPerformance
**Functions:** logFunction, logPerformance

---

### 🧩 Flow Group: [188] `Similarity-placeholderWrappers`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/errorHandling/placeholderWrappers.ts (roleScore 0)
**Dominant Dirs:** lib/errorHandling (1)
**Internal Deps:** 0

## [327] `lib/errorHandling/placeholderWrappers.ts`
**Type:** Code File
**Imports:** ./errorTypes.js
**Exports:** createApiErrorWrapper, createAsyncErrorWrapper, createBatchErrorWrapper, createDatabaseErrorWrapper, createFileErrorWrapper, createRouteErrorWrapper, createStructuredError, createSyncErrorWrapper (+3 more)
**Functions:** createApiErrorWrapper, createAsyncErrorWrapper, createBatchErrorWrapper, createDatabaseErrorWrapper, createFileErrorWrapper, createRouteErrorWrapper, createStructuredError, createSyncErrorWrapper (+3 more)

---

### 🧩 Flow Group: [189] `Similarity-security-test-runner`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** scripts/security-test-runner.ts (roleScore 0)
**Dominant Dirs:** scripts (1)
**Internal Deps:** 0

## [328] `scripts/security-test-runner.ts`
**Type:** Test File
**Imports:** ./writeSummaryFile.js, fs, path, url
**Exports:** SecurityTestRunner
**Functions:** main, resolveSecurityImport

---

### 🧩 Flow Group: [190] `Similarity-rateLimiter-flexible`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/rateLimiter-flexible.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [329] `lib/rateLimiter-flexible.ts`
**Type:** Code File
**Exports:** DistributedRateLimiter, InMemoryRateLimiter, RateLimitConfig, RateLimitResult, RateLimitStats, RateLimiterAbstract, RateLimiterMemory, RateLimiterRedis (+7 more)

---

### 🧩 Flow Group: [191] `Similarity-JoiSecurityValidator`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/security/JoiSecurityValidator.ts (roleScore 0)
**Dominant Dirs:** lib/security (1)
**Internal Deps:** 0

## [330] `lib/security/JoiSecurityValidator.ts`
**Type:** Code File
**Imports:** joi
**Exports:** JoiSecurityValidator, SanitizeOptions, ValidationResult, joiSecurityValidator, validateCommand, validateEmail, validateInput, validateJSON (+4 more)
**Functions:** checkForOperators, validateCommand, validateEmail, validateInput, validateJSON, validateModuleId, validatePath, validateURL (+1 more)
**API Calls:** undefined.get

---

### 🧩 Flow Group: [192] `Similarity-polyfillOrchestrator`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/polyfills/polyfillOrchestrator.ts (roleScore 0)
**Dominant Dirs:** lib/polyfills (1)
**Internal Deps:** 0

## [331] `lib/polyfills/polyfillOrchestrator.ts`
**Type:** Code File
**Imports:** ./clipboardPolyfill.js, ./intersectionObserverPolyfill.js, ./mediaQueryPolyfill.js, ./resizeObserverPolyfill.js
**Exports:** setupAllPolyfills
**Functions:** setupAllPolyfills

---

### 🧩 Flow Group: [193] `Similarity-pRetryTimeoutWrapper`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/errorHandling/pRetryTimeoutWrapper.ts (roleScore 0)
**Dominant Dirs:** lib/errorHandling (1)
**Internal Deps:** 0

## [332] `lib/errorHandling/pRetryTimeoutWrapper.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js
**Exports:** EnhancedErrorHandler, ErrorHandlingOptions, RetryOptions, TimeoutOptions, default, getAbortError, getPRetry, getPTimeout (+6 more)
**Functions:** getAbortError, getPRetry, getPTimeout, safeExecute, withAsyncErrorLogging, withErrorLogging, withFallback, withRetry (+2 more)

---

### 🧩 Flow Group: [194] `Similarity-performanceTestHelper`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testing/performanceTestHelper.ts (roleScore 4)
**Dominant Dirs:** utils/testing (1)
**Internal Deps:** 0

## [333] `utils/testing/performanceTestHelper.ts`
**Type:** Test File
**Imports:** ../../lib/logUtils.js
**Exports:** PerformanceTestHelper

---

### 🧩 Flow Group: [195] `Similarity-integrationTestHelper`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** utils/testing/integrationTestHelper.ts (roleScore 4)
**Dominant Dirs:** utils/testing (1)
**Internal Deps:** 0

## [334] `utils/testing/integrationTestHelper.ts`
**Type:** Test File
**Imports:** ../../lib/errorHandling/pRetryTimeoutWrapper.js, axios
**Exports:** RequestOptions, TimedAxiosResponse, cleanupTestData, createTimedAxios, default, getNextCounter, initializeTestData, makeRequest (+3 more)
**Functions:** cleanupTestData, createTimedAxios, getNextCounter, initializeTestData, makeAttempt, makeRequest, waitForPort, waitForServer
**API Calls:** axios.create

---

### 🧩 Flow Group: [196] `Similarity-resolveStubPaths-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/resolveStubPaths.test.ts (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [335] `tests/integration/resolveStubPaths.test.ts`
**Type:** Test File
**Imports:** path
**Functions:** getStubPath

---

### 🧩 Flow Group: [197] `Similarity-isolationOrchestrator`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/testIsolation/isolationOrchestrator.ts (roleScore 0)
**Dominant Dirs:** lib/testIsolation (1)
**Internal Deps:** 0

## [336] `lib/testIsolation/isolationOrchestrator.ts`
**Type:** Test File
**Imports:** ../memory/index.js, ./databaseManager.js, ./environmentManager.js, ./mockManager.js, ./serverManager.js
**Exports:** setupJestIsolation, setupTestIsolation, teardownTestIsolation
**Functions:** getIsolationState, setupJestIsolation, setupTestIsolation, teardownTestIsolation

---

### 🧩 Flow Group: [198] `Similarity-ENTERPRISE-INTEGRATION`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** docs/ENTERPRISE_INTEGRATION.md (roleScore 0)
**Dominant Dirs:** docs (1)
**Internal Deps:** 0

## [337] `docs/ENTERPRISE_INTEGRATION.md`
**Type:** Documentation
**Headings:** Enterprise Integration Guide, 🏢 Enterprise Setup, Repository Structure, Package.json Configuration, 🔄 CI/CD Integration, GitHub Actions Enterprise Workflow, .github/workflows/enterprise-tests.yml, Jenkins Declarative Pipeline (+26 more)
**Summary:** This guide covers enterprise-level integration patterns, best practices, and operational considerations for using qtests in production environments., - **Separate concerns**: Unit, integration, e2e, and performance tests in separate directories, - **Environment parity**: Test environments should mirror production as closely as possible, - **Data management**: Use fixtures and factories for test data, avoid hardcoded values, - **Parallel execution**: Configure appropriate worker counts for different test types

---

### 🧩 Flow Group: [199] `Similarity-httpMock-modernMSWMock`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** __mocks__/httpMock-modernMSWMock.js (roleScore 0)
**Dominant Dirs:** __mocks__ (2)
**Internal Deps:** 0

## [338] `__mocks__/httpMock-modernMSWMock.js`
**Type:** Code File

---

## [339] `__mocks__/httpMock-serverFactories.js`
**Type:** Code File

---

### 🧩 Flow Group: [200] `Similarity-testIsolationFramework`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** lib/utils/testIsolationFramework.ts (roleScore 0)
**Dominant Dirs:** lib/utils (1), examples/lib (1)
**Internal Deps:** 0

## [340] `lib/utils/testIsolationFramework.ts`
**Type:** Test File
**Imports:** events
**Exports:** IsolationCleanup, IsolationState, ResourceTracker, SessionCleaner, TestIsolationManager, TestMetrics, createTestIsolation, default (+3 more)
**Functions:** createTestIsolation, withIsolation
**API Calls:** undefined.delete

---

## [341] `examples/lib/testIsolationFramework.ts`
**Type:** Test File

---

### 🧩 Flow Group: [201] `Similarity-performanceBenchmarker`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/utils/performanceBenchmarker.ts (roleScore 0)
**Dominant Dirs:** lib/utils (1)
**Internal Deps:** 0

## [342] `lib/utils/performanceBenchmarker.ts`
**Type:** Utility
**Imports:** ../performanceMonitor.js, ./structuredLogger.js, ./timingUtils.js
**Exports:** BenchmarkConfig, BenchmarkResult, BenchmarkSuite, benchmarker, compareSuites, generateReport, runBenchmark, runSuite
**Functions:** compareSuites, generateReport, runBenchmark, runSuite
**API Calls:** currentMap.get

---

### 🧩 Flow Group: [202] `Similarity-resizeObserverPolyfill`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/polyfills/resizeObserverPolyfill.ts (roleScore 0)
**Dominant Dirs:** lib/polyfills (1)
**Internal Deps:** 0

## [343] `lib/polyfills/resizeObserverPolyfill.ts`
**Type:** Code File
**Exports:** MockResizeObserver, setupResizeObserver
**Functions:** setupResizeObserver

---

### 🧩 Flow Group: [203] `Similarity-simple-security-example`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** examples/simple-security-example.ts (roleScore 0)
**Dominant Dirs:** examples (1), examples/examples (1)
**Internal Deps:** 0

## [344] `examples/simple-security-example.ts`
**Type:** Code File
**Imports:** ./lib/security/SecurityTestFramework.js
**Exports:** demonstrateMonitoring, demonstratePolicies, demonstrateRateLimiting, demonstrateSecurityTesting, demonstrateSecurityUtilities, demonstrateValidation
**Functions:** demonstrateMonitoring, demonstratePolicies, demonstrateRateLimiting, demonstrateSecurityTesting, demonstrateSecurityUtilities, demonstrateValidation, runAllSecurityExamples

---

## [345] `examples/examples/simple-security-example.js`
**Type:** Code File
**Exports:** demonstrateMonitoring, demonstratePolicies, demonstrateRateLimiting, demonstrateSecurityTesting, demonstrateSecurityUtilities, demonstrateValidation
**Functions:** demonstrateMonitoring, demonstratePolicies, demonstrateRateLimiting, demonstrateSecurityTesting, demonstrateSecurityUtilities, demonstrateValidation, runAllSecurityExamples

---

### 🧩 Flow Group: [204] `Similarity-scalability-high-impact`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** config/scalability-high-impact.json (roleScore 7)
**Dominant Dirs:** config (1)
**Internal Deps:** 0

## [346] `config/scalability-high-impact.json`
**Type:** Configuration/Data

---

### 🧩 Flow Group: [205] `Similarity-qerrors-resolution-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/qerrors-resolution.test.ts (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [347] `tests/integration/qerrors-resolution.test.ts`
**Type:** Test File
**Imports:** @bijikyu/qtests/setup, @jest/globals

---

### 🧩 Flow Group: [206] `Similarity-performance-testing-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/performance-testing.test.js (roleScore 0)
**Dominant Dirs:** tests (1)
**Internal Deps:** 0

## [348] `tests/performance-testing.test.js`
**Type:** Test File
**Imports:** assert, sinon
**Exports:** CacheService, FastDatabaseService, PerformanceMonitor, SlowExternalAPI, runPerformanceTests
**Functions:** memoryIntensiveFunction, runPerformanceTests
**API Calls:** cacheService.get, undefined.delete, undefined.get

---

### 🧩 Flow Group: [207] `Similarity-concurrency-testing-test`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** tests/concurrency-testing.test.js (roleScore 0)
**Dominant Dirs:** tests (1), tests/integration (1)
**Internal Deps:** 0

## [349] `tests/concurrency-testing.test.js`
**Type:** Test File
**Imports:** assert, sinon
**Exports:** ConcurrentBank, DistributedCache, MessageQueue, TicketingSystem, runConcurrencyTests
**Functions:** runConcurrencyTests
**API Calls:** undefined.delete, undefined.get

---

## [350] `tests/integration/connectionPoolAndLoadTest.test.js`
**Type:** Test File
**Functions:** makePool

---

### 🧩 Flow Group: [208] `Similarity-advanced-edge-cases-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/advanced-edge-cases.test.js (roleScore 0)
**Dominant Dirs:** tests (1)
**Internal Deps:** 0

## [351] `tests/advanced-edge-cases.test.js`
**Type:** Test File
**Imports:** assert, sinon
**Exports:** CacheService, DatabaseService, EmailService, complexDataProcessor, memoryIntensiveFunction, raceConditionFunction, runAdvancedEdgeCaseTests
**Functions:** complexDataProcessor, memoryIntensiveFunction, raceConditionFunction, runAdvancedEdgeCaseTests
**API Calls:** cacheService.get, perfService.get, sharedState.get, undefined.delete, undefined.get

---

### 🧩 Flow Group: [209] `Similarity-demonstrate-improvements`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** scripts/demonstrate-improvements.js (roleScore 0)
**Dominant Dirs:** scripts (1)
**Internal Deps:** 0

## [352] `scripts/demonstrate-improvements.js`
**Type:** Code File

---

### 🧩 Flow Group: [210] `Similarity-working-security-example`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** examples/working-security-example.ts (roleScore 0)
**Dominant Dirs:** examples (2)
**Internal Deps:** 0

## [353] `examples/working-security-example.ts`
**Type:** Code File
**Imports:** ./lib/security/SecurityTestFramework.js
**Exports:** test1_BasicValidation, test2_SecurityMonitoring, test3_SecurityHeaders, test4_RateLimiting, test5_SecurityBestPractices
**Functions:** runSecurityDemo, test1_BasicValidation, test2_SecurityMonitoring, test3_SecurityHeaders, test4_RateLimiting, test5_SecurityBestPractices

---

## [354] `examples/working-security-example.js`
**Type:** Code File
**Exports:** demonstrateBasicSecurity, demonstrateRateLimiting, demonstrateSecurityBestPractices, demonstrateSecurityHeaders, demonstrateSecurityMonitoring
**Functions:** demonstrateBasicSecurity, demonstrateRateLimiting, demonstrateSecurityBestPractices, demonstrateSecurityHeaders, demonstrateSecurityMonitoring, runSecurityDemo

---

### 🧩 Flow Group: [211] `Similarity-minimal-security-example`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** examples/minimal-security-example.ts (roleScore 0)
**Dominant Dirs:** examples (1)
**Internal Deps:** 0

## [355] `examples/minimal-security-example.ts`
**Type:** Code File
**Imports:** ./lib/security/SecurityTestFramework.js
**Functions:** main, testInputValidation, testSecurityHeaders, testSecurityMonitoring

---

### 🧩 Flow Group: [212] `Similarity-core-function-tests-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/core-function-tests.test.ts (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [356] `tests/integration/core-function-tests.test.ts`
**Type:** Test File
**Imports:** @jest/globals, sinon
**Functions:** asyncPredicate, faultyPredicate, fn, fnReturnsNull, fnThrows, predicate

---

### 🧩 Flow Group: [213] `Similarity-streamingValidationLogic`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/validation/streamingValidationLogic.ts (roleScore 0)
**Dominant Dirs:** lib/validation (1)
**Internal Deps:** 0

## [357] `lib/validation/streamingValidationLogic.ts`
**Type:** Code File
**Imports:** ./validationTypes.js, zod
**Exports:** validateStreamingString
**Functions:** validateStreamingString

---

### 🧩 Flow Group: [214] `Similarity-legacyStreamingValidator`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/validation/legacyStreamingValidator.ts (roleScore 0)
**Dominant Dirs:** lib/validation (1)
**Internal Deps:** 0

## [358] `lib/validation/legacyStreamingValidator.ts`
**Type:** Code File
**Imports:** ./validationTypes.js
**Exports:** validateStreaming
**Functions:** validateStreaming

---

### 🧩 Flow Group: [215] `Similarity-userConfigurableAxiosMock`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/httpMock/userConfigurableAxiosMock.ts (roleScore 7)
**Dominant Dirs:** lib/httpMock (1)
**Internal Deps:** 0

## [359] `lib/httpMock/userConfigurableAxiosMock.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, ./legacyAxiosImplementation.js, ./mockTypes.js, ./mockUtilities.js
**Exports:** UserConfigurableAxiosMock
**API Calls:** undefined.get

---

### 🧩 Flow Group: [216] `Similarity-legacyAxiosImplementation`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/httpMock/legacyAxiosImplementation.ts (roleScore 0)
**Dominant Dirs:** lib/httpMock (1)
**Internal Deps:** 0

## [360] `lib/httpMock/legacyAxiosImplementation.ts`
**Type:** Code File
**Imports:** ../qerrorsFallback.js, ./mockTypes.js, ./mockUtilities.js, crypto
**Exports:** LegacyAxiosMock

---

### 🧩 Flow Group: [217] `Similarity-advancedMemoryLeakDetector`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/advancedMemoryLeakDetector.ts (roleScore 0)
**Dominant Dirs:** lib (1)
**Internal Deps:** 0

## [361] `lib/advancedMemoryLeakDetector.ts`
**Type:** Code File
**Imports:** ./qerrorsFallback.js, events
**Exports:** AdvancedMemoryLeakDetector, default

---

### 🧩 Flow Group: [218] `Similarity-demo--server--app--get-test`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** tests/integration/demo__server__app__get.test.js (roleScore 0)
**Dominant Dirs:** tests/integration (2)
**Internal Deps:** 0

## [362] `tests/integration/demo__server__app__get.test.js`
**Type:** Test File
**Imports:** @bijikyu/qtests/lib/routeTestUtils

---

## [363] `tests/integration/demo__server__routes__hello__get.test.js`
**Type:** Test File
**Imports:** @bijikyu/qtests/lib/routeTestUtils

---

### 🧩 Flow Group: [219] `Similarity-security-integration-example`
**Flow Type:** Similarity
**Files:** 2
**Entry Point:** examples/security-integration-example.ts (roleScore 0)
**Dominant Dirs:** examples (1), examples/examples (1)
**Internal Deps:** 0

## [364] `examples/security-integration-example.ts`
**Type:** Code File
**Imports:** ../lib/security/SecurityMonitor.js, ../lib/security/SecurityPolicyManager.js, ../lib/security/SecurityValidator.js
**Exports:** demonstrateBasicValidation, demonstrateRateLimiting, demonstrateSecurityMonitoring, demonstrateSecurityPolicies, demonstrateSecurityReport
**Functions:** demonstrateBasicValidation, demonstrateRateLimiting, demonstrateSecurityMonitoring, demonstrateSecurityPolicies, demonstrateSecurityReport, runSecurityIntegrationExamples

---

## [365] `examples/examples/security-integration-example.js`
**Type:** Code File
**Imports:** ../lib/security/SecurityMonitor.js, ../lib/security/SecurityPolicyManager.js, ../lib/security/SecurityValidator.js
**Exports:** demonstrateBasicValidation, demonstrateRateLimiting, demonstrateSecurityMonitoring, demonstrateSecurityPolicies, demonstrateSecurityReport
**Functions:** demonstrateBasicValidation, demonstrateRateLimiting, demonstrateSecurityMonitoring, demonstrateSecurityPolicies, demonstrateSecurityReport, runSecurityIntegrationExamples

---

### 🧩 Flow Group: [220] `Similarity-intersectionObserverPolyfill`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** lib/polyfills/intersectionObserverPolyfill.ts (roleScore 0)
**Dominant Dirs:** lib/polyfills (1)
**Internal Deps:** 0

## [366] `lib/polyfills/intersectionObserverPolyfill.ts`
**Type:** Code File
**Exports:** MockIntersectionObserver, setupIntersectionObserver
**Functions:** setupIntersectionObserver

---

### 🧩 Flow Group: [221] `Similarity-simple-scalability-test-clean`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** scripts/simple-scalability-test-clean.js (roleScore 0)
**Dominant Dirs:** scripts (1)
**Internal Deps:** 0

## [367] `scripts/simple-scalability-test-clean.js`
**Type:** Test File
**Functions:** printSummary, simulateRequest
**API Calls:** activeRequests.delete

---

### 🧩 Flow Group: [222] `Similarity-comprehensive-function-tests-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/comprehensive-function-tests.test.ts (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [368] `tests/integration/comprehensive-function-tests.test.ts`
**Type:** Test File
**Imports:** @jest/globals, sinon
**Functions:** asyncPredicate, faultyPredicate, fn, predicate
**API Calls:** cache.get, registry.get

---

### 🧩 Flow Group: [223] `Similarity-circuitBreakerAndRunTestSuite-test`
**Flow Type:** Similarity
**Files:** 1
**Entry Point:** tests/integration/circuitBreakerAndRunTestSuite.test.js (roleScore 0)
**Dominant Dirs:** tests/integration (1)
**Internal Deps:** 0

## [369] `tests/integration/circuitBreakerAndRunTestSuite.test.js`
**Type:** Test File
**Imports:** ../../dist/lib/circuitBreaker.js, ../../dist/utils/runTestSuite.js
**API Calls:** circuitBreakerRegistry.get

---
