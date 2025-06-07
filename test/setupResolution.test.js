
const { execFileSync } = require('child_process'); //(utility to run child scripts)
const path = require('path'); //(resolve helper script path)

function runChild(includeSetup){ //(execute child script with or without setup)
 console.log(`runChild is running with ${includeSetup}`); //(start log)
 try{ //(attempt execution)
  const script = path.join(__dirname, 'withoutSetup.js'); //(child script path)
  const args = includeSetup ? ['-r', path.join(__dirname, '../setup'), script] : [script]; //(create arg list)
  const out = execFileSync(process.execPath, args, { env: { NODE_PATH: '' } }).toString(); //(spawn child)
  const res = JSON.parse(out); //(parse child output)
  console.log(`runChild is returning ${JSON.stringify(res)}`); //(return log)
  return res; //(forward result)
 }catch(error){ //(handle errors)
  console.error(error); //(output problem)
  return {}; //(fallback result)
 }
} //(end runChild)

function runWithoutSetup(){ //(spawn child process without setup)
 console.log(`runWithoutSetup is running with none`); //(start log)
 return runChild(false); //(delegate to runChild)
} //(end runWithoutSetup)

function runWithSetup(){ //(spawn child process with setup)
 console.log(`runWithSetup is running with none`); //(start log)
 return runChild(true); //(delegate to runChild)
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
