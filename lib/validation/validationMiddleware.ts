/**
 * Validation Middleware
 * Express middleware for request validation
 */

import { createStreamingValidator, ValidationConfig } from './streamingValidator.js';

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
      console.error('Validation error:', error);
      res.status(400).json({
        error: 'Validation failed',
        message: error instanceof Error ? error.message : 'Invalid input'
      });
    }
  };
}