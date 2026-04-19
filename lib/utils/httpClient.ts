/**
 * HTTP Client Utilities using Axios
 *
 * Simplified HTTP client utilities that use axios directly with recommended
 * configuration for scalability and performance.
 */

import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import qerrors from '../qerrorsFallback.js';
import { createHTTPSAgent, createHTTPAgent } from './agentFactory.js';

/**
 * Augment the axios InternalAxiosRequestConfig to carry timing metadata.
 * This is attached by the request interceptor and consumed by the response
 * interceptor to calculate per-request duration.
 */
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime?: number;
      duration?: number;
      [key: string]: unknown;
    };
  }
}

/** Shared connection-pooling agents (created once, reused for all requests). */
const httpsAgent = createHTTPSAgent();
const httpAgent = createHTTPAgent();

/**
 * Create a configured axios instance with connection pooling.
 *
 * @param options - Axios configuration options merged on top of the defaults
 * @returns Configured axios instance
 */
function createHttpClient(options: AxiosRequestConfig = {}): AxiosInstance {
  return axios.create({
    timeout: 10000,
    maxRedirects: 5,

    // Connection pooling
    httpsAgent,
    httpAgent,

    // Performance limits
    maxContentLength: 10 * 1024 * 1024, // 10 MB
    maxBodyLength: 10 * 1024 * 1024,    // 10 MB
    decompress: true,

    // Only treat 2xx responses as successful
    validateStatus: (status: number) => status >= 200 && status < 300,

    ...options,
  });
}

/** Default shared axios instance (with monitoring interceptors attached). */
const httpClient = createHttpClient();

/**
 * Attach request/response monitoring interceptors to an axios instance.
 *
 * - Request interceptor: stamps `config.metadata.startTime`.
 * - Response interceptor: computes duration, warns on slow requests (> 5 s),
 *   and forwards errors through qerrors for structured logging.
 *
 * @param instance - The axios instance to enhance
 */
function addMonitoringInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.metadata = { startTime: Date.now() };
      return config;
    },
    (error: unknown) => {
      qerrors(error as Error, 'httpClient.request.interceptor: request failed', {
        interceptor: 'request',
        phase: 'setup',
      });
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      const duration = Date.now() - (response.config.metadata?.startTime ?? Date.now());
      response.config.metadata = { ...response.config.metadata, duration };

      if (duration > 5000) {
        console.warn(
          `Slow HTTP request: ${response.config.method?.toUpperCase()} ${response.config.url} took ${duration}ms`,
        );
      }

      return response;
    },
    (error: unknown) => {
      const axiosError = error as {
        config?: {
          metadata?: { startTime?: number; duration?: number };
          url?: string;
          method?: string;
        };
      };

      if (axiosError.config) {
        const duration = Date.now() - (axiosError.config.metadata?.startTime ?? Date.now());
        axiosError.config.metadata = { ...axiosError.config.metadata, duration };
      }

      qerrors(error as Error, 'httpClient.response.interceptor: response failed', {
        interceptor: 'response',
        phase: 'handling',
        url: axiosError.config?.url,
        method: axiosError.config?.method,
      });

      return Promise.reject(error);
    },
  );
}

addMonitoringInterceptors(httpClient);

/** Destroy the shared connection pools. Called automatically on process exit signals. */
function cleanup(): void {
  httpsAgent.destroy();
  httpAgent.destroy();
}

if (typeof process !== 'undefined') {
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGUSR2', cleanup);
}

export {
  httpClient,
  createHttpClient,
  addMonitoringInterceptors,
  cleanup,
  httpsAgent,
  httpAgent,
};
