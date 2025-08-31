import { stubMethod } from '../utils/stubMethod.js'; // import stubMethod utility

test('stubMethod replaces and restores methods', () => {
  const obj = { method: () => 'original' };
  const stub = stubMethod(obj, 'method', () => 'stubbed');
  
  expect(obj.method()).toBe('stubbed');
  stub.restore();
  expect(obj.method()).toBe('original');
});