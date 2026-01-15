/**
 * Jest Manual Mock for Winston
 * 
 * This mock is automatically used by Jest when any module imports 'winston'.
 * It provides a complete mock implementation with working transports.
 */

const noop = () => {};

class MockTransport {
  constructor(options = {}) {
    this.name = 'mock';
    this.level = options.level || 'info';
    this.silent = options.silent || false;
    this.handleExceptions = options.handleExceptions || false;
  }
  
  log(info, callback) {
    if (callback) callback();
  }
  
  close() {}
}

class MockConsoleTransport extends MockTransport {
  constructor(options = {}) {
    super(options);
    this.name = 'console';
  }
}

class MockFileTransport extends MockTransport {
  constructor(options = {}) {
    super(options);
    this.name = 'file';
    this.filename = options.filename;
  }
}

class MockHttpTransport extends MockTransport {
  constructor(options = {}) {
    super(options);
    this.name = 'http';
  }
}

class MockStreamTransport extends MockTransport {
  constructor(options = {}) {
    super(options);
    this.name = 'stream';
  }
}

const mockFormat = { transform: (info) => info };

const createLogger = (options = {}) => ({
  error: noop,
  warn: noop,
  info: noop,
  http: noop,
  verbose: noop,
  debug: noop,
  silly: noop,
  log: noop,
  add: function() { return this; },
  remove: function() { return this; },
  clear: function() { return this; },
  close: noop,
  child: function() { return this; },
  profile: function() { return this; },
  startTimer: () => ({ done: noop }),
  query: (opts, cb) => { if (cb) cb(null, {}); return Promise.resolve({}); },
  stream: () => ({ on: noop, pipe: noop, resume: noop, pause: noop })
});

const format = {
  colorize: () => mockFormat,
  combine: (...formats) => mockFormat,
  label: () => mockFormat,
  timestamp: () => mockFormat,
  printf: () => mockFormat,
  json: () => mockFormat,
  simple: () => mockFormat,
  splat: () => mockFormat,
  padLevels: () => mockFormat,
  metadata: () => mockFormat,
  errors: () => mockFormat,
  align: () => mockFormat,
  cli: () => mockFormat,
  logstash: () => mockFormat,
  prettyPrint: () => mockFormat,
  uncolorize: () => mockFormat,
  ms: () => mockFormat
};

const transports = {
  Console: MockConsoleTransport,
  File: MockFileTransport,
  Http: MockHttpTransport,
  Stream: MockStreamTransport
};

const loggers = {
  add: (id, opts) => createLogger(opts),
  get: (id) => createLogger(),
  close: noop,
  has: () => false
};

const exceptions = {
  handle: () => ({ catch: noop }),
  unhandle: noop,
  getHandlers: () => []
};

module.exports = {
  createLogger,
  format,
  transports,
  addColors: noop,
  level: 'info',
  loggers,
  exceptions,
  default: {
    createLogger,
    format,
    transports,
    addColors: noop,
    level: 'info',
    loggers,
    exceptions
  }
};
