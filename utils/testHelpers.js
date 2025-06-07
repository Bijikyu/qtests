const { mockConsole } = require('./mockConsole'); //(import console spy util)

async function withMockConsole(method, fn){ //(run callback with console spy)
  console.log(`withMockConsole is running with ${method}`); //(debug start log)
  const spy = mockConsole(method); //(create console spy)
  try{ //(run callback safely)
    const res = await fn(spy); //(execute callback with spy)
    console.log(`withMockConsole is returning ${res}`); //(debug return log)
    return res; //(forward result)
  }catch(err){ //(handle callback error)
    console.log(`withMockConsole encountered ${err}`); //(log error)
    throw err; //(rethrow for test failure)
  }finally{ //(cleanup regardless of outcome)
    spy.mockRestore(); //(restore original console method)
  }
} //(end helper)

module.exports = { withMockConsole }; //(export helper)
