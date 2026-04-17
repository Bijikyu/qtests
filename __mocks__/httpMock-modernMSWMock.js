'use strict';
module.exports = {
  createMSWMockServer: () => ({
    listen: () => {},
    close: () => {},
    resetHandlers: () => {}
  })
};
