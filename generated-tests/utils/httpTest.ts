// Re-export the JS shim so tests work in TS/ESM
// Use a different filename to avoid Jest's moduleNameMapper resolving back to this TS file
export { createMockApp, supertest } from './httpTest.shim.js';
