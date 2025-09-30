// Re-export the JS shim so tests work in TS/ESM
export { createMockApp, supertest } from './httpTest.shim.js';
