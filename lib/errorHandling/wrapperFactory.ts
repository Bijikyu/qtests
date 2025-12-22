/**
 * Error Wrapper Factory
 * Factory functions for creating different types of error wrappers
 */

import {
  AsyncErrorWrapperOptions,
  RouteErrorWrapperOptions
} from './errorTypes.js';

export const createAsyncErrorWrapper = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  _options: AsyncErrorWrapperOptions = {}
): T => fn;

export const createSyncErrorWrapper = <T extends (...args: any[]) => any>(
  fn: T,
  _options: RouteErrorWrapperOptions = {}
): T => fn;

export const createRouteErrorWrapper = (
  _options: RouteErrorWrapperOptions = {}
) => (_req: any, _res: any, next: any) => next();