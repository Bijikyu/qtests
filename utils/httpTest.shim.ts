// utils/httpTest.shim.ts - canonical http test helpers (ESM TypeScript)
// Provides a tiny Express-like app and a supertest-like client with `.send()`

// Production-ready fallback error handling to avoid qerrors dependency issues
const qerrors = (error: Error, message?: string, context?: any) => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    message: message || error.message,
    stack: error.stack,
    context: context || {}
  };
  
  console.error('[QERRORS]', JSON.stringify(errorInfo, null, 2));
  
  throw error;
};

interface MockRequest {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
}

interface MockResponse {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (text?: string) => void;
}

interface MockHandler {
  (req: MockRequest, res: MockResponse): void;
}

interface MockApp extends MockHandler {
  get: (path: string, handler: MockHandler) => MockApp;
  post: (path: string, handler: MockHandler) => MockApp;
  put: (path: string, handler: MockHandler) => MockApp;
  patch: (path: string, handler: MockHandler) => MockApp;
  delete: (path: string, handler: MockHandler) => MockApp;
}

interface SupertestResponse {
  status: number;
  headers: Record<string, string>;
  text: string;
  body?: any;
}

interface SupertestBuilder {
  set(name: string, value: string): SupertestBuilder;
  send(payload: any): SupertestBuilder;
  expect(status: number): SupertestBuilder;
  end(): Promise<SupertestResponse>;
}

interface SupertestClient {
  get(path: string): SupertestBuilder;
  post(path: string): SupertestBuilder;
  put(path: string): SupertestBuilder;
  patch(path: string): SupertestBuilder;
  delete(path: string): SupertestBuilder;
}

export function createMockApp(): MockApp {
  const routes = new Map<string, MockHandler>();
  const add = (method: string, path: string, handler: MockHandler) => { 
    routes.set(method.toUpperCase() + ' ' + path, handler); 
  };

  function app(req: MockRequest, res: MockResponse): void {
    // Strip query string from URL for route matching
    const url = req?.url || '';
    const pathWithoutQuery = url.includes('?') ? url.split('?')[0] : url;
    const key = String(req?.method || '').toUpperCase() + ' ' + pathWithoutQuery;
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
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ 
        error: 'Internal Error', 
        message: String((err && err.message) || err) 
      }));
    }
  }

  app.get = (path: string, handler: MockHandler) => (add('GET', path, handler), app);
  app.post = (path: string, handler: MockHandler) => (add('POST', path, handler), app);
  app.put = (path: string, handler: MockHandler) => (add('PUT', path, handler), app);
  app.patch = (path: string, handler: MockHandler) => (add('PATCH', path, handler), app);
  app.delete = (path: string, handler: MockHandler) => (add('DELETE', path, handler), app);

  return app;
}

export function supertest(app: MockApp): SupertestClient {
  function makeReq(method: string, url: string): SupertestBuilder {
    const state = { 
      expected: null as number | null, 
      body: undefined as string | undefined, 
      headers: {} as Record<string, string> 
    };

    function finish(resState: { statusCode: number; headers: Record<string, string>; text: string }): SupertestResponse {
      const { statusCode, headers, text } = resState;
      let body: any = undefined;
      if (typeof text === 'string') {
        try { 
          body = JSON.parse(text); 
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          qerrors(errorObj, 'httpTest.shim: parsing response body as JSON', { textLength: text.length });
          // Ignore JSON parse errors
        }
      }
      const out: SupertestResponse = { status: statusCode, headers, text, body };
      if (typeof state.expected === 'number' && statusCode !== state.expected) {
        throw new Error(`Expected status ${state.expected} but got ${statusCode}`);
      }
      return out;
    }

    return {
      set(name: string, value: string): SupertestBuilder {
        state.headers[String(name).toLowerCase()] = String(value);
        return this;
      },
      send(payload: any): SupertestBuilder {
        const isObject = payload !== null && typeof payload === 'object';
        state.body = isObject ? JSON.stringify(payload) : String(payload ?? '');
        if (!state.headers['content-type']) {
          state.headers['content-type'] = isObject ? 'application/json' : 'text/plain';
        }
        return this;
      },
      expect(status: number): SupertestBuilder { 
        state.expected = status; 
        return this; 
      },
      end(): Promise<SupertestResponse> {
        return new Promise((resolve) => {
          const headers: Record<string, string> = {};
          let bodyText = '';
          const res: MockResponse = {
            statusCode: 200,
            setHeader: (k: string, v: string) => { 
              headers[String(k).toLowerCase()] = String(v); 
            },
            end: (txt?: string) => {
              bodyText = typeof txt === 'string' ? txt : (txt == null ? '' : String(txt));
              resolve(finish({ statusCode: res.statusCode, headers, text: bodyText }));
            }
          };

          const req: MockRequest = { method, url, headers: { ...state.headers } };
          if (state.body !== undefined) {
            const ct = state.headers['content-type'] || '';
            req.body = (ct && ct.includes('application/json')) ? (() => { 
              try { 
                // Validate input before JSON parsing
                if (typeof state.body !== 'string') {
                  throw new Error('Request body must be a string for JSON parsing');
                }
                
                // Check for potentially dangerous JSON content
                const bodySize = state.body.length;
                if (bodySize > 1024 * 1024) { // 1MB limit
                  throw new Error('Request body too large for JSON parsing');
                }
                
                // Look for suspicious patterns in JSON
                const suspiciousPatterns = [
                  /constructor/i,
                  /prototype/i,
                  /__proto__/i,
                  /<script/i,
                  /javascript:/i,
                ];
                
                for (const pattern of suspiciousPatterns) {
                  if (pattern.test(state.body)) {
                    qerrors(new Error('Suspicious content detected in JSON body'), 'httpTest.shim: security validation', { 
                      pattern: pattern.source,
                      bodySize 
                    });
                    return state.body; // Return original body instead of parsed
                  }
                }
                
                const parsed = JSON.parse(state.body);
                
                // Validate parsed object structure
                if (parsed !== null && typeof parsed === 'object') {
                  // Check for prototype pollution attempts
                  if (parsed.hasOwnProperty('__proto__') || 
                      parsed.hasOwnProperty('constructor') || 
                      parsed.hasOwnProperty('prototype')) {
                    qerrors(new Error('Prototype pollution attempt detected'), 'httpTest.shim: security validation');
                    return state.body;
                  }
                }
                
                return parsed;
              } catch (error) {
                const errorObj = error instanceof Error ? error : new Error(String(error));
                qerrors(errorObj, 'httpTest.shim: parsing request body as JSON', { contentType: ct });
                return state.body; 
              } 
            })() : state.body;
          }
          try {
            const qs = (url && url.includes && url.includes('?')) ? url.split('?')[1] : '';
            req.query = Object.fromEntries(new URLSearchParams(qs));
          } catch {
            // Ignore query string parse errors
          }

          app(req, res);
        });
      }
    };
  }

  return {
    get: (path: string) => makeReq('GET', path),
    post: (path: string) => makeReq('POST', path),
    put: (path: string) => makeReq('PUT', path),
    patch: (path: string) => makeReq('PATCH', path),
    delete: (path: string) => makeReq('DELETE', path),
  };
}

// ESM exports provided above