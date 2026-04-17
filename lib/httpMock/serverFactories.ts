/**
 * MSW Server Factory Functions
 * Responsible for creating MSW-based mock servers
 */

import { createRequire } from 'module';
import { MockResponse } from './mockTypes.js';
import qerrors from '../qerrorsFallback.js';

// Node ESM: `require` is not global; create a scoped require for CJS-compatible dependencies.
// Use process.cwd() + package.json as the base (avoids import.meta.url so this compiles in CJS mode too)
const _require: NodeRequire = (globalThis as any).require || createRequire(process.cwd() + '/package.json');

/**
 * Create a mock server with custom response patterns
 * For advanced MSW-based mocking scenarios
 */
export function createCustomMockServer(responsePatterns: Array<{
  method: string;
  url: string | RegExp;
  response: MockResponse;
}>): { server: any; cleanup: () => void } {
  try {
    const { setupServer } = _require('msw/node');
    const { http } = _require('msw');
    
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
  } catch (error: any) {
    qerrors(error, 'serverFactories.createCustomMockServer: MSW server creation failed', {
      patternCount: responsePatterns.length,
      methods: [...new Set(responsePatterns.map(p => p.method))],
      hasUrls: responsePatterns.some(p => p.url)
    });
    throw error;
  }
}
