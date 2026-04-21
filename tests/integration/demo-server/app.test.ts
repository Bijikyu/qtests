// 🔗 Tests: demo/server/app.js → demo/server/routes/root.js → demo/server/routes/status.js
import path from 'path';

// qtests/setup stubs the bare "axios" module id, so the tests use the package entry file directly.
const realAxios = require(path.join(process.cwd(), 'node_modules', 'axios', 'dist', 'node', 'axios.cjs')) as typeof import('axios');
const app = require('../../../demo/server/app.js') as {
  listen: (port: number) => {
    address: () => { port: number } | string | null;
    close: (callback: () => void) => void;
    once: (event: string, callback: () => void) => void;
  };
};

describe('demo/server/app', () => {
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

  test('GET /health returns the public health payload', async () => {
    const response = await realAxios.get(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: true });
  });

  test('GET /api/health returns API health fields without asserting volatile timestamps', async () => {
    const response = await realAxios.get(`${baseUrl}/api/health`);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(expect.objectContaining({
      ok: true,
      status: 'healthy',
      timestamp: expect.any(String),
    }));
  });
});
