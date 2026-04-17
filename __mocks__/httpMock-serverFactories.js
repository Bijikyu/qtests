'use strict';
module.exports = {
  createCustomMockServer: () => ({
    listen: () => {},
    close: () => {},
    resetHandlers: () => {}
  })
};
