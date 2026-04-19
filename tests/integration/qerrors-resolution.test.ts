import 'qtests/setup'; // Ensure qtests hooks are in place before any module resolution for stubs
import { describe, expect, it } from '@jest/globals';

describe('qerrors module resolution', () => {
  it('loads HttpInputError via TypeScript fallback when .js artifact is missing', async () => {
    // Validate resolver fallback by importing the scoped path that previously lacked a compiled .js file
    const httpInputModule = await import('@bijikyu/qerrors/lib/shared/httpInputError.js');
    const { HttpInputError } = httpInputModule;

    // Constructing the error confirms the class is reachable and behaves like a standard Error
    const errorInstance = new HttpInputError(422, { detail: 'invalid input' });

    expect(errorInstance).toBeInstanceOf(Error);
    expect(errorInstance.statusCode).toBe(422);
    expect(errorInstance.payload).toEqual({ detail: 'invalid input' });
  });
});
