/**
 * HTTP Mock Type Definitions
 */

export type MockStrategy = 'legacy-axios' | 'msw-modern' | 'simple-axios' | 'user-configurable';

export interface MockResponse {
  status?: number;
  statusText?: string;
  headers?: Record<string, any>;
  data?: any;
  delay?: number; // Response delay in milliseconds
}

export interface AxiosResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, any>;
  config: Record<string, any>;
  request: Record<string, any>;
}

export interface RequestMatcher {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string | RegExp;
  headers?: Record<string, string>;
  body?: any;
}

export interface MockHttpClientConfig {
  strategy?: MockStrategy;
  defaultResponse?: any;
  defaultStatus?: number;
  simulateErrors?: boolean;
  responseDelay?: number;
  presetData?: Record<string, { data: any; status: number; reject?: boolean }>;
}

export interface MockHttpClient {
  get(url: string, config?: any): Promise<MockResponse | AxiosResponse>;
  post(url: string, data?: any, config?: any): Promise<MockResponse | AxiosResponse>;
  put(url: string, data?: any, config?: any): Promise<MockResponse | AxiosResponse>;
  delete(url: string, config?: any): Promise<MockResponse | AxiosResponse>;
  patch(url: string, data?: any, config?: any): Promise<MockResponse | AxiosResponse>;
  request(config?: any): Promise<MockResponse | AxiosResponse>;
  cleanup?(): void; // For MSW-based implementations
}

export interface UserMockAxios extends MockHttpClient {
  __set?(url: string, data: any, status?: number, reject?: boolean): void;
}