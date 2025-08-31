/**
 * Axios HTTP Client Stub for Testing - TypeScript Implementation
 * 
 * This module provides a minimal, side-effect-free replacement for the axios
 * HTTP client library. When tests require('axios') after qtests/setup, they
 * get this stub instead of the real axios, preventing actual network requests.
 */

// Type definitions for axios stub
interface MockResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  config: any;
}

interface AxiosStub {
  get: (url: string, config?: any) => Promise<MockResponse>;
  post: (url: string, data?: any, config?: any) => Promise<MockResponse>;
  put: (url: string, data?: any, config?: any) => Promise<MockResponse>;
  delete: (url: string, config?: any) => Promise<MockResponse>;
  patch: (url: string, data?: any, config?: any) => Promise<MockResponse>;
  head: (url: string, config?: any) => Promise<MockResponse>;
  options: (url: string, config?: any) => Promise<MockResponse>;
  request: (config: any) => Promise<MockResponse>;
}

// Enhanced axios stub with all HTTP methods and response structure
const mockResponse: MockResponse = {
  status: 200,
  statusText: 'OK',
  data: {},
  headers: {},
  config: {}
};

const axiosStub: AxiosStub = {
  get: async (): Promise<MockResponse> => mockResponse,
  post: async (): Promise<MockResponse> => mockResponse,
  put: async (): Promise<MockResponse> => mockResponse,
  delete: async (): Promise<MockResponse> => mockResponse,
  patch: async (): Promise<MockResponse> => mockResponse,
  head: async (): Promise<MockResponse> => mockResponse,
  options: async (): Promise<MockResponse> => mockResponse,
  request: async (): Promise<MockResponse> => mockResponse
};

// Export axios stub using ES module syntax
export default axiosStub;