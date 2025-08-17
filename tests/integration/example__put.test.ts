// Auto-generated API test for PUT /api/users/:id
import request from '../../src/app';

describe('PUT /api/users/:id', () => {
  test('should succeed', async () => {
    const res = await request.put('/api/users/:id');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.put('/api/users/:id').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
