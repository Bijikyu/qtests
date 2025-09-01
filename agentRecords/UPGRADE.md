qtests Competitive Roadmap — Making Jest/Mocha Redundant (Node.js, JS/TS)

Intent
- Goal: Specify exactly what to add so qtests can replace Jest/Mocha in Node.js projects while staying true to qtests’ vision: fast, isolated unit tests and a minimal, pragmatic API. Efficiency over backward compatibility.
- Scope: JavaScript/TypeScript on Node.js only. No browser targets.

Where qtests Stands Today
- Strengths: Global auto‑stubbing via `setup`, `stubMethod`, `mockConsole`, `testEnv`/`offlineMode`, simple HTTP/email helpers, ESM/TS support, and a tiny runner (`runTestSuite`).
- Gaps (to be closed): Full runner UX (discovery, watch, hooks), richer assertions, built‑in spies/mocks/timers, reporters, coverage integration, parallelism, snapshots, and first‑class CLI/config.

Priority Gap Analysis → Deliverables
1) Test Structure & Lifecycle (Runner Core)
- Add: `describe/it/test`, `beforeAll/afterAll/beforeEach/afterEach`, `test.only/skip`, `describe.only/skip`, `test.todo`.
- Add: Async handling (async functions, returned promises, and optional `done` callback), per‑test timeouts, retries, bail on first failure, per‑file and global hooks.
- Add: Test discovery via globs (e.g., `**/*.test.{js,ts}`), name filtering (`-t`), exit codes.
- Rationale: Removes Mocha as a runner dependency and enables drop‑in usage.

2) Assertions & Matchers
- Add: `expect()` with core matchers: equality (strict/deep), truthiness, numbers (>, <, >=, <=, closeTo), strings/regex (match/contain), arrays/objects (contain, subset), errors (toThrow), promises (`resolves`/`rejects`).
- Add: Custom matcher API with extension hooks.
- Keep: `createAssertions()` for minimal mode; promote `expect` for parity.
- Rationale: Removes Chai/Jest‑expect dependency for most use cases.

3) Spies, Mocks, and Timers
- Add: `qtests.mock.fn()` (call tracking, mockReturnValue, mockResolvedValue, mockImplementation, .mockClear/.mockReset/.mockRestore).
- Add: `qtests.mock.spyOn(obj, method)` with restore.
- Add: Fake timers API: `useFakeTimers`, `useRealTimers`, `advanceTimersByTime`, `runAllTimers`, `runOnlyPendingTimers`, `setSystemTime`.
- Leverage: Existing resolver patching to add `qtests.mock.module(name, factory)` for on‑demand module mocks (configurable registry layered on current stubs).
- Rationale: Removes dependency on Jest or Sinon for the common 80% of mocking.

4) Reporters & Output
- Add: Built‑in reporters: `spec` (default), `dot`, `json`, `junit-xml`, and minimal `tap`.
- Add: Pretty diffs for assertion failures, error stack pruning, summary with slow test reporting.
- Add: Reporter plugin API and `--reporters` CLI flag.
- Rationale: Satisfies CI needs and human‑readable output without external libs.

5) Coverage Integration (Node‑Native)
- Add: Coverage via V8 native coverage API with a small built‑in aggregator; output lcov/json/text.
- Provide: Option to run under `c8` when installed. Detect and integrate automatically. Allow well‑maintained coverage libs as production dependencies when they improve reliability/UX.
- Rationale: Eliminates need for Jest runner solely to get coverage.

6) Watch Mode
- Add: File watching using Node’s `fs.watch` with debouncing, test file re-run, and pattern filtering.
- Provide: `--watch`, `--watchAll`, change summary, failed‑tests‑only mode.
- Rationale: Developer ergonomics on par with Jest’s edit–refresh loop while keeping dependencies near zero.

7) Parallel Execution
- Add: Per‑file parallelism using `worker_threads` or `child_process` (configurable `--maxWorkers`), isolated env, aggregated reporting.
- Add: Test sharding support for CI (e.g., `--shard N/M`).
- Rationale: Performance and scalability for larger repos.

8) Snapshots (Node‑only)
- Add: `expect(value).toMatchSnapshot()` with serializers, stable ordering, `__snapshots__` co‑located, `--updateSnapshot` support.
- Rationale: Replaces Jest snapshot use cases for Node services and libraries.

9) TypeScript & ESM Execution
- Add: First‑class TS execution strategy without bundling heavy deps: prefer precompiled TS; if `ts-node` or `tsx` is present, auto‑detect and use as an optional peer path. Provide ESM loader hooks where available.
- Add: Config option `transform` for custom loaders (documented patterns). Prefer lightweight libs; allow production deps when they reduce complexity and improve stability.
- Rationale: Seamless TS/ESM without forcing a stack.

10) Configuration & CLI
- Add: `qtests.config.{js,ts,mjs}` with schema: `testMatch`, `testIgnore`, `timeout`, `retries`, `bail`, `reporters`, `coverage`, `watch`, `maxWorkers`, `setupFiles`, `setupFilesAfterEnv`, `globals`, `snapshotDir`, `moduleNameMapper` (Node‑only use cases).
- Add: CLI `qtests` with commands/flags: `run`, `watch`, `--updateSnapshot`, `--coverage`, `-t <pattern>`, `--bail`, `--retries`, `--reporters`, `--maxWorkers`, `--json`, `--outputFile`.
- Policy: Prefer minimal dependencies, but allow production dependencies when they deliver meaningful value (stability, performance, DX). Optional peer tools can be auto‑discovered when present.

11) Documentation & Migration Aids
- Add: “From Mocha” and “From Jest” guides, mapping common features and APIs to qtests equivalents.
- Add: Recipes for module mocking via resolver registry, env isolation with `testEnv`, and silent logging via `mockConsole`/winston stub.

Design Constraints to Honor
- Target JS/TS across Node and DOM environments (jsdom or real browsers via adapters).
 - Prefer minimal dependencies but allow production dependencies when they add clear value. Optional dev‑tool integrations are auto‑detected when available.
 - Preserve explicit setup timing: `require('qtests/setup')` must run before requiring stubbed modules.
 - Backward compatibility: NOT required. We will favor efficient, simpler designs even if breaking. We will bump a major version and provide codemods/migration guides.

Phased Implementation Plan (Suggested)
- Phase 1 (Runner core): describe/it/hooks, async, timeouts, discovery, filtering, basic spec reporter. CLI `qtests run`.
- Phase 2 (Assertions): `expect()` + core matchers, pretty diffs, custom matchers.
- Phase 3 (Mocks): mock.fn/spyOn, timers, clear/reset between tests.
- Phase 4 (Reporters & Watch): dot/json/junit/tap, watch mode, fail‑fast, retries.
- Phase 5 (Coverage & Parallel): V8 coverage integration, workers for per‑file parallelism, shard support.
- Phase 6 (Snapshots & TS/ESM): snapshot API, `--updateSnapshot`, TS/ESM execution strategy and loader hooks.
- Phase 7 (Config & Polish): config file, moduleNameMapper, setupFiles, CLI UX, docs and migration guides.
- Phase 8 (Web/React): jsdom env, React render utilities, browser stubs, bundler adapters, DOM/React matchers, React snapshot serializer.
 - Phase 8 (Web/React): jsdom env, React render utilities, browser stubs, bundler adapters, DOM/React matchers, React snapshot serializer.
  - Phase 9 (Real Browser): Playwright adapter, browser lifecycle, screenshots/traces, browser coverage, CI integration, component testing mode.
  - Phase 10 (Replit Profile): environment fallbacks, ports, DB adapters, optional Playwright auto-detect, docs/scripts.
  - Phase 11 (Test Generation): preserve and extend generator (heuristic + AST), new templates (Node/jsdom/Playwright/MERN), config integration.

Acceptance Criteria (to declare parity for Node services/libs + Web/React + Real Browser + Generation)
- Runs medium‑sized Node codebases end‑to‑end with only qtests installed (plus optional `ts-node/tsx` when the project requires on‑the‑fly TS execution), without Jest/Mocha/Chai/Sinon.
- Provides module mocking, spies, timers, snapshots, coverage, watch, reporters, and parallelism sufficient for CI and local dev.
- Maintains qtests’ differentiator: global auto‑stubbing that eliminates refactors for external service dependencies.
- Can run React component tests under jsdom; supports DOM assertions and snapshots; axios/winston are stubbed via bundler adapters in browser builds.
  - Can run React/UI tests in real browsers (Chromium/Firefox/WebKit) with Playwright integration; supports screenshots/traces on failure and collects browser-side coverage when configured.
  - Can run Playwright Component Testing: mount React components in real browsers without a full app server; interact and assert DOM/state; optional per-test screenshots and snapshots.
  - Runs on Replit reliably with jsdom as default; gracefully disables unsupported features (e.g., Docker/testcontainers) and provides DB/browser fallbacks.
  - Test generation preserves all current capabilities and adds templates for the new runner, jsdom, Playwright (page and component), and MERN flows; generated tests run out of the box.
- Accepts breaking changes versus prior qtests APIs where doing so yields simpler, faster, more maintainable designs.

Notes on Implementation Within Current Codebase
- Extend resolver/stub behavior via a configurable mock registry layered on current `lib/stubs.ts` and `setup.ts` (without altering protected core semantics). Expose `mock.module()`.
- Introduce a new runner package under `lib/runner` with lifecycle orchestration, worker management, and reporter interfaces. Deprecate `runTestSuite` and transition to the new runner; remove legacy runner in the major release.
- Add `expect/Matchers` under `utils/testing` to avoid circular deps; export at bottom from `index.ts`. Replace `createAssertions()` with `expect()`; keep a thin compatibility shim only during migration if desired.
- Implement reporters under `lib/reporters/*` and wire via CLI/config.
- Add CLI in `bin/qtests` and configuration loader `qtests.config.*`.

Summary
- This roadmap closes the specific gaps that keep teams on Mocha/Jest. Executed in phases, it lets qtests remain minimal by default while offering a complete Node‑focused test platform when enabled. The result: Jest/Mocha become optional, not required, for Node.js JS/TS projects.

Breaking Changes & Migration Strategy
- Philosophy: Efficiency over backward compatibility. We will make breaking changes where they simplify design, speed execution, or reduce maintenance burden.
- Major version bump: All breaking changes land in the next major.
- Deprecations/removals (planned):
  - Replace `runTestSuite`/`runTestSuites` with the new runner; provide a temporary shim during migration phase, then remove.
  - Replace `createAssertions()` with `expect()`; add codemod to transform assertion calls.
  - Consolidate `envUtils` API names for clarity (e.g., standardize save/restore naming); provide codemod recipes.
  - Normalize CLI to `qtests` with subcommands; remove older scripts/entry points.
- Codemods & docs:
  - Add `scripts/codemods/` with transforms: assertions → expect, runner usage → dsl/describe/it, env API renames, config migration.
  - Provide “From Prior qtests” guide alongside “From Mocha/Jest”.


Automatic Test Generation (Required — Preserve and Extend)

Goals
- Retain all existing generator capabilities (heuristic + AST modes, include/exclude, dry-run, unit/integration toggles) while upgrading output to the new runner, assertions, and environments (Node, jsdom, Playwright, MERN).
- Ensure generated tests work out of the box in Replit and typical npm module setups.

Deliverables
- Generator Core
  - Maintain both modes: `mode: 'heuristic'|'ast'`.
  - AST mode: use TypeScript compiler APIs (or `ts-morph` if chosen) to detect exported functions/classes/hooks and props for React components.
  - Heuristic mode: fast file scanning with regex/structure hints; unchanged behavior where effective.
  - Config integration: respect `qtests.config.*` defaults (testMatch, env, reporters, snapshotDir, moduleNameMapper), with generator-specific overrides.

- Templates
  - Node Unit: `describe/it + expect`, per-file `import 'qtests/setup'` first line; examples for stubMethod/mockConsole/testEnv.
  - React (jsdom): setup `--env=jsdom`, use `render` helpers and DOM/React matchers, optional snapshots.
  - Playwright Page: end-to-end skeleton using `getPage()` (or exported helpers), baseURL wiring; optional screenshot on failure.
  - Playwright Component: use `mount/rerender/unmount`, screen-like queries, optional snapshots.
  - MERN: full-stack template hitting in-process Express routes via fetch bridge; seeding via mongo-memory helpers.
  - Replit-aware imports: ESM by default; relative paths resolved; include `import 'qtests/setup'` when stubs needed.

- CLI & Flags
  - Preserve: `--src`, `--test-dir`, `--include`, `--exclude`, `--unit`, `--dry-run`, `--mode`, `--force`.
  - Add: `--env=node|jsdom|browser`, `--component`, `--playwright`, `--mern`, `--template=<name>` to choose template class.
  - Default selection logic: pick template by file type and config (e.g., `.tsx` → React template; presence of server entry → MERN template for route handlers).

- Non-Destructive Behavior
  - Idempotent generation: skip existing tests unless `--force`.
  - Safe updates: if updating, back up prior generated file with `.bak` or include header with generation metadata.

- Stubbing & Setup
  - Always emit `import 'qtests/setup'` or bundler alias guidance at the top when tests rely on axios/winston stubs.
  - For browser tests, include bundler adapter notes (Vite/webpack) where needed.

Tests & Acceptance (Generation)
- Unit: generator selects correct templates based on inputs; AST mode extracts symbols as expected; flags honored.
- Integration: run generator on sample Node/React/MERN projects; generated tests compile and pass with the new runner under Node/jsdom/Playwright contexts.
- Replit: generated tests run with jsdom default and mongo-memory; fallback to mongo-docstore if binary download blocked.


Web/React Support (Required)

Goals
- Run React component/unit tests and UI module tests without requiring Jest/Mocha.
- Preserve automatic stubbing ethos (axios/logger) via bundler adapters rather than Node resolver patching.
- Provide React‑friendly assertions, DOM environment, and snapshot support.

Deliverables
- DOM Environment
  - New: `lib/env/jsdomEnv.ts` — create/manage a jsdom instance per file or per test (configurable). Wire globals: `window`, `document`, `navigator`, `fetch` (stubbed), timers.
  - CLI: `--env=jsdom` to select DOM environment; default `node`.
  - Isolation: reset DOM between tests; expose `cleanup()`.

- React Utilities
  - New: `lib/react/render.ts` — minimal render/cleanup around React 18 `act` + `createRoot`.
  - API: `render(element, options)`, basic `screen`-like queries, `cleanup()`; auto‑delegate to `@testing-library/react` if detected; fallback to built‑ins if not.
  - Snapshots: `lib/snapshots/reactSerializer.ts` for stable serialization of React elements/trees.

- Web Module Auto‑Stubbing
  - Browser stubs: `stubs/axios.browser.ts`, `stubs/winston.browser.ts` that are DOM‑safe.
  - Registry: extend `lib/stubsRegistry.ts` with environment awareness (`env: 'node'|'browser'`).
  - Bundler adapters:
    - `adapters/vite-plugin-qtests.ts`: alias stubs + inject setup at build/start.
    - `adapters/webpack-plugin-qtests.js`: Resolve.alias + plugin to inject setup.
  - Docs: alias recipes for Vite, Webpack, Next.js, CRA.

- Browser‑Focused Matchers
  - Extend `expect` with DOM/React matchers: visibility, textContent, attribute/role checks.
  - Optional: integrate with `@testing-library/jest-dom` if present; otherwise provide a small subset.

- CLI/Config
  - Config: `environment: 'node'|'jsdom'`, `dom: { cleanup: 'afterEach'|'manual' }`, `moduleAliases` for stubs.
  - CLI: `--env=jsdom`, `--domCleanup=afterEach|manual`.

Tests & Acceptance (Web)
- Unit: jsdom setup/teardown, render/cleanup correctness, stub alias resolution, serializer stability.
- Integration: example React app under `tests/web/react-app` runs with qtests runner, jsdom env, axios/winston stubs aliased via Vite/Webpack adapter.
- Acceptance: Write `describe/it` tests for React components, assert DOM, take/update snapshots, and auto‑stub axios without Jest/Mocha.


Full‑Stack (MERN) Support (Required)

Goals
- Enable end‑to‑end tests across Model/DB + Express API + React UI + Node runtime for JS/TS apps.
- Provide fast, deterministic DB layers suitable for CI and local runs.

Deliverables
- Express/API Integration
  - New: `lib/server/testServer.ts` — harness to mount an Express app (or a handler) with lifecycle controls: start/stop, dynamic port, baseURL.
  - New: `lib/server/supertestBridge.ts` — unify Node http client and browser `fetch` tests against the same in‑process server.
  - CLI/config: `server: { entry?: string; port?: number; autoStart?: boolean }`.

- MongoDB (Mandatory)
  - New: `lib/db/mongoMemory.ts` — wrapper around `mongodb-memory-server` providing start/stop, URI, db handle, seeding helpers.
  - New: `lib/db/mongooseTest.ts` — convenience helpers to connect/disconnect Mongoose to the in‑memory URI, clear collections between tests.
  - Config: `db: { kind: 'mongo-memory'|'mongo-container', seed?: string|Function }`.
  - Reporter integration: print db mode + lifecycle timings.

- Relational DB (Optional, configurable)
  - New: `lib/db/relationalContainers.ts` — `testcontainers` helpers to spin up Postgres/MySQL; export connection info and teardown.
  - Config: `db: { kind: 'relational-container', image: 'postgres:16'|'mysql:8', schema?: string|Function }`.
  - Fallback: document local service requirement if Docker unavailable; fail fast with clear guidance.

- Fetch/HTTP Bridge (UI ↔ API)
  - New: `lib/env/fetchBridge.ts` — when running `--env=jsdom`, provide a `fetch` implementation that routes to the in‑process Express server via Node HTTP, so React component tests can hit actual routes without a network.
  - Axios in browser: ensure axios uses the same bridge or browser stubs as configured.

- CLI/Config
  - Flags: `--db=mongo-memory|mongo-container|relational-container`, `--serverEntry=./app/server.ts`, `--autoStartServer`.
  - Config file: mirror flags; default DB mode `mongo-memory`.

Tests & Acceptance (Full‑Stack)
- Unit: mongoMemory lifecycle and seeding, mongoose connect/disconnect helpers, container spin‑up/teardown (guarded e2e tests), fetch bridge request/response fidelity.
- Integration: sample MERN app under `tests/fullstack/app` with CRUD flow:
  - React component triggers fetch/axios → Express route handler → Mongo in‑memory DB → response updates UI.
  - Assertions on UI state, API response, and DB contents.
- Acceptance: Full flow passes locally and in CI using `mongo-memory` by default; optional relational container path documented and tested in a dedicated CI job.


Real Browser (Playwright) Support (Required)

Goals
- Run UI/component and end-to-end tests in real browsers (Chromium, Firefox, WebKit) using Playwright while retaining qtests’ runner, assertions, and reporting.
- Provide consistent APIs and outputs across jsdom and real browsers.

Deliverables
- Playwright Adapter
  - New: `adapters/playwright/launcher.ts` — manage installation check, launch browser, create contexts/pages per test file or per test, teardown.
  - New: `lib/env/playwrightEnv.ts` — environment shim that wires `page`, `context`, and a controlled `window` proxy for helpers; aligns life-cycle with qtests hooks.
  - New: `lib/browser/api.ts` — re-export minimal Playwright page utilities (click, fill, type, getByRole/Text) for tests, or expose `getPage()`/`getContext()` directly if playwright is installed.
  - CLI: `--browser=chromium|firefox|webkit`, `--headless`, `--browserWorkers=<n>`, `--trace on|retain-on-failure|off`, `--screenshot-on-fail`.

- Server Bridging
  - Use `lib/server/testServer.ts` if configured to serve the app under test.
  - Provide `baseURL` to Playwright contexts; ensure same-port routing for relative URLs.

- Coverage (Browser)
  - Add: `lib/coverage/browserCollector.ts` — collect `window.__coverage__` at test boundaries; merge with Node coverage.
  - Docs: instrument via bundler (Vite/webpack) with Istanbul plugins to populate `__coverage__`.

- Artifacts & Reporting
  - On failure: capture screenshot and optional Playwright trace (if enabled); store under `./logs/artifacts/<test-name>/`.
  - Reporter integration: link artifacts in JSON/JUnit outputs.

Config/CLI
- Config: `browser: { name: 'chromium'|'firefox'|'webkit', headless?: boolean, workers?: number, trace?: 'on'|'retain-on-failure'|'off', screenshotOnFail?: boolean }`.
- CLI flags as above; defaults: headless true, workers = CPU cores/2.

Tests & Acceptance (Real Browser)
- Unit: launcher lifecycle under mock Playwright, env wiring, artifact path generation, CLI/config precedence.
- Integration: sample React app served via `testServer`:
  - Navigate, interact (click/type), assert UI changes, take screenshot on failing assertion.
  - Validate `__coverage__` merged with Node coverage when bundler instrumentation is enabled.
- Acceptance: Chromium/Firefox/WebKit runs pass in CI matrix; artifacts generated on failures; coverage merged and reported.


Playwright Component Testing (Required)

Goals
- Mount and test React components directly in real browsers (Chromium/Firefox/WebKit) without a full app shell.
- Keep a single runner, assertions, and reporters consistent with jsdom/page testing.

Deliverables
- Component Mount API
  - New: `lib/react/componentMount.ts` — mount/unmount APIs using a lightweight harness page; integrates with React 18 `act`.
  - API: `mount(<Component props/children>)`, `unmount()`, `rerender(nextProps)`, `screen`-like queries; optional `within(container)` helper.
  - Snapshots/screenshots: tie into existing snapshot serializer and artifact capture.

- Playwright Component Runner
  - New: `adapters/playwright/componentRunner.ts` — spins up a minimal component host page per test file; injects the compiled test/component code; coordinates mount calls via `window.__qtestsMount__` bridge.
  - New: `adapters/playwright/bundler/esbuildComponent.ts` — default zero-config esbuild bundling for component tests (TS/JS/JSX/TSX) with React fast transforms; optionally detect and use Vite if present.
  - Harness: `adapters/playwright/componentHost.html` + `componentHost.ts` to provide a stable, minimal DOM root and message bridge.

- Bundler Adapters
  - Vite: extend `adapters/vite-plugin-qtests.ts` to route `*.component.test.(ts|tsx|js|jsx)` to a component host with HMR disabled for test stability.
  - Webpack: extend `adapters/webpack-plugin-qtests.js` with an entry wrapper for component tests and proper aliases for stubs/react runtime.

Config/CLI
- Config: `component: { framework: 'react', bundler?: 'esbuild'|'vite'|'webpack', host?: string }`.
- CLI: `--component`, `--componentFramework=react`, `--componentBundler=esbuild|vite|webpack`.

Tests & Acceptance (Component)
- Unit: componentMount lifecycle (mount/unmount/rerender), bridge messaging, esbuild bundling pipeline.
- Integration: sample React component tests under `tests/web/components` using `--component`:
  - Interact with inputs/events, assert DOM and props/state changes.
  - Validate per-test screenshots on failure and React snapshot stability.
- Acceptance: Component tests pass across Chromium/Firefox/WebKit in CI matrix using default esbuild bundler; optional Vite/webpack paths validated where available.


Replit Execution Profile (Required)

Goals
- Ensure all Node, React/jsdom, MERN, and (where possible) Playwright features run smoothly on Replit workspaces.
- Provide graceful fallbacks where Replit constraints apply (no Docker; possible limitations on browser installs).

Constraints
- No Docker: `testcontainers` generally unavailable; avoid container-based DB in Replit.
- Playwright browsers may be large to download; installation may be constrained. Prefer jsdom by default and auto-detect Playwright availability.
- Ports: Replit often exposes `process.env.PORT`; internal tests can still bind to random ports, but server harness must allow explicit port override.

Deliverables
- Config & CLI
  - Config: `replit: { enabled?: boolean, preferJsdom?: boolean, allowPlaywright?: boolean }`.
  - Default behavior when `process.env.REPL_ID` or similar is detected: `preferJsdom=true`, `allowPlaywright=auto`.
  - Adjust defaults: `env=jsdom` unless `allowPlaywright` and browsers are present.

- Server/Ports
  - `lib/server/testServer.ts`: accept `port?: number`; if `process.env.PORT` exists and tests require visibility, allow using it; otherwise default to 0 (ephemeral).
  - Document port strategy for Replit to avoid conflicts with the running repl.

- Database
  - Primary: `lib/db/mongoMemory.ts` (mongodb-memory-server). Cache binaries across runs when possible.
  - Fallback: `lib/db/mongoDocStore.ts` — lightweight in-memory document store mimicking a subset of Mongo driver operations used in typical apps (find, findOne, insertOne, updateOne, deleteOne, aggregate basic stages). Config key: `db.kind='mongo-docstore'`.
  - Mongoose helpers: detect fallback and provide compatible helpers; warn when advanced Mongo features are not emulated.

- Browser
  - Default to `--env=jsdom` on Replit. If Playwright detected with installed browsers, enable `--browser` flow; else warn and continue with jsdom.
  - Component testing: prefer esbuild bundler to reduce install footprint; avoid heavyweight bundlers unless detected.

- Artifacts & Coverage
  - Artifacts: write under `./logs/artifacts` as planned.
  - Coverage: use Node V8 coverage by default; for browser coverage rely on Istanbul bundler integration. Document enabling steps in Replit.

Docs & Scripts
- Provide Replit-specific docs: `.replit`/Run command examples for common flows (unit, web/jsdom, full-stack, optional Playwright if available).
- Add troubleshooting for Playwright installs and mongodb-memory-server downloads in Replit.

Tests & Acceptance (Replit)
- Spin up example MERN app under `tests/fullstack/app` and run:
  - Node-only tests (runner, assertions), jsdom React tests, full-stack flow via `mongo-memory`.
  - Force `db.kind='mongo-docstore'` and verify core CRUD paths still work in tests.
- If Playwright is available: run a minimal page and component test; otherwise verify graceful jsdom fallback with a clear log message.


Implementation Plan — LLM‑Executable Steps

Principles
- Node.js only; no browser APIs. Prefer minimal deps but allow pragmatic production deps. Exports at file bottoms. Inline comments with rationale. Tests for new files; integration tests in `./tests`. Breaking changes allowed for efficiency (with major version bump).
- Never modify `setup.js` directly. Extend behavior via new modules and registries. Ensure `setup()` runs before imports that need stubbing.

Phase 1 — Runner Core (describe/it/hooks, async, timeouts, discovery, basic reporter, CLI run)
- New files
  - `lib/runner/context.ts`: Test context, per‑run state, timeouts, random seed, env controls.
  - `lib/runner/hooks.ts`: Implement `beforeAll/afterAll/beforeEach/afterEach` storage + execution.
  - `lib/runner/dsl.ts`: Export `describe`, `it`/`test`, variants `.only/.skip`, `test.todo`.
  - `lib/runner/loader.ts`: Test file discovery and isolation (load files, register tests).
  - `lib/runner/runner.ts`: Orchestrate suites, apply timeouts, run hooks/tests, collect results.
  - `lib/reporters/specReporter.ts`: Default spec reporter (indented hierarchical output).
  - `utils/testing/errors.ts`: Error helpers, stack pruning.
  - `bin/qtests`: Node CLI entry (ESM), `qtests run` with basic flags.
- Public API additions (in `index.ts`, exports at bottom):
  - `describe`, `it`, `test`, lifecycle hooks; `run` function for programmatic execution.
- Behaviors
  - Discovery: Walk project from CWD; include globs `**/*.test.{js,ts,mjs,cjs,ts,tsx}`; ignore `node_modules`, `dist`, configurable later.
  - Async: Support async functions and returned Promises; support `done` callback if function.length > 0. Wrap with per‑test timeout (default 5s).
  - Timeouts: Precedence test > suite default > global default. Implement via `Promise.race([testFn, timeout])`.
  - Filtering: CLI `-t <pattern>` filters test names (substring/regex), and `--testPathPattern` filters files.
  - Exit code: Non‑zero on failures.
- Minimal types
  - `interface TestCase { name: string; fn: Function; timeout?: number; mode?: 'normal'|'only'|'skip'|'todo'; }`
  - `interface Suite { name: string; tests: TestCase[]; suites: Suite[]; hooks: Hooks; }`
- Tests
  - Unit: hooks ordering, timeout behavior, `done` handling, skip/only semantics.
  - Integration: run sample tests in `tests/runner/` via CLI.
- Acceptance
  - Can run suites with nested `describe`, hooks execute in correct order, timeouts enforced, clear spec output.

Phase 2 — Assertions & Matchers (`expect()`)
- New files
  - `utils/testing/expect/index.ts`: `expect(value)` factory + matcher registration.
  - `utils/testing/expect/matchers.ts`: Core matchers (toBe, toEqual, toBeTruthy/Falsy, toBeGreaterThan/LessThan, toBeCloseTo, toMatch, toContain, toHaveProperty, toThrow, resolves/rejects).
  - `utils/testing/expect/diff.ts`: Pretty diffs (JSON stable stringify + colorizing).
- Public API additions (in `index.ts`): `expect` + `extendMatchers`.
- Behaviors
  - Deep equality: stable typed deepEqual (Map/Set/Date/RegExp support) with circular detection.
  - Async helpers: `await expect(promise).resolves.toEqual(...)` and `.rejects`.
  - Custom matchers: `extendMatchers({ toBeWithinRange(...) { ... } })`.
- Tests
  - Cover all core matchers success/failure, diffs, and async helpers.
- Acceptance
  - Expect/matchers usable in runner and standalone. Helpful diffs on failure.

Phase 3 — Mocks, Spies, Timers
- New files
  - `lib/mocks/mockFunction.ts`: `mock.fn()` implementation (calls, results, mockReturnValue/ResolvedValue, mockImplementation, clear/reset/restore).
  - `lib/mocks/spyOn.ts`: Property method spy with restore.
  - `lib/timers/fakeTimers.ts`: Timer faking API: `useFakeTimers`, `useRealTimers`, `advanceTimersByTime`, `runAllTimers`, `runOnlyPendingTimers`, `setSystemTime`.
- Public API additions: `mock` namespace with `fn`, `spyOn`; `timers` or integrate into `mock` as `mock.timers`.
- Isolation
  - Reset mocks/timers in `afterEach` by default; add config to opt‑out.
- Tests
  - Call tracking, restore semantics, timer advancement, nested fakes.
- Acceptance
  - Replace Jest/Sinon for common mocking scenarios in Node services.

Phase 4 — Reporters & Watch Mode
- New files
  - `lib/reporters/dotReporter.ts`, `jsonReporter.ts`, `junitReporter.ts`, `tapReporter.ts`.
  - `lib/watch/watch.ts`: fs.watch‑based incremental re‑run, debounce, cache last status.
- CLI flags
  - `--reporters=spec,dot,json`, `--outputFile=results.json`, `--watch`, `--watchAll`, `--bail`, `--retries`.
- Reporter API
  - `IReporter` with hooks: `onRunStart`, `onSuiteStart`, `onTestResult`, `onSuiteResult`, `onRunComplete`.
- Tests
  - Reporter unit tests (JSON output shape, JUnit XML format), watch cycle basic integration test.
- Acceptance
  - Human‑friendly spec/dot; machine‑readable JSON/JUnit; stable TAP. Watch updates on file changes.

Phase 5 — Coverage & Parallelism
- Coverage
  - Implement with Node V8 coverage: use `v8.takeCoverage()` and `v8.stopCoverage()` (Node ≥16), aggregate per file, output lcov/txt/json.
  - If `c8` present, integrate by honoring `C8_*` env or child process spawn; do not hard‑depend.
- Parallelism
  - `lib/runner/worker.ts`: Per‑file execution via `worker_threads` (fallback to `child_process` when needed). Config `--maxWorkers` (default: CPU cores‑1).
  - Isolate env per worker, aggregate results/reports in parent.
- Tests
  - Coverage diff across simple files, parallel run determinism, shard correctness.
- Acceptance
  - Meaningful coverage output without external deps; speedup on multi‑core.

Phase 6 — Snapshots
- New files
  - `lib/snapshots/serializer.ts`: Default stable serializer (sorted keys, normalize paths/dates via options).
  - `lib/snapshots/manager.ts`: Read/write `__snapshots__/*.snap` alongside test files; `--updateSnapshot` support.
  - Integrate into expect: `expect(value).toMatchSnapshot([name])`.
- Tests
  - Snapshot creation, update, failure diffs, custom serializer example.
- Acceptance
  - Replace Jest snapshots for Node library/service outputs.

Phase 7 — Config & Polish
- Config loader
  - `lib/config/loadConfig.ts`: Load `qtests.config.{js,ts,mjs}`; schema validate.
  - Options: `testMatch`, `testIgnore`, `timeout`, `retries`, `bail`, `reporters`, `coverage`, `watch`, `maxWorkers`, `setupFiles`, `setupFilesAfterEnv`, `globals`, `snapshotDir`, `moduleNameMapper` (Node‑oriented), `restoreMocks`.
- CLI polish
  - Subcommands: `run`, `watch`; flags docs and `--help` output.
- Docs
  - Add migration guides (“From Mocha”, “From Jest”), and examples for resolver‑based module mocking.
- Acceptance
  - Configurable behavior via file and flags; clear docs for migration.

Resolver‑Backed Module Mocks (Extend Current Strength)
- Goal: Layer configurable module mocks on top of current stubs without touching `setup.js`.
- Plan
  - `lib/stubsRegistry.ts`: Runtime registry: `{ [moduleName: string]: () => any | any }`.
  - `lib/mockModule.ts`: Public `mock.module(name, factory|value)` to register a mock; `mock.unmock(name)`; `mock.resetAll()`.
  - `setup.ts` (TypeScript wrapper) to import and initialize registry before tests run; ensure compatibility with `setup.js` policy by not modifying it.
  - `lib/stubs.ts`: Prefer registry entry > built‑in stub > real module (documented precedence).
- Tests
  - Mock module overrides built‑in axios/winston stubs; unmock restores behavior.

CLI & File Flows (LLM Checklist)
- Add `bin/qtests` (ESM): parse args, load config, run discovery, spawn runner, print via reporter.
- Ensure exports added at the bottom of `index.ts`: `describe`, `it`, `test`, hooks, `expect`, `mock`, `timers`, `run`.
- Update docs: `README.md` and `lib/summary.md` (new/changed modules), plus `agentRecords` log entry.
- Add tests:
  - Unit tests colocated with modules (e.g., `lib/runner/hooks.test.ts`).
  - Integration tests in `./tests` verifying CLI behavior, watch, coverage, snapshots.

Compatibility, Security, and Performance Notes
- Node versions: target 16/18/20; avoid APIs newer than 16 unless guarded.
- Security: no network, no remote code eval; isolate workers; sanitize snapshot outputs.
- Performance: lazy‑load reporters; debounce file watching; keep deepEqual and diff efficient; parallelize by file.

Risks & Mitigations
- Fake timers correctness: isolate per test; provide escape hatch to real timers.
- ESM/TS loading ambiguity: prefer precompiled TS; auto‑detect `ts-node/tsx` when present; document loader options.
- Coverage drift with V8: document Node version caveats; permit `c8` passthrough.

Definition of Done (Parity for Node Services/Libs)
- Teams can remove Jest/Mocha/Sinon/Chai and run with only qtests (plus optional `ts-node/tsx` if needed).
- Features available: runner, lifecycle, expect/matchers, spies/mocks/timers, reporters, coverage, watch, parallelism, snapshots, config/CLI.
- qtests’ differentiator preserved: global auto‑stubbing and env/offline utilities.
