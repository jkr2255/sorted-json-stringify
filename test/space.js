const sortedStringify = require('../index');
const assert = require('chai').assert;

const parameters = [
  NaN,
  -1,
  0,
  1,
  15,
  'a',
  'abcdefghijklm'
];

// Should not include multiple key object
const target = [
  {},
  {key: 'value'},
  7,
  [{}, {keys: 'values'}, 9, {test: ['9aa']}]
];

describe('space parameter', () => {
  parameters.forEach(param => {
    it('should work properly by ' + param, () => {
      assert.equal(
        sortedStringify(target, null, param),
        JSON.stringify(target, null, param)
      );
    });
  });
});
