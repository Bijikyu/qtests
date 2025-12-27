/**
 * Shared Route Test Utilities
 * Eliminates duplication in route testing patterns
 * Provides parameterized test generation for common HTTP route scenarios
 */

import { createMockApp, supertest } from '../utils/httpTest.js';
import qerrors from 'qerrors';

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
      qerrors(error, 'routeTestUtils.createSuccessResponse: JSON stringify failed', {
        dataType: typeof data,
        status,
        operation: 'responseSerialization'
      });
      res.end('{"success":true}'); // fallback response
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
      qerrors(error, 'routeTestUtils.createErrorResponse: JSON stringify failed', {
        errorMsg,
        status,
        operation: 'errorResponseSerialization'
      });
      res.end('{"error":"Bad request"}'); // fallback response
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
    // Default success handler
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
    // Default error handler
    (app as any)[config.method.toLowerCase()](config.path, createErrorResponse(config.errorResponse, config.errorStatus));
  }
  
  return app;
}

/**
 * Execute a test request and return the result
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
 * Execute an error test request and return the result
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
    // GET all
    createGetRouteTest(basePath, {
      data: [],
      total: 0
    });

    // GET single
    createGetRouteTest(`${basePath}/:id`, {
      id: '123',
      name: 'Test Resource'
    });

    // POST create
    createPostRouteTest(basePath, {
      id: '123',
      name: 'New Resource',
      created: true
    });

    // PUT update
    createPutRouteTest(`${basePath}/:id`, {
      id: '123',
      name: 'Updated Resource',
      updated: true
    });

    // DELETE
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
  // Main functions
  create: createRouteTests,
  createGet: createGetRouteTest,
  createPost: createPostRouteTest,
  createPut: createPutRouteTest,
  createDelete: createDeleteRouteTest,
  
  // Batch functions
  createMultiple: createMultipleRouteTests,
  createResource: createResourceTests,
  
  // Utilities
  createSuccessResponse,
  createErrorResponse,
  executeRequest,
  executeErrorRequest
};

// Default export
export default routeTestUtils;