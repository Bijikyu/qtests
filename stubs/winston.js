
/** Winston logging library stub for testing environments */
module.exports = {
  createLogger: () => ({
    error: () => {},
    warn: () => {},
    info: () => {}
  }),
  format: {
    combine: () => {},
    timestamp: () => {},
    errors: () => {},
    splat: () => {},
    json: () => {},
    printf: () => {}
  },
  transports: {
    File: function(){},
    Console: function(){}
  }
};
