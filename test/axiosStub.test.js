const { stubs } = require('..'); // (import main index for stubs)

// Test to ensure new axios.get stub exists and resolves correctly
 test('stubs.axios.get returns enhanced response object', async () => {
  const result = await stubs.axios.get('https://example.com'); // (call get on stub)
  expect(result).toEqual({
    data: {},
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  }); // (should resolve to enhanced response format)
});
