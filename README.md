# sortedJSONStringify

[![Build Status](https://travis-ci.org/jkr2255/sorted-json-stringify.svg?branch=master)](https://travis-ci.org/jkr2255/sorted-json-stringify)

A function like `JSON.stringify` with the difference that all keys in Object are sorted by alphabetical order.

It doesn't depend on the behaviors of objects in JavaScript engine; it sorts native output of `JSON.stringify`.

## Usage

the function accepts the same parameters as `JSON.stringify`, including `replacer` and `space`.

It can be used by `import sortedJSONStringify from 'sorted-json-stringify'` (in ES6), or `window.sortedJSONStringify` (from browser directly).

## Changelog

* 0.1.1 (2018/02/16) - Tune build process (create both `index.js` and `index.min.js`), reduce the size of ES5.
* 0.1.0 (2018/01/30) - Improve performance (using AST, bypass routine in special conditions)
* 0.0.2 (2018/01/28) - change build settings (using uglifier, add `module` field in `package.json`)
* 0.0.1 (2018/01/28) - first release
