
const { execFileSync } = require('child_process'); //(utility to run child scripts)
const path = require('path'); //(resolve helper script path)
const { executeWithLogs } = require('../lib/logUtils'); //(import executeWithLogs)

function runChild(includeSetup){ //(execute child script with or without setup)
 return executeWithLogs('runChild', () => { //(delegate to executeWithLogs)
  const script = path.join(__dirname, 'withoutSetup.js'); //(child script path)
  const args = includeSetup ? ['-r', path.join(__dirname, '../setup'), script] : [script]; //(create arg list)
  const out = execFileSync(process.execPath, args, { env: { NODE_PATH: '' } }).toString(); //(spawn child)
  const res = JSON.parse(out); //(parse child output)
  return res; //(forward result)
 }, includeSetup);
} //(end runChild)

function runWithoutSetup(){ //(spawn child process without setup)
 return executeWithLogs('runWithoutSetup', () => runChild(false)); //(delegate to executeWithLogs)
} //(end runWithoutSetup)

function runWithSetup(){ //(spawn child process with setup)
 return executeWithLogs('runWithSetup', () => runChild(true)); //(delegate to executeWithLogs)
} //(end runWithSetup)

test('child process uses stubs when setup is required', () => { //(jest test case)
 console.log(`setupResolutionTest is running with none`); //(start log)
 const withSetup = runWithSetup(); //(result when setup loaded)
 const withoutSetup = runWithoutSetup(); //(result when setup absent)
 expect(withSetup.axiosStub).toBe(true); //(axios should be stubbed)
 expect(withSetup.winstonStub).toBe(true); //(winston should be stubbed)
 expect(withoutSetup.axiosStub).toBe(false); //(axios should be real)
 expect(withoutSetup.winstonStub).toBe(false); //(winston should be real)
 console.log(`setupResolutionTest has run resulting in pass`); //(end log)
});
