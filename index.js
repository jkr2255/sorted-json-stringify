(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.sortedJSONStringify = factory());
}(this, (function () { 'use strict';

/** @param {string} str */
function indexedArr(str) {
  var commaTrimmed = str.replace(/,$/, '');
  var spaceStripped = commaTrimmed.replace(/^ */, '');
  return [commaTrimmed.length - spaceStripped.length, spaceStripped];
}

function pickKey(str) {
  var quoted = /^"(?:[^"\\]|\\.)*"/.exec(str)[0];
  return JSON.parse(quoted);
}

/** @param {[number, string][]} content */
function sortContent(content) {
  var keyArr = content.map(function (item, index) {
    return [index, pickKey(item[0][1])];
  });
  keyArr.sort(function (a, b) {
    if (a[1] === b[1]) return 0;
    if (a[1] < b[1]) return -1;
    return 1;
  });
  // console.log(keyArr);
  return keyArr.map(function (item) {
    return content[item[0]];
  });
}

function sortObject(arr) {
  for (var i = 0; i < arr.length; ++i) {
    if (!/\{$/.test(arr[i][1])) continue;
    var outerDepth = arr[i][0];
    var content = [];
    var j = i + 1;
    for (;; ++j) {
      if (arr[j][0] === outerDepth) break;
      var item = [arr[j]];
      if (!/[[{]$/.test(arr[j][1])) {
        content.push(item);
        continue;
      }
      ++j;
      for (;; ++j) {
        item.push(arr[j]);
        if (arr[j][0] === outerDepth + 1) break;
      }
      content.push(item);
    }
    if (content.length <= 1) continue;
    var sorted = [].concat.apply([], sortContent(content));
    [].splice.apply(arr, [i + 1, j - i - 1].concat(sorted));
  }
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

var removeKeySpace = function removeKeySpace(str) {
  return str.replace(/^("(?:[^"\\]|\\.)*":) /, '$1');
};

/** @param {[number, string][]} arr */
function indexed2JSON(arr, indent) {
  return arr.map(function (row, index) {
    var unindented = row[1] + (row[0] === 0 || arr[index + 1][0] !== row[0] ? '' : ',');
    if (indent) {
      return repeatStr(indent, row[0]) + unindented;
    }
    return removeKeySpace(unindented);
  }).join(indent ? '\n' : '');
}

function sortedStringify(obj, replacer, space) {
  var indent = parseSpace(space);
  var baseArr = JSON.stringify(obj, replacer, 1).split('\n').map(indexedArr);
  sortObject(baseArr);
  return indexed2JSON(baseArr, indent);
}

return sortedStringify;

})));
