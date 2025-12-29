/**
 * HTTP Testing Utilities - Express-like Mocking for Tests
 * 
 * This module provides HTTP testing capabilities without requiring actual servers.
 * It re-exports from the TypeScript shim to maintain ESM compatibility while
 * providing a clean interface for mocking HTTP requests and responses.
 * 
 * Features:
 * - Express-like app creation with routing
 * - Supertest-like client for HTTP assertions
 * - In-memory request/response handling
 * - No actual network connections required
 * 
 * Usage Pattern:
 *   import { createMockApp, supertest } from './httpTest.js';
 *   const app = createMockApp();
 *   app.get('/api/test', (req, res) => res.json({ message: 'test' }));
 *   const response = await supertest(app).get('/api/test').expect(200);
 */

// Re-export from the TypeScript shim for ESM compatibility
export { createMockApp, supertest } from './httpTest.shim.js';
