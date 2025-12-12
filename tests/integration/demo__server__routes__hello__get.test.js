import { createMockApp, supertest } from 'qtests/utils/httpTest';
const httpTest = { createMockApp, supertest };

describe('GET /hello', () => {
  let sharedApp;
  beforeAll(() => {
    sharedApp = httpTest.createMockApp();
  });

  test('should succeed', async () => {
    const app = httpTest.createMockApp();
    app.get('/hello', (req, res) => {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    });
    
    const res = await httpTest.supertest(app)
      .get('/hello')
      .expect(200)
      .end();
    
    expect(res.body.success).toBe(true);
  });

  test('should handle error responses', async () => {
    const app = httpTest.createMockApp();
    app.get('/hello', (req, res) => {
      res.statusCode = 400;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'Bad request' }));
    });
    
    const res = await httpTest.supertest(app)
      .get('/hello')
      .expect(400)
      .end();
    
    expect(res.body.error).toBe('Bad request');
  });
});
