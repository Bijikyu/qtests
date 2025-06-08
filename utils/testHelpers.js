const { mockConsole } = require('./mockConsole'); //(import console spy util)
const { executeWithLogs } = require('../lib/logUtils'); //(import central logging helper)

async function withMockConsole(method, fn){ //(run callback with console spy)
  return executeWithLogs('withMockConsole', async () => { //(central logging wrapper)
    const spy = mockConsole(method); //(create console spy)
    try{ //(execute and ensure cleanup)
      return await fn(spy); //(run provided callback)
    }finally{ //(always restore spy)
      spy.mockRestore(); //(restore original console method)
    }
  }, method); //(pass method for log context)
} //(end helper)

module.exports = { withMockConsole }; //(export helper)
