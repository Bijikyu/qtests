const { reload } = require('../utils/testHelpers'); //load utility
const mod1 = require('./fixtures/reloadTarget'); //initial require
const mod2 = reload('../test/fixtures/reloadTarget'); //reload module
console.log(JSON.stringify({ val1: mod1.val, val2: mod2.val })); //output result
