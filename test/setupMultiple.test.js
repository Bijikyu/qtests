const { execFileSync } = require('child_process'); //child process runner
const path = require('path'); //path helper

require('../setup'); //activate stub resolution for test environment

test('setup called twice still returns stubs', () => { //verify repeated setup
  const scriptPath = path.join(__dirname, 'setupMultipleChild.js'); //child script
  const output = execFileSync(process.execPath, [scriptPath], { env: { NODE_PATH: '' } }).toString(); //run child script
  const lastLine = output.trim().split('\n').pop(); //extract JSON line ignoring logs
  const result = JSON.parse(lastLine); //parse child output
  expect(result.axiosStub).toBe(true); //axios should resolve to stub
  expect(result.winstonStub).toBe(true); //winston should resolve to stub
});
