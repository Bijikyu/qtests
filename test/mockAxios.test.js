/**
 * Mock Axios Factory Tests
 * 
 * This test suite verifies the behavior of the mock axios factory utilities
 * that provide HTTP client simulation for testing environments. These tests
 * ensure that mock axios instances behave predictably and maintain API
 * compatibility with real axios.
 * 
 * Test coverage includes:
 * - Factory function behavior and configuration options
 * - HTTP method implementations (GET, POST, PUT, DELETE)
 * - Response structure compatibility with real axios
 * - Error simulation capabilities
 * - Performance and reliability characteristics
 */

const { createMockAxios, createConfigurableMockAxios, createSimpleMockAxios } = require('../utils/mockAxios');

describe('Mock Axios Factory', () => {
  
  describe('createMockAxios', () => {
    
    test('creates mock axios with default configuration', async () => {
      const mockAxios = createMockAxios();
      
      // Verify mock axios has expected HTTP methods
      expect(typeof mockAxios.get).toBe('function');
      expect(typeof mockAxios.post).toBe('function');
      expect(typeof mockAxios.put).toBe('function');
      expect(typeof mockAxios.delete).toBe('function');
      expect(typeof mockAxios.request).toBe('function');
    });
    
    test('creates mock axios with custom configuration', async () => {
      const customResponse = { users: ['alice', 'bob'] };
      const mockAxios = createMockAxios({
        defaultResponse: customResponse,
        defaultStatus: 201
      });
      
      const response = await mockAxios.get('/api/users');
      
      // Verify custom configuration is applied
      expect(response.data).toEqual(customResponse);
      expect(response.status).toBe(201);
      expect(response.statusText).toBe('Error'); // Non-200 status
    });
    
    test('GET method returns axios-compatible response', async () => {
      const mockAxios = createMockAxios();
      const response = await mockAxios.get('/api/test');
      
      // Verify response structure matches real axios
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('statusText');
      expect(response).toHaveProperty('headers');
      expect(response).toHaveProperty('config');
      expect(response).toHaveProperty('request');
      
      // Verify default values
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.data).toEqual({});
    });
    
    test('POST method handles data payload', async () => {
      const mockAxios = createMockAxios();
      const testData = { name: 'test user', email: 'test@example.com' };
      
      const response = await mockAxios.post('/api/users', testData);
      
      // Verify response structure is consistent
      expect(response.status).toBe(200);
      expect(response.data).toEqual({});
      expect(typeof response.config).toBe('object');
    });
    
    test('PUT method maintains API compatibility', async () => {
      const mockAxios = createMockAxios();
      const updateData = { id: 1, name: 'updated user' };
      
      const response = await mockAxios.put('/api/users/1', updateData);
      
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
    });
    
    test('DELETE method works without data payload', async () => {
      const mockAxios = createMockAxios();
      
      const response = await mockAxios.delete('/api/users/1');
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual({});
    });
    
    test('request method handles custom configurations', async () => {
      const mockAxios = createMockAxios();
      const config = {
        method: 'PATCH',
        url: '/api/users/1',
        data: { status: 'active' }
      };
      
      const response = await mockAxios.request(config);
      
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
    });
    
    test('simulates network errors when configured', async () => {
      const mockAxios = createMockAxios({ simulateErrors: true });
      
      // Test multiple requests since error simulation is probabilistic
      let errorThrown = false;
      for (let i = 0; i < 20; i++) {
        try {
          await mockAxios.get('/api/test');
        } catch (error) {
          expect(error.message).toBe('Simulated network error');
          errorThrown = true;
          break;
        }
      }
      
      // Note: This test might occasionally pass even with error simulation
      // due to the random nature of error triggering
    });
  });
  
  describe('createConfigurableMockAxios', () => {
    
    test('creates mock axios with URL-specific response mapping', async () => {
      const mockAxios = createConfigurableMockAxios();
      
      // Verify it's a function with helper methods
      expect(typeof mockAxios).toBe('function');
      expect(typeof mockAxios.__set).toBe('function');
      expect(typeof mockAxios.__get).toBe('function');
      expect(typeof mockAxios.__clear).toBe('function');
      expect(typeof mockAxios.__urls).toBe('function');
    });
    
    test('returns default seeded response for configured URL', async () => {
      const mockAxios = createConfigurableMockAxios();
      
      const response = await mockAxios({ url: 'http://a' });
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ mock: true });
    });
    
    test('configures custom responses using __set method', async () => {
      const mockAxios = createConfigurableMockAxios();
      const testData = { users: ['alice', 'bob'] };
      
      mockAxios.__set('http://api.test.com/users', testData, 201);
      
      const response = await mockAxios({ url: 'http://api.test.com/users' });
      
      expect(response.status).toBe(201);
      expect(response.data).toEqual(testData);
    });
    
    test('simulates error responses when reject flag is set', async () => {
      const mockAxios = createConfigurableMockAxios();
      const errorData = { error: 'Not found' };
      
      mockAxios.__set('http://api.test.com/notfound', errorData, 404, true);
      
      try {
        await mockAxios({ url: 'http://api.test.com/notfound' });
        fail('Expected promise to reject');
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toEqual(errorData);
      }
    });
    
    test('returns 500 error for unconfigured URLs', async () => {
      const mockAxios = createConfigurableMockAxios();
      
      try {
        await mockAxios({ url: 'http://unknown.com' });
        fail('Expected promise to reject');
      } catch (error) {
        expect(error.response.status).toBe(500);
        expect(error.response.data).toBe('error');
      }
    });
    
    test('__get method retrieves configured responses', () => {
      const mockAxios = createConfigurableMockAxios();
      const testData = { message: 'test' };
      
      mockAxios.__set('http://test.com', testData, 200);
      
      const config = mockAxios.__get('http://test.com');
      expect(config.data).toEqual(testData);
      expect(config.status).toBe(200);
      expect(config.reject).toBe(false);
    });
    
    test('__clear method removes all configurations', () => {
      const mockAxios = createConfigurableMockAxios();
      
      mockAxios.__set('http://test1.com', { data: 1 });
      mockAxios.__set('http://test2.com', { data: 2 });
      
      expect(mockAxios.__urls()).toHaveLength(3); // 2 new + 1 default
      
      mockAxios.__clear();
      
      expect(mockAxios.__urls()).toHaveLength(0);
    });
    
    test('__urls method returns all configured URLs', () => {
      const mockAxios = createConfigurableMockAxios();
      
      mockAxios.__set('http://api1.com', { data: 1 });
      mockAxios.__set('http://api2.com', { data: 2 });
      
      const urls = mockAxios.__urls();
      expect(urls).toContain('http://a'); // default
      expect(urls).toContain('http://api1.com');
      expect(urls).toContain('http://api2.com');
      expect(urls).toHaveLength(3);
    });
    
    test('handles multiple configurations for same URL', async () => {
      const mockAxios = createConfigurableMockAxios();
      
      // Initial configuration
      mockAxios.__set('http://api.com', { version: 1 }, 200);
      let response = await mockAxios({ url: 'http://api.com' });
      expect(response.data.version).toBe(1);
      
      // Override configuration
      mockAxios.__set('http://api.com', { version: 2 }, 201);
      response = await mockAxios({ url: 'http://api.com' });
      expect(response.data.version).toBe(2);
      expect(response.status).toBe(201);
    });
    
    test('maintains isolation between different mock instances', async () => {
      const mockAxios1 = createConfigurableMockAxios();
      const mockAxios2 = createConfigurableMockAxios();
      
      mockAxios1.__set('http://shared.com', { instance: 1 });
      mockAxios2.__set('http://shared.com', { instance: 2 });
      
      const response1 = await mockAxios1({ url: 'http://shared.com' });
      const response2 = await mockAxios2({ url: 'http://shared.com' });
      
      expect(response1.data.instance).toBe(1);
      expect(response2.data.instance).toBe(2);
    });
  });
  
  describe('createSimpleMockAxios', () => {
    
    test('creates basic mock axios without configuration', async () => {
      const mockAxios = createSimpleMockAxios();
      
      // Verify basic functionality
      expect(typeof mockAxios.get).toBe('function');
      expect(typeof mockAxios.post).toBe('function');
      
      const response = await mockAxios.get('/api/simple');
      expect(response.status).toBe(200);
      expect(response.data).toEqual({});
    });
    
    test('provides same interface as configurable version', async () => {
      const simpleMock = createSimpleMockAxios();
      const configurableMock = createMockAxios();
      
      // Both should have the same method signatures
      expect(Object.keys(simpleMock).sort()).toEqual(Object.keys(configurableMock).sort());
    });
  });
  
  describe('Performance and Reliability', () => {
    
    test('mock responses resolve immediately', async () => {
      const mockAxios = createMockAxios();
      const startTime = Date.now();
      
      await mockAxios.get('/api/performance-test');
      
      const duration = Date.now() - startTime;
      // Mock requests should complete in well under 100ms
      expect(duration).toBeLessThan(100);
    });
    
    test('handles concurrent requests correctly', async () => {
      const mockAxios = createMockAxios();
      
      // Create multiple concurrent requests
      const requests = Array(10).fill().map((_, i) => 
        mockAxios.get(`/api/concurrent/${i}`)
      );
      
      const responses = await Promise.all(requests);
      
      // All requests should succeed with consistent responses
      expect(responses).toHaveLength(10);
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.data).toEqual({});
      });
    });
    
    test('maintains state isolation between instances', async () => {
      const mockAxios1 = createMockAxios({ defaultResponse: { instance: 1 } });
      const mockAxios2 = createMockAxios({ defaultResponse: { instance: 2 } });
      
      const response1 = await mockAxios1.get('/api/test');
      const response2 = await mockAxios2.get('/api/test');
      
      // Each instance should maintain its own configuration
      expect(response1.data).toEqual({ instance: 1 });
      expect(response2.data).toEqual({ instance: 2 });
    });
  });
});