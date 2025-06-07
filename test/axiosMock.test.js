const { testEnv } = require('..'); //import utilities

test('axios mock stores replies and resets', () => { //jest test verifying persistence
  const mock = testEnv.createAxiosMock();
  mock.onGet('/users').reply(200, { ok: true });
  expect(mock.getReply('/users', 'get')).toEqual({ status: 200, data: { ok: true } });
  mock.reset();
  expect(mock.getReply('/users', 'get')).toBeUndefined();
});
