/**
 * Axios HTTP Client Stub for Testing - Complete API Compliance
 * 
 * This module provides a complete, API-compliant replacement for the axios
 * HTTP client library. When tests require('axios') after qtests/setup, they
 * get this stub instead of the real axios, preventing actual network requests
 * while maintaining full axios API compatibility.
 */

// Simplified types to avoid axios dependency conflicts
interface MockAxiosRequestConfig {
  url?: string;
  method?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  params?: any;
  data?: any;
  timeout?: number;
  responseType?: string;
  auth?: { username: string; password: string };
  maxContentLength?: number;
  maxBodyLength?: number;
  validateStatus?: (status: number) => boolean;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
}

interface MockAxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: MockAxiosRequestConfig;
  request?: any;
}

interface MockAxiosError extends Error {
  config?: MockAxiosRequestConfig;
  code?: string;
  request?: any;
  response?: MockAxiosResponse;
  isAxiosError: boolean;
}

interface MockInterceptor<T = any> {
  fulfilled?: (value: T) => T | Promise<T>;
  rejected?: (error: any) => any;
}

interface MockInterceptorManager<T = any> {
  use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: any) => any): number;
  eject(id: number): void;
  clear(): void;
}

interface MockInterceptors {
  request: MockInterceptorManager<MockAxiosRequestConfig>;
  response: MockInterceptorManager<MockAxiosResponse>;
}

interface MockDefaults {
  headers: Record<string, string>;
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
}

interface MockAxiosInstance {
  request<T = any>(config: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
  get<T = any>(url: string, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
  post<T = any>(url: string, data?: any, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
  put<T = any>(url: string, data?: any, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
  delete<T = any>(url: string, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
  head<T = any>(url: string, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
  options<T = any>(url: string, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
  getUri(config?: MockAxiosRequestConfig): string;
  interceptors: MockInterceptors;
  defaults: MockDefaults;
}

// Default mock response structure
const createMockResponse = <T = any>(config: MockAxiosRequestConfig, data?: T, status: number = 200): MockAxiosResponse<T> => {
  // Ensure data has proper type
  const responseData = data !== undefined ? data : {} as T;
  
  return {
    data: responseData,
    status,
    statusText: getStatusText(status),
    headers: {
      'content-type': 'application/json',
      'content-length': '0',
      'connection': 'keep-alive'
    },
    config: { ...getDefaultConfig(), ...config },
    request: {} // Mock XMLHttpRequest object
  };
};

// Default axios configuration
const getDefaultConfig = (): MockAxiosRequestConfig => ({
  url: '',
  method: 'get',
  baseURL: '',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  timeout: 0,
  responseType: 'json',
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function(status) { return status >= 200 && status < 300; }
});

// Helper function to get status text
function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable'
  };
  return statusTexts[status] || 'Unknown Status';
}

// Mock interceptor manager
class MockInterceptorManagerImplementation<T = any> implements MockInterceptorManager<T> {
  private interceptors: MockInterceptor<T>[] = [];

  use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: any) => any): number {
    const interceptor = { fulfilled: onFulfilled, rejected: onRejected };
    this.interceptors.push(interceptor);
    return this.interceptors.length - 1;
  }

  eject(id: number): void {
    this.interceptors.splice(id, 1);
  }

  clear(): void {
    this.interceptors = [];
  }

  getInterceptors(): MockInterceptor<T>[] {
    return this.interceptors;
  }
}

// Mock CancelToken implementation
class MockCancelToken {
  static source(): { token: MockCancelToken; cancel: (reason?: any) => void } {
    const token = new MockCancelToken();
    return {
      token,
      cancel: (reason?: any) => {
        (token as any)._cancelled = true;
        (token as any)._reason = reason;
      }
    };
  }

  private _cancelled: boolean = false;
  private _reason: any;

  get cancelled(): boolean {
    return this._cancelled;
  }

  get reason(): any {
    return this._reason;
  }

  throwIfRequested(): void {
    if (this._cancelled) {
      throw new MockAxiosErrorImplementation('Request canceled', 'ECONNABORTED');
    }
  }
}

// Mock AxiosError implementation
class MockAxiosErrorImplementation extends Error implements MockAxiosError {
  config?: MockAxiosRequestConfig;
  code?: string;
  request?: any;
  response?: MockAxiosResponse;
  isAxiosError: boolean = true;

  constructor(message: string, code?: string, config?: MockAxiosRequestConfig, request?: any, response?: MockAxiosResponse) {
    super(message);
    this.name = 'AxiosError';
    this.code = code;
    this.config = config;
    this.request = request;
    this.response = response;
  }

  toJSON(): object {
    return {
      message: this.message,
      name: this.name,
      code: this.code,
      config: this.config,
      request: this.request,
      response: this.response
    };
  }
}

// Main axios stub instance factory
function createAxiosInstance(defaultConfig: MockAxiosRequestConfig = {}): MockAxiosInstance {
  const interceptors: MockInterceptors = {
    request: new MockInterceptorManagerImplementation<MockAxiosRequestConfig>(),
    response: new MockInterceptorManagerImplementation<MockAxiosResponse>()
  };

  const defaults: MockDefaults = {
    headers: { ...getDefaultConfig().headers, ...defaultConfig.headers } as Record<string, string>,
    timeout: defaultConfig.timeout || 0,
    xsrfCookieName: defaultConfig.xsrfCookieName || 'XSRF-TOKEN',
    xsrfHeaderName: defaultConfig.xsrfHeaderName || 'X-XSRF-TOKEN',
    maxContentLength: defaultConfig.maxContentLength || -1,
    maxBodyLength: defaultConfig.maxBodyLength || -1
  };

  // Core request function
  async function request<T = any>(config: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>> {
    // Merge with defaults
    const finalConfig = { ...getDefaultConfig(), ...defaults, ...defaultConfig, ...config };

    // Process request interceptors
    for (const interceptor of (interceptors.request as MockInterceptorManagerImplementation<MockAxiosRequestConfig>).getInterceptors()) {
      try {
        if (interceptor.fulfilled) {
          const result = await interceptor.fulfilled(finalConfig);
          Object.assign(finalConfig, result);
        }
      } catch (error) {
        if (interceptor.rejected) {
          throw await interceptor.rejected(error);
        }
        throw error;
      }
    }

    // Create mock response
    let response = createMockResponse<T>(finalConfig);

    // Process response interceptors
    for (const interceptor of (interceptors.response as MockInterceptorManagerImplementation<MockAxiosResponse>).getInterceptors()) {
      try {
        if (interceptor.fulfilled) {
          response = await interceptor.fulfilled(response);
        }
      } catch (error) {
        if (interceptor.rejected) {
          throw await interceptor.rejected(error);
        }
        throw error;
      }
    }

    return response;
  }

  // HTTP method helpers
  const instance: MockAxiosInstance = {
    request,
    get: <T = any>(url: string, config?: MockAxiosRequestConfig) => 
      request<T>({ ...config, method: 'get', url }),
    post: <T = any>(url: string, data?: any, config?: MockAxiosRequestConfig) => 
      request<T>({ ...config, method: 'post', url, data }),
    put: <T = any>(url: string, data?: any, config?: MockAxiosRequestConfig) => 
      request<T>({ ...config, method: 'put', url, data }),
    patch: <T = any>(url: string, data?: any, config?: MockAxiosRequestConfig) => 
      request<T>({ ...config, method: 'patch', url, data }),
    delete: <T = any>(url: string, config?: MockAxiosRequestConfig) => 
      request<T>({ ...config, method: 'delete', url }),
    head: <T = any>(url: string, config?: MockAxiosRequestConfig) => 
      request<T>({ ...config, method: 'head', url }),
    options: <T = any>(url: string, config?: MockAxiosRequestConfig) => 
      request<T>({ ...config, method: 'options', url }),
    getUri: (config?: MockAxiosRequestConfig) => {
      const finalConfig = { ...getDefaultConfig(), ...config };
      return finalConfig.baseURL ? finalConfig.baseURL + (finalConfig.url || '') : (finalConfig.url || '');
    },
    interceptors,
    defaults
  };

  return instance;
}

// Default axios instance
const defaultAxios = createAxiosInstance();

// Axios factory function with all static methods
const axios = Object.assign(defaultAxios, {
  create: createAxiosInstance,
  all: <T>(promises: Promise<T>[]) => Promise.all(promises),
  spread: <T, R>(callback: (...args: T[]) => R) => 
    (array: T[]): R => callback(...array),
  isCancel: (value: any): value is MockCancelToken => 
    value && typeof value === 'object' && 'cancelled' in value,
  isAxiosError: (error: any): error is MockAxiosError => 
    error && error.isAxiosError === true,
  CancelToken: MockCancelToken,
  VERSION: '1.6.0' // Match current axios version
});

// Export axios stub using ES module syntax
export default axios;

// Also export individual components for advanced usage
export { MockCancelToken, MockAxiosErrorImplementation, createAxiosInstance };
export type { MockAxiosResponse, MockAxiosError, MockAxiosRequestConfig, MockAxiosInstance };