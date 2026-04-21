// 🔗 Tests: demo/server/routes/hello.js → demo/server/services/externalService.js
import path from 'path';

jest.mock('../../../../demo/server/services/externalService.js', () => ({
  fetchHello: jest.fn(),
}));

// qtests/setup stubs the bare "axios" module id, so the tests use the package entry file directly.
const realAxios = require(path.join(process.cwd(), 'node_modules', 'axios', 'dist', 'node', 'axios.cjs')) as typeof import('axios');
const { fetchHello } = require('../../../../demo/server/services/externalService.js') as {
  fetchHello: jest.Mock;
};
const app = require('../../../../demo/server/app.js') as {
  listen: (port: number) => {
    address: () => { port: number } | string | null;
    close: (callback: () => void) => void;
    once: (event: string, callback: () => void) => void;
  };
};

describe('demo/server/routes/hello', () => {
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

  beforeEach(() => {
    fetchHello.mockReset();
  });

  test('GET /api/hello returns ok=true when the external dependency resolves', async () => {
    fetchHello.mockResolvedValue({ status: 200, data: { ok: true } });

    const response = await realAxios.get(`${baseUrl}/api/hello`);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(expect.objectContaining({
      ok: true,
      hasData: true,
    }));
  });

  test('GET /api/hello returns a stable 500 payload when the external dependency fails', async () => {
    fetchHello.mockRejectedValue(new Error('upstream unavailable'));

    const response = await realAxios.get(`${baseUrl}/api/hello`, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(500);
    expect(response.data).toEqual(expect.objectContaining({
      ok: false,
      error: 'upstream unavailable',
    }));
  });
});
