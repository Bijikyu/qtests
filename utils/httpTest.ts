// Minimal TS wrapper that re-exports the canonical CJS shim.
// Keeping this file TS avoids ESM/CJS ambiguity in Jest + ts-jest.
// Using .js explicit path prevents recursive re-exports under transpilation.
// Types are inferred as any to keep the wrapper thin and dependency-free.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export { createMockApp, supertest } from './httpTest.shim.js';
