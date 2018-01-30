const arrayASTToJSON = (ast, indent, currentIndent, suppressFirstIndent) => {
  const nextIndent = currentIndent + indent;
  const parsedItems = ast.items.map(item => ASTToJSON(item, indent, nextIndent));
  const maybeNewLine = indent ? '\n' : '';
  return (suppressFirstIndent ? '' : currentIndent) + '[' + maybeNewLine +
    parsedItems.join(',' + maybeNewLine) +
    maybeNewLine + currentIndent + ']';
};

const pickKey = str => {
  if (str.indexOf('\\') === -1) return str.slice(1, -1);
  return JSON.parse(str);
};

const objectItemToStr = (item, indent, currentIndent) => {
  const keyValSeparator = indent ? ': ' : ':';
  return currentIndent + item.key + keyValSeparator +
    ASTToJSON(item.value, indent, currentIndent, true);
};

/** @param {{key: string, value: object}[]} items */
const parseObjectItems = (items, indent, currentIndent) => {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [objectItemToStr(items[0], indent, currentIndent)];
  }
  // sort
  const sortIndex = items.map((item, i) => [i, pickKey(item.key)]);
  sortIndex.sort((a, b) => {
    if (a[1] === b[1]) return 0;
    if (a[1] < b[1]) return -1;
    return 1;
  });
  return sortIndex.map(idx => {
    const item = items[idx[0]];
    return objectItemToStr(item, indent, currentIndent);
  });
};

const objectASTToJSON = (ast, indent, currentIndent, suppressFirstIndent) => {
  const nextIndent = currentIndent + indent;
  const maybeNewLine = indent ? '\n' : '';
  const parsedItems = parseObjectItems(ast.items, indent, nextIndent);
  return (suppressFirstIndent ? '' : currentIndent) + '{' + maybeNewLine +
    parsedItems.join(',' + maybeNewLine) +
    maybeNewLine + currentIndent + '}';
};

export default function ASTToJSON (ast, indent, currentIndent = '', suppressFirstIndent = false) {
  if (ast.type === 'scalar') return (suppressFirstIndent ? '' : currentIndent) + ast.value;
  if (ast.type === 'array') return arrayASTToJSON(ast, indent, currentIndent, suppressFirstIndent);
  if (ast.type === 'object') return objectASTToJSON(ast, indent, currentIndent, suppressFirstIndent);
  throw new Error('unknown ast');
}
