/**
 * HTTP Test Client Tests
 * 
 * This test suite verifies the lightweight HTTP testing client that provides
 * supertest-like functionality without external dependencies. Tests cover
 * request building, response handling, and integration with mock applications.
 * 
 * Test coverage includes:
 * - HTTP method support (GET, POST, PUT, DELETE, etc.)
 * - Request configuration (headers, body, expectations)
 * - Response parsing and validation
 * - Mock application integration
 * - Error handling and edge cases
 */

const { supertest, createMockApp } = require('../utils/httpTest');

describe('HTTP Test Client', () => {
  
  describe('supertest function', () => {
    
    test('creates Super instance with application', () => {
      const mockApp = () => {};
      const client = supertest(mockApp);
      
      // Verify client has HTTP method functions
      expect(typeof client.get).toBe('function');
      expect(typeof client.post).toBe('function');
      expect(typeof client.put).toBe('function');
      expect(typeof client.delete).toBe('function');
      expect(typeof client.patch).toBe('function');
      expect(typeof client.head).toBe('function');
      expect(typeof client.options).toBe('function');
      expect(typeof client.all).toBe('function');
    });
  });
  
  describe('HTTP method builders', () => {
    
    let app;
    let client;
    
    beforeEach(() => {
      app = createMockApp();
      client = supertest(app);
    });
    
    test('creates GET request builder', () => {
      const test = client.get('/test');
      
      expect(test.method).toBe('GET');
      expect(test.path).toBe('/test');
      expect(typeof test.set).toBe('function');
      expect(typeof test.send).toBe('function');
      expect(typeof test.expect).toBe('function');
      expect(typeof test.end).toBe('function');
    });
    
    test('creates POST request builder', () => {
      const test = client.post('/api/data');
      
      expect(test.method).toBe('POST');
      expect(test.path).toBe('/api/data');
    });
    
    test('creates PUT request builder', () => {
      const test = client.put('/api/users/1');
      
      expect(test.method).toBe('PUT');
      expect(test.path).toBe('/api/users/1');
    });
    
    test('creates DELETE request builder', () => {
      const test = client.delete('/api/users/1');
      
      expect(test.method).toBe('DELETE');
      expect(test.path).toBe('/api/users/1');
    });
    
    test('supports all HTTP methods', () => {
      expect(client.patch('/test').method).toBe('PATCH');
      expect(client.head('/test').method).toBe('HEAD');
      expect(client.options('/test').method).toBe('OPTIONS');
      expect(client.all('/test').method).toBe('ALL');
    });
  });
  
  describe('Request configuration', () => {
    
    let app;
    let client;
    
    beforeEach(() => {
      app = createMockApp();
      client = supertest(app);
    });
    
    test('sets request headers with chaining', () => {
      const test = client.get('/test')
        .set('Authorization', 'Bearer token')
        .set('Content-Type', 'application/json');
      
      expect(test.headers['Authorization']).toBe('Bearer token');
      expect(test.headers['Content-Type']).toBe('application/json');
    });
    
    test('sets request body with chaining', () => {
      const testData = { name: 'test', value: 123 };
      const test = client.post('/test').send(testData);
      
      expect(test.body).toEqual(testData);
    });
    
    test('auto-sets JSON content-type for object bodies', () => {
      const test = client.post('/test').send({ data: 'test' });
      
      expect(test.headers['Content-Type']).toBe('application/json');
    });
    
    test('does not override existing content-type', () => {
      const test = client.post('/test')
        .set('Content-Type', 'text/plain')
        .send({ data: 'test' });
      
      expect(test.headers['Content-Type']).toBe('text/plain');
    });
    
    test('sets expected status code', () => {
      const test = client.get('/test').expect(200);
      
      expect(test.expectedStatus).toBe(200);
    });
    
    test('supports method chaining', () => {
      const test = client.post('/api/test')
        .set('Authorization', 'Bearer token')
        .send({ data: 'test' })
        .expect(201);
      
      expect(test.headers['Authorization']).toBe('Bearer token');
      expect(test.body).toEqual({ data: 'test' });
      expect(test.expectedStatus).toBe(201);
    });
  });
  
  describe('Mock application integration', () => {
    
    test('createMockApp creates Express-style application', () => {
      const app = createMockApp();
      
      expect(typeof app).toBe('function');
      expect(typeof app.get).toBe('function');
      expect(typeof app.post).toBe('function');
      expect(typeof app.put).toBe('function');
      expect(typeof app.delete).toBe('function');
      expect(typeof app.patch).toBe('function');
      expect(typeof app.all).toBe('function');
    });
    
    test('mock app supports route registration', () => {
      const app = createMockApp();
      
      // Should not throw when registering routes
      app.get('/test', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
      });
      
      app.post('/api/data', (req, res) => {
        res.statusCode = 201;
        res.end();
      });
      
      expect(true).toBe(true); // Routes registered without errors
    });
  });
  
  describe('HTTP request execution', () => {
    
    let app;
    
    beforeEach(() => {
      app = createMockApp();
    });
    
    test('executes GET request and returns response', async () => {
      app.get('/test', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'success' }));
      });
      
      const response = await supertest(app).get('/test').end();
      
      expect(response.status).toBe(200);
      expect(response.statusCode).toBe(200); // alias
      expect(response.body).toEqual({ message: 'success' });
      expect(response.headers['content-type']).toBe('application/json');
    });
    
    test('executes POST request with JSON body', async () => {
      let receivedBody = null;
      
      app.post('/api/data', (req, res) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          receivedBody = JSON.parse(body);
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ id: 1, ...receivedBody }));
        });
      });
      
      const testData = { name: 'test', value: 123 };
      const response = await supertest(app)
        .post('/api/data')
        .send(testData)
        .end();
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, name: 'test', value: 123 });
      expect(receivedBody).toEqual(testData);
    });
    
    test('executes PUT request with headers', async () => {
      let receivedAuth = null;
      
      app.put('/api/users/1', (req, res) => {
        receivedAuth = req.headers.authorization;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ updated: true }));
      });
      
      const response = await supertest(app)
        .put('/api/users/1')
        .set('Authorization', 'Bearer test-token')
        .end();
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ updated: true });
      expect(receivedAuth).toBe('Bearer test-token');
    });
    
    test('executes DELETE request', async () => {
      app.delete('/api/users/1', (req, res) => {
        res.statusCode = 204;
        res.end();
      });
      
      const response = await supertest(app).delete('/api/users/1').end();
      
      expect(response.status).toBe(204);
    });
    
    test('handles 404 for unregistered routes', async () => {
      const response = await supertest(app).get('/nonexistent').end();
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not Found' });
    });
  });
  
  describe('Response parsing', () => {
    
    let app;
    
    beforeEach(() => {
      app = createMockApp();
    });
    
    test('auto-parses JSON responses', async () => {
      app.get('/json', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ parsed: true, data: [1, 2, 3] }));
      });
      
      const response = await supertest(app).get('/json').end();
      
      expect(response.body).toEqual({ parsed: true, data: [1, 2, 3] });
      expect(typeof response.body).toBe('object');
    });
    
    test('preserves raw text for non-JSON responses', async () => {
      app.get('/text', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Plain text response');
      });
      
      const response = await supertest(app).get('/text').end();
      
      expect(response.body).toBe('Plain text response');
      expect(response.text).toBe('Plain text response');
    });
    
    test('handles malformed JSON gracefully', async () => {
      app.get('/bad-json', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end('{ invalid json }');
      });
      
      const response = await supertest(app).get('/bad-json').end();
      
      // Should fall back to raw text when JSON parsing fails
      expect(response.body).toBe('{ invalid json }');
      expect(response.text).toBe('{ invalid json }');
    });
  });
  
  describe('Status expectations', () => {
    
    let app;
    
    beforeEach(() => {
      app = createMockApp();
    });
    
    test('validates expected status codes', async () => {
      app.get('/success', (req, res) => {
        res.statusCode = 200;
        res.end();
      });
      
      // Should not throw for matching status
      const response = await supertest(app).get('/success').expect(200).end();
      expect(response.status).toBe(200);
    });
    
    test('throws error for mismatched status codes', async () => {
      app.get('/created', (req, res) => {
        res.statusCode = 201;
        res.end();
      });
      
      try {
        await supertest(app).get('/created').expect(200).end();
        fail('Expected error for status mismatch');
      } catch (error) {
        expect(error.message).toContain('Expected status 200, got 201');
      }
    });
  });
  
  describe('Error handling', () => {
    
    test('handles server creation errors gracefully', async () => {
      const invalidApp = null;
      
      try {
        await supertest(invalidApp).get('/test').end();
        fail('Expected error for invalid app');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
    
    test('cleans up server on request failure', async () => {
      const app = createMockApp();
      
      app.get('/error', (req, res) => {
        // Simulate server error
        throw new Error('Server error');
      });
      
      try {
        await supertest(app).get('/error').end();
      } catch (error) {
        // Error should be caught and server cleaned up
        expect(error).toBeDefined();
      }
    });
  });
  
  describe('Integration patterns', () => {
    
    test('supports complex request/response cycles', async () => {
      const app = createMockApp();
      
      app.post('/auth', (req, res) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          const auth = JSON.parse(body);
          if (auth.username === 'admin' && auth.password === 'secret') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ token: 'jwt-token' }));
          } else {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Unauthorized' }));
          }
        });
      });
      
      app.get('/protected', (req, res) => {
        const auth = req.headers.authorization;
        if (auth === 'Bearer jwt-token') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ data: 'secret data' }));
        } else {
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Forbidden' }));
        }
      });
      
      // Test authentication flow
      const authResponse = await supertest(app)
        .post('/auth')
        .send({ username: 'admin', password: 'secret' })
        .expect(200)
        .end();
      
      expect(authResponse.body.token).toBe('jwt-token');
      
      // Test protected endpoint
      const dataResponse = await supertest(app)
        .get('/protected')
        .set('Authorization', 'Bearer jwt-token')
        .expect(200)
        .end();
      
      expect(dataResponse.body.data).toBe('secret data');
    });
  });
});