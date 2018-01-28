# sortedJSONStringify

A function like `JSON.stringify` with the difference that all keys in Object are sorted by alphabetical order.

It doesn't depend on the behaviors of objects in JavaScript engine; it sorts native output of `JSON.stringify`.

## Usage

the function accepts the same parameters as `JSON.stringify`, including `replacer` and `space`.

It can be used by `import sortedJSONStringify from 'sorted-json stringify'` (in ES6), or `window.sortedJSONStringify` (from browser directly).

## Changelog

* 0.0.1 (2018/01/28) - first release
