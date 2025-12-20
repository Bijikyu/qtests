/**
 * MSW Server Factory Functions
 * Responsible for creating MSW-based mock servers
 */

import { MockResponse } from './mockTypes.js';

/**
 * Create a mock server with custom response patterns
 * For advanced MSW-based mocking scenarios
 */
export function createCustomMockServer(responsePatterns: Array<{
  method: string;
  url: string | RegExp;
  response: MockResponse;
}>): { server: any; cleanup: () => void } {
  const { setupServer } = require('msw/node');
  const { http } = require('msw');
  
  const handlers = responsePatterns.map(pattern => ({
    request: {
      method: pattern.method.toUpperCase() as any,
      url: pattern.url,
    },
    response: pattern.response,
  }));

  const mswHandlers = handlers.map(({ request, response }) => {
    return http[request.method](request.url, (_req: any, _res: any, ctx: any) => {
      if (response.delay) {
        return _res(ctx.delay(response.delay));
      }
      
      return _res(
        ctx.status(response.status || 200, response.statusText),
        ctx.json(response.data || {}),
        ...Object.entries(response.headers || {}).map(([key, value]) => ctx.set(key, value))
      );
    });
  });

  const server = setupServer(...mswHandlers);
  server.listen();

  return {
    server,
    cleanup: () => server.close()
  };
}