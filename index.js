(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.sortedJSONStringify = factory());
}(this, (function () { 'use strict';

var arrayASTToJSON = function arrayASTToJSON(ast, indent, currentIndent, suppressFirstIndent) {
  var nextIndent = currentIndent + indent;
  var parsedItems = ast.items.map(function (item) {
    return ASTToJSON(item, indent, nextIndent);
  });
  var maybeNewLine = indent ? '\n' : '';
  return (suppressFirstIndent ? '' : currentIndent) + '[' + maybeNewLine + parsedItems.join(',' + maybeNewLine) + maybeNewLine + currentIndent + ']';
};

var pickKey = function pickKey(str) {
  if (str.indexOf('\\') === -1) return str.slice(1, -1);
  return JSON.parse(str);
};

var objectItemToStr = function objectItemToStr(item, indent, currentIndent) {
  var keyValSeparator = indent ? ': ' : ':';
  return currentIndent + item.key + keyValSeparator + ASTToJSON(item.value, indent, currentIndent, true);
};

/** @param {{key: string, value: object}[]} items */
var parseObjectItems = function parseObjectItems(items, indent, currentIndent) {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [objectItemToStr(items[0], indent, currentIndent)];
  }
  // sort
  var sortIndex = items.map(function (item, i) {
    return [i, pickKey(item.key)];
  });
  sortIndex.sort(function (a, b) {
    if (a[1] === b[1]) return 0;
    if (a[1] < b[1]) return -1;
    return 1;
  });
  return sortIndex.map(function (idx) {
    var item = items[idx[0]];
    return objectItemToStr(item, indent, currentIndent);
  });
};

var objectASTToJSON = function objectASTToJSON(ast, indent, currentIndent, suppressFirstIndent) {
  var nextIndent = currentIndent + indent;
  var maybeNewLine = indent ? '\n' : '';
  var parsedItems = parseObjectItems(ast.items, indent, nextIndent);
  return (suppressFirstIndent ? '' : currentIndent) + '{' + maybeNewLine + parsedItems.join(',' + maybeNewLine) + maybeNewLine + currentIndent + '}';
};

function ASTToJSON(ast, indent) {
  var currentIndent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var suppressFirstIndent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (ast.type === 'scalar') return (suppressFirstIndent ? '' : currentIndent) + ast.value;
  if (ast.type === 'array') return arrayASTToJSON(ast, indent, currentIndent, suppressFirstIndent);
  if (ast.type === 'object') return objectASTToJSON(ast, indent, currentIndent, suppressFirstIndent);
  throw new Error('unknown ast');
}

// assume trimmed in index.js
var parseArray = function parseArray(lines) {
  var items = [];
  while (1) {
    var item = linedJSONToAST(lines);
    if (!item) break;
    items.push(item);
  }
  return { type: 'array', items: items };
};

function parseKeyAndValue(row) {
  var char = row[row.length - 1];
  if (char === '{' || char === '[') return [row.slice(0, -3), char];

  var matches = /^("(?:[^\\"]|\\.)*"): (.+)$/.exec(row);
  return [matches[1], matches[2]];
}

var parseObjectItem = function parseObjectItem(lines) {
  var trimmed = lines.shift();
  if (trimmed === '}') return false;
  var tmp = parseKeyAndValue(trimmed);
  var key = tmp[0];
  var rawValue = tmp[1];
  var value = void 0;
  if (rawValue === '[') value = parseArray(lines);else if (rawValue === '{') value = parseObject(lines);else value = parseScalar(rawValue);
  return { key: key, value: value };
};

var parseObject = function parseObject(lines) {
  var items = [];
  while (1) {
    var item = parseObjectItem(lines);
    if (!item) break;
    items.push(item);
  }
  return { type: 'object', items: items };
};

var parseScalar = function parseScalar(trimmed) {
  return { type: 'scalar', value: trimmed };
};

function linedJSONToAST(lines) {
  var trimmed = lines.shift();
  if (trimmed === '[') return parseArray(lines);
  if (trimmed === '{') return parseObject(lines);
  if (trimmed === ']') return false;
  return parseScalar(trimmed);
}

var repeatStr = function repeatStr(str, count) {
  count = Math.floor(count);
  str = String(str);
  // including NaN judgement
  if (!(count > 0) || str === '') return '';
  var ret = '';
  for (var i = 0; i < count; ++i) {
    ret += str;
  }
  return ret;
};

var parseSpace = function parseSpace(space) {
  if (typeof space === 'number') {
    return repeatStr(' ', Math.min(space, 10));
  }
  if (typeof space === 'string') {
    return space.substring(0, 10);
  }
  return '';
};

var toLinedJSON = function toLinedJSON(obj, replacer) {
  return JSON.stringify(obj, replacer, 1).split(/,?\n */);
};

function sortedStringify(obj, replacer, space) {
  var indent = parseSpace(space);
  var ast = linedJSONToAST(toLinedJSON(obj, replacer));
  return ASTToJSON(ast, indent);
}

return sortedStringify;

})));
