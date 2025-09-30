// tests/generated-tests/utils/httpTest.shim.js - minimal local test http helpers (ESM)
// Provides a tiny Express-like app and a supertest-like client with .send()

export function createMockApp() {
  const routes = new Map();
  const add = (m, p, h) => { routes.set(m.toUpperCase() + ' ' + p, h); };

  function app(req, res) {
    const key = String(req?.method || '').toUpperCase() + ' ' + String(req?.url || '');
    const handler = routes.get(key);

    if (!handler) {
      res.statusCode = 404;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'Not Found' }));
      return;
    }

    try {
      res.statusCode = 200; // default
      handler(req, res);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Error', message: String(err && err.message || err) }));
    }
  }

  app.get = (p, h) => add('GET', p, h);
  app.post = (p, h) => add('POST', p, h);
  app.put = (p, h) => add('PUT', p, h);
  app.patch = (p, h) => add('PATCH', p, h);
  app.delete = (p, h) => add('DELETE', p, h);

  return app;
}

export function supertest(app) {
  function makeReq(method, url) {
    const state = { expected: null, body: undefined, headers: {} };

    function finish(resState) {
      const { statusCode, headers, text } = resState;
      let body = undefined;
      if (typeof text === 'string') {
        try { body = JSON.parse(text); } catch {}
      }
      const out = { status: statusCode, headers, text, body };
      if (typeof state.expected === 'number' && statusCode !== state.expected) {
        throw new Error(`Expected status ${state.expected} but got ${statusCode}`);
      }
      return out;
    }

    return {
      set(name, value) {
        state.headers[String(name).toLowerCase()] = String(value);
        return this;
      },
      send(payload) {
        const isObject = payload !== null && typeof payload === 'object';
        state.body = isObject ? JSON.stringify(payload) : String(payload ?? '');
        if (!state.headers['content-type']) {
          state.headers['content-type'] = isObject ? 'application/json' : 'text/plain';
        }
        return this;
      },
      expect(status) { state.expected = status; return this.end(); },
      end() {
        return new Promise((resolve) => {
          const headers = {};
          let bodyText = '';
          const res = {
            statusCode: 200,
            setHeader: (k, v) => { headers[String(k).toLowerCase()] = String(v); },
            end: (txt) => {
              bodyText = typeof txt === 'string' ? txt : (txt == null ? '' : String(txt));
              resolve(finish({ statusCode: res.statusCode, headers, text: bodyText }));
            }
          };

          const req = { method, url, headers: { ...state.headers } };
          if (state.body !== undefined) {
            const ct = state.headers['content-type'] || '';
            req.body = ct.includes('application/json') ? (() => { try { return JSON.parse(state.body); } catch { return state.body; } })() : state.body;
          }
          try {
            const qs = url.includes('?') ? url.split('?')[1] : '';
            req.query = Object.fromEntries(new URLSearchParams(qs));
          } catch {}

          app(req, res);
        });
      }
    };
  }

  return {
    get: (p) => makeReq('GET', p),
    post: (p) => makeReq('POST', p),
    put: (p) => makeReq('PUT', p),
    patch: (p) => makeReq('PATCH', p),
    delete: (p) => makeReq('DELETE', p),
  };
}
