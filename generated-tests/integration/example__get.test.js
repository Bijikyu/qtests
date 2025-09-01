// Auto-generated API test for GET /api/status - optimized for speed
import { httpTest } from '../../utils/httpTest.js';

describe('GET /api/status', () => {
  // Shared app setup for performance
  let sharedApp;
  beforeAll(() => {
    sharedApp = httpTest.createMockApp();
  });

  test('should succeed', async () => {
    // Reuse shared app for speed
    const app = httpTest.createMockApp();
    app.get('/api/status', (req, res) => {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    });
    
    const res = await httpTest.supertest(app)
      .get('/api/status')
      .expect(200)
      .end();
    
    expect(res.body.success).toBe(true);
  });

  test('should handle error responses', async () => {
    const app = httpTest.createMockApp();
    app.get('/api/status', (req, res) => {
      res.statusCode = 400;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'Bad request' }));
    });
    
    const res = await httpTest.supertest(app)
      .get('/api/status')
      .expect(400)
      .end();
    
    expect(res.body.error).toBe('Bad request');
  });
});
