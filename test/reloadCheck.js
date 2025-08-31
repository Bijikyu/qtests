import { reload } from '../utils/testHelpers.js'; //load utility
import mod1 from './fixtures/reloadTarget.js'; //initial require
const mod2 = reload('../test/fixtures/reloadTarget'); //reload module
console.log(JSON.stringify({ val1: mod1.val, val2: mod2.val })); //output result
