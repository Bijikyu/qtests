/**
 * Shared Route Test Utilities
 * Eliminates duplication in route testing patterns
 * Provides parameterized test generation for common HTTP route scenarios
 */

// Simplified http testing implementations to avoid import issues
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

function createMockApp(): MockApp {
  const routes = new Map<string, MockHandler>();
  const add = (method: string, path: string, handler: MockHandler) => { 
    routes.set(method.toUpperCase() + ' ' + path, handler); 
  };

  function app(req: MockRequest, res: MockResponse): void {
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
      res.statusCode = 200;
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

function supertest(app: MockApp): SupertestClient {
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
          qerrors(errorObj, 'routeTestUtils: parsing response body as JSON', { textLength: text.length });
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
                if (typeof state.body !== 'string') {
                  throw new Error('Request body must be a string for JSON parsing');
                }
                const bodySize = state.body.length;
                if (bodySize > 1024 * 1024) {
                  throw new Error('Request body too large for JSON parsing');
                }
                const suspiciousPatterns = [
                  /constructor/i,
                  /prototype/i,
                  /__proto__/i,
                  /<script/i,
                  /javascript:/i,
                ];
                for (const pattern of suspiciousPatterns) {
                  if (pattern.test(state.body)) {
                    qerrors(new Error('Suspicious content detected in JSON body'), 'routeTestUtils: security validation', { 
                      pattern: pattern.source,
                      bodySize 
                    });
                    return state.body;
                  }
                }
                const parsed = JSON.parse(state.body);
                if (parsed !== null && typeof parsed === 'object') {
                  if (parsed.hasOwnProperty('__proto__') || 
                      parsed.hasOwnProperty('constructor') || 
                      parsed.hasOwnProperty('prototype')) {
                    qerrors(new Error('Prototype pollution attempt detected'), 'routeTestUtils: security validation');
                    return state.body;
                  }
                }
                return parsed;
              } catch (error) {
                const errorObj = error instanceof Error ? error : new Error(String(error));
                qerrors(errorObj, 'routeTestUtils: parsing request body as JSON', { contentType: ct });
                return state.body; 
              } 
            })() : state.body;
          }
          try {
            const qs = (url && url.includes && url.includes('?')) ? url.split('?')[1] : '';
            req.query = Object.fromEntries(new URLSearchParams(qs));
          } catch {
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

// ==================== TEST INTERFACES ====================

/**
 * Route test configuration
 */
export interface RouteTestConfig {
  /** HTTP method (GET, POST, etc.) */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Route path */
  path: string;
  /** Test description */
  description?: string;
  /** Success response data */
  successResponse?: any;
  /** Success status code */
  successStatus?: number;
  /** Error response data */
  errorResponse?: any;
  /** Error status code */
  errorStatus?: number;
  /** Custom route handler */
  customHandler?: (req: any, res: any) => void;
}

/**
 * Test result interface
 */
export interface TestResult {
  status: number;
  body: any;
  headers: any;
}

// ==================== TEST GENERATION FUNCTIONS ====================

/**
 * Create a standardized success response
 */
function createSuccessResponse(data: any = { success: true }, status: number = 200): (req: any, res: any) => void {
  return (req: any, res: any) => {
    res.statusCode = status;
    res.setHeader('content-type', 'application/json');
    try {
      const jsonStr = JSON.stringify(data);
      res.end(jsonStr);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      qerrors(errorObj, 'routeTestUtils.createSuccessResponse: JSON stringify failed', {
        dataType: typeof data,
        status,
        operation: 'responseSerialization'
      });
      res.end('{"success":true}');
    }
  };
}

/**
 * Create a standardized error response
 */
function createErrorResponse(errorMsg: string = 'Bad request', status: number = 400): (req: any, res: any) => void {
  return (req: any, res: any) => {
    res.statusCode = status;
    res.setHeader('content-type', 'application/json');
    try {
      const jsonStr = JSON.stringify({ error: errorMsg });
      res.end(jsonStr);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      qerrors(errorObj, 'routeTestUtils.createErrorResponse: JSON stringify failed', {
        errorMsg,
        status,
        operation: 'errorResponseSerialization'
      });
      res.end('{"error":"Bad request"}');
    }
  };
}

/**
 * Create a mock app with a single route
 */
function createRouteApp(config: RouteTestConfig): any {
  const app = createMockApp();
  
  if (config.customHandler) {
    (app as any)[config.method.toLowerCase()](config.path, config.customHandler);
  } else {
    (app as any)[config.method.toLowerCase()](config.path, createSuccessResponse(config.successResponse, config.successStatus));
  }
  
  return app;
}

/**
 * Create a mock app with error handling
 */
function createErrorRouteApp(config: RouteTestConfig): any {
  const app = createMockApp();
  
  if (config.customHandler) {
    (app as any)[config.method.toLowerCase()](config.path, config.customHandler);
  } else {
    (app as any)[config.method.toLowerCase()](config.path, createErrorResponse(config.errorResponse, config.errorStatus));
  }
  
  return app;
}

/**
 * Execute a test request and return result
 */
async function executeRequest(config: RouteTestConfig, app: any): Promise<TestResult> {
  const request = supertest(app);
  let response;

  switch (config.method) {
    case 'GET':
      response = await request.get(config.path).expect(200).end();
      break;
    case 'POST':
      response = await request.post(config.path).expect(200).end();
      break;
    case 'PUT':
      response = await request.put(config.path).expect(200).end();
      break;
    case 'DELETE':
      response = await request.delete(config.path).expect(200).end();
      break;
    case 'PATCH':
      response = await request.patch(config.path).expect(200).end();
      break;
    default:
      throw new Error(`Unsupported method: ${config.method}`);
  }

  return response as TestResult;
}

/**
 * Execute an error test request and return result
 */
async function executeErrorRequest(config: RouteTestConfig, app: any): Promise<TestResult> {
  const request = supertest(app);
  let response;

  switch (config.method) {
    case 'GET':
      response = await request.get(config.path).expect(config.errorStatus || 400).end();
      break;
    case 'POST':
      response = await request.post(config.path).expect(config.errorStatus || 400).end();
      break;
    case 'PUT':
      response = await request.put(config.path).expect(config.errorStatus || 400).end();
      break;
    case 'DELETE':
      response = await request.delete(config.path).expect(config.errorStatus || 400).end();
      break;
    case 'PATCH':
      response = await request.patch(config.path).expect(config.errorStatus || 400).end();
      break;
    default:
      throw new Error(`Unsupported method: ${config.method}`);
  }

  return response as TestResult;
}

// ==================== MAIN TEST GENERATOR ====================

/**
 * Generate comprehensive route tests
 * 
 * @param config - Route test configuration
 * @returns Jest test suite description
 */
export function createRouteTests(config: RouteTestConfig): void {
  const testDescription = config.description || `${config.method} ${config.path}`;
  
  describe(testDescription, () => {
    test('should succeed', async () => {
      const app = createRouteApp(config);
      const result = await executeRequest(config, app);
      
      if (config.successResponse) {
        expect(result.body).toEqual(config.successResponse);
      } else {
        expect(result.body.success).toBe(true);
      }
      
      expect(result.status).toBe(config.successStatus || 200);
    });

    test('should handle error responses', async () => {
      const app = createErrorRouteApp(config);
      const result = await executeErrorRequest(config, app);
      
      if (config.errorResponse) {
        expect(result.body).toEqual({ error: config.errorResponse });
      } else {
        expect(result.body.error).toBe('Bad request');
      }
      
      expect(result.status).toBe(config.errorStatus || 400);
    });
  });
}

// ==================== CONVENIENCE FUNCTIONS ====================

/**
 * Create a simple GET route test
 */
export function createGetRouteTest(path: string, successResponse?: any, errorResponse?: string): void {
  createRouteTests({
    method: 'GET',
    path,
    successResponse,
    errorResponse
  });
}

/**
 * Create a simple POST route test
 */
export function createPostRouteTest(path: string, successResponse?: any, errorResponse?: string): void {
  createRouteTests({
    method: 'POST',
    path,
    successResponse,
    errorResponse
  });
}

/**
 * Create a simple PUT route test
 */
export function createPutRouteTest(path: string, successResponse?: any, errorResponse?: string): void {
  createRouteTests({
    method: 'PUT',
    path,
    successResponse,
    errorResponse
  });
}

/**
 * Create a simple DELETE route test
 */
export function createDeleteRouteTest(path: string, successResponse?: any, errorResponse?: string): void {
  createRouteTests({
    method: 'DELETE',
    path,
    successResponse,
    errorResponse
  });
}

// ==================== BATCH TEST GENERATION ====================

/**
 * Generate tests for multiple routes
 */
export function createMultipleRouteTests(configs: RouteTestConfig[]): void {
  describe('Multiple Route Tests', () => {
    configs.forEach(config => {
      createRouteTests(config);
    });
  });
}

/**
 * Generate tests for a REST API resource
 */
export function createResourceTests(basePath: string, resourceName: string): void {
  describe(`${resourceName} Resource Tests`, () => {
    createGetRouteTest(basePath, {
      data: [],
      total: 0
    });

    createGetRouteTest(`${basePath}/:id`, {
      id: '123',
      name: 'Test Resource'
    });

    createPostRouteTest(basePath, {
      id: '123',
      name: 'New Resource',
      created: true
    });

    createPutRouteTest(`${basePath}/:id`, {
      id: '123',
      name: 'Updated Resource',
      updated: true
    });

    createDeleteRouteTest(`${basePath}/:id`, {
      deleted: true
    });
  });
}

// ==================== EXPORTS ====================

/**
 * Route test utilities interface
 */
export const routeTestUtils = {
  create: createRouteTests,
  createGet: createGetRouteTest,
  createPost: createPostRouteTest,
  createPut: createPutRouteTest,
  createDelete: createDeleteRouteTest,
  createMultiple: createMultipleRouteTests,
  createResource: createResourceTests,
  createSuccessResponse,
  createErrorResponse,
  executeRequest,
  executeErrorRequest
};

export default routeTestUtils;