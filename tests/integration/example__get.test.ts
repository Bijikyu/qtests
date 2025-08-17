// Auto-generated API test for GET /api/status
import request from '../../src/app';

describe('GET /api/status', () => {
  test('should succeed', async () => {
    const res = await request.get('/api/status');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.get('/api/status').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
