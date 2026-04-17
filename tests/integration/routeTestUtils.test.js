'use strict';
/**
 * Dogfood tests for lib/routeTestUtils.ts
 *
 * These exercise the module's exported helpers that generate Jest describe/test
 * blocks.  We call them at the top level of this file — Jest picks up the
 * describe blocks they register as part of the normal suite.
 */

const {
  createRouteTests,
  createGetRouteTest,
  createPostRouteTest,
  createPutRouteTest,
  createDeleteRouteTest,
  createMultipleRouteTests,
  createResourceTests,
  routeTestUtils,
} = require('../../dist/lib/routeTestUtils.js');

// ---------------------------------------------------------------------------
// 1. createGetRouteTest — default 200 success + 400 error
// ---------------------------------------------------------------------------
createGetRouteTest('/health', { ok: true });

// ---------------------------------------------------------------------------
// 2. createPostRouteTest — default 200 success + 400 error
// ---------------------------------------------------------------------------
createPostRouteTest('/items', { id: 1, created: true });

// ---------------------------------------------------------------------------
// 3. createPutRouteTest — default 200 success + 400 error
// ---------------------------------------------------------------------------
createPutRouteTest('/items/1', { id: 1, updated: true });

// ---------------------------------------------------------------------------
// 4. createDeleteRouteTest — default 200 success + 400 error
// ---------------------------------------------------------------------------
createDeleteRouteTest('/items/1', { deleted: true });

// ---------------------------------------------------------------------------
// 5. createRouteTests with explicit successStatus — the bug was that
//    executeRequest always called .expect(200), ignoring successStatus.
//    This test registers a route that deliberately returns 201 and verifies
//    the generated test suite does NOT throw.
// ---------------------------------------------------------------------------
createRouteTests({
  method: 'POST',
  path: '/things',
  successStatus: 201,
  successResponse: { id: 99, created: true },
  errorStatus: 422,
  errorResponse: 'Unprocessable entity',
  description: 'POST /things with custom status codes',
});

// ---------------------------------------------------------------------------
// 6. createMultipleRouteTests — generates a wrapping describe
// ---------------------------------------------------------------------------
createMultipleRouteTests([
  { method: 'GET',    path: '/ping', successResponse: { pong: true } },
  { method: 'POST',   path: '/echo', successResponse: { echo: true } },
  { method: 'DELETE', path: '/nuke', successResponse: { nuked: true } },
]);

// ---------------------------------------------------------------------------
// 7. createResourceTests — generates describe for all 5 CRUD operations
// ---------------------------------------------------------------------------
createResourceTests('/products', 'Product');

// ---------------------------------------------------------------------------
// 8. routeTestUtils namespace object — spot-check the re-exports
// ---------------------------------------------------------------------------
describe('routeTestUtils namespace object', () => {
  test('exports all convenience helpers', () => {
    expect(typeof routeTestUtils.create).toBe('function');
    expect(typeof routeTestUtils.createGet).toBe('function');
    expect(typeof routeTestUtils.createPost).toBe('function');
    expect(typeof routeTestUtils.createPut).toBe('function');
    expect(typeof routeTestUtils.createDelete).toBe('function');
    expect(typeof routeTestUtils.createMultiple).toBe('function');
    expect(typeof routeTestUtils.createResource).toBe('function');
    expect(typeof routeTestUtils.createSuccessResponse).toBe('function');
    expect(typeof routeTestUtils.createErrorResponse).toBe('function');
    expect(typeof routeTestUtils.executeRequest).toBe('function');
    expect(typeof routeTestUtils.executeErrorRequest).toBe('function');
  });

  test('createSuccessResponse returns a function', () => {
    const handler = routeTestUtils.createSuccessResponse({ hello: 'world' }, 200);
    expect(typeof handler).toBe('function');
    const res = { statusCode: 0, headers: {}, body: null, setHeader(k, v) { this.headers[k] = v; }, end(b) { this.body = b; } };
    handler({}, res);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ hello: 'world' });
  });

  test('createErrorResponse returns a function', () => {
    const handler = routeTestUtils.createErrorResponse('gone wrong', 503);
    expect(typeof handler).toBe('function');
    const res = { statusCode: 0, headers: {}, body: null, setHeader(k, v) { this.headers[k] = v; }, end(b) { this.body = b; } };
    handler({}, res);
    expect(res.statusCode).toBe(503);
    expect(JSON.parse(res.body)).toEqual({ error: 'gone wrong' });
  });
});

// ---------------------------------------------------------------------------
// 9. PATCH is a valid method via createRouteTests
// ---------------------------------------------------------------------------
createRouteTests({
  method: 'PATCH',
  path: '/items/1',
  successResponse: { id: 1, patched: true },
  description: 'PATCH /items/1',
});
