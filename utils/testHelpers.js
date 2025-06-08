const { mockConsole } = require('./mockConsole'); //(import console spy util)

const testEnv = require('./testEnv'); //(import env helpers for reuse)
const { executeWithLogs } = require('../lib/logUtils'); //(import logging wrapper)


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

async function withSavedEnv(fn){ //(run callback with saved process.env)
  return executeWithLogs('withSavedEnv', async () => { //(run with logging)
    const saved = testEnv.saveEnv(); //(capture current environment)
    try{ //(attempt callback)
      const result = await fn(); //(execute provided callback)
      return result; //(forward callback result)
    }finally{ //(always restore environment)
      testEnv.restoreEnv(saved); //(restore captured environment)
    }
  }, 'none'); //(no extra context)
} //(end helper)

module.exports = { withMockConsole, withSavedEnv }; //(export helpers)
