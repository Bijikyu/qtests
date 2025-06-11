const { safeSerialize } = require('../lib/logUtils'); //import serializer under test
const util = require('util'); //node util for expected output

test('serializes primitives and objects', () => { //verify JSON path
  expect(safeSerialize(5)).toBe('5'); //number serialization
  expect(safeSerialize('hi')).toBe('"hi"'); //string serialization
  const obj = { a: 1 }; //simple object
  expect(safeSerialize(obj)).toBe(JSON.stringify(obj)); //object serialization output
});

test('handles undefined value', () => { //new test for explicit undefined handling
  expect(safeSerialize(undefined)).toBe('undefined'); //should return string literal
});

test('falls back to util.inspect for circular references', () => { //verify fallback
  const circ = {}; //create base object
  circ.self = circ; //circular reference
  const expected = util.inspect(circ, { depth: null }); //expected inspect
  expect(safeSerialize(circ)).toBe(expected); //uses inspect output
});

test('returns "[unserializable]" on inspect failure', () => { //verify final fallback
  const bad = {}; //object that forces errors
  bad.toJSON = () => { throw new Error('json fail'); }; //stringify will throw
  bad[util.inspect.custom] = () => { throw new Error('inspect fail'); }; //inspect will throw
  expect(safeSerialize(bad)).toBe('[unserializable]'); //fallback result string
});
