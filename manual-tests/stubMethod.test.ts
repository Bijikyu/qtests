import { stubMethod } from '../utils/stubMethod.js'; // import stubMethod utility

test('stubMethod replaces and restores methods', () => {
  const obj = { method: () => 'original' };
  const restore = stubMethod(obj, 'method', () => 'stubbed');
  
  expect(obj.method()).toBe('stubbed');
  restore();
  expect(obj.method()).toBe('original');
});