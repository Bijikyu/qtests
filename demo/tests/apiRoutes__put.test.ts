// Auto-generated API test for PUT /api/calculate/:operation
import request from '../../src/app';

describe('PUT /api/calculate/:operation', () => {
  test('should succeed', async () => {
    const res = await request.put('/api/calculate/:operation');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.put('/api/calculate/:operation').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
