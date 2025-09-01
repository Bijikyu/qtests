// Simple test to verify qtests runner works
import { describe, it, expect } from './index.js';

describe('Basic functionality', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async tests', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});