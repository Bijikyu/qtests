const { safeSerialize, logConfig } = require('../lib/logUtils'); //import serializer and config under test
const util = require('util'); //node util for expected output

test('serializes primitives and objects', () => { //verify JSON path
  expect(safeSerialize(5)).toBe('5'); //number serialization
  expect(safeSerialize('hi')).toBe('"hi"'); //string serialization
  const obj = { a: 1 }; //simple object
  expect(safeSerialize(obj)).toBe(JSON.stringify(obj)); //object serialization output
});

test('falls back to util.inspect for circular references', () => { //verify fallback
  const circ = {}; //create base object
  circ.self = circ; //circular reference
  const expected = util.inspect(circ, { depth: logConfig.inspectDepth }); //expected inspect with config depth
  expect(safeSerialize(circ)).toBe(expected); //uses inspect output
});

test('returns "[unserializable]" on inspect failure', () => { //verify final fallback
  const bad = {}; //object that forces errors
  bad.toJSON = () => { throw new Error('json fail'); }; //stringify will throw
  bad[util.inspect.custom] = () => { throw new Error('inspect fail'); }; //inspect will throw
  expect(safeSerialize(bad)).toBe('[unserializable]'); //fallback result string
});

test('logConfig controls inspect depth', () => { //verify configurable depth
  const deepObj = { level1: { level2: { level3: 'value' } } }; //nested object
  deepObj.level1.level2.self = deepObj.level1; //create circular reference for inspect fallback
  logConfig.inspectDepth = 1; //set depth to 1
  const expected = util.inspect(deepObj, { depth: logConfig.inspectDepth }); //expected output with depth 1
  expect(safeSerialize(deepObj)).toBe(expected); //serializer respects config
  logConfig.inspectDepth = 2; //reset depth after test
});
