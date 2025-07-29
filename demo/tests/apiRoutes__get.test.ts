// Auto-generated API test for GET /api/health
import request from '../../src/app';

describe('GET /api/health', () => {
  test('should succeed', async () => {
    const res = await request.get('/api/health');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.get('/api/health').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
