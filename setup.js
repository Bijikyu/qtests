
/** Sets NODE_PATH for test stubs */
const path = require('path');
process.env.NODE_PATH = path.join(__dirname, 'stubs');
require('module').Module._initPaths();
