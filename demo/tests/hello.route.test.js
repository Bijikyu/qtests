// Always load qtests setup first to enable module resolution stubbing.
require('qtests/setup');

const request = require('supertest');

describe('GET /api/hello', () => {
  it('returns ok with stubbed external data', async () => {
    const app = require('../server/app');
    const res = await request(app).get('/api/hello').expect(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('hasData', true);
  });
});

