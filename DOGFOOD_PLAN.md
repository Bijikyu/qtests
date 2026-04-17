# Dogfooding Plan — Uncovered Modules

Systematic sweep of the ~60 remaining untested source files.
Each round reads every file in the group, checks for behavioural bugs and logic
errors, fixes anything found, writes regression + clean-probe tests, rebuilds,
and confirms all suites stay green before moving on.

---

## What to look for in every file

- **Silent no-ops** — a flag or option that is accepted but never acted on
  (the `stopOnFirstError` forEach bug, Round 21)
- **Always-wrong defaults** — a local variable that shadows the real module
  state (the `emailHistory = []` bug, Round 21)
- **Timer / interval leaks** — `setTimeout`/`setInterval` without `clearTimeout`/
  `clearInterval` in a `.finally()` or destructor (Rounds 20, 21)
- **Constructors that start background work** — any `new X()` that calls
  `startMonitoring()` / `startPolling()` without a `JEST_WORKER_ID` guard
  (Rounds 12, 13)
- **`import.meta` in CJS-loaded files** — literal use of `import.meta.url`
  outside a dynamic `(0,eval)(...)` wrapper crashes Jest (Rounds 16, 20)
- **Pure-ESM static imports** — `import ... from 'p-retry'` etc. at the top
  level of a CJS-compatible file (Round 20)
- **Unbound method exports** — static class methods exported as plain
  references lose `this` (Round 15)
- **Off-by-one / wrong index maths** in loops or array slices
- **Missing null / undefined guards** before property access or method calls
- **Return value ignored** where callers would reasonably expect a meaningful
  result

---

## Round 22 — Email sending pipeline

**Files to read:**
```
utils/email/emailSender.ts
utils/email/emailFormatter.ts
utils/email/emailTemplate.ts
utils/email/emailValidator.ts
utils/sendEmail.ts
```

**Focus areas:**
- `emailSender` — does it push to the shared `emailHistory`? Does it guard
  against missing transport config? Are errors surfaced or swallowed?
- `emailFormatter` — does `format()` handle undefined/null fields without
  crashing? Is HTML escaping applied before it reaches the template?
- `emailTemplate` — does template substitution fall back gracefully for missing
  variables, or does it produce `undefined` strings?
- `emailValidator` — regex edge cases (empty string, non-string input, unicode
  domains); does it throw or return false for invalid input?
- `sendEmail` (top-level shim) — does it delegate to `emailSender` correctly,
  or does it have its own copy of logic that can drift?

**Test file to create:** `tests/integration/round22-bugs.test.ts`

---

## Round 23 — Stubbing internals

**Files to read:**
```
utils/stubbing/mockCreation.ts
utils/stubbing/networkMocking.ts
utils/stubbing/verification.ts
utils/stubbing/spying.ts        (surveyed R21 — no tests written)
utils/stubbing/timerManagement.ts  (surveyed R21 — no tests written)
utils/stubbing/utilities.ts    (surveyed R21 — no tests written)
utils/customStubs.ts
utils/stubMethod.ts
```

**Focus areas:**
- `mockCreation` — does `createMock()` deep-clone the template so mutations
  don't bleed between tests? Does it handle circular refs?
- `networkMocking` — does it restore the original `fetch`/`http` after the
  test? Is there a missing `afterEach` restoration that could leak?
- `verification` — do `assertCalled` / `assertCalledWith` compare arguments
  by value or reference? Are error messages specific enough to be useful?
- `spying` / `timerManagement` / `utilities` — write clean-probe tests for
  the behaviours confirmed correct in R21 survey
- `stubMethod` — does it restore the original on `mockRestore()`? Does it
  handle non-configurable properties gracefully?

**Test file to create:** `tests/integration/round23-bugs.test.ts`

---

## Round 24 — Console mocking layer

**Files to read:**
```
utils/console/consoleUtils.ts
utils/console/fallbackMocker.ts
utils/console/jestMocker.ts
utils/mockConsole.ts   (has a test but no dedicated round coverage)
```

**Focus areas:**
- `jestMocker` — does it guard against being called outside a Jest context?
  The R11 fix to `mockAllConsole` returned empty objects; check whether any
  remaining no-op patterns survived.
- `fallbackMocker` — used when Jest is unavailable; does it cleanly restore
  the original `console.*` methods in all exit paths (including throws)?
- `consoleUtils` — helper shared by both mockers; check for
  `console[method] = ...` assignments that don't save the original first.
- Cross-file: do `jestMocker` and `fallbackMocker` share the same restoration
  registry, or could both be active at once and fight?

**Test file to create:** `tests/integration/round24-bugs.test.ts`

---

## Round 25 — Mock models and HTTP test utilities

**Files to read:**
```
utils/models/baseMockModel.ts
utils/models/modelFactory.ts
utils/models/apiKeyModel.ts
utils/models/apiLogModel.ts
utils/mockModels.ts
utils/http/mockResponse.ts
utils/httpClientMockFactory.ts
utils/httpTest.ts
utils/httpTest.shim.ts
utils/mockAxios.ts
```

**Focus areas:**
- `baseMockModel` — does `save()` / `find()` etc. return the right shape?
  Does it update `updatedAt` on save?
- `modelFactory` — are created models independent instances or aliases to the
  same object (shared-mutation bug)?
- `mockResponse` — does it set a default `status` of 200 when none is given?
  Does it produce a valid `headers` map?
- `httpClientMockFactory` — does it reset between tests, or does state from
  one test pollute the next?
- `mockAxios` — does it correctly mirror the real axios API shape
  (`.get`, `.post`, `.create`, interceptors)?

**Test file to create:** `tests/integration/round25-bugs.test.ts`

---

## Round 26 — Test environment setup cluster

**Files to read:**
```
utils/testEnv/testInitializer.ts
utils/testEnv/envManager.ts
utils/testEnv/mockFactory.ts
utils/testEnv/testMockFactory.ts
utils/testEnv/axiosMocks.ts
utils/testEnv/functionMocks.ts
utils/testEnv/serviceMocks.ts
utils/testEnv/spyAttacher.ts
utils/testEnv.ts  (barrel / orchestrator)
utils/testHelpers.ts
utils/enhancedTesting.ts
```

**Focus areas:**
- `testInitializer` — does `setup()` / `teardown()` pair correctly? Is there
  a case where setup succeeds but teardown is never called on error?
- `envManager` — distinct from `utils/helpers/envManager`; does it merge with
  `process.env` or replace it? Does it restore on teardown?
- `mockFactory` / `testMockFactory` — do they guard against `jest.fn()` being
  called outside Jest (the R11 pattern)?
- `spyAttacher` — does it track all attached spies so they can all be restored
  in one call?
- `testHelpers` / `enhancedTesting` — utility soup; look for duplicate
  implementations of the same helper with subtly different behaviour.

**Test file to create:** `tests/integration/round26-bugs.test.ts`

---

## Round 27 — Testing helpers (data / port / DB / HTTP factories)

**Files to read:**
```
utils/testing/databaseTestHelper.ts
utils/testing/httpDataFactory.ts
utils/testing/testDataFactory.ts
utils/testing/integrationTestHelper.ts
utils/testing/jestSetupHelper.ts
utils/testing/mockManager.ts
utils/testing/portAllocator.ts
```

**Focus areas:**
- `databaseTestHelper` — does `setupTestDb()` clean up its connection on
  `teardown()`? Is there a missing `await` on an async disconnect?
- `portAllocator` — does it track allocated ports so two parallel tests don't
  get the same port? Is the free-port detection race-condition-safe?
- `testDataFactory` — similar concern to `modelFactory`; are returned objects
  independent copies?
- `integrationTestHelper` — does it start a server per test or share one?
  Is the server torn down even when a test throws?
- `mockManager` — does `clearAll()` actually clear everything, or just the
  most-recently-registered mock?

**Test file to create:** `tests/integration/round27-bugs.test.ts`

---

## Round 28 — lib/fileSystem sub-modules

**Files to read:**
```
lib/fileSystem/fileReading.ts
lib/fileSystem/fileWriting.ts
lib/fileSystem/fileDeletion.ts
lib/fileSystem/fileExistence.ts
lib/fileSystem/managementUtils.ts
lib/fileSystem/readingUtils.ts
lib/fileSystem/errorHandling.ts
utils/fileSystem/safeOperations.ts
utils/helpers/moduleReloader.ts
utils/helpers/keyGenerator.ts
```

**Focus areas:**
- `fileReading` / `readingUtils` — do they handle ENOENT gracefully or throw?
  Do they close file handles on error?
- `fileWriting` — does it use `fs-extra.outputFile` (which creates
  intermediate dirs) or plain `fs.writeFile` (which requires the dir to
  exist)? The R14 bug was exactly this.
- `fileDeletion` — does it swallow ENOENT on a missing file or rethrow?
- `managementUtils` — does `move()` handle cross-device moves (where rename
  fails and a copy+delete is needed)?
- `moduleReloader` — does the `createRequire` call use
  `(0,eval)('import.meta.url')` for the CJS path, or does it still use a
  literal `import.meta`? (R16 fix pattern)
- `keyGenerator` — does it produce cryptographically random keys, or is it
  using `Math.random()` (unsuitable for any security-adjacent use)?

**Test file to create:** `tests/integration/round28-bugs.test.ts`

---

## Round 29 — lib/memory sub-modules

**Files to read:**
```
lib/memory/leakDetector.ts
lib/memory/memoryMonitoring.ts
lib/memory/monitoringOrchestration.ts
lib/memory/snapshotManager.ts
lib/memory/cleanupOperations.ts
lib/memory/garbageCollection.ts
lib/memory/globalCleanup.ts
```

**Focus areas:**
- All monitoring files — constructor or module-load `setInterval` without
  `JEST_WORKER_ID` guard (R12 pattern; `advancedMemoryLeakDetector` and
  `performanceMonitor` both had this; check whether any of these sub-modules
  escaped the fix).
- `snapshotManager` — are snapshots stored in memory (leak between tests) or
  cleared on each `take()`?
- `cleanupOperations` / `globalCleanup` — does calling `cleanup()` twice
  throw or silently succeed?
- `garbageCollection` — if `global.gc` is unavailable, does it fail silently
  or log a warning?

**Test file to create:** `tests/integration/round29-bugs.test.ts`

---

## Round 30 — lib/errorHandling remaining files

**Files to read:**
```
lib/errorHandling/basicWrappers.ts
lib/errorHandling/errorWrappers.ts
lib/errorHandling/placeholderWrappers.ts
lib/errorHandling/simpleErrorLogging.ts
lib/errorHandling/errorTypes.ts
```

**Focus areas:**
- `basicWrappers` — surveyed R21 but no dedicated tests; write clean-probe
  coverage for every exported function.
- `errorWrappers` — is there overlap with `basicWrappers`? Do both wrap the
  same way, or does one add retry logic / structured logging the other lacks?
- `placeholderWrappers` — are these genuinely no-ops, or do they have
  partially-implemented logic that looks like it works but silently discards
  error context?
- `simpleErrorLogging` — does it produce the same structured fields as
  `errorLogging`? Are `timestamp` and `stack` always populated?

**Test file to create:** `tests/integration/round30-bugs.test.ts`

---

## Round 31 — lib/logging remaining + lib misc

**Files to read:**
```
lib/logging/decorators.ts
lib/loggingDecorators.ts
lib/logging.ts
lib/logging/winstonLogger.ts
lib/logUtils.ts
lib/qerrorsFallback.ts
lib/envUtils.ts
lib/streamingValidator.ts
lib/streamingValidatorModern.ts
lib/validation/basicSchemas.ts    (covered R18 — write clean-probe tests)
lib/validation/validationMiddleware.ts
```

**Focus areas:**
- `decorators` / `loggingDecorators` — do the TypeScript decorators work
  correctly when targeting ES5/ES2017? Does `logStart` / `logReturn` still
  fire when the decorated method throws?
- `winstonLogger` — is the `msg msg` duplication bug (R13: passing `message`
  twice to winston) absent here, or does this file replicate the same pattern?
- `qerrorsFallback` — used everywhere as an error reporter; does it silently
  swallow errors when the real `qerrors` package is unavailable?
- `streamingValidator` / `streamingValidatorModern` — do they handle backpressure
  correctly, or do they buffer unboundedly?
- `validationMiddleware` — does it call `next(err)` on validation failure, or
  does it call `res.status(400).json(...)` directly? (Framework contract.)

**Test file to create:** `tests/integration/round31-bugs.test.ts`

---

## Round 32 — lib/polyfills + lib/setup + remaining utils

**Files to read:**
```
lib/polyfills/clipboardPolyfill.ts
lib/polyfills/intersectionObserverPolyfill.ts
lib/polyfills/mediaQueryPolyfill.ts
lib/polyfills/resizeObserverPolyfill.ts
lib/polyfills/polyfillOrchestrator.ts
lib/setup.ts
utils/helpers/functionLogger.ts    (surveyed R21 — no tests written)
utils/helpers/responseMocker.ts    (surveyed R21 — no tests written)
utils/helpers/qerrorsStub.ts
utils/__mocks__/esm-globals.ts
```

**Focus areas:**
- Polyfills — do they check `typeof window !== 'undefined'` before installing?
  Installing a browser polyfill in a Node/Jest environment should be a no-op,
  not a crash.
- `polyfillOrchestrator` — does it de-duplicate installations if called
  multiple times (idempotency)?
- `setup.ts` — the Jest global setup file; does it leave any intervals or
  open handles? Does it guard against being `require()`d more than once?
- `qerrorsStub` — does it match the real `qerrors` API shape exactly, or are
  some call signatures silently ignored?
- `responseMocker` / `functionLogger` — write the clean-probe tests deferred
  from Round 21.

**Test file to create:** `tests/integration/round32-bugs.test.ts`

---

## Completion criteria

A round is done when:
1. Every file in the group has been read.
2. All bugs found are fixed and justified with a comment.
3. `npm run build` produces zero TypeScript errors.
4. `Test Runner` reports **all suites green** with the new test count.
5. `replit.md` test-count progression line is updated.
6. A commit message is written to `.local/.commit_message`.
