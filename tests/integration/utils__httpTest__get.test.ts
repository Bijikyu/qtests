// Auto-generated API test for GET /test
import request from '../../src/app';

describe('GET /test', () => {
  test('should succeed', async () => {
    const res = await request.get('/test');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.get('/test').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
