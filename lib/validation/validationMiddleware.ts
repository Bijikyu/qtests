/**
 * Validation Middleware
 * Express middleware for request validation
 */

import { createStreamingValidator, ValidationConfig } from './streamingValidator.js';
import qerrors from 'qerrors';

export function streamingValidationMiddleware(config: ValidationConfig = {}) {
  const validator = createStreamingValidator(config);

  return async (req: any, res: any, next: any) => {
    const startTime = Date.now();

    try {
      if (req.body && typeof req.body === 'object') {
        req.body = await validator.validateObject(req.body);
      }

      if (req.query && typeof req.query === 'object') {
        for (const [key, value] of Object.entries(req.query)) {
          if (typeof value === 'string') {
            const maxQueryLength = validator['config']?.maxQueryStringLength ?? 500;
            req.query[key] = await validator.validateString(value, maxQueryLength);
          }
        }
      }

      if (req.params && typeof req.params === 'object') {
        for (const [key, value] of Object.entries(req.params)) {
          if (typeof value === 'string') {
            req.params[key] = await validator.validateString(value, 200);
          }
        }
      }

      const processingTime = Date.now() - startTime;
      res.set('X-Validation-Time', `${processingTime}ms`);
      next();
    } catch (error) {
      qerrors(error as Error, 'validationMiddleware: request validation failed', {
        startTime,
        processingTime: Date.now() - startTime,
        hasBody: !!req.body,
        hasQuery: !!req.query,
        hasParams: !!req.params,
        bodyType: typeof req.body,
        queryKeys: req.query ? Object.keys(req.query) : [],
        paramKeys: req.params ? Object.keys(req.params) : []
      });
      res.status(400).json({
        error: 'Validation failed',
        message: (error as Error).message || 'Invalid input'
      });
    }
  };
}