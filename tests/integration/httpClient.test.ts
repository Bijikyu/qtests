/**
 * Tests for lib/utils/httpClient.ts
 *
 * Covers createHttpClient, addMonitoringInterceptors (request/response/error
 * paths, slow-request warning, duration attachment), cleanup, and the shapes
 * of the exported singleton instances.
 */

import https from 'https';
import http from 'http';
import { AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import {
  createHttpClient,
  addMonitoringInterceptors,
  cleanup,
  httpClient,
  httpsAgent,
  httpAgent,
} from '../../lib/utils/httpClient.js';

// Minimal typed shapes used by the response/error interceptors under test.
interface TimingMetadata {
  startTime?: number;
  duration?: number;
}
interface MockConfig {
  method?: string;
  url?: string;
  timeout?: number;
  metadata?: TimingMetadata;
}
interface MockResponse {
  config: MockConfig;
  status?: number;
  data?: unknown;
}
interface MockAxiosError {
  config?: MockConfig;
  message?: string;
}

// Typed wrappers around the interceptor manager internals.
interface RequestHandler {
  fulfilled: (cfg: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  rejected: (err: unknown) => unknown;
}
interface ResponseHandler {
  fulfilled: (res: MockResponse) => MockResponse;
  rejected: (err: MockAxiosError) => Promise<MockAxiosError>;
}
interface InterceptorManager<H> {
  handlers: (H | null)[];
}

function lastRequestHandler(instance: AxiosInstance): RequestHandler {
  const mgr = instance.interceptors.request as unknown as InterceptorManager<RequestHandler>;
  const handlers = mgr.handlers.filter((h): h is RequestHandler => h !== null);
  return handlers[handlers.length - 1];
}

function lastResponseHandler(instance: AxiosInstance): ResponseHandler {
  const mgr = instance.interceptors.response as unknown as InterceptorManager<ResponseHandler>;
  const handlers = mgr.handlers.filter((h): h is ResponseHandler => h !== null);
  return handlers[handlers.length - 1];
}

function makeConfig(overrides: Partial<MockConfig> = {}): InternalAxiosRequestConfig {
  return { headers: new AxiosHeaders(), ...overrides } as InternalAxiosRequestConfig;
}

describe('createHttpClient', () => {
  test('returns an object with standard axios instance methods', () => {
    const client = createHttpClient();
    expect(typeof client.get).toBe('function');
    expect(typeof client.post).toBe('function');
    expect(typeof client.put).toBe('function');
    expect(typeof client.delete).toBe('function');
    expect(typeof client.request).toBe('function');
  });

  test('default timeout is 10000ms', () => {
    expect(createHttpClient().defaults.timeout).toBe(10000);
  });

  test('caller-supplied timeout overrides the default', () => {
    expect(createHttpClient({ timeout: 3000 }).defaults.timeout).toBe(3000);
  });

  test('caller-supplied baseURL is applied', () => {
    expect(createHttpClient({ baseURL: 'https://example.com' }).defaults.baseURL)
      .toBe('https://example.com');
  });

  test('two calls return independent instances', () => {
    expect(createHttpClient()).not.toBe(createHttpClient());
  });
});

describe('addMonitoringInterceptors', () => {
  let instance: AxiosInstance;

  beforeEach(() => {
    instance = createHttpClient();
    addMonitoringInterceptors(instance);
  });

  describe('request interceptor', () => {
    test('stamps metadata.startTime on the config', () => {
      const fakeNow = 1_000_000;
      jest.spyOn(Date, 'now').mockReturnValueOnce(fakeNow);

      const cfg = lastRequestHandler(instance).fulfilled(makeConfig());

      expect(cfg.metadata?.startTime).toBe(fakeNow);
      jest.restoreAllMocks();
    });

    test('does not overwrite unrelated config fields', () => {
      const cfg = lastRequestHandler(instance).fulfilled(
        makeConfig({ method: 'post', url: '/data', timeout: 5000 }),
      );
      expect(cfg.method).toBe('post');
      expect(cfg.url).toBe('/data');
      expect(cfg.timeout).toBe(5000);
    });
  });

  describe('response interceptor — success path', () => {
    test('computes duration and attaches it to response.config.metadata', () => {
      const startTime = 2_000_000;
      const endTime   = 2_000_500;
      // The interceptor calls Date.now() once; startTime comes from config.metadata.
      jest.spyOn(Date, 'now').mockReturnValue(endTime);

      const response: MockResponse = { config: { metadata: { startTime } } };
      const result = lastResponseHandler(instance).fulfilled(response);

      expect(result.config.metadata?.duration).toBe(500);
      jest.restoreAllMocks();
    });

    test('returns the response with other fields intact', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1_000_100);

      const response: MockResponse = {
        config: { metadata: { startTime: 1_000_000 } },
        status: 200,
        data: { ok: true },
      };
      const result = lastResponseHandler(instance).fulfilled(response);

      expect(result.status).toBe(200);
      expect(result.data).toEqual({ ok: true });
      jest.restoreAllMocks();
    });

    test('fires console.warn when duration exceeds 5000ms', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const startTime = 1_000_000;
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 6_000);

      lastResponseHandler(instance).fulfilled({
        config: { method: 'GET', url: '/slow', metadata: { startTime } },
      });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Slow HTTP request'));
      warnSpy.mockRestore();
      jest.restoreAllMocks();
    });

    test('does NOT fire console.warn for a fast response', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const startTime = 1_000_000;
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 100);

      lastResponseHandler(instance).fulfilled({
        config: { method: 'get', url: '/fast', metadata: { startTime } },
      });

      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
      jest.restoreAllMocks();
    });

    test('slow-request warning includes method and URL', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const startTime = 1_000_000;
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 6_000);

      lastResponseHandler(instance).fulfilled({
        config: { method: 'post', url: '/upload', metadata: { startTime } },
      });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('POST'));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('/upload'));
      warnSpy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  describe('response interceptor — error path', () => {
    test('attaches duration to error.config.metadata when config is present', async () => {
      const startTime = 3_000_000;
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 200);

      const err: MockAxiosError = {
        config: { url: '/fail', method: 'get', metadata: { startTime } },
        message: 'Network Error',
      };

      await expect(lastResponseHandler(instance).rejected(err)).rejects.toBe(err);
      expect(err.config?.metadata?.duration).toBe(200);
      jest.restoreAllMocks();
    });

    test('re-rejects when the error has no config', async () => {
      const err: MockAxiosError = { message: 'no config' };
      await expect(lastResponseHandler(instance).rejected(err)).rejects.toBe(err);
    });
  });
});

describe('cleanup', () => {
  test('calls destroy() on the shared httpsAgent', () => {
    const spy = jest.spyOn(httpsAgent, 'destroy').mockImplementation(() => {});
    cleanup();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  test('calls destroy() on the shared httpAgent', () => {
    const spy = jest.spyOn(httpAgent, 'destroy').mockImplementation(() => {});
    cleanup();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  test('calls destroy() on both agents in one invocation', () => {
    const httpsSpy = jest.spyOn(httpsAgent, 'destroy').mockImplementation(() => {});
    const httpSpy  = jest.spyOn(httpAgent,  'destroy').mockImplementation(() => {});
    cleanup();
    expect(httpsSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).toHaveBeenCalledTimes(1);
    httpsSpy.mockRestore();
    httpSpy.mockRestore();
  });
});

describe('exported singletons', () => {
  test('httpClient is an AxiosInstance', () => {
    expect(typeof httpClient.get).toBe('function');
    expect(typeof httpClient.post).toBe('function');
    expect(httpClient.defaults).toBeDefined();
  });

  test('httpsAgent is an https.Agent', () => {
    expect(httpsAgent).toBeInstanceOf(https.Agent);
  });

  test('httpAgent is an http.Agent', () => {
    expect(httpAgent).toBeInstanceOf(http.Agent);
  });
});
