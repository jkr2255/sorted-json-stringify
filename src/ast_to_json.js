const arrayASTToJSON = (ast, indent, currentIndent, suppressFirstIndent) => {
  const nextIndent = currentIndent + indent;
  const parsedItems = ast.items.map(item => ASTToJSON(item, indent, nextIndent));
  const maybeNewLine = indent ? '\n' : '';
  return (suppressFirstIndent ? '' : currentIndent) + '[' + maybeNewLine +
    parsedItems.join(',' + maybeNewLine) +
    maybeNewLine + currentIndent + ']';
};

/** @param {{key: string, value: object}[]} items */
const parseObjectItems = (items, indent, currentIndent) => {
  const keyValSeparator = indent ? ': ' : ':';
  // sort
  const sortIndex = items.map((item, i) => [i, JSON.parse(item.key)]);
  sortIndex.sort((a, b) => {
    if (a[1] === b[1]) return 0;
    if (a[1] < b[1]) return -1;
    return 1;
  });
  return sortIndex.map(idx => {
    const item = items[idx[0]];
    return currentIndent + item.key + keyValSeparator +
      ASTToJSON(item.value, indent, currentIndent, true);
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
