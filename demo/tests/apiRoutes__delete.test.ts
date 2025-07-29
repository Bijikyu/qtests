// Auto-generated API test for DELETE /api/history
import request from '../../src/app';

describe('DELETE /api/history', () => {
  test('should succeed', async () => {
    const res = await request.delete('/api/history');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.delete('/api/history').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
