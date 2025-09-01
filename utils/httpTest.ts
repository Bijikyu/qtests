/**
 * HTTP Testing Utilities - TypeScript Implementation
 * 
 * Provides tiny HTTP client for integration tests.
 * Rationale: avoids external supertest dependency and works in Node core.
 */

// Import logging control utility for consistent framework behavior
import { setLogging } from '../lib/logUtils.js';
if (process.env.NODE_ENV === 'test') setLogging(false);

import http from 'http';
import type { Server } from 'http';

// Type definitions for HTTP testing
interface TestResponse {
  status: number;
  statusCode: number; // alias for compatibility
  headers: http.IncomingHttpHeaders;
  body: any;
  text: string; // raw response text
}

interface MockApp {
  (req: http.IncomingMessage, res: http.ServerResponse): void;
  get: (path: string | RegExp, handler: RouteHandler) => MockApp;
  post: (path: string | RegExp, handler: RouteHandler) => MockApp;
  put: (path: string | RegExp, handler: RouteHandler) => MockApp;
  delete: (path: string | RegExp, handler: RouteHandler) => MockApp;
  patch: (path: string | RegExp, handler: RouteHandler) => MockApp;
  all: (path: string | RegExp, handler: RouteHandler) => MockApp;
}

interface RouteHandler {
  (req: http.IncomingMessage, res: http.ServerResponse): void;
}

interface Route {
  method: string;
  path: string | RegExp;
  handler: RouteHandler;
}

/**
 * Creates HTTP test client for integration testing.
 * Returns builder object for chaining request configuration.
 * Rationale: provides supertest-like API without external dependencies.
 */
function supertest(app: Function): Super {
  console.log(`supertest is running with app`); // log factory creation
  
  // Validate app early to provide immediate feedback
  if (!app || typeof app !== 'function') {
    const error = new Error('Invalid app provided to supertest');
    console.log(`supertest error ${error.message}`); // log failure  
    throw error;
  }
  
  try {
    const client = new Super(app); // create builder instance
    console.log(`supertest is returning Super instance`); // log return
    return client; // return configured builder
  } catch (error: any) {
    console.log(`supertest error ${error.message}`); // log failure
    throw error; // rethrow for caller
  }
}

class Super {
  private app: Function;
  
  constructor(app: Function) {
    this.app = app; // store app reference for server creation
  }
  
  get(path: string): Test { return new Test(this.app, 'get', path); }
  post(path: string): Test { return new Test(this.app, 'post', path); }
  put(path: string): Test { return new Test(this.app, 'put', path); }
  delete(path: string): Test { return new Test(this.app, 'delete', path); }
  patch(path: string): Test { return new Test(this.app, 'patch', path); }
  head(path: string): Test { return new Test(this.app, 'head', path); }
  options(path: string): Test { return new Test(this.app, 'options', path); }
  all(path: string): Test { return new Test(this.app, 'all', path); }
}

class Test {
  private app: Function;
  private method: string;
  private path: string;
  private headers: Record<string, string>;
  private body: any;
  private expectedStatus: number | null;
  private server: Server | null;
  
  constructor(app: Function, method: string, path: string) {
    console.log(`Test is running with ${method} ${path}`); // log test creation
    
    this.app = app; // application instance
    this.method = method.toUpperCase(); // normalize method to uppercase
    this.path = path; // request path
    this.headers = {}; // request headers storage
    this.body = undefined; // request body storage
    this.expectedStatus = null; // expected status for assertions
    this.server = null; // server instance reference for cleanup
  }
  
  set(name: string, value: string): Test {
    console.log(`Test.set is running with ${name}: ${value}`); // log header setting
    
    try {
      this.headers[name] = value; // store header
      console.log(`Test.set is returning this`); // log chaining
      return this; // enable method chaining
    } catch (error: any) {
      console.log(`Test.set error ${error.message}`); // log error
      throw error; // propagate error
    }
  }
  
  send(body: any): Test {
    console.log(`Test.send is running with ${typeof body}`); // log body attachment
    
    try {
      this.body = body; // store request body
      
      // Auto-set content-type for JSON bodies
      if (typeof body === 'object' && body !== null && !this.headers['Content-Type']) {
        this.headers['Content-Type'] = 'application/json';
      }
      
      console.log(`Test.send is returning this`); // log chaining
      return this; // enable method chaining
    } catch (error: any) {
      console.log(`Test.send error ${error.message}`); // log error
      throw error; // propagate error
    }
  }
  
  expect(status: number): Promise<TestResponse> {
    console.log(`Test.expect is running with ${status}`); // log expectation setting
    
    try {
      this.expectedStatus = status; // store expected status
      console.log(`Test.expect is executing request immediately`); // log execution
      return this.end(); // execute request immediately and return promise
    } catch (error: any) {
      console.log(`Test.expect error ${error.message}`); // log error
      throw error; // propagate error
    }
  }
  
  async end(): Promise<TestResponse> {
    console.log(`Test.end is running with ${this.method} ${this.path}`); // log request execution
    
    try {
      const server = http.createServer(this.app as any);
      this.server = server; // store reference for cleanup
      
      // Start server on random available port
      await new Promise<void>(resolve => server.listen(0, resolve));
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      
      // Configure request options
      const opts: http.RequestOptions = {
        method: this.method,
        hostname: '127.0.0.1',
        port,
        path: this.path,
        headers: this.headers
      };
      
      // Execute HTTP request and collect response
      const response = await this.makeRequest(opts);
      
      // Clean up server
      await new Promise<void>(resolve => server.close(() => resolve()));
      this.server = null;
      
      // Validate expected status if specified
      if (this.expectedStatus !== null && response.status !== this.expectedStatus) {
        throw new Error(`Expected status ${this.expectedStatus}, got ${response.status}`);
      }
      
      console.log(`Test.end is returning response with status ${response.status}`); // log completion
      return response; // return response object
      
    } catch (error: any) {
      console.log(`Test.end error ${error.message}`); // log error
      
      // Ensure server cleanup on error
      if (this.server) {
        try {
          await new Promise<void>(resolve => this.server!.close(() => resolve()));
        } catch (cleanupError: any) {
          console.log(`Server cleanup error: ${cleanupError.message}`);
        }
        this.server = null;
      }
      
      throw error; // propagate error
    }
  }
  
  /**
   * Execute HTTP request and parse response
   * 
   * This method handles the low-level HTTP request execution and response
   * parsing. It creates a promise-based wrapper around Node.js http.request
   * and automatically parses JSON responses.
   * 
   * @param opts - HTTP request options
   * @returns Response object with status, headers, and body
   */
  private makeRequest(opts: http.RequestOptions): Promise<TestResponse> {
    return new Promise((resolve, reject) => {
      console.log(`makeRequest is running with ${opts.method} ${opts.path}`); // log request start
      
      const req = http.request(opts, (res) => {
        let data = '';
        
        // Collect response data
        res.on('data', chunk => {
          data += chunk;
        });
        
        // Parse and resolve response
        res.on('end', () => {
          try {
            let body: any = data;
            
            // Auto-parse JSON responses
            const contentType = res.headers['content-type'] || '';
            if (contentType.includes('application/json') && data) {
              try {
                body = JSON.parse(data);
              } catch (parseError: any) {
                // Keep raw data if JSON parsing fails
                console.log(`JSON parse error: ${parseError.message}`);
              }
            }
            
            const response: TestResponse = {
              status: res.statusCode || 0,
              statusCode: res.statusCode || 0, // alias for compatibility
              headers: res.headers,
              body: body,
              text: data // raw response text
            };
            
            console.log(`makeRequest is returning response with status ${response.status}`); // log completion
            resolve(response);
            
          } catch (error: any) {
            console.log(`makeRequest response parsing error ${error.message}`); // log error
            reject(error);
          }
        });
      });
      
      // Handle request errors
      req.on('error', (error: Error) => {
        console.log(`makeRequest request error ${error.message}`); // log error
        reject(error);
      });
      
      // Send request body if present
      if (this.body !== undefined) {
        const bodyData = typeof this.body === 'string' 
          ? this.body 
          : JSON.stringify(this.body);
        req.write(bodyData);
      }
      
      req.end(); // finalize request
    });
  }
}

/**
 * Create Express-style application mock for testing
 * 
 * This utility creates a simple Express-compatible application mock that
 * can be used with the supertest client. It provides basic routing and
 * middleware support for testing HTTP endpoints.
 * 
 * @returns Express-style application function
 * 
 * @example
 * const app = createMockApp();
 * app.get('/test', (req, res) => res.json({ success: true }));
 * const response = await supertest(app).get('/test').end();
 */
function createMockApp(): MockApp {
  console.log(`createMockApp is running with none`); // log app creation
  
  try {
    const routes: Route[] = []; // store route definitions
    
    // Express-style application function
    function app(req: http.IncomingMessage, res: http.ServerResponse): void {
      console.log(`mockApp is running with ${req.method} ${req.url}`); // log request
      
      try {
        // Find matching route with parameter support
        const route = routes.find(r => {
          const methodMatch = r.method === 'ALL' || r.method === req.method;
          
          // Support exact match, regex, and Express-style parameters
          let pathMatch = false;
          if (r.path === req.url) {
            pathMatch = true;
          } else if (r.path instanceof RegExp && r.path.test(req.url || '')) {
            pathMatch = true;
          } else if (typeof r.path === 'string' && r.path.includes(':')) {
            // Convert Express-style parameters to regex
            const regexPath = r.path.replace(/:[\w]+/g, '[^/]+');
            const regex = new RegExp(`^${regexPath}$`);
            pathMatch = regex.test(req.url || '');
          }
          
          return methodMatch && pathMatch;
        });
        
        if (route) {
          // Execute route handler
          route.handler(req, res);
        } else {
          // Return 404 for unmatched routes
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Not Found' }));
        }
        
        console.log(`mockApp handled ${req.method} ${req.url}`); // log completion
        
      } catch (error: any) {
        console.log(`mockApp error ${error.message}`); // log error
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    }
    
    // Create mock app with HTTP method helpers
    const mockApp = app as MockApp;
    
    // Add HTTP method helpers
    mockApp.get = (path: string | RegExp, handler: RouteHandler): MockApp => {
      routes.push({ method: 'GET', path, handler });
      return mockApp;
    };
    
    mockApp.post = (path: string | RegExp, handler: RouteHandler): MockApp => {
      routes.push({ method: 'POST', path, handler });
      return mockApp;
    };
    
    mockApp.put = (path: string | RegExp, handler: RouteHandler): MockApp => {
      routes.push({ method: 'PUT', path, handler });
      return mockApp;
    };
    
    mockApp.delete = (path: string | RegExp, handler: RouteHandler): MockApp => {
      routes.push({ method: 'DELETE', path, handler });
      return mockApp;
    };
    
    mockApp.patch = (path: string | RegExp, handler: RouteHandler): MockApp => {
      routes.push({ method: 'PATCH', path, handler });
      return mockApp;
    };
    
    mockApp.all = (path: string | RegExp, handler: RouteHandler): MockApp => {
      routes.push({ method: 'ALL', path, handler });
      return mockApp;
    };
    
    console.log(`createMockApp is returning app`); // log return
    return mockApp; // return configured mock app
    
  } catch (error: any) {
    console.log(`createMockApp error ${error.message}`); // log failure
    throw error; // rethrow for caller
  }
}

// Export HTTP testing utilities using ES module syntax
export {
  supertest, // lightweight supertest alternative
  createMockApp // Express-style app mock for testing
};