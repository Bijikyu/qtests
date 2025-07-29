// Auto-generated API test for POST /api/calculate
import request from '../../src/app';

describe('POST /api/calculate', () => {
  test('should succeed', async () => {
    const res = await request.post('/api/calculate');
    expect(res.status).toBe(200);
  });

  test('should handle failure', async () => {
    const res = await request.post('/api/calculate').send({ bad: true });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
