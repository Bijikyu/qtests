/**
 * Mock Axios Factory for Environment-Aware Testing - TypeScript Implementation
 * 
 * This module provides factory functions for creating mock axios implementations
 * that simulate HTTP responses without making actual network requests. This is
 * essential for testing applications in offline environments or when external
 * APIs are unavailable.
 * 
 * Design philosophy:
 * - Factory pattern for creating customizable mock instances
 * - Predictable response simulation for consistent testing
 * - No network I/O to ensure fast, isolated test execution
 * - Extensible interface for adding custom response behaviors
 * 
 * Key benefits:
 * 1. Environment Isolation - Tests don't depend on external services
 * 2. Predictable Behavior - Same responses every time for reliable tests
 * 3. Fast Execution - No network delays in test suites
 * 4. Flexible Configuration - Can simulate various response scenarios
 * 
 * Use cases:
 * - Testing HTTP-dependent code without external API dependencies
 * - Simulating various response scenarios (success, error, timeout)
 * - Development environments where external APIs are unavailable
 * - Integration testing with controlled response data
 */

// Import logging control utility for consistent framework behavior
import { setLogging } from '../lib/logUtils.js';
if (process.env.NODE_ENV !== 'test') setLogging(false);

// Type definitions for axios-compatible mock
interface MockAxiosConfig {
  defaultResponse?: any;
  defaultStatus?: number;
  simulateErrors?: boolean;
}

interface MockAxiosResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, any>;
  config: Record<string, any>;
  request: Record<string, any>;
}

interface MockAxios {
  get(url: string, config?: any): Promise<MockAxiosResponse>;
  post(url: string, data?: any, config?: any): Promise<MockAxiosResponse>;
  put(url: string, data?: any, config?: any): Promise<MockAxiosResponse>;
  delete(url: string, config?: any): Promise<MockAxiosResponse>;
  request(config?: any): Promise<MockAxiosResponse>;
}

interface UserMockAxios {
  (config: { url: string; [key: string]: any }): Promise<MockAxiosResponse>;
  __set: (url: string, data: any, status?: number, reject?: boolean) => void;
}

/**
 * Create a mock axios instance with simulated HTTP methods
 * 
 * This factory function creates an axios-compatible object that provides
 * the same interface as real axios but returns simulated responses instead
 * of making actual HTTP requests. The mock instance is designed to be a
 * drop-in replacement for axios in testing environments.
 * 
 * Implementation strategy:
 * 1. Provide async methods that match axios API signatures
 * 2. Return promises that resolve immediately with predictable data
 * 3. Support both method-specific functions and generic request function
 * 4. Include response structure that matches axios response format
 * 
 * Why factory pattern:
 * - Allows customization of mock behavior per test scenario
 * - Enables future enhancement with configurable response data
 * - Provides clean separation between mock creation and usage
 * - Follows established patterns in testing frameworks
 * 
 * @param options - Configuration options for mock behavior
 * @returns Mock axios instance with HTTP methods
 * 
 * @example
 * const mockAxios = createMockAxios();
 * const response = await mockAxios.get('/api/data');
 * // Returns: { data: {}, status: 200, statusText: 'OK' }
 * 
 * @example
 * const customMock = createMockAxios({
 *   defaultResponse: { users: [] },
 *   defaultStatus: 200
 * });
 */
function createMockAxios(options: MockAxiosConfig = {}): MockAxios {
  console.log(`createMockAxios is running with ${JSON.stringify(options)}`);

  try {
    // Extract configuration options with sensible defaults
    const {
      defaultResponse = {},
      defaultStatus = 200,
      simulateErrors = false
    } = options;

    /**
     * Create a standardized mock response object
     * 
     * This helper function creates response objects that match the structure
     * returned by real axios requests. Maintaining this structure ensures
     * that application code can work with mock responses identically to
     * real responses.
     * 
     * @param data - Response data payload
     * @param status - HTTP status code
     * @returns Axios-compatible response object
     */
    function createMockResponse(data: any = defaultResponse, status: number = defaultStatus): MockAxiosResponse {
      return {
        data,
        status,
        statusText: status === 200 ? 'OK' : 'Error',
        headers: {},
        config: {},
        request: {}
      };
    }

    /**
     * Mock axios instance with HTTP method implementations
     * 
     * This object provides the core axios API methods that applications
     * commonly use. Each method returns a promise that resolves immediately
     * with a mock response, allowing tests to proceed without network delays.
     */
    const mockAxios: MockAxios = {
      /**
       * Mock GET request implementation
       * 
       * Simulates HTTP GET requests by returning immediate promise resolution
       * with predictable response data. Accepts the same parameters as real
       * axios.get() for API compatibility.
       * 
       * @param url - Request URL (logged but not used)
       * @param config - Request configuration (logged but not used)
       * @returns Promise resolving to mock response
       */
      async get(url: string, config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.get is running with ${url}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createMockResponse();
        console.log(`mockAxios.get is returning ${JSON.stringify(response)}`);
        return response;
      },

      /**
       * Mock POST request implementation
       * 
       * Simulates HTTP POST requests with immediate promise resolution.
       * Accepts data payload and configuration parameters for API compatibility
       * with real axios.post() method.
       * 
       * @param url - Request URL (logged but not used)
       * @param data - Request payload (logged but not used)
       * @param config - Request configuration (logged but not used)
       * @returns Promise resolving to mock response
       */
      async post(url: string, data: any = {}, config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.post is running with ${url}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createMockResponse();
        console.log(`mockAxios.post is returning ${JSON.stringify(response)}`);
        return response;
      },

      /**
       * Mock PUT request implementation
       * 
       * Simulates HTTP PUT requests for update operations.
       * Maintains API compatibility with axios.put() method signature.
       * 
       * @param url - Request URL (logged but not used)
       * @param data - Request payload (logged but not used)
       * @param config - Request configuration (logged but not used)
       * @returns Promise resolving to mock response
       */
      async put(url: string, data: any = {}, config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.put is running with ${url}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createMockResponse();
        console.log(`mockAxios.put is returning ${JSON.stringify(response)}`);
        return response;
      },

      /**
       * Mock DELETE request implementation
       * 
       * Simulates HTTP DELETE requests for resource removal operations.
       * Maintains API compatibility with axios.delete() method signature.
       * 
       * @param url - Request URL (logged but not used)
       * @param config - Request configuration (logged but not used)
       * @returns Promise resolving to mock response
       */
      async delete(url: string, config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.delete is running with ${url}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createMockResponse();
        console.log(`mockAxios.delete is returning ${JSON.stringify(response)}`);
        return response;
      },

      /**
       * Generic request method for custom HTTP operations
       * 
       * Provides the axios.request() interface for custom request configurations.
       * This method covers any HTTP methods not explicitly implemented above
       * and allows for more complex request configurations.
       * 
       * @param config - Complete request configuration object
       * @returns Promise resolving to mock response
       */
      async request(config: any = {}): Promise<MockAxiosResponse> {
        console.log(`mockAxios.request is running with ${JSON.stringify(config)}`);
        if (simulateErrors && Math.random() < 0.1) {
          throw new Error('Simulated network error');
        }
        const response = createMockResponse();
        console.log(`mockAxios.request is returning ${JSON.stringify(response)}`);
        return response;
      }
    };

    console.log(`createMockAxios is returning ${mockAxios}`);
    return mockAxios;

  } catch (error: any) {
    console.log(`createMockAxios error: ${error.message}`);
    throw error;
  }
}

/**
 * Generates a mock axios instance returning preset data.
 * It intercepts axios calls to return canned responses, avoiding real HTTP.
 * Rationale: enables offline tests and predictable responses.
 */
function createUserMockAxios(): UserMockAxios {
    console.log(`createMockAxios is running with none`); // log start of factory
    try {
        const responses = new Map<string, { data: any; status: number; reject: boolean }>(); // map to hold url responses
        responses.set('http://a', { data: { mock: true }, status: 200, reject: false }); // seed default mock
        
        function mockAxios(config: { url: string; [key: string]: any }): Promise<MockAxiosResponse> { // simulate axios request/response
            console.log(`mockAxios is running with ${JSON.stringify(config)}`); // log start
            try {
                const mock = responses.get(config.url); // lookup response
                if(mock){
                    const result: MockAxiosResponse = { 
                        status: mock.status, 
                        data: mock.data,
                        statusText: mock.status === 200 ? 'OK' : 'Error',
                        headers: {},
                        config: {},
                        request: {}
                    }; // build axios style result
                    console.log(`mockAxios is returning ${JSON.stringify(result)}`); // log return
                    if(mock.reject) return Promise.reject({ response: result }); // reject when flagged
                    return Promise.resolve(result); // resolve mock success
                }
                const error = { response: { status: 500, data: 'error' } }; // fallback error
                console.log(`mockAxios is returning ${JSON.stringify(error)}`); // log error return
                return Promise.reject(error); // reject unknown url
            } catch(error: any){
                console.log(`mockAxios error ${error.message}`); // log internal error
                return Promise.reject(error); // propagate
            }
        }
        
        const axiosWrapper = mockAxios as UserMockAxios;
        axiosWrapper.__set = (url: string, data: any, status: number = 200, reject: boolean = false) => { 
            responses.set(url, { data, status, reject }); 
        }; // helper to program responses
        
        console.log(`createMockAxios is returning axiosWrapper`); // log end
        return axiosWrapper; // return configured mock
    } catch(error: any){
        console.log(`createMockAxios error ${error.message}`); // log failure
        throw error; // rethrow for caller
    }
}

/**
 * Create a simple mock axios instance with default configuration
 * 
 * This convenience function creates a basic mock axios instance without
 * requiring configuration options. It's useful for quick test setup where
 * custom response behavior isn't needed.
 * 
 * @returns Basic mock axios instance
 * 
 * @example
 * const axios = createSimpleMockAxios();
 * const response = await axios.get('/api/test');
 */
function createSimpleMockAxios(): MockAxios {
  console.log(`createSimpleMockAxios is running with none`);
  
  try {
    const mockAxios = createMockAxios();
    console.log(`createSimpleMockAxios is returning ${mockAxios}`);
    return mockAxios;
  } catch (error: any) {
    console.log(`createSimpleMockAxios error: ${error.message}`);
    throw error;
  }
}

// Export mock axios factory utilities using ES module syntax
export {
  createMockAxios, // configurable mock axios factory
  createUserMockAxios, // user-provided axios mock factory with exact implementation
  createSimpleMockAxios // simple mock axios for basic usage
};