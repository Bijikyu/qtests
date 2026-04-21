// 🔗 Tests: demo/server/routes/users.js → demo/server/app.js
import path from 'path';

// qtests/setup stubs the bare "axios" module id, so the tests use the package entry file directly.
const realAxios = require(path.join(process.cwd(), 'node_modules', 'axios', 'dist', 'node', 'axios.cjs')) as typeof import('axios');
const app = require('../../../../demo/server/app.js') as {
  listen: (port: number) => {
    address: () => { port: number } | string | null;
    close: (callback: () => void) => void;
    once: (event: string, callback: () => void) => void;
  };
};

describe('demo/server/routes/users', () => {
  let server: ReturnType<typeof app.listen>;
  let baseUrl: string;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(resolve));
  });

  test('GET /api/users returns the seeded users collection with stable fields', async () => {
    const response = await realAxios.get(`${baseUrl}/api/users`);

    expect(response.status).toBe(200);
    expect(response.data.count).toBeGreaterThan(0);
    expect(Array.isArray(response.data.users)).toBe(true);
    expect(response.data.users[0]).toEqual(expect.objectContaining({
      name: expect.any(String),
      email: expect.any(String),
    }));
  });

  test('POST /api/users creates a user when the payload is valid', async () => {
    const response = await realAxios.post(`${baseUrl}/api/users`, {
      name: 'Alice Example',
      email: 'alice@example.com',
    });

    expect(response.status).toBe(201);
    expect(response.data).toEqual(expect.objectContaining({
      name: 'Alice Example',
      email: 'alice@example.com',
    }));
  });

  test('POST /api/users rejects invalid email addresses with a 400 response', async () => {
    const response = await realAxios.post(`${baseUrl}/api/users`, {
      name: 'Broken User',
      email: 'not-an-email',
    }, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
    expect(response.data).toEqual(expect.objectContaining({
      error: 'Invalid email format',
    }));
  });
});
