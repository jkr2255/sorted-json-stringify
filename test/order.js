const sortedStringify = require('../index');
const assert = require('chai').assert;

describe('order of JSON string', () => {
  it('generates the same JSON regardless the original object', () => {
    const EXPECTED_JSON = '{"150":null,"27":"test","a":7,"b":"string","c":true}';
    assert.equal(sortedStringify({
      '150': null, '27': 'test', 'a': 7, 'b': 'string', 'c': true
    }), EXPECTED_JSON);
    assert.equal(sortedStringify({
      'a': 7, 'b': 'string', '27': 'test', '150': null, 'c': true
    }), EXPECTED_JSON);
    assert.equal(sortedStringify({
      'c': true, '150': null, 'a': 7, 'b': 'string', '27': 'test'
    }), EXPECTED_JSON);
    assert.equal(sortedStringify({
      'b': 'string', 'a': 7, '27': 'test', 'c': true, '150': null
    }), EXPECTED_JSON);
  });
});
