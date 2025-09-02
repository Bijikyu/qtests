// generated-tests/utils/httpTest.js - minimal local test http helpers (ESM)
export function createMockApp() {
  // Route table keyed by METHOD + space + path
  const routes = new Map();
  const add = (m, p, h) => { routes.set(m.toUpperCase() + ' ' + p, h); };
  const app = {
    get: (p, h) => add('GET', p, h),
    post: (p, h) => add('POST', p, h),
    put: (p, h) => add('PUT', p, h),
    patch: (p, h) => add('PATCH', p, h),
    delete: (p, h) => add('DELETE', p, h),
    async handle(method, url, body) {
      const key = method.toUpperCase() + ' ' + url;
      const handler = routes.get(key);
      const query = (() => {
        try {
          const qs = url.includes('?') ? url.split('?')[1] : '';
          return Object.fromEntries(new URLSearchParams(qs));
        } catch {
          return {};
        }
      })();
      const req = { method: method.toUpperCase(), url, body, query };
      const res = {
        statusCode: 404,
        headers: {},
        body: undefined,
        _rawBody: undefined,
        setHeader(name, value) { this.headers[String(name).toLowerCase()] = String(value); },
        end(payload) {
          this._rawBody = payload;
          try {
            this.body = typeof payload === 'string' ? JSON.parse(payload) : payload;
          } catch {
            this.body = payload;
          }
        }
      };
      if (!handler) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
        return res;
      }
      // Default to 200 unless handler sets otherwise
      res.statusCode = 200;
      await handler(req, res);
      return res;
    }
  };
  return app;
}

export function supertest(app) {
  const make = (method) => (route) => ({
    _payload: undefined,
    send(data) { this._payload = data; return this; },
    async expect(status) {
      const res = await app.handle(method, route, this._payload);
      if (res.statusCode !== status) {
        throw new Error(`Expected status ${status} but got ${res.statusCode}`);
      }
      return res;
    }
  });
  return {
    get: make('GET'),
    post: make('POST'),
    put: make('PUT'),
    patch: make('PATCH'),
    delete: make('DELETE')
  };
}
