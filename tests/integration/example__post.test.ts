// Auto-generated API test for POST /api/users
import request from '../../src/app';

describe('POST /api/users', () => {
  test('should succeed', async () => {
    const res = await request.post('/api/users');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.post('/api/users').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
