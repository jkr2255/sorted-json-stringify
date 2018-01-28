
/** @param {string} str */
function indexedArr (str) {
  const commaTrimmed = str.replace(/,$/, '');
  const spaceStripped = commaTrimmed.replace(/^ */, '');
  return [commaTrimmed.length - spaceStripped.length, spaceStripped];
}

function pickKey (str) {
  const quoted = /^"(?:[^"\\]|\\.)*"/.exec(str)[0];
  return JSON.parse(quoted);
}

/** @param {[number, string][]} content */
function sortContent (content) {
  const keyArr = content.map((item, index) => [index, pickKey(item[0][1])]);
  keyArr.sort((a, b) => {
    if (a[1] === b[1]) return 0;
    if (a[1] < b[1]) return -1;
    return 1;
  });
  // console.log(keyArr);
  return keyArr.map(item => content[item[0]]);
}

function sortObject (arr) {
  for (let i = 0; i < arr.length; ++i) {
    if (!/\{$/.test(arr[i][1])) continue;
    const outerDepth = arr[i][0];
    const content = [];
    let j = i + 1;
    for (; ; ++j) {
      if (arr[j][0] === outerDepth) break;
      const item = [arr[j]];
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
    const sorted = [].concat.apply([], sortContent(content));
    [].splice.apply(arr, [i + 1, j - i - 1].concat(sorted));
  }
}

const repeatStr = (str, count) => {
  count = Math.floor(count);
  str = String(str);
  // including NaN judgement
  if (!(count > 0) || str === '') return '';
  let ret = '';
  for (let i = 0; i < count; ++i) {
    ret += str;
  }
  return ret;
};

const parseSpace = space => {
  if (typeof space === 'number') {
    return repeatStr(' ', Math.min(space, 10));
  }
  if (typeof space === 'string') {
    return space.substring(0, 10);
  }
  return '';
};

const removeKeySpace = str => str.replace(/^("(?:[^"\\]|\\.)*":) /, '$1');

/** @param {[number, string][]} arr */
function indexed2JSON (arr, indent) {
  return arr.map((row, index) => {
    const unindented = row[1] +
      ((row[0] === 0 || arr[index + 1][0] !== row[0]) ? '' : ',');
    if (indent) {
      return repeatStr(indent, row[0]) + unindented;
    }
    return removeKeySpace(unindented);
  }).join(indent ? '\n' : '');
}

export default function sortedStringify (obj, replacer, space) {
  const indent = parseSpace(space);
  const baseArr = JSON.stringify(obj, replacer, 1).split('\n').map(indexedArr);
  sortObject(baseArr);
  return indexed2JSON(baseArr, indent);
}
