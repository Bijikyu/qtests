/**
 * Integration Test Helper with HTTP Utilities and Server Readiness
 * 
 * Provides utilities for integration tests that make actual HTTP requests:
 * - Pre-configured axios instance with timing interceptors
 * - HTTP request wrapper with retry logic
 * - Server readiness checking
 * - Test data cleanup utilities
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { EnhancedErrorHandler } from '../../lib/errorHandling/pRetryTimeoutWrapper.js';

export interface RequestOptions {
  retries?: number;
  retryDelay?: number;
  expectedStatus?: number[];
  timeout?: number;
  headers?: Record<string, string>;
}

export interface TimedAxiosResponse<T = any> extends AxiosResponse<T> {
  duration?: number;
}

/**
 * Create an axios instance with request/response timing interceptors
 */
export function createTimedAxios(config: {
  timeout?: number;
  validateStatus?: (status: number) => boolean;
} = {}): AxiosInstance {
  const instance = axios.create({
    timeout: config.timeout ?? 10000,
    maxRedirects: 0,
    validateStatus: config.validateStatus ?? ((status) => status < 500)
  });

  instance.interceptors.request.use(
    (reqConfig) => {
      (reqConfig as any).metadata = { startTime: Date.now() };
      return reqConfig;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: TimedAxiosResponse) => {
      const metadata = (response.config as any).metadata;
      if (metadata) {
        response.duration = Date.now() - metadata.startTime;
        (response.config as any).metadata = null;
      }
      return response;
    },
    (error: AxiosError) => {
      const metadata = (error.config as any)?.metadata;
      if (metadata) {
        (error as any).duration = Date.now() - metadata.startTime;
        (error.config as any).metadata = null;
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

const testAxios = createTimedAxios();

/**
 * HTTP request wrapper with retry logic and status validation
 * Uses our existing EnhancedErrorHandler for retry logic
 */
export async function makeRequest<T = any>(
  method: string,
  url: string,
  data: any = null,
  options: RequestOptions = {}
): Promise<TimedAxiosResponse<T>> {
  const {
    retries = 3,
    retryDelay = 1000,
    expectedStatus = [200, 201],
    timeout = 10000,
    headers = {}
  } = options;

  const errorHandler = new EnhancedErrorHandler({
    retries,
    minTimeout: retryDelay,
    maxTimeout: retryDelay * 4,
    milliseconds: timeout,
    enableLogging: false,
    shouldRetry: (error: Error) => {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const status = axiosError.response.status;
        if (status >= 400 && status < 500 && status !== 429) {
          return false;
        }
      }
      if (axiosError.code === 'ECONNABORTED') {
        return false;
      }
      return true;
    }
  });

  const makeAttempt = async (): Promise<TimedAxiosResponse<T>> => {
    const config: any = {
      method,
      url,
      timeout,
      headers
    };

    if (data !== null) {
      config.data = data;
    }

    const response = await testAxios.request<T>(config) as TimedAxiosResponse<T>;

    if (!expectedStatus.includes(response.status)) {
      const error = new Error(
        `Unexpected status ${response.status}. Expected: ${expectedStatus.join(', ')}`
      ) as any;
      error.response = response;
      throw error;
    }

    return response;
  };

  try {
    return await errorHandler.executeWithRetryAndTimeout(makeAttempt);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const enhancedError = new Error(
        `HTTP ${axiosError.response.status}: ${(axiosError.response.data as any)?.error || axiosError.message}`
      ) as any;
      enhancedError.status = axiosError.response.status;
      enhancedError.data = axiosError.response.data;
      enhancedError.config = axiosError.config;
      enhancedError.duration = (axiosError as any).duration;
      throw enhancedError;
    }
    throw error;
  }
}

/**
 * Wait for a server to be ready by polling its health endpoint
 */
export async function waitForServer(
  baseUrl: string,
  options: {
    timeout?: number;
    healthPath?: string;
    pollInterval?: number;
  } = {}
): Promise<boolean> {
  const {
    timeout = 15000,
    healthPath = '/api/health',
    pollInterval = 500
  } = options;

  const startTime = Date.now();
  const healthUrl = `${baseUrl}${healthPath}`;

  while (Date.now() - startTime < timeout) {
    try {
      await makeRequest('GET', healthUrl, null, {
        timeout: 3000,
        retries: 1,
        expectedStatus: [200]
      });
      return true;
    } catch {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }

  throw new Error(`Server not ready at ${healthUrl} after ${timeout}ms`);
}

/**
 * Wait for a port to be listening
 */
export async function waitForPort(
  port: number,
  options: {
    timeout?: number;
    host?: string;
    pollInterval?: number;
  } = {}
): Promise<boolean> {
  const {
    timeout = 15000,
    host = 'localhost',
    pollInterval = 500
  } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const net = await import('net');
      const isOpen = await new Promise<boolean>((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(1000);
        socket.once('connect', () => {
          socket.destroy();
          resolve(true);
        });
        socket.once('error', () => {
          socket.destroy();
          resolve(false);
        });
        socket.once('timeout', () => {
          socket.destroy();
          resolve(false);
        });
        socket.connect(port, host);
      });

      if (isOpen) {
        return true;
      }
    } catch {
      // Continue polling
    }
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Port ${port} not available after ${timeout}ms`);
}

/**
 * Clean up global test data with error handling
 */
export function cleanupTestData(): void {
  try {
    if ((global as any).testData) {
      const testData = (global as any).testData;
      if (Array.isArray(testData.rules)) testData.rules = [];
      if (Array.isArray(testData.templates)) testData.templates = [];
      if (Array.isArray(testData.users)) testData.users = [];
      if (testData._counters) {
        testData._counters = { user: 1, rule: 1, template: 1, snooze: 1 };
      }
    }

    if (typeof (global as any).gc === 'function') {
      (global as any).gc();
    }
  } catch (error) {
    console.warn('Warning during test cleanup:', (error as Error).message);
  }
}

/**
 * Initialize global test data structure
 */
export function initializeTestData(): void {
  (global as any).testData = {
    rules: [],
    templates: [],
    users: [],
    _counters: { user: 1, rule: 1, template: 1, snooze: 1 }
  };
}

/**
 * Get next counter value for generating unique test data
 */
export function getNextCounter(type: 'user' | 'rule' | 'template' | 'snooze'): number {
  if (!(global as any).testData) {
    initializeTestData();
  }
  return (global as any).testData._counters[type]++;
}

export { testAxios };
export default {
  createTimedAxios,
  makeRequest,
  waitForServer,
  waitForPort,
  cleanupTestData,
  initializeTestData,
  getNextCounter,
  testAxios
};
