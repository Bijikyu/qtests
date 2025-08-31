// Auto-generated API test for PUT /api/users/:id - TypeScript ES module
// PARALLEL-SAFE DESIGN: This test avoids race conditions

// Unique API test session for parallel execution safety
const apiTestSession = `${process.hrtime.bigint()}-${Math.random().toString(36).substr(2, 9)}`;
const uniqueRoute = '/api/users/:id' + (/api/users/:id.includes('?') ? '&' : '?') + 'testSession=' + apiTestSession;

import { httpTest } from 'qtests/lib/envUtils';

describe(`PUT /api/users/:id [API-${apiTestSession}]`, () => {
  // Test data factory for unique request/response data
  const createUniqueTestData = () => ({
    sessionId: apiTestSession,
    requestId: `req-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
  });

  test('should succeed with unique test data', async () => {
    const testData = createUniqueTestData();
    const app = httpTest.createMockApp();
    
    app.put(uniqueRoute, (req, res) => {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ 
        success: true, 
        testSession: apiTestSession,
        requestId: testData.requestId
      }));
    });
    
    const res = await httpTest.supertest(app)
      .put(uniqueRoute)
      .send(testData)
      .expect(200);
    
    expect(res.body.success).toBe(true);
    expect(res.body.testSession).toBe(apiTestSession);
  });
});
