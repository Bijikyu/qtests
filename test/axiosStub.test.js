const { stubs } = require('..'); // (import main index for stubs)

// Test to ensure new axios.get stub exists and resolves correctly
 test('stubs.axios.get returns empty object', async () => {
  const result = await stubs.axios.get('https://example.com'); // (call get on stub)
  expect(result).toEqual({}); // (should resolve to empty object)
});
