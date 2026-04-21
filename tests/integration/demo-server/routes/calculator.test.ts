// 🔗 Tests: demo/server/routes/calculator.js → demo/server/app.js
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

describe('demo/server/routes/calculator', () => {
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

  beforeEach(async () => {
    await realAxios.delete(`${baseUrl}/api/history`, {
      validateStatus: () => true,
    });
  });

  test('POST /api/calculate stores a successful calculation that is later visible via GET /api/history', async () => {
    const calculationResponse = await realAxios.post(`${baseUrl}/api/calculate`, {
      operation: 'add',
      operands: [5, 3],
    });
    const historyResponse = await realAxios.get(`${baseUrl}/api/history`);

    expect(calculationResponse.status).toBe(200);
    expect(calculationResponse.data).toEqual(expect.objectContaining({
      result: 8,
      operation: 'add',
      operands: [5, 3],
    }));
    expect(historyResponse.status).toBe(200);
    expect(historyResponse.data.count).toBe(1);
    expect(historyResponse.data.history[0]).toEqual(expect.objectContaining({
      operation: 'add',
      result: 8,
    }));
  });

  test('POST /api/calculate rejects division by zero with a 400 response', async () => {
    const response = await realAxios.post(`${baseUrl}/api/calculate`, {
      operation: 'divide',
      operands: [10, 0],
    }, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
    expect(response.data).toEqual(expect.objectContaining({
      error: 'Division by zero',
    }));
  });

  test('DELETE /api/history clears accumulated calculation history', async () => {
    await realAxios.post(`${baseUrl}/api/calculate`, {
      operation: 'multiply',
      operands: [4, 2],
    });

    const deleteResponse = await realAxios.delete(`${baseUrl}/api/history`);
    const historyResponse = await realAxios.get(`${baseUrl}/api/history`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.data).toEqual(expect.objectContaining({
      message: 'History cleared',
    }));
    expect(historyResponse.status).toBe(200);
    expect(historyResponse.data).toEqual(expect.objectContaining({
      count: 0,
      history: [],
    }));
  });
});
