
const simpleObjs = [
  'foo',
  2,
  true,
  false,
  null,
  ['a'],
  {b: 'hoge'},
  // with irregular strings
  ['\\', '"', '\\"'],
  {
    '\\': '"',
    '"': '\\"',
    '\\"': '\\'
  }
];

const complexObj = {
  emptyArr: [],
  emptyObject: {},
  oneItemArray: ['a'],
  oneItemHash: {a: 7},
  multipleItemArray: [null, false, true],
  multipleItemHash: {
    z: '7',
    a: 'abc',
    q: '58'
  },
  insideArray: [
    {},
    {a: 5},
    {foo: 2, bar: null, baz: ''}
  ]
};

const sortedStringify = require('../index');
const assert = require('chai').assert;

describe('deep equality', () => {
  simpleObjs.forEach(item => {
    it('is kept in ' + JSON.stringify(item), () => {
      // if invalid JSON is returned,
      // JSON.parse throws SyntaxError and the test fails.
      assert.deepEqual(item, JSON.parse(sortedStringify(item)));
    });
  });
  it('is kept in complex object', () => {
    assert.deepEqual(complexObj, JSON.parse(sortedStringify(complexObj)));
  });
});
