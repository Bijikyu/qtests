// Auto-generated API test for DELETE /api/history - optimized for speed
import { httpTest } from 'qtests/lib/envUtils';

describe('DELETE /api/history', () => {
  // Shared app setup for performance
  let sharedApp;
  beforeAll(() => {
    sharedApp = httpTest.createMockApp();
  });

  test('should succeed', async () => {
    // Reuse shared app for speed
    const app = httpTest.createMockApp();
    app.delete('/api/history', (req, res) => {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    });
    
    const res = await httpTest.supertest(app)
      .delete('/api/history')
      .expect(200)
      .end();
    
    expect(res.body.success).toBe(true);
  });

  test('should handle error responses', async () => {
    const app = httpTest.createMockApp();
    app.delete('/api/history', (req, res) => {
      res.statusCode = 400;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'Bad request' }));
    });
    
    const res = await httpTest.supertest(app)
      .delete('/api/history')
      .expect(400)
      .end();
    
    expect(res.body.error).toBe('Bad request');
  });
});
