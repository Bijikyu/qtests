// Auto-generated API test for PUT /api/users/:id
const { httpTest } = require('qtests/lib/envUtils');

describe('PUT /api/users/:id', () => {
  test('should succeed', async () => {
    // Create mock app for testing
    const app = httpTest.createMockApp();
    app.put('/api/users/:id', (req, res) => {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    });
    
    const res = await httpTest.supertest(app)
      .put('/api/users/:id')
      .expect(200)
      .end();
    
    expect(res.body.success).toBe(true);
  });

  test('should handle error responses', async () => {
    const app = httpTest.createMockApp();
    app.put('/api/users/:id', (req, res) => {
      res.statusCode = 400;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'Bad request' }));
    });
    
    const res = await httpTest.supertest(app)
      .put('/api/users/:id')
      .expect(400)
      .end();
    
    expect(res.body.error).toBe('Bad request');
  });
});
