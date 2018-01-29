
/** @param {string} str */
function indexedArr (str) {
  const commaTrimmed = str.replace(/,$/, '');
  const spaceStripped = commaTrimmed.replace(/^ */, '');
  return {indent: commaTrimmed.length - spaceStripped.length, content: spaceStripped};
}

/** @return {string} */
function pickKey (str) {
  const quoted = /^"(?:[^"\\]|\\.)*"/.exec(str)[0];
  return JSON.parse(quoted);
}

/** @param {{indent: number, content: string}[]} content */
function sortContent (content) {
  const keyArr = content.map((item, index) => [index, pickKey(item[0].content)]);
  keyArr.sort((a, b) => {
    if (a[1] === b[1]) return 0;
    if (a[1] < b[1]) return -1;
    return 1;
  });
  // console.log(keyArr);
  return keyArr.map(item => content[item[0]]);
}

/** @param {{indent: number, content: string}[]} arr */
function sortObject (arr) {
  for (let i = 0; i < arr.length; ++i) {
    if (!/\{$/.test(arr[i].content)) continue;
    const outerDepth = arr[i].indent;
    const content = [];
    let j = i + 1;
    for (; ; ++j) {
      if (arr[j].indent === outerDepth) break;
      const item = [arr[j]];
      if (!/[[{]$/.test(arr[j].content)) {
        content.push(item);
        continue;
      }
      ++j;
      for (;; ++j) {
        item.push(arr[j]);
        if (arr[j].indent === outerDepth + 1) break;
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

/** @param {{indent: number, content: string}[]} arr */
function indexed2JSON (arr, indentStr) {
  return arr.map((row, index) => {
    const unindented = row.content +
      ((row.indent === 0 || arr[index + 1].indent !== row.indent) ? '' : ',');
    if (indentStr) {
      return repeatStr(indentStr, row.indent) + unindented;
    }
    return removeKeySpace(unindented);
  }).join(indentStr ? '\n' : '');
}

export default function sortedStringify (obj, replacer, space) {
  const indent = parseSpace(space);
  const baseArr = JSON.stringify(obj, replacer, 1).split('\n').map(indexedArr);
  sortObject(baseArr);
  return indexed2JSON(baseArr, indent);
}
