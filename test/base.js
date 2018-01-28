'use strict';

const sortedStringify = require('../index');
const assert = require('chai').assert;

describe('sortedStringify', () => {
  it('is a function', () => {
    assert.isFunction(sortedStringify);
  });
});
