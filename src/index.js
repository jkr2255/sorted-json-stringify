import ASTToJSON from './ast_to_json';
import linedJSONToAST from './lined_json_to_ast';

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

const toLinedJSON = (obj, replacer) => JSON.stringify(obj, replacer, 1).split(/,?\n */);

export default function sortedStringify (obj, replacer, space) {
  const indent = parseSpace(space);
  const ast = linedJSONToAST(toLinedJSON(obj, replacer));
  return ASTToJSON(ast, indent);
}
