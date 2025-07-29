// Auto-generated API test for PATCH /api/settings
import request from '../../src/app';

describe('PATCH /api/settings', () => {
  test('should succeed', async () => {
    const res = await request.patch('/api/settings');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.patch('/api/settings').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
