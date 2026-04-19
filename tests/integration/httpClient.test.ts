/**
 * Integration tests for lib/utils/httpClient.ts
 *
 * Covers:
 *  - createHttpClient: returns an AxiosInstance with correct defaults and option merging
 *  - addMonitoringInterceptors:
 *      request interceptor stamps config.metadata.startTime
 *      response interceptor computes duration and attaches it to metadata
 *      response interceptor fires console.warn for slow requests (> 5000ms)
 *      error interceptor attaches duration to error.config.metadata
 *  - cleanup: calls destroy() on both the https and http agents
 *  - Exported singletons: httpClient is an AxiosInstance, agents are Agent instances
 */

import https from 'https';
import http from 'http';
import {
  createHttpClient,
  addMonitoringInterceptors,
  cleanup,
  httpClient,
  httpsAgent,
  httpAgent,
} from '../../lib/utils/httpClient.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Retrieve the fulfilled/rejected handlers attached to an axios interceptor
 * manager. Axios stores them in an internal `handlers` array.
 */
function getInterceptorHandlers(manager: unknown): Array<{
  fulfilled: (v: unknown) => unknown;
  rejected: (e: unknown) => unknown;
}> {
  return (manager as { handlers: Array<{ fulfilled: Function; rejected: Function }> }).handlers.filter(Boolean);
}

// ─── createHttpClient ─────────────────────────────────────────────────────────

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
    const client = createHttpClient();
    expect(client.defaults.timeout).toBe(10000);
  });

  test('caller-supplied timeout overrides the default', () => {
    const client = createHttpClient({ timeout: 3000 });
    expect(client.defaults.timeout).toBe(3000);
  });

  test('caller-supplied baseURL is applied', () => {
    const client = createHttpClient({ baseURL: 'https://example.com' });
    expect(client.defaults.baseURL).toBe('https://example.com');
  });

  test('two calls return independent instances', () => {
    const a = createHttpClient();
    const b = createHttpClient();
    expect(a).not.toBe(b);
  });
});

// ─── addMonitoringInterceptors ────────────────────────────────────────────────

describe('addMonitoringInterceptors', () => {
  let instance: ReturnType<typeof createHttpClient>;

  beforeEach(() => {
    instance = createHttpClient();
    addMonitoringInterceptors(instance);
  });

  // ── request interceptor ────────────────────────────────────────────────────

  describe('request interceptor', () => {
    test('stamps config.metadata.startTime with the current timestamp', () => {
      const fakeNow = 1_000_000;
      jest.spyOn(Date, 'now').mockReturnValueOnce(fakeNow);

      const handlers = getInterceptorHandlers(instance.interceptors.request);
      const handler = handlers[handlers.length - 1];

      const mockConfig = { method: 'get', url: '/test' } as any;
      const result = handler.fulfilled(mockConfig) as any;

      expect(result.metadata).toBeDefined();
      expect(result.metadata.startTime).toBe(fakeNow);

      jest.restoreAllMocks();
    });

    test('does not overwrite other existing config fields', () => {
      const handlers = getInterceptorHandlers(instance.interceptors.request);
      const handler = handlers[handlers.length - 1];

      const mockConfig = { method: 'post', url: '/data', timeout: 5000 } as any;
      const result = handler.fulfilled(mockConfig) as any;

      expect(result.method).toBe('post');
      expect(result.url).toBe('/data');
      expect(result.timeout).toBe(5000);
    });
  });

  // ── response interceptor (success path) ───────────────────────────────────

  describe('response interceptor (success)', () => {
    test('computes duration and attaches it to response.config.metadata', () => {
      const startTime = 2_000_000;
      const endTime   = 2_000_500; // 500ms later

      // The interceptor calls Date.now() exactly once (to get "now"),
      // then subtracts response.config.metadata.startTime (already in the mock).
      jest.spyOn(Date, 'now').mockReturnValue(endTime);

      const handlers = getInterceptorHandlers(instance.interceptors.response);
      const handler = handlers[handlers.length - 1];

      const mockResponse = {
        config: {
          method: 'get',
          url: '/test',
          metadata: { startTime },
        },
      } as any;

      const result = handler.fulfilled(mockResponse) as any;

      expect(result.config.metadata.duration).toBe(500);
      jest.restoreAllMocks();
    });

    test('returns the response object unchanged except for added duration', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1_000_100);

      const handlers = getInterceptorHandlers(instance.interceptors.response);
      const handler = handlers[handlers.length - 1];

      const mockResponse = {
        config: { method: 'get', url: '/test', metadata: { startTime: 1_000_000 } },
        status: 200,
        data: { ok: true },
      } as any;

      const result = handler.fulfilled(mockResponse) as any;

      expect(result.status).toBe(200);
      expect(result.data).toEqual({ ok: true });

      jest.restoreAllMocks();
    });

    test('fires console.warn when duration exceeds 5000ms', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const startTime = 1_000_000;

      jest.spyOn(Date, 'now').mockReturnValue(startTime + 6_000); // 6 seconds later

      const handlers = getInterceptorHandlers(instance.interceptors.response);
      const handler = handlers[handlers.length - 1];

      const mockResponse = {
        config: { method: 'GET', url: '/slow', metadata: { startTime } },
      } as any;

      handler.fulfilled(mockResponse);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Slow HTTP request'),
      );

      warnSpy.mockRestore();
      jest.restoreAllMocks();
    });

    test('does NOT fire console.warn for a fast response (< 5000ms)', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const startTime = 1_000_000;

      jest.spyOn(Date, 'now').mockReturnValue(startTime + 100); // 100ms — fast

      const handlers = getInterceptorHandlers(instance.interceptors.response);
      const handler = handlers[handlers.length - 1];

      handler.fulfilled({
        config: { method: 'get', url: '/fast', metadata: { startTime } },
      } as any);

      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
      jest.restoreAllMocks();
    });

    test('slow-request warning message includes method and URL', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const startTime = 1_000_000;
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 6_000);

      const handlers = getInterceptorHandlers(instance.interceptors.response);
      const handler = handlers[handlers.length - 1];

      handler.fulfilled({
        config: { method: 'post', url: '/upload', metadata: { startTime } },
      } as any);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('POST'));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('/upload'));

      warnSpy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  // ── response interceptor (error path) ─────────────────────────────────────

  describe('response interceptor (error)', () => {
    test('attaches duration to error.config.metadata when config is present', async () => {
      const startTime = 3_000_000;
      jest.spyOn(Date, 'now').mockReturnValue(startTime + 200);

      const handlers = getInterceptorHandlers(instance.interceptors.response);
      const handler = handlers[handlers.length - 1];

      const mockError = {
        config: { url: '/fail', method: 'get', metadata: { startTime } },
        message: 'Network Error',
      };

      await expect(handler.rejected(mockError)).rejects.toBe(mockError);
      expect((mockError as any).config.metadata.duration).toBe(200);

      jest.restoreAllMocks();
    });

    test('re-rejects when config is absent', async () => {
      const handlers = getInterceptorHandlers(instance.interceptors.response);
      const handler = handlers[handlers.length - 1];

      const mockError = { message: 'no config' };
      await expect(handler.rejected(mockError)).rejects.toBe(mockError);
    });
  });
});

// ─── cleanup ──────────────────────────────────────────────────────────────────

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

  test('calls destroy() on both agents in a single cleanup() call', () => {
    const httpsSpy = jest.spyOn(httpsAgent, 'destroy').mockImplementation(() => {});
    const httpSpy  = jest.spyOn(httpAgent,  'destroy').mockImplementation(() => {});

    cleanup();

    expect(httpsSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).toHaveBeenCalledTimes(1);

    httpsSpy.mockRestore();
    httpSpy.mockRestore();
  });
});

// ─── exported singletons ──────────────────────────────────────────────────────

describe('exported singletons', () => {
  test('httpClient is an AxiosInstance (has .get, .post, .defaults)', () => {
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
