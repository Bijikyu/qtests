/** //(introduces internal supertest alternative)
 * Provides tiny HTTP client for integration tests. //(creates minimal API)
 * Rationale: avoids external supertest dependency and works in Node core. //(reason)
 */ //(close introductory comment)

// Import logging control utility for consistent framework behavior
const { setLogging } = require('../lib/logUtils');
if (process.env.NODE_ENV !== 'test') setLogging(false);

const http = require('http'); //(use node http to avoid external deps)

/** //(introduces http test factory function)
 * Creates HTTP test client for integration testing. //(describe main function)
 * Returns builder object for chaining request configuration. //(explain return)
 * Rationale: provides supertest-like API without external dependencies. //(why)
 */ //(close factory comment)
function supertest(app) { //(lightweight supertest-like client)
  console.log(`supertest is running with app`); // log factory creation
  
  try {
    const client = new Super(app); // create builder instance
    console.log(`supertest is returning Super instance`); // log return
    return client; // return configured builder
  } catch (error) {
    console.log(`supertest error ${error.message}`); // log failure
    throw error; // rethrow for caller
  }
}

class Super { //(builder for request objects)
  constructor(app) {
    this.app = app; // store app reference for server creation
  }
  
  get(path) { return new Test(this.app, 'get', path); } //(start GET request)
  post(path) { return new Test(this.app, 'post', path); } //(start POST request)
  put(path) { return new Test(this.app, 'put', path); } //(start PUT request)
  delete(path) { return new Test(this.app, 'delete', path); } //(start DELETE request)
  patch(path) { return new Test(this.app, 'patch', path); } //(start PATCH request)
  head(path) { return new Test(this.app, 'head', path); } //(start HEAD request)
  options(path) { return new Test(this.app, 'options', path); } //(start OPTIONS request)
  all(path) { return new Test(this.app, 'all', path); } //(start request with any method)
}

class Test { //(represents a single http call)
  constructor(app, method, path) {
    console.log(`Test is running with ${method} ${path}`); // log test creation
    
    this.app = app; // application instance
    this.method = method.toUpperCase(); // normalize method to uppercase
    this.path = path; // request path
    this.headers = {}; // request headers storage
    this.body = undefined; // request body storage
    this.expectedStatus = null; // expected status for assertions
    this.server = null; // server instance reference for cleanup
  }
  
  set(name, value) { //(set request header)
    console.log(`Test.set is running with ${name}: ${value}`); // log header setting
    
    try {
      this.headers[name] = value; // store header
      console.log(`Test.set is returning this`); // log chaining
      return this; // enable method chaining
    } catch (error) {
      console.log(`Test.set error ${error.message}`); // log error
      throw error; // propagate error
    }
  }
  
  send(body) { //(attach json body)
    console.log(`Test.send is running with ${typeof body}`); // log body attachment
    
    try {
      this.body = body; // store request body
      
      // Auto-set content-type for JSON bodies
      if (typeof body === 'object' && body !== null && !this.headers['Content-Type']) {
        this.headers['Content-Type'] = 'application/json';
      }
      
      console.log(`Test.send is returning this`); // log chaining
      return this; // enable method chaining
    } catch (error) {
      console.log(`Test.send error ${error.message}`); // log error
      throw error; // propagate error
    }
  }
  
  expect(status) { //(set expected status code)
    console.log(`Test.expect is running with ${status}`); // log expectation setting
    
    try {
      this.expectedStatus = status; // store expected status
      console.log(`Test.expect is returning this`); // log chaining
      return this; // enable method chaining
    } catch (error) {
      console.log(`Test.expect error ${error.message}`); // log error
      throw error; // propagate error
    }
  }
  
  async end() { //(perform the request)
    console.log(`Test.end is running with ${this.method} ${this.path}`); // log request execution
    
    try {
      const server = http.createServer(this.app); //(spin up ephemeral server)
      this.server = server; // store reference for cleanup
      
      // Start server on random available port
      await new Promise(resolve => server.listen(0, resolve));
      const port = server.address().port;
      
      // Configure request options
      const opts = {
        method: this.method,
        hostname: '127.0.0.1',
        port,
        path: this.path,
        headers: this.headers
      };
      
      // Execute HTTP request and collect response
      const response = await this.makeRequest(opts);
      
      // Clean up server
      await new Promise(resolve => server.close(resolve));
      this.server = null;
      
      // Validate expected status if specified
      if (this.expectedStatus !== null && response.status !== this.expectedStatus) {
        throw new Error(`Expected status ${this.expectedStatus}, got ${response.status}`);
      }
      
      console.log(`Test.end is returning response with status ${response.status}`); // log completion
      return response; // return response object
      
    } catch (error) {
      console.log(`Test.end error ${error.message}`); // log error
      
      // Ensure server cleanup on error
      if (this.server) {
        try {
          await new Promise(resolve => this.server.close(resolve));
        } catch (cleanupError) {
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
   * @param {Object} opts - HTTP request options
   * @returns {Promise<Object>} Response object with status, headers, and body
   */
  makeRequest(opts) {
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
            let body = data;
            
            // Auto-parse JSON responses
            const contentType = res.headers['content-type'] || '';
            if (contentType.includes('application/json') && data) {
              try {
                body = JSON.parse(data);
              } catch (parseError) {
                // Keep raw data if JSON parsing fails
                console.log(`JSON parse error: ${parseError.message}`);
              }
            }
            
            const response = {
              status: res.statusCode,
              statusCode: res.statusCode, // alias for compatibility
              headers: res.headers,
              body: body,
              text: data // raw response text
            };
            
            console.log(`makeRequest is returning response with status ${response.status}`); // log completion
            resolve(response);
            
          } catch (error) {
            console.log(`makeRequest response parsing error ${error.message}`); // log error
            reject(error);
          }
        });
      });
      
      // Handle request errors
      req.on('error', (error) => {
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
 * @returns {Function} Express-style application function
 * 
 * @example
 * const app = createMockApp();
 * app.get('/test', (req, res) => res.json({ success: true }));
 * const response = await supertest(app).get('/test').end();
 */
function createMockApp() {
  console.log(`createMockApp is running with none`); // log app creation
  
  try {
    const routes = []; // store route definitions
    
    // Express-style application function
    function app(req, res) {
      console.log(`mockApp is running with ${req.method} ${req.url}`); // log request
      
      try {
        // Find matching route with parameter support
        const route = routes.find(r => {
          const methodMatch = r.method === 'ALL' || r.method === req.method;
          
          // Support exact match, regex, and Express-style parameters
          let pathMatch = false;
          if (r.path === req.url) {
            pathMatch = true;
          } else if (r.path instanceof RegExp && r.path.test(req.url)) {
            pathMatch = true;
          } else if (typeof r.path === 'string' && r.path.includes(':')) {
            // Convert Express-style parameters to regex
            const regexPath = r.path.replace(/:[\w]+/g, '[^/]+');
            const regex = new RegExp(`^${regexPath}$`);
            pathMatch = regex.test(req.url);
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
        
      } catch (error) {
        console.log(`mockApp error ${error.message}`); // log error
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    }
    
    // Add HTTP method helpers
    app.get = (path, handler) => {
      routes.push({ method: 'GET', path, handler });
      return app;
    };
    
    app.post = (path, handler) => {
      routes.push({ method: 'POST', path, handler });
      return app;
    };
    
    app.put = (path, handler) => {
      routes.push({ method: 'PUT', path, handler });
      return app;
    };
    
    app.delete = (path, handler) => {
      routes.push({ method: 'DELETE', path, handler });
      return app;
    };
    
    app.patch = (path, handler) => {
      routes.push({ method: 'PATCH', path, handler });
      return app;
    };
    
    app.all = (path, handler) => {
      routes.push({ method: 'ALL', path, handler });
      return app;
    };
    
    console.log(`createMockApp is returning app`); // log return
    return app; // return configured mock app
    
  } catch (error) {
    console.log(`createMockApp error ${error.message}`); // log failure
    throw error; // rethrow for caller
  }
}

// Export HTTP testing utilities at bottom per requirements
module.exports = {
  supertest, // lightweight supertest alternative
  createMockApp // Express-style app mock for testing
};