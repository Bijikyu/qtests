// Minimal httpTest shim for generated integration tests
export { default as supertest } from 'supertest';
export function createMockApp() { throw new Error('createMockApp not available in shim'); }