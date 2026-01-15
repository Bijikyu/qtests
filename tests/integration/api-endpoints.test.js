const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const api = axios.create({ 
  baseURL: BASE_URL, 
  timeout: 5000,
  validateStatus: () => true
});

describe('Demo Server API Endpoints - Real HTTP Tests', () => {
  
  describe('Root Routes', () => {
    test('GET /hello returns greeting message', async () => {
      const res = await api.get('/hello');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('message', 'Hello from QTests Demo!');
      expect(res.data).toHaveProperty('timestamp');
    });
  });

  describe('Hello Routes (/api)', () => {
    test('GET /api/hello returns ok with hasData', async () => {
      const res = await api.get('/api/hello');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('ok', true);
      expect(res.data).toHaveProperty('hasData');
    });
  });

  describe('Status Routes (/api)', () => {
    test('GET /api/status returns service info', async () => {
      const res = await api.get('/api/status');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('service', 'calculator');
      expect(res.data).toHaveProperty('version', '1.0.0');
      expect(res.data).toHaveProperty('uptime');
      expect(res.data).toHaveProperty('timestamp');
    });

    test('POST /api/batch performs batch calculations', async () => {
      const res = await api.post('/api/batch', {
        operations: [
          { operation: 'add', a: 5, b: 3 },
          { operation: 'multiply', a: 4, b: 2 }
        ]
      });
      expect(res.status).toBe(200);
      expect(res.data.count).toBe(2);
      expect(res.data.results[0].result).toBe(8);
      expect(res.data.results[1].result).toBe(8);
    });

    test('POST /api/batch handles invalid input', async () => {
      const res = await api.post('/api/batch', { operations: 'not-array' });
      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty('error');
    });

    test('POST /api/batch handles division by zero', async () => {
      const res = await api.post('/api/batch', {
        operations: [{ operation: 'divide', a: 10, b: 0 }]
      });
      expect(res.status).toBe(200);
      expect(res.data.results[0]).toHaveProperty('error', 'Division by zero');
    });
  });

  describe('Users Routes (/api)', () => {
    let createdUserId;

    test('GET /api/users returns user list', async () => {
      const res = await api.get('/api/users');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('users');
      expect(Array.isArray(res.data.users)).toBe(true);
      expect(res.data).toHaveProperty('count');
    });

    test('GET /api/users/:id returns specific user', async () => {
      const res = await api.get('/api/users/1');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('id', 1);
      expect(res.data).toHaveProperty('name');
      expect(res.data).toHaveProperty('email');
    });

    test('GET /api/users/:id returns 404 for non-existent user', async () => {
      const res = await api.get('/api/users/9999');
      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty('error', 'User not found');
    });

    test('GET /api/users/:id returns 400 for invalid ID format', async () => {
      const res = await api.get('/api/users/abc');
      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty('error', 'Invalid user ID format');
    });

    test('POST /api/users creates new user', async () => {
      const timestamp = Date.now();
      const res = await api.post('/api/users', {
        name: 'Test User',
        email: `test${timestamp}@example.com`
      });
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data).toHaveProperty('name', 'Test User');
      createdUserId = res.data.id;
    });

    test('POST /api/users rejects missing name', async () => {
      const res = await api.post('/api/users', { email: 'test@example.com' });
      expect(res.status).toBe(400);
      expect(res.data.error).toMatch(/Name is required/i);
    });

    test('POST /api/users rejects invalid email format', async () => {
      const res = await api.post('/api/users', { name: 'Test', email: 'invalid-email' });
      expect(res.status).toBe(400);
      expect(res.data.error).toMatch(/Invalid email format/i);
    });

    test('PUT /api/users/:id updates user', async () => {
      const res = await api.put('/api/users/1', { name: 'Updated Name' });
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('name', 'Updated Name');
    });

    test('PUT /api/users/:id returns 404 for non-existent user', async () => {
      const res = await api.put('/api/users/9999', { name: 'Test' });
      expect(res.status).toBe(404);
    });

    test('DELETE /api/users/:id deletes user', async () => {
      if (createdUserId) {
        const res = await api.delete(`/api/users/${createdUserId}`);
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('message', 'User deleted successfully');
      }
    });

    test('DELETE /api/users/:id returns 404 for non-existent user', async () => {
      const res = await api.delete('/api/users/9999');
      expect(res.status).toBe(404);
    });
  });

  describe('Calculator Routes (/api)', () => {
    beforeAll(async () => {
      await api.delete('/api/history');
    });

    test('GET /api/calculator/health returns health status', async () => {
      const res = await api.get('/api/calculator/health');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('status', 'ok');
      expect(res.data).toHaveProperty('service', 'calculator');
    });

    test('POST /api/calculate performs addition', async () => {
      const res = await api.post('/api/calculate', {
        operation: 'add',
        operands: [10, 5]
      });
      expect(res.status).toBe(200);
      expect(res.data.result).toBe(15);
    });

    test('POST /api/calculate performs subtraction', async () => {
      const res = await api.post('/api/calculate', {
        operation: 'subtract',
        operands: [10, 3]
      });
      expect(res.status).toBe(200);
      expect(res.data.result).toBe(7);
    });

    test('POST /api/calculate performs multiplication', async () => {
      const res = await api.post('/api/calculate', {
        operation: 'multiply',
        operands: [4, 5]
      });
      expect(res.status).toBe(200);
      expect(res.data.result).toBe(20);
    });

    test('POST /api/calculate performs division', async () => {
      const res = await api.post('/api/calculate', {
        operation: 'divide',
        operands: [20, 4]
      });
      expect(res.status).toBe(200);
      expect(res.data.result).toBe(5);
    });

    test('POST /api/calculate rejects division by zero', async () => {
      const res = await api.post('/api/calculate', {
        operation: 'divide',
        operands: [10, 0]
      });
      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty('error', 'Division by zero');
    });

    test('POST /api/calculate rejects unknown operation', async () => {
      const res = await api.post('/api/calculate', {
        operation: 'power',
        operands: [2, 3]
      });
      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty('error', 'Unknown operation');
    });

    test('POST /api/calculate rejects invalid format', async () => {
      const res = await api.post('/api/calculate', { operation: 'add' });
      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty('error', 'Invalid request format');
    });

    test('PUT /api/calculate/:operation performs operation via URL param', async () => {
      const res = await api.put('/api/calculate/add', { a: 7, b: 8 });
      expect(res.status).toBe(200);
      expect(res.data.result).toBe(15);
    });

    test('PUT /api/calculate/:operation rejects missing operands', async () => {
      const res = await api.put('/api/calculate/add', {});
      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty('error', 'Missing operands');
    });

    test('GET /api/history returns calculation history', async () => {
      const res = await api.get('/api/history');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('history');
      expect(Array.isArray(res.data.history)).toBe(true);
      expect(res.data).toHaveProperty('count');
    });

    test('DELETE /api/history clears history', async () => {
      const res = await api.delete('/api/history');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('message', 'History cleared');
      
      const historyRes = await api.get('/api/history');
      expect(historyRes.data.count).toBe(0);
    });

    test('PATCH /api/settings updates settings', async () => {
      const res = await api.patch('/api/settings', { precision: 4 });
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('message', 'Settings updated');
      expect(res.data).toHaveProperty('precision', 4);
    });
  });

  describe('Error Handling', () => {
    test('Returns 404 for unknown routes', async () => {
      const res = await api.get('/api/nonexistent');
      expect(res.status).toBe(404);
    });
  });

  describe('HTTP Methods Coverage', () => {
    test('Covers all HTTP methods (GET, POST, PUT, PATCH, DELETE)', async () => {
      const methods = {
        GET: await api.get('/api/status'),
        POST: await api.post('/api/calculate', { operation: 'add', operands: [1, 1] }),
        PUT: await api.put('/api/calculate/add', { a: 1, b: 1 }),
        PATCH: await api.patch('/api/settings', { precision: 2 }),
        DELETE: await api.delete('/api/history')
      };
      
      Object.entries(methods).forEach(([method, res]) => {
        expect(res.status).toBeLessThan(500);
      });
    });
  });
});
