# qtests Roadmap Scaffolds (TypeScript)

Note: These are scaffolds/pseudocode only. They are not wired into the build. Use them as starting points to implement the roadmap in phases without breaking existing code.

## 1) Runner Core

```ts
// lib/runner/context.ts
export interface TestCase {
  name: string;
  fn: (done?: (err?: any) => void) => any | Promise<any>;
  timeoutMs?: number;
  mode?: 'normal' | 'only' | 'skip' | 'todo';
}

export interface Hooks {
  beforeAll: Array<() => any | Promise<any>>;
  afterAll: Array<() => any | Promise<any>>;
  beforeEach: Array<() => any | Promise<any>>;
  afterEach: Array<() => any | Promise<any>>;
}

export interface Suite {
  name: string;
  tests: TestCase[];
  suites: Suite[];
  hooks: Hooks;
}

export interface RunOptions {
  timeoutMs?: number;
  filterName?: RegExp;
}

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped' | 'todo';
  error?: Error;
  durationMs?: number;
}

export interface SuiteResult {
  name: string;
  results: TestResult[];
  suites: SuiteResult[];
}

export interface RunResult {
  root: SuiteResult;
  passed: number;
  failed: number;
  skipped: number;
  todo: number;
  durationMs: number;
}

export const rootSuite: Suite = {
  name: 'root',
  tests: [],
  suites: [],
  hooks: { beforeAll: [], afterAll: [], beforeEach: [], afterEach: [] }
};

export function resetRootSuite(): void {
  rootSuite.tests.length = 0;
  rootSuite.suites.length = 0;
  rootSuite.hooks.beforeAll.length = 0;
  rootSuite.hooks.afterAll.length = 0;
  rootSuite.hooks.beforeEach.length = 0;
  rootSuite.hooks.afterEach.length = 0;
}
```

```ts
// lib/runner/hooks.ts
import { Suite } from './context.js';

export function pushHook(target: Suite, type: keyof Suite['hooks'], hook: () => any) {
  target.hooks[type].push(hook);
}

export async function runHooks(hooks: Array<() => any | Promise<any>>) {
  for (const h of hooks) await h();
}
```

```ts
// lib/runner/dsl.ts
import { rootSuite, Suite, TestCase } from './context.js';
import { pushHook } from './hooks.js';

let currentSuite: Suite = rootSuite;
const suiteStack: Suite[] = [];

export function describe(name: string, fn: () => void) {
  const suite: Suite = {
    name,
    tests: [],
    suites: [],
    hooks: { beforeAll: [], afterAll: [], beforeEach: [], afterEach: [] }
  };
  currentSuite.suites.push(suite);
  suiteStack.push(currentSuite);
  currentSuite = suite;
  try { fn(); } finally { currentSuite = suiteStack.pop()!; }
}

export function it(name: string, fn: TestCase['fn']) {
  currentSuite.tests.push({ name, fn });
}

export const test = it;
it.only = (name: string, fn: TestCase['fn']) => currentSuite.tests.push({ name, fn, mode: 'only' });
it.skip = (name: string, _fn: TestCase['fn']) => currentSuite.tests.push({ name, fn: () => {}, mode: 'skip' });
test.only = it.only;
test.skip = it.skip;

export function beforeAll(fn: () => any) { pushHook(currentSuite, 'beforeAll', fn); }
export function afterAll(fn: () => any) { pushHook(currentSuite, 'afterAll', fn); }
export function beforeEach(fn: () => any) { pushHook(currentSuite, 'beforeEach', fn); }
export function afterEach(fn: () => any) { pushHook(currentSuite, 'afterEach', fn); }
```

```ts
// lib/runner/loader.ts
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export interface DiscoveryOptions { cwd: string; patterns: string[]; ignore?: string[] }

export function discoverTestFiles(opts: DiscoveryOptions): string[] {
  // Pseudocode: walk directories, filter by glob; return sorted list
  return [];
}

export async function loadTestFile(file: string) {
  // ESM dynamic import
  await import(path.isAbsolute(file) ? pathToFileURL(file).href : file);
}
```

```ts
// lib/runner/runner.ts
import { rootSuite, RunOptions, RunResult, SuiteResult, TestResult } from './context.js';
import { runHooks } from './hooks.js';

export async function run(opts: RunOptions = {}): Promise<RunResult> {
  const started = Date.now();
  // TODO apply filters, only/skip
  const root: SuiteResult = await runSuite(rootSuite, opts);
  const durationMs = Date.now() - started;
  const counts = countResults(root);
  return { root, durationMs, ...counts };
}

async function runSuite(suite: any, opts: RunOptions): Promise<SuiteResult> {
  const res: SuiteResult = { name: suite.name, results: [], suites: [] };
  await runHooks(suite.hooks.beforeAll);
  for (const t of suite.tests) res.results.push(await runTest(t, suite, opts));
  for (const s of suite.suites) res.suites.push(await runSuite(s, opts));
  await runHooks(suite.hooks.afterAll);
  return res;
}

async function runTest(t: any, suite: any, opts: RunOptions): Promise<TestResult> {
  if (t.mode === 'skip') return { name: t.name, status: 'skipped' };
  const started = Date.now();
  await runHooks(suite.hooks.beforeEach);
  try {
    await runWithTimeout(t.fn, t.timeoutMs ?? opts.timeoutMs ?? 5000);
    return { name: t.name, status: 'passed', durationMs: Date.now() - started };
  } catch (err: any) {
    return { name: t.name, status: 'failed', error: err, durationMs: Date.now() - started };
  } finally {
    await runHooks(suite.hooks.afterEach);
  }
}

function runWithTimeout(fn: any, timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    let doneCalled = false;
    const done = (err?: any) => { if (!doneCalled) { doneCalled = true; err ? reject(err) : resolve(); } };
    const p = fn.length > 0 ? fn(done) : Promise.resolve().then(() => fn());
    const timer = setTimeout(() => reject(new Error(`Test timeout after ${timeout}ms`)), timeout);
    Promise.resolve(p).then(() => { clearTimeout(timer); done(); }, (e) => { clearTimeout(timer); reject(e); });
  });
}

function countResults(root: SuiteResult) {
  let passed = 0, failed = 0, skipped = 0, todo = 0;
  const visit = (s: SuiteResult) => {
    for (const r of s.results) {
      if (r.status === 'passed') passed++; else if (r.status === 'failed') failed++; else if (r.status === 'skipped') skipped++; else todo++;
    }
    s.suites.forEach(visit);
  };
  visit(root);
  return { passed, failed, skipped, todo };
}
```

```ts
// lib/reporters/specReporter.ts
import type { RunResult, SuiteResult, TestResult } from '../runner/context.js';

export function specReport(result: RunResult) {
  // Pseudocode: print nested suites/tests with ✓/✗ and durations
}
```

## 2) Assertions & Matchers

```ts
// utils/testing/expect/index.ts
type MatcherFn = (this: { isNot: boolean }, received: any, ...args: any[]) => { pass: boolean; message: () => string };

const registry = new Map<string, MatcherFn>();

export function expect(received: any) {
  const api: any = {};
  for (const [name, fn] of registry) {
    api[name] = (...args: any[]) => {
      const { pass, message } = fn.call({ isNot: false }, received, ...args);
      if (!pass) throw new Error(message());
    };
    api.not = api.not || {};
    api.not[name] = (...args: any[]) => {
      const { pass, message } = fn.call({ isNot: true }, received, ...args);
      if (!pass) throw new Error(message());
    };
  }
  return api;
}

export function extendMatchers(map: Record<string, MatcherFn>) {
  for (const k of Object.keys(map)) registry.set(k, map[k]);
}
```

```ts
// utils/testing/expect/matchers.ts
import { extendMatchers } from './index.js';

extendMatchers({
  toBe(received, expected) {
    const pass = Object.is(received, expected);
    return { pass, message: () => `Expected ${received} to be ${expected}` };
  },
  toEqual(received, expected) {
    // TODO deep equal
    const pass = JSON.stringify(received) === JSON.stringify(expected);
    return { pass, message: () => `Expected deep equal` };
  }
});
```

## 3) Mocks, Spies, Timers

```ts
// lib/mocks/mockFunction.ts
export interface Mock<TArgs extends any[] = any[], TRet = any> {
  mock: { calls: TArgs[]; results: { type: 'return' | 'throw'; value: any }[] };
  (...args: TArgs): TRet;
  mockReturnValue(v: TRet): this;
  mockResolvedValue(v: any): this;
  mockImplementation(fn: (...args: TArgs) => TRet): this;
  mockClear(): this; mockReset(): this; mockRestore(): this;
}

export function fn<TArgs extends any[] = any[], TRet = any>(): Mock<TArgs, TRet> {
  // Pseudocode: record calls/results; support implementation and return values
  return Object.assign(function mockImpl() { /* ... */ }, { mock: { calls: [], results: [] } });
}
```

```ts
// lib/mocks/spyOn.ts
import { fn } from './mockFunction.js';
export function spyOn<T extends object, K extends keyof T>(obj: T, key: K) {
  const original = obj[key] as any;
  const m = fn();
  (obj as any)[key] = m as any;
  return { mock: m, restore() { (obj as any)[key] = original; } };
}
```

```ts
// lib/timers/fakeTimers.ts
export function useFakeTimers() { /* swap global timers */ }
export function useRealTimers() { /* restore */ }
export function advanceTimersByTime(ms: number) { /* tick */ }
export function runAllTimers() { /* flush */ }
```

## 4) Stubs Registry / Mock Module

```ts
// lib/stubsRegistry.ts
const registry = new Map<string, any>();
const factories = new Map<string, () => any>();

export function registerModule(name: string, impl: any | (() => any)) {
  if (typeof impl === 'function') factories.set(name, impl as any); else registry.set(name, impl);
}
export function resolveModule(name: string) {
  if (registry.has(name)) return registry.get(name);
  if (factories.has(name)) return factories.get(name)!();
  return undefined;
}
export function unmock(name: string) { registry.delete(name); factories.delete(name); }
export function resetAll() { registry.clear(); factories.clear(); }
```

## 5) Web/React (jsdom + render)

```ts
// lib/env/jsdomEnv.ts
export async function setupJsdom() {
  // Create jsdom, set globals: window, document, navigator, fetch (stub), timers
}
export async function teardownJsdom() { /* cleanup */ }
```

```ts
// lib/react/render.ts
export interface RenderResult { container: HTMLElement; cleanup(): void }
export function render(element: any, opts?: { container?: HTMLElement }): RenderResult {
  // React 18: createRoot(container).render(element); return cleanup()
  // NOTE: ensure setupJsdom() was called before render in test envs.
  return { container: document.createElement('div'), cleanup() {} };
}
```

## 6) Server & MERN

```ts
// lib/server/testServer.ts
import http from 'node:http';
export interface TestServer { url: string; port: number; close(): Promise<void> }
export async function startServer(app: any, port?: number): Promise<TestServer> {
  // If app is express, http.createServer(app).listen(...)
  return { url: 'http://127.0.0.1:0', port: 0, close: async () => {} };
}
```

```ts
// lib/db/mongoMemory.ts
export interface MongoMemoryHandle { uri: string; stop(): Promise<void> }
export async function startMongoMemory(): Promise<MongoMemoryHandle> { return { uri: 'mongodb://...', stop: async () => {} }; }
```

```ts
// lib/db/mongoDocStore.ts (fallback for constrained environments like Replit)
export type CollectionDoc = Record<string, any> & { _id?: string };
export interface DocStore { collection(name: string): {
  find(query?: Record<string, any>): CollectionDoc[];
  findOne(query?: Record<string, any>): CollectionDoc | null;
  insertOne(doc: CollectionDoc): { insertedId: string };
  updateOne(filter: any, update: any): { matchedCount: number; modifiedCount: number };
  deleteOne(filter: any): { deletedCount: number };
}}
export function createDocStore(): DocStore { /* minimal in-memory impl */ return { collection: () => ({ find: () => [], findOne: () => null, insertOne: () => ({ insertedId: '1' }), updateOne: () => ({ matchedCount: 0, modifiedCount: 0 }), deleteOne: () => ({ deletedCount: 0 }) }) }; }
```

```ts
// lib/db/mongooseTest.ts
export async function connect(uri: string) { /* mongoose.connect */ }
export async function disconnect() { /* mongoose.disconnect */ }
export async function clearCollections() { /* drop data */ }
```

## 7) Playwright (page + coverage)

```ts
// adapters/playwright/launcher.ts
export interface BrowserOptions { name: 'chromium'|'firefox'|'webkit'; headless?: boolean }
export async function withBrowser<T>(opts: BrowserOptions, fn: (ctx: { browser: any, context: any, page: any }) => Promise<T>) {
  // Launch, create context/page, run fn, teardown
}
```

```ts
// lib/env/playwrightEnv.ts
export async function setupPlaywrightEnv() { /* wire globals if desired */ }
export async function teardownPlaywrightEnv() { /* cleanup */ }
```

```ts
// lib/coverage/browserCollector.ts
export async function collectBrowserCoverage(page: any) {
  // await page.evaluate(() => window.__coverage__)
  return {};
}
```

## 8) Playwright Component Testing

```ts
// lib/react/componentMount.ts
export interface ComponentHandle { rerender(next: any): Promise<void>; unmount(): Promise<void> }
export async function mount(element: any): Promise<ComponentHandle> {
  // Bridge to host page to mount component
  return { rerender: async () => {}, unmount: async () => {} };
}
```

```ts
// adapters/playwright/componentRunner.ts
export async function runComponentTest(file: string) {
  // Bundle test and component, open host page, inject, run assertions
}
```

```ts
// adapters/playwright/bundler/esbuildComponent.ts
export async function bundleComponentTest(entry: string): Promise<{ outfile: string }> {
  // esbuild compile TS/TSX with React jsx
  return { outfile: 'dist/tmp.js' };
}
```

## 9) Replit Profile

```ts
// notes
// - Prefer jsdom by default; auto-detect Playwright availability
// - Use mongodb-memory-server; fallback to in-memory docstore when needed
// - Bind servers to PORT when visibility needed; ephemeral port otherwise
```

## 10) Test Generation (heuristic + AST)

```ts
// lib/testGenerator2.ts (new)
export interface GeneratorOptions {
  mode: 'heuristic' | 'ast';
  srcDir: string;
  testDir: string;
  env?: 'node' | 'jsdom' | 'browser';
  template?: 'node' | 'react' | 'playwright-page' | 'playwright-component' | 'mern';
  dryRun?: boolean;
}

export class TestGenerator2 {
  constructor(private opts: GeneratorOptions) {}
  async discover(): Promise<string[]> { return []; }
  async generateForFile(file: string): Promise<{ outPath: string; content: string }> { return { outPath: '', content: '' }; }
  async write(outPath: string, content: string) {/* fs.writeFile */}
}
```

```ts
// lib/testTemplates/reactJsdom.ts
export function renderReactJsdomTemplate(params: { relImport: string; name: string }) { return `/* test code */`; }
```
